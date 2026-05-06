#!/usr/bin/env bash
#
# Vervangt overal de ?v=-query bij video-URL's in homepage + work-page door NEW_V (één tijdstempel).
# Alle browsers halen zo de nieuwe, kleinere MP4 van het CDN op.
#
# VERPLICHT NEW_V bijv.:  NEW_V=20260507 ./scripts/bump-video-version-in-json.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ -z "${NEW_V:-}" ]]; then
  echo "Gebruik: NEW_V=20260507 ./scripts/bump-video-version-in-json.sh" >&2
  exit 1
fi

for f in "${ROOT}/src/content/homepage.json" "${ROOT}/src/content/work-page.json"; do
  if [[ "$(uname -s)" == "Darwin" ]]; then
    sed -i '' -E "s/(\\.mp4)\\?v=[^\"]+/\\1?v=${NEW_V}/g" "$f"
  else
    sed -i -E "s/(\\.mp4)\\?v=[^\"]+/\\1?v=${NEW_V}/g" "$f"
  fi
  echo "Bijgewerkt: $f"
done

echo "Nieuwe cache-key overal: ?v=${NEW_V}"
