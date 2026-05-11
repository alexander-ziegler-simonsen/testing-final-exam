#!/bin/bash

# Each entry is "display-name|relative-path-under-stress-tests/"
TESTS=(
  "single-endpoint-load-test|single-endpoint-load-test"
  "single-endpoint-stress-test|single-endpoint-stress-test"
  "single-endpoint-spike-test|single-endpoint-spike-test"
  "single-endpoint-soak-test|single-endpoint-soak-test"
  "single-endpoint-random|single-endpoint-random"
)

TOTAL=${#TESTS[@]}
REPORT_DIR="tests/stress-tests/reports"
mkdir -p "$REPORT_DIR"

for i in "${!TESTS[@]}"; do
  ENTRY="${TESTS[$i]}"
  NAME="${ENTRY%%|*}"
  PATH_SUFFIX="${ENTRY##*|}"
  NUM=$((i + 1))

  echo ""
  echo "=========================================="
  echo "  Test $NUM/$TOTAL: $NAME"
  echo "=========================================="
  read -p "  Press Enter to run, or 's' to skip: " choice </dev/tty
  if [[ "$choice" == "s" || "$choice" == "S" ]]; then
    echo "  Skipped."
    continue
  fi

  k6 run --env TEST_NAME="$NAME" "tests/stress-tests/$PATH_SUFFIX.js" < /dev/null

  if [ $NUM -lt $TOTAL ]; then
    NEXT_ENTRY="${TESTS[$((i + 1))]}"
    NEXT="${NEXT_ENTRY%%|*}"
    echo ""
    read -p "Press Enter to go to the next stress test ($((NUM + 1))/$TOTAL: $NEXT) ... " </dev/tty
  else
    echo ""
    echo "=========================================="
    echo "  All $TOTAL stress tests complete."
    echo "  Reports saved in: $REPORT_DIR/"
    echo "=========================================="
  fi
done
