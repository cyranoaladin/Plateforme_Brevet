# Checklist de Mise en Production - BREVET MASTER

Ce document définit les étapes obligatoires pour valider un déploiement en production.

## 🔐 1. Sécurité et Environnement
- [ ] **Validation Env** : Vérifier que `.env.production` contient toutes les variables validées par `src/config/env.ts`.
- [ ] **Secrets** : `OPENAI_API_KEY` ou `OPENROUTER_API_KEY` injectés via le vault secret de l'hébergeur.
- [ ] **RGPD** : S'assurer que `SALT` est défini pour le hachage des IP dans les logs.
- [ ] **Auth** : S'assurer que `NEXTAUTH_SECRET` est défini (sinon NextAuth échoue avec une 500 `MissingSecretError` sur toute route authentifiée - `GET /api/health` reste vert, ce n'est PAS un indicateur suffisant, voir §3).
- [ ] **Debug** : `NEXT_PUBLIC_DEBUG_MODE` doit être à `false`.

## 🏗️ 2. Infrastructure (Qdrant)
- [ ] **Accessibilité** : Ping `http://<qdrant-url>:6333/readyz` -> doit répondre `all shards are ready` (vérifié contre `qdrant/qdrant:v1.11.0`, la version pinnée dans docker-compose.yml ; pas `all good`, une formulation qui ne correspond à aucune version réelle testée).
- [ ] **Données** : Exécuter le script d'ingestion Python sur les documents officiels mis à jour.
- [ ] **Persistance** : Vérifier le montage du volume Docker `/qdrant/storage`.

## 📈 3. Observabilité et Santé
- [ ] **Healthcheck** : Vérifier `GET /api/health` après déploiement (liveness uniquement - ne touche ni la config validée par `src/config/env.ts` ni la DB/Qdrant).
- [ ] **Readiness** : Vérifier `GET /api/ready` (DB + Qdrant si `ARIA_MODE=rag`) ET une route authentifiée (ex: `GET /api/user/profile` sans session -> doit répondre 401, jamais 500) : `/api/health` seul ne détecte pas un `NEXTAUTH_SECRET` manquant.
- [ ] **CI Smoke Test** : start prod + healthcheck automatisé et déterministe.
- [ ] **Rate Limit** : Tester qu'un bombardement de requêtes déclenche bien une 429.
- [ ] **Logs** : Vérifier dans la console de log que les emails/IP sont bien masqués par `[REDACTED]` ou `clientHash`.

## 🔄 4. Plan de Rollback
- [ ] **Instantané** : Garder l'image Docker précédente tagguée `stable-backup`.
- [ ] **Procédure** : 
  1. Revenir sur le commit précédent.
  2. Redéployer l'image `stable-backup`.
  3. Si Qdrant a été corrompu, restaurer le snapshot du volume.

## 🛠️ 5. Diagnostic Rapide
- **ARIA ne répond plus ?** Vérifier le Circuit Breaker dans les logs. S'il est "OPEN", Qdrant est probablement tombé.
- **Citations manquantes ?** Vérifier le mode (`ARIA_MODE`). S'il est en `mock`, c'est normal.
