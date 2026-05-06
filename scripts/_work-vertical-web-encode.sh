#!/usr/bin/env bash
# Gedeelde ffmpeg-instelling: zo klein mogelijk voor web, nog net “goed” op telefoon.
# – 720×1280 max (veel minder data dan 1080 verticaal)
# – CRF 27 + slow preset (kleiner bestand; iets langere encode)
# – AAC 96k, faststart voor sneller starten
#
# Usage: source vanuit andere scripts ("./scripts/import-…").
encode_work_vertical_web_mp4() {
  local src="$1"
  local tmp="$2"
  ffmpeg -hide_banner -loglevel warning -stats -y -i "$src" \
    -map 0:v:0 \
    -map 0:a:0? \
    -vf "scale=720:1280:force_original_aspect_ratio=decrease:force_divisible_by=2" \
    -c:v libx264 -preset slow -crf 27 -profile:v main -pix_fmt yuv420p \
    -c:a aac -b:a 96k \
    -movflags +faststart \
    "$tmp"
}
