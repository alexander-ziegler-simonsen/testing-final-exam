#!/usr/bin/env bash
set -euo pipefail

pnpm install --frozen-lockfile

installed=$(node -p "require('./node_modules/playwright/package.json').version")
if [ "$installed" != "$PLAYWRIGHT_VERSION" ]; then
    echo "playwright in node_modules is $installed, image is built for $PLAYWRIGHT_VERSION." >&2
    echo "Bump the image tag + PLAYWRIGHT_VERSION in docker/Dockerfile.component-test together with playwright." >&2
    exit 1
fi

script=test:browser
if [ $# -gt 0 ] && [[ $1 != -* ]]; then
    script=$1
    shift
fi

exec pnpm run "$script" "$@"
