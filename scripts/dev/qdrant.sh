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
      # docker-compose.yml), not a host bind mount. Whether a
      # service-scoped `down -v <service>` actually removes a NAMED
      # (non-anonymous) volume has been version-dependent across Compose
      # v2 releases, so the volume is removed explicitly by its real,
      # project-qualified name instead of relying on that flag alone -
      # `docker compose config` resolves the actual project name (env var,
      # `name:` field, or directory name) without needing any container
      # running, so this works even right after `down`.
      project_name="$(node -e 'process.stdout.write(JSON.parse(require("child_process").execSync(process.argv[1]+" config --format json")).name)' "$COMPOSE")"
      $COMPOSE down qdrant
      docker volume rm "${project_name}_qdrant_storage" >/dev/null 2>&1 || true
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
