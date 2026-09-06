# Stage 1: Dependencies (full tree, needed to build and type-check)
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Production-only dependencies
# Installed separately (--omit=dev) so devDependencies (test/build tooling)
# never ship inside the runtime image, reducing image size and attack surface.
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS prod-deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN ./node_modules/.bin/prisma generate

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
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 -G nodejs nextjs

# Create persistent data directory with correct ownership (matches nextjs 1001:1001)
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data && chmod 770 /app/data

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# The npm CLI itself is only needed to build the app, not to run it: the
# entrypoint calls the local `prisma` binary directly and the server is
# started via the `next` binary below. Removing npm's own vendored
# tooling (pacote/tar/sigstore/...) drops several unrelated CVEs that
# have nothing to do with this application's code from the runtime image.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

USER nextjs
EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["./node_modules/.bin/next", "start"]
