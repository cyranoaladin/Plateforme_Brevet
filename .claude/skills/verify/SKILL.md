# Verify — Brevet

Single-package repo. Surface: HTTP (Next.js app) + Docker. This skill captures the recipe that
worked for a real runtime verification (build → run → drive via curl/docker exec), so the next
session skips the cold start.

## Build & launch

```bash
cp .env.example .env
sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$(openssl rand -base64 32)|" .env
sed -i "s|SALT=.*|SALT=$(openssl rand -base64 32)|" .env
echo "NEXTAUTH_URL=http://localhost:3099" >> .env

docker compose -p brevet-verify up -d --build   # bare `up`, no -f override: matches production
                                                 # (Qdrant NOT published on the host by default)
```

App: `http://127.0.0.1:3010`. Qdrant: internal-only (`http://qdrant:6333` from inside the `app`
container), never on the host — verify with `curl http://127.0.0.1:6333` from the host (must
refuse) and `docker exec brevet-master-app wget -qO- http://qdrant:6333` (must respond).

To use `docker-compose.dev.yml` (publishes Qdrant on `127.0.0.1:6333` for local dev tooling), pass
`-f docker-compose.yml -f docker-compose.dev.yml` explicitly — never on anything resembling
production, and never target the `app` service with it (port 3010 collision with `next start`).

## Driving the real auth flow (no seed data exists — you must create a user)

There is no signup endpoint. `bcryptjs` is a `package.json` dependency but is **not** present as a
raw package in the standalone image's `node_modules` (see gotcha below) — hash the password
*outside* the container and insert via Prisma only:

```bash
# on the host (needs node + bcryptjs available locally, e.g. `npx bcryptjs-cli '<password>' 12`)
npx --yes bcryptjs-cli 'VerifyTest123!' 12   # → prints a $2b$12$... hash

docker exec brevet-master-app node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const u = await prisma.user.create({ data: { email: 'verify-test@example.com', name: 'Verify Test', password: '<hash from above>' } });
  console.log('created', u.id);
  await prisma.\$disconnect();
})();
"
```

Then the real HTTP flow:

```bash
CSRF=$(curl -s -c cookies.txt http://127.0.0.1:3010/api/auth/csrf | python3 -c "import json,sys; print(json.load(sys.stdin)['csrfToken'])")
curl -s -b cookies.txt -c cookies.txt -X POST http://127.0.0.1:3010/api/auth/callback/credentials \
  -d "email=verify-test@example.com&password=VerifyTest123!&csrfToken=$CSRF&json=true"   # → 200, session cookie set

curl -s -b cookies.txt http://127.0.0.1:3010/api/user/profile   # → 200 {"authenticated":true,...} with session
                                                                  # → 401 {"error":"Unauthorized"} without
```

Logout: `POST /api/auth/signout` with a fresh CSRF token the same way, then re-check
`/api/user/profile` returns 401 again.

Clean up the synthetic user afterward (`prisma.user.delete`) before tearing down.

## Persistence check

`docker compose -p brevet-verify up -d --force-recreate app` → entrypoint log must say
"No pending migrations to apply." (proves idempotence) → the user created above must still be
`findUnique`-able and still able to log in after the recreate.

## Teardown

```bash
docker compose -p brevet-verify down -v
```

## Known gotchas (found via actual runtime verification, not visible from code review or CI)

- **`brevet-master-app` shows `unhealthy` in `docker ps` forever, even though the app works
  fine.** The Dockerfile's healthcheck runs `wget http://127.0.0.1:3000/api/health` *inside* the
  container, but Next.js's standalone `server.js` binds to `process.env.HOSTNAME` — which Docker
  auto-sets to the container ID, not `0.0.0.0` or `127.0.0.1`. The app is reachable fine from the
  host via the published port; only the in-container health probe is broken. Not yet fixed —
  needs `ENV HOSTNAME=0.0.0.0` (or equivalent) in the Dockerfile plus confirming the healthcheck
  target is then actually reachable.
- `bcryptjs` is declared in `package.json` but absent as a raw package from the standalone
  image's `node_modules` (Next.js's output tracer bundles it directly into the compiled auth
  route instead). Login works fine through the real HTTP surface — this only bites if something
  does a runtime `require('bcryptjs')` outside a traced webpack bundle (a debug script, a cron
  job). Don't assume any npm package name is `docker exec`-requirable just because it's in
  `package.json` — check the actual standalone `node_modules` first.
