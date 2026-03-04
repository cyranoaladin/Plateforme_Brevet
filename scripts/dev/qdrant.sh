#!/bin/bash

COMMAND=$1

case $COMMAND in
  start)
    echo "🚀 Démarrage de Qdrant..."
    docker-compose up -d
    ;;
  stop)
    echo "🛑 Arrêt de Qdrant..."
    docker-compose stop
    ;;
  reset)
    echo "⚠️  WIPING QDRANT STORAGE..."
    read -p "Es-tu sûr de vouloir tout supprimer ? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      docker-compose down -v
      rm -rf ./infra/qdrant_storage/*
      echo "✅ Storage nettoyé."
      docker-compose up -d
    fi
    ;;
  logs)
    docker-compose logs -f qdrant
    ;;
  status)
    docker-compose ps
    ;;
  *)
    echo "Usage: $0 {start|stop|reset|logs|status}"
    exit 1
esac
