#!/bin/bash
# scripts/deploy.sh
# Idempotent script for production deployment (typically to an EC2 instance)

set -e

echo "🚀 Starting Deployment Process..."

echo "Pulling docker images"
docker compose pull

# 4. Migrate database
echo "🗄️  Running Database Migrations..."
# Start the postgres service first if not already running
docker compose up -d --no-deps db migrate seed api web

echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment completed successfully! 🎉"