#!/bin/bash
# Build script: injects last commit date into index.html at build time.
# Run before deploying. In CI, this runs automatically via GitHub Actions.

set -e

DATE=$(git log -1 --format="%cd" --date=format:'%d %b %Y' 2>/dev/null)

if [ -z "$DATE" ]; then
  echo "Error: could not read git log date." >&2
  exit 1
fi

sed -i "s|<!--LIVE_UPDATED_DATE-->[^<]*<!--/LIVE_UPDATED_DATE-->|<!--LIVE_UPDATED_DATE-->${DATE}<!--/LIVE_UPDATED_DATE-->|g" index.html
echo "Build: Live Updated date set to $DATE"
