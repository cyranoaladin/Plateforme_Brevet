# Contributing to BREVET MASTER

## Workflow
1.  **Branching** : Créez une branche descriptive (`feat/mon-truc`, `fix/bug-nom`).
2.  **Qualité** : `npm run lint` et `npx vitest run` doivent être verts avant toute PR.
3.  **Commits** : Utilisez le format **Conventional Commits** (ex: `feat(ui): add new card`).
4.  **PR** : Chaque PR doit être accompagnée d'une description des changements et des preuves de tests.

## Local setup
```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```
