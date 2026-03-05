# BREVET MASTER 🎓

![CI Status](https://github.com/cyranoaladin/Plateforme_Brevet/actions/workflows/ci.yml/badge.svg)
![Node Version](https://img.shields.io/badge/node-v22.21.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**BREVET MASTER** est une plateforme EdTech gamifiée conçue pour la préparation au **Diplôme National du Brevet (DNB) 2026**. Elle intègre un mentor IA (ARIA) basé sur une architecture RAG certifiée.

## 🚀 Fonctionnalités Clés

- **Curriculum Complet** : Mathématiques, Français, Histoire-Géo/EMC et Sciences.
- **Mentor ARIA (RAG)** : Analyse de documents officiels, citations certifiées et aide personnalisée.
- **Gamification** : Système d'XP, Rangs, Quêtes quotidiennes et Énergie.
- **Duels 1v1** : Affrontez des bots simulés sur des notions spécifiques pour booster votre progression.
- **Leaderboard** : Classement dynamique mondial (local-first) pour stimuler la compétition.
- **Dashboard Statistiques** : Suivi de la maîtrise par matière et historique de progression.

## 🛠️ Stack Technique

- **Framework** : Next.js 14+ (App Router), TypeScript strict.
- **Style** : Tailwind CSS (Dark Mode), Framer Motion.
- **Vector DB** : Qdrant (Retrieval Augmented Generation).
- **Sécurité** : RGPD Strict (IP hashing), Rate Limiting anonyme.
- **Local-First** : Persistance via `localStorage` avec normalisation de schéma automatique.

## 📦 Installation

```bash
# Utiliser la bonne version de Node
nvm use

# Installer les dépendances
npm ci

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditez .env.local avec vos clés (OpenAI/OpenRouter si mode RAG activé)
```

## ⌨️ Scripts Disponibles

- `npm run dev` : Lance le serveur de développement.
- `npm run build` : Génère le build de production optimisé.
- `npm run start` : Démarre le serveur de production.
- `npm run lint` : Vérifie la qualité du code (ESLint).
- `npx vitest run` : Exécute l'intégralité de la suite de tests (75+ tests).
- `npm run smoke:prod` : Lance un test de santé sur le build de production (Smoke Test).
- `npm run ingest:pdf` : Déclenche le pipeline d'ingestion des documents PDF situés dans `data/pdfs/`.

## 📂 Ingestion de documents (RAG)

Pour enrichir la base de connaissances du Mentor ARIA :
1. Placez vos fichiers PDF dans le dossier `data/pdfs/`.
2. Exécutez `npm run ingest:pdf`.
3. Les documents sont automatiquement découpés en chunks et stockés dans la base vectorielle Qdrant (si `ARIA_MODE=rag`).
   - Options : `--dir <path>`, `--dry-run`, `--chunk-size <int>`, `--overlap <int>`.

## 🛠️ Quickstart RAG (Environnement Local)

Pour tester le pipeline complet avec Qdrant :
1.  **Lancer Qdrant** : `docker compose up -d`
2.  **Configuration** : S'assurer que `.env.local` contient `ARIA_MODE=rag` et `QDRANT_URL=http://localhost:6333`.
3.  **Ingestion** : `npm run ingest:pdf` (après avoir ajouté des PDF dans `data/pdfs/`).
4.  **Vérification** : `node scripts/verify-rag.mjs` (le serveur Next.js doit être lancé).

## 🧪 Qualité & Fiabilité

Le projet applique des barrières de qualité strictes :
- **Atomic Energy Spending** : La consommation d'énergie est garantie avant le lancement des défis.
- **Schema-on-Read** : Les données utilisateur sont migrées et normalisées à chaque lecture pour éviter les crashs.
- **Circuit Breaker** : Le moteur RAG se protège automatiquement en cas de défaillance de la base vectorielle.

## 🛡️ Sécurité

Le projet utilise un `SALT` environnemental pour anonymiser les identifiants élèves. En production, le serveur refusera de démarrer si cette variable est manquante.

---
Développé avec ❤️ pour la réussite de tous les collégiens.
