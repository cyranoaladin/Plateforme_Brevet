# Security Policy

## Reporting a Vulnerability
Si vous découvrez une faille de sécurité, merci de ne pas l'ouvrir en issue publique. Envoyez un signalement à [cyranoaladin@gmail.com].

## Secret Protection
- N'incluez **jamais** de secrets dans vos commits.
- Utilisez le fichier d'environnement local `.env` (créé via `cp .env.example .env`), ignoré par Git (`.gitignore` exclut tout `.env*` sauf `.env.example`).
- La variable `SALT` est obligatoire en production pour le hachage cryptographique des identifiants élèves.

## Dependency overrides (tracked, not permanent)

`package.json` forces `deepmerge-ts` to `^8.0.0` via `"overrides"`. This is a
transitive dependency of `@prisma/config` (used only by the `prisma` CLI's
config-file parser, invoked by `prisma migrate deploy` at container
startup), which pins it at exactly `7.1.5` — a version with a known HIGH
CVE. As of this writing, no released `prisma` line (including the current
stable 7.x) has bumped that pin past `7.1.5`, so the override cannot yet be
dropped in favour of a plain version bump.

Verified before merging this override:
- `deepmerge-ts` 7→8's breaking changes (per its CHANGELOG) are about
  `deepmergeInto` mutation semantics, renamed TS-only types, and Map-merge
  collision handling — none of which `@prisma/config`'s plain
  object-merging usage exercises.
- `prisma migrate deploy` was run against a real built image in three
  scenarios — empty database, already-migrated database, and across a
  container recreation with a pre-existing data volume — with the override
  in place; all three left the container healthy (see
  `docs/RELEASE_CHECKLIST.md` and the PR history for the exact commands).
- Full `vitest` suite green with the override applied.

**Action when upstream catches up**: once a released `@prisma/config`
declares `deepmerge-ts` at `^8.0.0` or later (check with
`npm view @prisma/config@latest dependencies`), remove the override and
bump `prisma`/`@prisma/client` normally instead.
