#!/usr/bin/env bash
set -e

echo "Starting infrastructure..."

pnpm infra:up

echo "Starting APIs..."

pm2 restart \
  ebtkar-api-auth \
  ebtkar-api-gateway \
  ebtkar-api-messaging \
  || pm2 start ecosystem.config.js

pm2 save

echo "Services running:"
pm2 list