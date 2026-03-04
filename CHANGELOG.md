# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-03-04

### Added
- **Stats Dashboard** : Nouveau tableau de bord analytique pour le suivi de l'élève.
- **XP History** : Enregistrement et persistance de la progression quotidienne sur 30 jours.
- **Duels 1v1 (MVP)** : Système de match simulé local-first sur des notions ciblées.
- **Leaderboard** : Classement mondial dynamique avec concurrents simulés.
- **Portable Smoke Test** : Script d'orchestration Node.js pour valider les builds de production.

### Changed
- **Schema-on-Read** : Migration et normalisation automatique des données stockées dans le LocalStorage.
- **Reliability** : Durcissement du moteur RAG (Circuit Breaker, Timeouts, Validation Qdrant).

### Fixed
- **Security** : Verrouillage du hachage IP et obligation du `SALT` en production.
- **Linting** : Élimination totale des avertissements et erreurs de qualité.

## [0.1.0] - 2026-03-04
- Initial release with curriculum support (Maths, Français, HG, Sciences).
- Mentor ARIA (RAG logic) integration.
