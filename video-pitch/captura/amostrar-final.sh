#!/usr/bin/env bash
# Tira quadros do vídeo final (out/pitch-broto.mp4) para conferência: out/final-<segundo>.png
cd "$(dirname "$0")/.."
for t in "$@"; do
  captura/ff.sh ffmpeg -v error -y -ss "$t" -i out/pitch-broto.mp4 -frames:v 1 "out/final-$t.png"
done
ls out
