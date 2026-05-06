#!/usr/bin/env bash
# Zet bronvideo (MOV of MP4) om naar compacte web-MP4 onder public/videos/work/travel/.
# Usage (pas SRC/DEST aan):
#   SRC="$HOME/Downloads/ce2493cab1c04f91a99b2e846e3c2ed9.MOV" ./scripts/import-mov-as-travel-reel.sh
#   SRC="$HOME/Downloads/D4A346E2-89BE-4144-A78D-B273AAE6D77E.MP4" DEST=".../travel-location-d4a346e2.mp4" ./scripts/import-mov-as-travel-reel.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_work-vertical-web-encode.sh
source "$SCRIPT_DIR/_work-vertical-web-encode.sh"

ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEST="${DEST:-${ROOT}/public/videos/work/travel/travel-location-ce2493ca.mp4}"
SRC="${SRC:-}"

if [[ -z "${SRC}" ]]; then
  echo "Gebruik: SRC=\"\$HOME/Downloads/jouw-bestand.MOV\" $0" >&2
  exit 1
fi

if [[ ! -f "${SRC}" ]]; then
  echo "Bron ontbreekt: ${SRC}" >&2
  exit 1
fi

command -v ffmpeg >/dev/null 2>&1 || { echo "Installeer: brew install ffmpeg" >&2; exit 1; }

mkdir -p "$(dirname "${DEST}")"
tmp="${DEST}.encoding.mp4"

encode_work_vertical_web_mp4 "${SRC}" "${tmp}"

mv "${tmp}" "${DEST}"
echo "Klaar: ${DEST}"
ls -lh "${DEST}"
