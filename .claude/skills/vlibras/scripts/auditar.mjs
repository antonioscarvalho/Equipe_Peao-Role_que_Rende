#!/usr/bin/env node
// Confere se o que está em web/src o VLibras Widget 7.x consegue ler. Pega o que dá para pegar
// lendo o código; o resto é tocar na tela com o widget aberto (SKILL.md, "Como testar").
// Sai com código 1 quando há BLOQUEIO.
//
// Uso: node .claude/skills/vlibras/scripts/auditar.mjs [caminhos...] [--json]
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";

const args = process.argv.slice(2);
const JSON_SAIDA = args.includes("--json");
const alvos = args.filter((a) => !a.startsWith("--"));
const raizes = alvos.length ? alvos : ["web/src"];

const IGNORAR = /(^|[\\/])(node_modules|dist|coverage|lottie)([\\/]|$)|\.(test|spec)\.[jt]sx?$/;
const listar = (c) =>
  !existsSync(c) || IGNORAR.test(c) ? [] : statSync(c).isFile() ? [c] : readdirSync(c).flatMap((n) => listar(join(c, n)));
const arquivos = raizes.flatMap(listar).filter((f) => [".tsx", ".ts", ".css", ".html"].includes(extname(f)));

const achados = [];
const BLOQ = "bloqueio";
const AVISO = "aviso";
const achar = (gravidade, arquivo, linha, mensagem) =>
  achados.push({ gravidade, arquivo: arquivo ? relative(process.cwd(), arquivo) : "projeto", linha, mensagem });
const linhaDe = (src, i) => src.slice(0, i).split("\n").length;

/** Elementos `<tag …>conteúdo</tag>` sem aninhar a mesma tag (botão dentro de botão não existe). */
function elementos(src, tag) {
  const lista = [];
  const re = new RegExp(`<${tag}(?=[\\s>])`, "g");
  for (const m of src.matchAll(re)) {
    let i = m.index + m[0].length;
    let prof = 0;
    let aspas = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (aspas) { if (c === aspas) aspas = null; continue; }
      if (c === '"' || c === "'" || c === "`") aspas = c;
      else if (c === "{") prof++;
      else if (c === "}") prof--;
      else if (c === ">" && prof === 0) break;
    }
    const atributos = src.slice(m.index, i + 1);
    if (atributos.endsWith("/>")) continue;
    const fim = src.indexOf(`</${tag}>`, i);
    if (fim < 0) continue;
    lista.push({ indice: m.index, atributos, conteudo: src.slice(i + 1, fim) });
  }
  return lista;
}

/** O que sobra de texto visível: sem tags, sem comentário. `{expressão}` conta como texto dinâmico. */
function textoVisivel(conteudo) {
  // `=>` dentro de atributo fecharia a tag cedo demais na hora de tirar as tags.
  const semSrOnly = conteudo.replace(/=>/g, "=)").replace(/<(\w+)[^>]*className="[^"]*\bsr-only\b[^"]*"[^>]*>[\s\S]*?<\/\1>/g, "");
  const semTags = semSrOnly.replace(/<[^>]*>/g, " ");
  const dinamico = /\{(?!\s*\/\*)[^}]*\}/.test(semTags);
  const estatico = semTags.replace(/\{[^}]*\}/g, " ");
  return { temLetra: /\p{L}/u.test(estatico), dinamico };
}

let carregador = false;
let toqueNoControle = false;

for (const arquivo of arquivos) {
  const src = readFileSync(arquivo, "utf8");
  const ext = extname(arquivo);

  if (/carregarVLibras\s*\(\s*\)/.test(src) && !/export function carregarVLibras/.test(src)) carregador = true;

  if (ext === ".css") {
    if (/:where\(\s*button\s*,\s*a\s*,\s*\[role="button"\]\s*\)\s*\*\s*\{[^}]*pointer-events:\s*none/.test(src)) toqueNoControle = true;
    for (const m of src.matchAll(/vlibras-ignore/g))
      achar(AVISO, arquivo, linhaDe(src, m.index), "`.vlibras-ignore` só muda o cursor no 7.12.2; não impede a tradução.");
    continue;
  }
  if (ext !== ".tsx" && ext !== ".html") continue;

  // 1. Controle sem texto visível: o widget traduz o innerText do botão, ou o data-vlibras-gloss dele.
  for (const tag of ["button", "a"]) {
    for (const el of elementos(src, tag)) {
      if (/data-vlibras-gloss=/.test(el.atributos)) {
        const valor = el.atributos.match(/data-vlibras-gloss=(?:"([^"]*)"|\{[^}]*"([^"]*)")/);
        const glosa = valor?.[1] ?? valor?.[2] ?? "";
        if (glosa && glosa !== glosa.toUpperCase())
          achar(AVISO, arquivo, linhaDe(src, el.indice), `Glosa "${glosa}" em minúsculas: glosa de Libras vai em MAIÚSCULAS ("FECHAR JOGO").`);
        continue;
      }
      const { temLetra, dinamico } = textoVisivel(el.conteudo);
      if (!temLetra && !dinamico)
        achar(BLOQ, arquivo, linhaDe(src, el.indice),
          `<${tag}> sem texto visível (só ícone, símbolo ou aria-label): o VLibras traduz nada ou o símbolo. Ponha texto visível ou data-vlibras-gloss="…".`);
    }
  }

  // 2. Informação só no aria-label de algo que não é controle: o VLibras não lê aria-label.
  for (const m of src.matchAll(/<(span|div|p|section|svg)\b[^>]*\baria-label=\{?[^>]*>/g)) {
    const tag = m[1];
    const depois = src.slice(m.index + m[0].length, m.index + m[0].length + 200);
    if (m[0].includes("role=\"group\"") || m[0].includes("<section") || /aria-hidden=/.test(m[0])) continue;
    const vazio = m[0].endsWith("/>") || new RegExp(`^\\s*(<[^>]*>\\s*)*</${tag}>`).test(depois);
    if (vazio || tag === "svg")
      achar(AVISO, arquivo, linhaDe(src, m.index),
        `<${tag} aria-label> sem texto visível: o leitor de tela ouve, o VLibras não tem o que traduzir. Se a informação importa, mostre em texto.`);
  }

  // 3. Rótulo cujo texto está só em .sr-only ou title: invisível para o VLibras e para quem enxerga.
  for (const el of elementos(src, "label")) {
    const { temLetra, dinamico } = textoVisivel(el.conteudo);
    if (!temLetra && !dinamico && /sr-only|title=/.test(el.atributos + el.conteudo))
      achar(AVISO, arquivo, linhaDe(src, el.indice),
        "<label> com o nome só em .sr-only ou title: o VLibras não alcança (e no celular title não aparece). Mostre o nome.");
  }

  // 4. Texto desenhado no canvas não existe para o widget.
  for (const m of src.matchAll(/\.fillText\(/g))
    achar(AVISO, arquivo, linhaDe(src, m.index), "Texto desenhado no <canvas>: o VLibras não lê. Se a pessoa precisa dele, repita em DOM.");

  // 5. Jogo em tempo real sem esconder a bolha durante a partida.
  if (/requestAnimationFrame/.test(src) && /role="dialog"/.test(src) && /onPointerDown/.test(src) && !/useEsconderVLibras\(/.test(src))
    achar(AVISO, arquivo, 1, "Parece jogo em tempo real e não chama useEsconderVLibras(estado === \"jogando\"): a bolha fica sobre o controle.");

  // 6. Imagem sem alt: o alt é o que o widget traduz.
  for (const m of src.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g))
    achar(BLOQ, arquivo, linhaDe(src, m.index), "<img> sem alt: o VLibras traduz o alt. Decorativa leva alt=\"\".");
}

if (!carregador) achar(BLOQ, null, null, "Ninguém chama carregarVLibras(): a bolha não aparece (web/src/main.tsx).");
if (!toqueNoControle)
  achar(BLOQ, null, null,
    "Falta `:where(button, a, [role=\"button\"]) * { pointer-events: none; }`: tocar no ícone de um botão traduz só o ícone (e num <svg> o widget dá erro).");

const bloqueios = achados.filter((a) => a.gravidade === BLOQ).length;
if (JSON_SAIDA) console.log(JSON.stringify({ bloqueios, achados }, null, 2));
else {
  console.log(`# VLibras · ${arquivos.length} arquivos\n`);
  const porArquivo = Map.groupBy(achados, (a) => a.arquivo);
  for (const [arq, lista] of porArquivo) {
    console.log(`## ${arq}`);
    for (const a of lista) console.log(`- ${a.gravidade === BLOQ ? "🔴 BLOQUEIO" : "🟡 aviso"}${a.linha ? ` · linha ${a.linha}` : ""} · ${a.mensagem}`);
    console.log();
  }
  console.log(`**${bloqueios} bloqueio(s), ${achados.length - bloqueios} aviso(s).** Passar aqui não é estar legível: falta tocar na tela com o widget aberto.`);
}
process.exit(bloqueios ? 1 : 0);
