#!/usr/bin/env bash
set -e

echo "Pulling latest code..."
git pull

echo "Building APIs..."
pnpm build:api

echo "Restarting APIs..."
pm2 restart \
  ebtkar-api-auth \
  ebtkar-api-gateway \
  ebtkar-api-messaging

pm2 save

echo "Deployment completed"
pm2 list