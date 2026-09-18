#!/usr/bin/env bash
set -euo pipefail
node "$(dirname "$0")/../../../tools/deployment/run.cjs" dev:build api-gateway "$@"
