#!/usr/bin/env bash
set -euo pipefail
umask 077
base="$1"
release="$(pwd -P)"
test "$(dirname "$(dirname "$release")")" = "$base"
mkdir -p "$base/uploads"
exec 9>"$base/.deploy.lock"
flock -n 9 || { echo 'Another deployment is active'; exit 1; }
command -v pm2 >/dev/null
required_node=$(node -p 'require("./release.json").nodeMajor')
test "$(node -p 'Number(process.versions.node.split(".")[0])')" = "$required_node"
if test "$(node -p 'require("./release.json").web')" = false; then
    command -v pnpm >/dev/null
    test "$(pnpm --version)" = '11.24.0'
    package=$(node -p 'require("./release.json").package')
    pnpm --filter "$package..." install --prod --frozen-lockfile --ignore-scripts
fi
old="$(readlink -f "$base/current" || true)"
name="$(node -p '"ebtkar-" + require("./release.json").name')"
if pm2 startOrRestart "$release/ecosystem.config.cjs" --only "$name" --update-env && node "$release/health.cjs"; then
    ln -s "$release" "$base/.current-new"
    mv -Tf "$base/.current-new" "$base/current"
    echo "Deployed $name; previous release: $old"
else
    echo 'Startup failed; restoring previous release' >&2
    if test -n "$old" && test -f "$old/ecosystem.config.cjs"; then
        pm2 startOrRestart "$old/ecosystem.config.cjs" --only "$name" --update-env
    else
        pm2 stop "$name" || true
    fi
    exit 1
fi
