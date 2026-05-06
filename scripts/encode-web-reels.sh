#!/usr/bin/env bash
#
# Hercodeer alle MP4’s onder public/videos voor web — standaard: ZEER HOGE kwaliteit.
#   - H.264 CRF 18 + preset “slower” (weinig zichtbaar verlies; betere compressie dan “slow”).
#   - Tot 1440×2560 (scherpe reels op grote telefoons; grotere bron wordt omlaag geschaald).
#   - AAC 192k stereo waar van toepassing; faststart voor streaming.
#
# Sneller / kleinere files (bewust lagere kwaliteit):
#   CRF=20 PRESET=slow ./scripts/encode-web-reels.sh
#
# Nóg trager, laatste bietje efficiëntie (lang encoderen):
#   PRESET=veryslow ./scripts/encode-web-reels.sh
#
# Daarna in JSON overal dezelfde nieuwe ?v= zetten.
#

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VID_ROOT="${ROOT}/public/videos"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg niet gevonden. Installeer met: brew install ffmpeg" >&2
  exit 1
fi

# CRF: lager = betere kwaliteit (18 ≈ zeer hoog voor web H.264).
CRF="${CRF:-18}"
PRESET="${PRESET:-slower}"
AUDIO_BR="${AUDIO_BR:-192k}"
# Max afmeting (reels): 1440×2560 = scherp op moderne telefoons; 4K-bron wordt verkleind.
MAX_W="${MAX_W:-1440}"
MAX_H="${MAX_H:-2560}"

encode_one() {
  local in="$1"
  local tmp="${in}.tmp-encode.mp4"
  local bak="${in}.pre-web.bak"

  rel="${in#"${ROOT}/public/"}"
  echo "==> /${rel}"

  # Past in vak MAX_W×MAX_H; nooit omhoog schalen, wel 4K+ naar webformaat.
  ffmpeg -hide_banner -loglevel warning -stats -y -i "$in" \
    -vf "scale=${MAX_W}:${MAX_H}:force_original_aspect_ratio=decrease:force_divisible_by=2" \
    -c:v libx264 -preset "${PRESET}" -crf "${CRF}" \
    -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a "${AUDIO_BR}" \
    -movflags +faststart \
    "${tmp}"

  mv "$in" "$bak"
  mv "$tmp" "$in"

  old_b=$(wc -c <"$bak" | tr -d " ")
  new_b=$(wc -c <"$in" | tr -d " ")
  echo "    oud:  $old_b bytes"
  echo "    nieuw: $new_b bytes"
  echo "    backup: ${bak#"${ROOT}/public/"}"
  echo ""
}

while IFS= read -r -d '' f; do
  encode_one "$f"
done < <(find "${VID_ROOT}" -type f -name '*.mp4' ! -name '*.tmp-encode.mp4' -print0)

echo "Klaar. Controleer een paar clips visueel. Daarna oude .pre-web.bak verwijderen als je tevreden bent."
echo "Vergeet niet in homepage.json / work-page.json een nieuwe ?v= te zetten."
