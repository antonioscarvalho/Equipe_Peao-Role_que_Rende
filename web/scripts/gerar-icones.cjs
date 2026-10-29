/**
 * Gera os ícones do app instalável (PWA) a partir de public/icones/broto.svg.
 * Rodar dentro de web/ quando o desenho mudar (o resultado vai para o repositório). O @resvg/resvg-js
 * fica fora do projeto, para não virar dependência do app:
 *
 *   mkdir -p /tmp/resvg && npm i --prefix /tmp/resvg @resvg/resvg-js@2
 *   NODE_PATH=/tmp/resvg/node_modules node scripts/gerar-icones.cjs
 *
 * - icone-192/512: o Broto sobre o amarelo do tema, com bordas arredondadas (Android e computador).
 * - icone-maskable-512: o Broto menor (zona segura de 80%) e fundo até a borda; o sistema recorta o formato.
 * - apple-touch-icon (180): fundo até a borda, sem transparência (o iOS arredonda sozinho).
 */
const fs = require("node:fs");
const path = require("node:path");
const { Resvg } = require("@resvg/resvg-js");

const AMARELO = "#F9DC6E"; // --livro-sol
const pasta = path.join(__dirname, "..", "public", "icones");
const broto = fs.readFileSync(path.join(pasta, "broto.svg"), "utf8")
  .replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

/** Monta um SVG quadrado de `lado` px com o Broto ocupando `escala` do lado. */
function icone(lado, escala, raio) {
  const b = lado * escala;
  const o = (lado - b) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}">
  <rect width="${lado}" height="${lado}" rx="${raio}" fill="${AMARELO}"/>
  <svg x="${o}" y="${o + b * 0.02}" width="${b}" height="${b}" viewBox="0 0 200 200">${broto}</svg>
</svg>`;
}

const saidas = [
  ["icone-192.png", icone(192, 0.86, 192 * 0.22)],
  ["icone-512.png", icone(512, 0.86, 512 * 0.22)],
  ["icone-maskable-512.png", icone(512, 0.62, 0)],
  ["apple-touch-icon.png", icone(180, 0.8, 0)],
];
for (const [nome, svg] of saidas) {
  const png = new Resvg(svg, { fitTo: { mode: "original" } }).render().asPng();
  fs.writeFileSync(path.join(pasta, nome), png);
  console.log(nome, png.length, "bytes");
}
