#!/usr/bin/env bash
set -e

BASE_URL="${BASE_URL:-http://localhost:5028}"

ALLURE_RESULTS_DIR="${ALLURE_RESULTS_DIR:-./allure-results}"

pnpm exec newman run \
  "new hospitalApi - 2026.postman_collection.json" \
  --env-var "baseUrl=$BASE_URL" \
  --reporters cli,allure \
  --reporter-allure-export "$ALLURE_RESULTS_DIR"
