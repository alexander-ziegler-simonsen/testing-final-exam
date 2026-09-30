#!/usr/bin/env bash
set -euo pipefail

pnpm install --frozen-lockfile

installed=$(node -p "require('./node_modules/playwright/package.json').version")
if [ "$installed" != "$PLAYWRIGHT_VERSION" ]; then
    echo "playwright in node_modules is $installed, image is built for $PLAYWRIGHT_VERSION." >&2
    echo "Bump the image tag + PLAYWRIGHT_VERSION in Dockerfile.component-test together with playwright." >&2
    exit 1
fi

exec pnpm exec vitest run --project browser --browser.headless "$@"
