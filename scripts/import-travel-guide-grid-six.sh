#!/usr/bin/env bash
# Maakt travel-guide-grid-01 … 06 onder public/videos/work/travel/ voor de Work-pagina.
#
# BRON VOLGORDE = de 6 bestanden die je op een rijtje hebt doorgestuurd (1=l…b, … 6=r…o).
#
# Optie A (aanbevolen, geen lange Downloads-namen): zet elk bestand in travel-grid-sources/ als:
#   01.mov  02.mp4  …  06.mp4  (precies één bestand dat begint met 01 enz.)
#
# Optie B: laat Downloads leeg gebruiken als optie-A ontbreekt — zie FALLBACK_* hieronder (originele namen).
#
# npm run import-travel-grid    (vanuit project-root)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_work-vertical-web-encode.sh
source "$SCRIPT_DIR/_work-vertical-web-encode.sh"

ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUT="$ROOT/public/videos/work/travel"
SOURCES_DIR="${TRAVEL_GRID_SOURCES:-$ROOT/travel-grid-sources}"
DOWNLOADS="${DOWNLOADS:-$HOME/Downloads}"

command -v ffmpeg >/dev/null 2>&1 || { echo "Installeer: brew install ffmpeg" >&2; exit 1; }
mkdir -p "$OUT"

# Downloads-fallback als travel-grid-sources/##.* ontbreekt (precies deze namen, met spatie waar nodig).
FALLBACK_01="$DOWNLOADS/e02602e7a22e47a2a1a505ccae633920 2.MOV"
FALLBACK_02="$DOWNLOADS/ADEA8A76-E542-4332-AF22-BCF01CC33EEC 3.MP4"
FALLBACK_03="$DOWNLOADS/7530D306-99F4-4ED4-AB37-764BBED09E62 2.MP4"
FALLBACK_04="$DOWNLOADS/724F9F41-A057-49DE-831A-F1C28987DD7F 4.MP4"
FALLBACK_05="$DOWNLOADS/484A585A-B7CB-45BF-85F8-5C4666936C7E 2.MP4"
FALLBACK_06="$DOWNLOADS/9AB923D1-4320-4B00-BCDD-7438E79D58E4 2.MP4"

pick_or_fail() {
  local id="$1"
  local fallback="$2"

  local matches=()
  shopt -s nullglob
  matches=("${SOURCES_DIR}/${id}".*)
  shopt -u nullglob

  if ((${#matches[@]})); then
    if ((${#matches[@]} > 1)); then
      echo "Let op ${id}: meerdere bestanden in ${SOURCES_DIR}/ — gebruik: ${matches[0]}" >&2
    fi
    echo "${matches[0]}"
    return 0
  fi

  if [[ -f "$fallback" ]]; then
    echo "$fallback"
    return 0
  fi

  echo ""
  echo "Geen bron voor plek ${id}." >&2
  echo "- Zet bestand hier: ${SOURCES_DIR}/${id}.mov (of .mp4 / .MOV)" >&2
  echo "- óf plaats export in Downloads met exact deze naam/spatie-indeling:" >&2
  echo "  $fallback" >&2
  exit 1
}

encode_slot() {
  local id="$1"
  local fallback="$2"
  local dest="$OUT/travel-guide-grid-${id}.mp4"
  local src
  src="$(pick_or_fail "$id" "$fallback")"
  echo "Bron ${id}: $src → $dest"
  local tmp="${dest}.encoding.mp4"
  encode_work_vertical_web_mp4 "$src" "$tmp"
  mv "$tmp" "$dest"
  echo "  → OK"
}

encode_slot "01" "$FALLBACK_01"
encode_slot "02" "$FALLBACK_02"
encode_slot "03" "$FALLBACK_03"
encode_slot "04" "$FALLBACK_04"
encode_slot "05" "$FALLBACK_05"
encode_slot "06" "$FALLBACK_06"

echo ""
echo "Klaar — 6 bestanden onder $OUT:"
ls -lh "$OUT"/travel-guide-grid-0*.mp4
echo ""
echo "Vernieuw localhost ( Cmd+Shift+R ). Controleer work-page.json (travelGridVideos) op ?v= als je cache hardnekkig blijft."
