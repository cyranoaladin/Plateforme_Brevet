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
# `.env` est LE fichier canonique : lu à la fois par Next.js (dev/build/start)
# et par `docker compose` (voir docker-compose.yml). Il est ignoré par Git.
cp .env.example .env
# Éditez .env avec vos clés (OpenAI/OpenRouter si mode RAG activé)
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
1.  **Lancer Qdrant** : `docker compose up -d qdrant` — publie Qdrant sur `127.0.0.1:6333` via `docker-compose.override.yml` (chargé automatiquement en local). Ne cible que le service `qdrant` : un `docker compose up -d` sans argument démarre aussi le service `app`, qui occupe le port 3010 utilisé par `next dev`/`next start` ci-dessous.
2.  **Configuration** : S'assurer que `.env` contient `ARIA_MODE=rag` et `QDRANT_URL=http://localhost:6333`.
3.  **Ingestion** : `npm run ingest:pdf` (après avoir ajouté des PDF dans `data/pdfs/`).
4.  **Vérification End-to-End** : `npm run smoke:rag` (démarre Qdrant, simule l'ingestion, lance la production et vérifie les citations).

### Déploiement (production / CI)

`docker-compose.override.yml` est réservé au développement local : il publie le port Qdrant sur l'hôte, ce qu'une production ne doit jamais faire. En production/CI, excluez-le explicitement :
```bash
cp .env.example .env   # puis renseigner SALT et les clés nécessaires
docker compose -f docker-compose.yml up -d
```
(ou `export COMPOSE_FILE=docker-compose.yml`). Qdrant n'est alors joignable que depuis le service `app`, sur le réseau interne `brevet-internal` (`http://qdrant:6333`).

## 🧪 Qualité & Fiabilité

Le projet applique des barrières de qualité strictes :
- **Atomic Energy Spending** : La consommation d'énergie est garantie avant le lancement des défis.
- **Schema-on-Read** : Les données utilisateur sont migrées et normalisées à chaque lecture pour éviter les crashs.
- **Circuit Breaker** : Le moteur RAG se protège automatiquement en cas de défaillance de la base vectorielle.

## 🛡️ Sécurité

Le projet utilise un `SALT` environnemental pour anonymiser les identifiants élèves. En production, le serveur refusera de démarrer si cette variable est manquante.

---
Développé avec ❤️ pour la réussite de tous les collégiens.
