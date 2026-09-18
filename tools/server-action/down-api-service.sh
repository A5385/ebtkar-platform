#!/usr/bin/env bash
set -e

echo "Stopping API services..."

pm2 stop \
  ebtkar-api-auth \
  ebtkar-api-gateway \
  ebtkar-api-messaging || true

echo "Stopping infrastructure..."
pnpm infra:down

echo "Done"