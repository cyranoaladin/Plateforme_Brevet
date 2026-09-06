#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "[entrypoint] Checking and applying Prisma migrations..."
  # Invoked directly via node rather than node_modules/.bin/prisma: the
  # runtime image is Next.js's "standalone" output plus the prisma CLI
  # package copied in on top (see Dockerfile), so no npm install ever ran
  # in the final stage to create the usual .bin symlink.
  node node_modules/prisma/build/index.js migrate deploy
fi

exec "$@"
