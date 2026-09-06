#!/bin/sh
set -e

# Step down from root, but only after fixing /app/data's ownership.
#
# The container is started as root (see the Dockerfile: there is no `USER`
# instruction in the runner stage). A brand-new named volume inherits
# nextjs:nodejs ownership from the image automatically, but an EXISTING
# volume from a prior run keeps whatever ownership it already has - which
# can be root if it predates this ownership-repair step, or was ever
# touched by a root process. A root-owned volume would silently break
# Prisma migrations and SQLite writes once the app dropped to the nextjs
# user, so that's fixed here, once, before anything else runs.
#
# This is a one-shot init step, not a long-lived privileged process: after
# the chown (skipped entirely when ownership is already correct, so this
# stays fast on repeat starts and never touches a correctly-owned volume's
# file metadata unnecessarily), su-exec's exec syscall replaces this shell
# with the target command running as nextjs - there is no root parent left
# afterwards to compromise.
if [ "$(id -u)" = "0" ]; then
  current_owner="$(stat -c '%u:%g' /app/data 2>/dev/null || echo unknown)"
  if [ "$current_owner" != "1001:1001" ]; then
    echo "[entrypoint] /app/data is owned by $current_owner, expected 1001:1001 - repairing..."
    chown -R 1001:1001 /app/data
  fi
  exec su-exec nextjs "$0" "$@"
fi

if [ -n "$DATABASE_URL" ]; then
  echo "[entrypoint] Checking and applying Prisma migrations..."
  # Invoked directly via node rather than node_modules/.bin/prisma: the
  # runtime image is Next.js's "standalone" output plus the prisma CLI
  # package copied in on top (see Dockerfile), so no npm install ever ran
  # in the final stage to create the usual .bin symlink.
  node node_modules/prisma/build/index.js migrate deploy
fi

exec "$@"
