#!/usr/bin/env bash
set -e

echo "Pulling latest code..."
git pull

echo "Installing Required Dependencies if Needed ..."
pnpm install

echo "Migrate New Schema if Needed..."
pnpm admin:db:mig
pnpm auth:db:mig
pnpm warehouse:db:mig

echo "Generate Prisma Types if Needed..."
pnpm admin:db:gen
pnpm auth:db:gen
pnpm warehouse:db:gen

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