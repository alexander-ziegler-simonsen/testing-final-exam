#!/bin/bash

# Each entry is "display-name|relative-path-under-stress-tests/"
TESTS=(
  "hospital-stress|multi-endpoint/hospital-stress"
  "hospital-linear|multi-endpoint/hospital-linear"
  "hospital-linear-no-sleep|multi-endpoint/hospital-linear-no-sleep"
  "hospital-multi-step|multi-endpoint/hospital-multi-step"
  "hospital-multi-step-no-sleep|multi-endpoint/hospital-multi-step-no-sleep"
  "hospital-random|multi-endpoint/hospital-random"
  "hospital-random-no-sleep|multi-endpoint/hospital-random-no-sleep"
  "hospital-expanding|multi-endpoint/hospital-expanding"
  "hospital-expanding-no-sleep|multi-endpoint/hospital-expanding-no-sleep"
  "single-endpoint-linear|single-endpoint/single-endpoint-linear"
  "single-endpoint-multi-step|single-endpoint/single-endpoint-multi-step"
  "single-endpoint-random|single-endpoint/single-endpoint-random"
  "single-endpoint-patient|single-endpoint/single-endpoint-patient"
)

TOTAL=${#TESTS[@]}
REPORT_DIR="stress-tests/reports"
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

  k6 run --env TEST_NAME="$NAME" "stress-tests/$PATH_SUFFIX.js" < /dev/null

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
