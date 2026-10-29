#!/usr/bin/env bash
# Copia a arte do app (ícone do Broto e cenários) para public/arte e instala @remotion/transitions na mesma versão do Remotion.
set -e
cd "$(dirname "$0")/.."
V=$(node -p "require('remotion/package.json').version")
echo "remotion $V"
npm ls @remotion/transitions >/dev/null 2>&1 || npm i --no-audit --no-fund "@remotion/transitions@$V" | tail -1
mkdir -p public/arte
for f in icones/broto.svg cenarios/cap1-nave-pousada.webp cenarios/cap4-banco-noite.webp cenarios/cap2-nave-cometa.webp cenarios/cap6-casas-chuvoso.webp cenarios/fundo-cap1.webp; do
  cp "../web/public/$f" public/arte/
done
ls public/arte
grep -c trimBefore node_modules/remotion/dist/cjs/video/props.d.ts || true
