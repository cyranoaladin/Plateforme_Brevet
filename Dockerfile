# Stage 1: Dependencies (full tree, needed to build and type-check)
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
# --legacy-peer-deps: required because vitest 4.1.x's peer-dependency graph
# (browser-mode optional peers) triggers a bug in npm 10.9.8's arborist
# peer-set resolver (TypeError: Cannot read properties of null (reading
# 'edgesOut') in @npmcli/arborist build-ideal-tree.js #loadPeerSet). See the
# vitest bump commit for the full root-cause writeup; --legacy-peer-deps
# steps around the crashing resolver path without disabling install
# integrity checks (npm ci still fails closed if package-lock.json and
# package.json disagree).
RUN npm ci --legacy-peer-deps

# Stage 2: Production-only dependencies
# Installed separately (--omit=dev) so devDependencies (test/build tooling)
# never ship inside the runtime image, reducing image size and attack surface.
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS prod-deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY prisma ./prisma
RUN ./node_modules/.bin/prisma generate

# The `prisma` CLI (invoked as a subprocess by docker-entrypoint.sh for
# `prisma migrate deploy`) is never imported by application code, so
# Next.js's standalone output tracer (used in the runner stage below)
# never discovers it or its dependency tree. Rather than hand-maintaining
# a list of which packages that tree currently happens to include - which
# would silently go stale and break `migrate deploy` at container startup
# the next time prisma/effect/c12 add or drop a transitive dependency -
# this walks the *actual* installed package.json dependency graph starting
# from "prisma" (dependencies + optionalDependencies, transitively) and
# copies exactly that closure into /app/cli-deps/node_modules. The runner
# stage copies that whole directory on top of the traced standalone tree.
RUN node -e " \
  const fs = require('fs'); \
  const path = require('path'); \
  const nm = path.join(process.cwd(), 'node_modules'); \
  const seen = new Set(); \
  const queue = ['prisma']; \
  function loadPkg(name) { \
    const p = path.join(nm, name, 'package.json'); \
    if (!fs.existsSync(p)) return null; \
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; } \
  } \
  while (queue.length) { \
    const name = queue.pop(); \
    if (seen.has(name)) continue; \
    seen.add(name); \
    const pkg = loadPkg(name); \
    if (!pkg) continue; \
    const deps = Object.assign({}, pkg.dependencies || {}, pkg.optionalDependencies || {}); \
    for (const d of Object.keys(deps)) if (!seen.has(d)) queue.push(d); \
  } \
  const dest = path.join(process.cwd(), 'cli-deps', 'node_modules'); \
  for (const name of seen) { \
    const src = path.join(nm, name); \
    if (!fs.existsSync(src)) continue; \
    const out = path.join(dest, name); \
    fs.mkdirSync(path.dirname(out), { recursive: true }); \
    fs.cpSync(src, out, { recursive: true }); \
  } \
  console.log('prisma CLI dependency closure:', seen.size, 'packages ->', [...seen].sort().join(', ')); \
"

# Stage 3: Builder
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN ./node_modules/.bin/prisma generate
RUN npm run build

# Stage 4: Runner
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS runner
# su-exec (a ~15KB setuid-and-exec helper, alpine's equivalent of gosu) is
# needed so docker-entrypoint.sh can start as root just long enough to fix
# /app/data's ownership on an existing volume, then drop to the
# unprivileged "nextjs" user for the actual Prisma migration and app
# process - see the ownership-repair step in docker-entrypoint.sh.
RUN apk add --no-cache libc6-compat openssl su-exec
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 -G nodejs nextjs

# Create persistent data directory with correct ownership (matches nextjs
# 1001:1001). This only sets the ownership baked into the IMAGE layer: a
# brand-new named volume mounted at /app/data inherits this automatically
# (Docker seeds a new volume from the image path's existing content on
# first use), but an EXISTING volume from a prior run keeps whatever
# ownership it already has - including root, if it predates this line or
# was ever touched by a root process. docker-entrypoint.sh repairs that
# case at container startup instead of relying on this build-time chown.
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data && chmod 770 /app/data

# next.config.ts sets output: "standalone", so the builder already traced
# the minimal runtime dependency subset (including the Prisma query-engine
# binary, force-included via outputFileTracingIncludes) into
# .next/standalone/node_modules. This is dramatically smaller than the full
# production node_modules tree (verified: ~150MB vs ~880MB) since it excludes
# every package (and every platform's native binaries) the app doesn't
# actually import - most of the win comes from not shipping the `next` CLI
# package and its platform-specific @next/swc-* binaries at all, since
# server.js is a pre-bundled standalone entrypoint that doesn't need them.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# See the cli-deps computation in the prod-deps stage above: this is the
# full, build-time-computed dependency closure of the `prisma` CLI
# (schema-engine binary included, via @prisma/engines), copied on top of
# the traced standalone tree without reintroducing `next`/@next or any
# other package standalone tracing already excluded.
COPY --from=prod-deps /app/cli-deps/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# The base image's own bundled npm/npx are only needed to build the app,
# never to run it: docker-entrypoint.sh invokes the local `prisma` CLI
# directly via node, and the server is server.js (standalone), not `next
# start`. Removing npm's vendored tooling (pacote/tar/sigstore/...) drops
# several unrelated CVEs that have nothing to do with this application's
# own code from the runtime image.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Intentionally NOT switching to USER nextjs here: the container must start
# as root so docker-entrypoint.sh can repair /app/data's ownership on an
# existing volume before anything else runs. This is not "running the app
# as root" - the entrypoint's very first action, before the Prisma
# migration or the app itself ever runs, is to re-exec itself via su-exec
# as the unprivileged nextjs (1001:1001) user and never regain root from
# there (exec replaces the process; there is no lingering root parent).
EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
