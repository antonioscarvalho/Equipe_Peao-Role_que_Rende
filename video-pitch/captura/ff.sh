#!/usr/bin/env bash
# Atalho para o ffmpeg/ffprobe que vem com o Remotion. Uso: captura/ff.sh ffprobe arquivo.mp4
C="$(dirname "$0")/../node_modules/@remotion/compositor-linux-x64-gnu"
bin="$1"; shift
LD_LIBRARY_PATH="$C" "$C/$bin" "$@"
