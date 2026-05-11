#!/usr/bin/env bash
set -e

: "${POSTMAN_API_KEY:?Set POSTMAN_API_KEY before running (export POSTMAN_API_KEY=your_key)}"

BASE_URL="${BASE_URL:-http://localhost:5028}"

newman run \
  "https://api.getpostman.com/collections/12590735-d2637d88-8db0-440f-8fc4-311fb39720d5" \
  --environment "https://api.getpostman.com/environments/12590735-36583cbb-fb85-4c40-93e4-2f58748a3d6d" \
  --postman-api-key "$POSTMAN_API_KEY" \
  --env-var "baseUrl=$BASE_URL"
