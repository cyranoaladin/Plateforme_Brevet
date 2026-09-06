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
  # Checks every entry under /app/data, not just the directory itself:
  # the directory can already be 1001:1001 (e.g. freshly created by the
  # image, or already repaired) while a file inside it - brevet.sqlite
  # itself - is still root-owned, e.g. left over from a run that created
  # the DB file directly as root before this repair step existed. `find
  # -quit` stops at the first mismatch, so this stays a cheap stat walk
  # (no chown) on the common case where everything already matches.
  # BusyBox find (this image's /usr/bin/find) has no -uid/-gid - only
  # -user/-group, which do accept a numeric id.
  mismatch="$(find /app/data ! \( -user 1001 -a -group 1001 \) -print -quit 2>/dev/null)"
  if [ -n "$mismatch" ]; then
    echo "[entrypoint] /app/data contains entries not owned by 1001:1001 (e.g. $mismatch) - repairing..."
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
