#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if ! command -v psql >/dev/null 2>&1; then
    apt-get update -qq && apt-get install -y -qq --no-install-recommends postgresql-client
fi

for f in "$repo_root"/initScripts/postgres/*.sql; do
    echo "Running $f"
    psql -v ON_ERROR_STOP=1 -d "$POSTGRES_DB" -f "$f"
done
