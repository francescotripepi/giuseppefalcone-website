#!/bin/bash
# Deployment script for Giuseppe Falcone website
# Usage: ./scripts/deploy.sh

set -e

APP_DIR="/opt/giuseppefalcone"
REPO_URL="git@github.com:francescotripepi/giuseppefalcone-website.git"

echo "=========================================="
echo "Giuseppe Falcone Website Deployment"
echo "=========================================="

# Navigate to app directory
cd "$APP_DIR"

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Build and restart containers
echo "Building and restarting containers..."
docker compose down
docker compose build --no-cache app
docker compose up -d

# Run database migrations
echo "Running database migrations..."
docker compose exec app npx prisma migrate deploy

# Run seed if first deployment
if [ "$1" == "--seed" ]; then
  echo "Running database seed..."
  docker compose exec app npx tsx scripts/seed.ts
fi

# Health check
echo "Performing health check..."
sleep 10
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health | grep -q "200"; then
  echo "Health check passed!"
else
  echo "Health check failed. Rolling back..."
  docker compose logs app --tail=50
  exit 1
fi

# Clean up old images
echo "Cleaning up old Docker images..."
docker image prune -f

echo "=========================================="
echo "Deployment completed successfully!"
echo "=========================================="
