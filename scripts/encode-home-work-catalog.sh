#!/usr/bin/env bash
#
# Hercodeert alle MP4-paden die in homepage.json + work-page.json staan naar een
# compacte web-kwaliteit — kleiner bestand, nauwelijks merkbaar op telefoon en laptop.
#
# Standaard (pas aan via env-vars):
#   - H.264 CRF 22 + preset slower (compact t.o.v. CRF 18, nog steeds “top” voor web-reels).
#   - Max 1080×1920 (standaard korte social/reels-maat; nooit opschalen).
#   - AAC stereo 160 kbps + faststart (snel starten in Safari/Chrome).
#   - Bij elke clip: eerst *.pre-web-reencode.bak, daarna nieuwe mp4 erover.
#
# Voorbereiding macOS:
#   brew install ffmpeg
#
# Gebruik (vanuit projectroot):
#   ./scripts/encode-home-work-catalog.sh
#
# Daarna nieuwe cache-busting in JSON (één tijdstempel voor alles):
#   NEW_V=20260507 ./scripts/bump-video-version-in-json.sh
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC="${ROOT}/public"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg niet gevonden. Installeer met: brew install ffmpeg" >&2
  exit 1
fi

CRF="${CRF:-22}"
PRESET="${PRESET:-slower}"
AUDIO_BR="${AUDIO_BR:-160k}"
MAX_W="${MAX_W:-1080}"
MAX_H="${MAX_H:-1920}"

encode_one() {
  local rel="$1"
  local in="${PUBLIC}/${rel}"
  local tmp="${in}.tmp-encode-web.mp4"
  local bak="${in}.pre-web-reencode.bak"

  echo "==> /${rel}"
  ffmpeg -hide_banner -loglevel warning -stats -y -i "${in}" \
    -vf "scale=${MAX_W}:${MAX_H}:force_original_aspect_ratio=decrease:force_divisible_by=2" \
    -c:v libx264 -preset "${PRESET}" -crf "${CRF}" \
    -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a "${AUDIO_BR}" \
    -movflags +faststart \
    "${tmp}"

  mv "${in}" "${bak}"
  mv "${tmp}" "${in}"

  old_b=$(wc -c <"${bak}" | tr -d " ")
  new_b=$(wc -c <"${in}" | tr -d " ")
  echo "    oud:  ${old_b} bytes"
  echo "    nieuw: ${new_b} bytes"
  echo "    backup: ${bak#"${PUBLIC}/"}"
  echo ""
}

paths_from_json() {
  grep -ohE '/videos/[^"?]+\.mp4' "${ROOT}/src/content/homepage.json" "${ROOT}/src/content/work-page.json" |
    sed 's|^/||' |
    LC_ALL=C sort -u
}

SKIP=0
DONE=0
while IFS= read -r rel; do
  [[ -z "${rel}" ]] && continue
  in="${PUBLIC}/${rel}"
  if [[ ! -f "${in}" ]]; then
    echo "⚠ Skip (bestand ontbreekt): /${rel}" >&2
    SKIP=$((SKIP + 1))
    continue
  fi
  encode_one "${rel}"
  DONE=$((DONE + 1))
done < <(paths_from_json)

echo "Klaar: ${DONE} ge‑encodeerd, ${SKIP} overgeslagen door ontbrekend bestand."
echo "Maak backups leeg (*.pre-web-reencode.bak) als het beeld akkoord is."
echo ""
echo 'Zet één nieuwe ?v=' in homepage.json én work-page.json (bv. via ./scripts/bump-video-version-in-json.sh)'
exit 0
