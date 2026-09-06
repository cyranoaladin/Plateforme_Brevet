#!/bin/bash
set -e

cd "$(dirname "$0")/../.."

COMMAND=$1

# Local-dev only: -f docker-compose.dev.yml must be named explicitly (see
# that file's header) to publish Qdrant on 127.0.0.1:6333, which
# docker-compose.yml alone never does. Uses `docker compose` (Compose V2,
# the "docker compose" plugin) rather than the standalone `docker-compose`
# (V1) binary, which has been EOL since July 2023 and does not understand
# docker-compose.yml's `env_file: [{path, required}]` syntax.
COMPOSE="docker compose -f docker-compose.yml -f docker-compose.dev.yml"

case $COMMAND in
  start)
    echo "🚀 Démarrage de Qdrant..."
    $COMPOSE up -d qdrant
    ;;
  stop)
    echo "🛑 Arrêt de Qdrant..."
    $COMPOSE stop qdrant
    ;;
  reset)
    echo "⚠️  WIPING QDRANT STORAGE..."
    read -p "Es-tu sûr de vouloir tout supprimer ? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      # Qdrant persists to the named volume "qdrant_storage" (see
      # docker-compose.yml), not a host bind mount - `-v` removes it.
      $COMPOSE down -v qdrant
      echo "✅ Storage nettoyé."
      $COMPOSE up -d qdrant
    fi
    ;;
  logs)
    $COMPOSE logs -f qdrant
    ;;
  status)
    $COMPOSE ps qdrant
    ;;
  *)
    echo "Usage: $0 {start|stop|reset|logs|status}"
    exit 1
esac
