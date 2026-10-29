#!/usr/bin/env bash
# Lista as cenas gravadas com duração e tira um quadro de conferência de cada uma (captura/sonda/).
cd "$(dirname "$0")/.."
mkdir -p captura/sonda
for f in public/cenas/*.mp4; do
  d=$(captura/ff.sh ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  echo "$(basename "$f"): ${d}s"
  n=$(basename "$f" .mp4)
  for t in ${PONTOS:-0.3 0.6 0.9}; do
    s=$(awk "BEGIN{print $d*$t}")
    captura/ff.sh ffmpeg -v error -y -ss "$s" -i "$f" -frames:v 1 "captura/sonda/$n-$t.png"
  done
done
ls public/cenas
