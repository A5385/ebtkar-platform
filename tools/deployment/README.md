# Development deployment

The repository is an Nx/pnpm workspace with NestJS APIs and React/Vite frontends.
Production remains a separate Docker image workflow; these scripts never deploy production.

## Commands (from the repository root)

```sh
pnpm dev                         # gateway locally, .env.local
pnpm dev api-auth                # local Auth TCP service
pnpm dev api-messaging           # local Messaging service
pnpm dev admin                  # local frontend, VPS API settings from .env.development
pnpm dev auth --local            # local frontend, .env.local
pnpm dev:build api-gateway       # build once, package, upload, PM2 restart
pnpm dev:build admin             # Vite production-optimized build with dev VPS URLs
pnpm dev:build all               # deploy all five applications sequentially
pnpm dev:build api-auth --package-only  # build + archive, no SSH
pnpm build api-gateway           # production environment build only
pnpm build                      # production build for all five applications
node --test tools/deployment/deployment.test.cjs
```

The same dev/dev:build/build commands are available in each application package.
Existing `*:serve` and `*:build` aliases retain their old behavior; use the new commands for explicit environment selection.

## First-time configuration

1. `.env.local` was initialized from the existing `.env` without printing secrets.
2. Complete `.env.development` and `.env.production` using the redacted templates in `env/`. Commands reject `CHANGE_ME` placeholders. No secrets are stored in templates or frontend deployment archives.
3. Use the SAME dev database for local and VPS. The old configuration uses `DATABASE_HOST=localhost`; this refers to different computers on PC and VPS. Confirm the shared database address or arrange an SSH tunnel. Do not point production at that database.
4. Set database URLs, token secrets and mail credentials in the private environment files. `${NAME}` references are supported, with missing/circular references rejected.
5. Review ignored `tools/deployment/dev.config.json`. Approved destination: `meda@109.199.99.70`, `/home/meda/node_apps/ebtkar-dev`. Set the existing SSH identity path for your machine.
6. Verify the VPS SSH fingerprint through your existing trusted server access, then record that host in SSH known_hosts. The deployment requires strict host-key checking and non-interactive key authentication.
7. VPS prerequisites: Node major version matching the local build (currently 24), pnpm 11.24.0, PM2, Bash, tar and flock. These are checked; scripts do not install global tools or configure system services.

Development endpoints: gateway HTTP 1000, Auth TCP 1001, Messaging TCP 1003, Admin HTTP 2000, Auth web HTTP 2001. Auth/Messaging listen on loopback in the dev template; browser/Postman requests go through the gateway, not directly to a Nest TCP port. Frontend dev servers keep their existing 7001/7000 ports; both are allowed by the template's ORIGIN list. HTTP and notification WebSocket CORS use that list.

## Build and runtime details

The runner explicitly loads exactly one environment file, expands references and disables Nx/Vite automatic env-file merging for this run. A build uses NODE_ENV=production for optimization even when targeting the dev VPS. Backend startup explicitly loads the deployed `.env.development` at runtime, before application imports.

API archives include compiled `dist` for the service and its transitive workspace dependencies, workspace package manifests/catalogs and the existing lockfile. The original Nx prune targets have incorrect output paths and are not used. No application TypeScript source, git checkout, local node_modules or database migrations are uploaded. Dependencies are installed on Linux from the lockfile with lifecycle scripts disabled. Prisma clients must already be generated and compiled locally. Packages requiring install-time native compilation need an explicit supported build step before use.

Each frontend archive contains only its static Vite output and the small Node/PM2 static server (with SPA fallback). Environment files and backend secrets are excluded. Vite only exposes its configured public prefixes, currently VITE_ and API_GATEWAY_; never place secrets under these prefixes.

Each deployment creates `<app>/releases/<id>`, installs dependencies before restart, takes a per-app deployment lock and checks the listening port for up to 45 seconds. It then updates `<app>/current`. Startup failure restarts the previous release if one exists. This is a TCP liveness check, not an end-to-end database/Kafka/email test. Old releases remain for rollback; cleanup is manual. Deploying `all` is sequential and is not an all-or-nothing transaction.

Uploads persist in `<app>/uploads` because PM2 runs with the stable application directory as cwd. PM2 process names are `ebtkar-api-gateway`, `ebtkar-api-auth`, `ebtkar-api-messaging`, `ebtkar-admin`, `ebtkar-auth`. Existing processes under other names must be reviewed for port conflicts before first deployment. Stop an unused app with `pm2 stop ebtkar-api-auth`. Configure PM2 startup/save separately if reboot persistence is wanted.

Archives under `dist/deploy` for APIs contain private environment values; keep them private and do not commit/share them.

## Redis / Kafka

The existing VPS Redis already occupies localhost:6379. Docker Compose also publishes 6379, so `infra:up` conflicts. This deployment does not stop Redis or alter the infrastructure. If keeping host Redis, start only Kafka/Zookeeper (`docker compose up -d zookeeper kafka`) and use Redis 127.0.0.1:6379 for PM2 services. If keeping Docker Redis instead, choose a free loopback host port and update REDIS_PORT consistently. Do not run both on the same host port.

Kafka currently advertises localhost:9092. That works for PM2 on the VPS; a local backend needs an SSH tunnel or explicitly configured external Kafka listeners. Copying the VPS IP into KAFKA_HOST alone does not change the broker's advertised address.

## Verification limitations

Live deployment requires completed environment values and a verified SSH host key. Production Dockerfiles/registry publishing are not created by this dev deployment change.
