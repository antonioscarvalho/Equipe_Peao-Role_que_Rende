// Renderiza quadros soltos do vídeo para revisão. Uso: node captura/quadros.mjs 100 400 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const raiz = resolve(import.meta.dirname, "..");
mkdirSync(resolve(raiz, "out/quadros"), { recursive: true });
const serveUrl = await bundle({ entryPoint: resolve(raiz, "src/index.ts"), publicDir: resolve(raiz, "public") });
const composition = await selectComposition({ serveUrl, id: "Pitch" });
console.log(`duração: ${composition.durationInFrames} quadros (${(composition.durationInFrames / 30).toFixed(1)} s)`);
for (const q of process.argv.slice(2).map(Number)) {
  await renderStill({ serveUrl, composition, frame: q, output: resolve(raiz, `out/quadros/q${String(q).padStart(4, "0")}.png`), scale: 0.5 });
  console.log("quadro", q);
}
