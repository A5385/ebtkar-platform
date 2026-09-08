# Messaging service

The service consumes Kafka events for email delivery and persisted admin notifications. It also exposes an internal TCP transport on port `4003` for future notification queries.

Required root `.env` values:

```dotenv
API_MESSAGING_HOST=127.0.0.1
API_MESSAGING_PORT=4003
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=change-me
DATABASE_HOST=localhost
DATABASE_PORT=5432
NOTIFICATION_DATABASE_NAME=ebtkar_notification
NOTIFICATION_DATABASE_URL="postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${NOTIFICATION_DATABASE_NAME}?schema=public&connection_limit=30&pool_timeout=40"
MAIL_HOST=mail.example.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=
```

Start infrastructure and deploy the notification migration:

```bash
pnpm infra:up
pnpm --filter @org/database-notification db:dep
pnpm api-messaging:serve
```

The Gateway WebSocket namespace is `/notifications`. Connections are accepted only when an `access_token` or `accessToken` cookie contains a valid JWT whose `role` claim is `ADMIN`.
