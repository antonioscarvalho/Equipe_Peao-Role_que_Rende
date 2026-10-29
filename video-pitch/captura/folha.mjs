// Folha de contato: junta imagens numa grade e salva um PNG. Uso: node captura/folha.mjs saida.png img1 img2 ...
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { basename } from "node:path";

const [saida, ...imgs] = process.argv.slice(2);
const cards = imgs.map((f) => `<figure><img src="data:image/png;base64,${readFileSync(f).toString("base64")}"><figcaption>${basename(f)}</figcaption></figure>`).join("");
const html = `<style>body{margin:0;background:#222;display:grid;grid-template-columns:repeat(${Math.min(6, imgs.length)},1fr);gap:6px;padding:6px;font:12px sans-serif;color:#fff}
img{width:100%;display:block}figure{margin:0}</style>${cards}`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1500, height: 800 } });
await p.setContent(html);
await p.screenshot({ path: saida, fullPage: true });
await b.close();
