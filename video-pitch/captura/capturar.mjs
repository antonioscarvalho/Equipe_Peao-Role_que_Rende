// Grava cenas do app real (web/, rodando em http://localhost:5180) para o vídeo do pitch.
// Cada cena: celular 390×844 @2x, estado de demonstração sintético no localStorage,
// screencast do Chromium em JPEG → MP4 30 fps (ffmpeg do Remotion) em public/cenas/.
// Uso: node captura/capturar.mjs [nome-da-cena ...]
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const URL = process.env.APP_URL ?? "http://localhost:5180/";
const RAIZ = resolve(import.meta.dirname, "..");
const SAIDA = join(RAIZ, "public", "cenas");
const TMP = join(RAIZ, "captura", "tmp");
mkdirSync(SAIDA, { recursive: true });
// ffmpeg que já vem com o Remotion (não precisa instalar no sistema).
const COMPOSITOR = join(RAIZ, "node_modules", "@remotion", "compositor-linux-x64-gnu");
const FFMPEG = join(COMPOSITOR, "ffmpeg");

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Estado sintético: "Marcos", dia 10 do plano, semana 1 completa, capítulo 1 concluído. */
function semear({ tema = "claro", fresco = false, capDoneOntem = true } = {}) {
  return `(() => {
    if (sessionStorage.getItem("demo-semeado")) return;
    sessionStorage.setItem("demo-semeado", "1");
    localStorage.clear();
    localStorage.setItem("rqr-tema", ${JSON.stringify(tema)});
    localStorage.setItem("rqr:volume-efeitos", "0");
    localStorage.setItem("rqr:volume-musica", "0");
    if (${fresco}) return;
    const dia = (n) => { const d = new Date(); d.setDate(d.getDate() - n);
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
    const feitas = { "s1-1": dia(8), "s1-2": dia(7), "s1-3": dia(5), "s1-4": dia(3), "s2-4": dia(1) };
    localStorage.setItem("rqr:plano", JSON.stringify({ inicio: dia(9), feitas }));
    localStorage.setItem("rqr:historia", JSON.stringify({ concluidos: ["cap1"], avisoVisto: true, partes: {}, ultimoDia: dia(${capDoneOntem ? 1 : 0}) }));
    localStorage.setItem("rqr:perfil", JSON.stringify({ nome: "Marcos", nomeBroto: "Broto", cenario: "bairro" }));
    localStorage.setItem("rqr:aparencia", JSON.stringify({ cor: "azul", corRoupa: "amarelo", roupa: "moletom", cabeca: "gorro", rosto: "nenhum", peito: "coracao" }));
    localStorage.setItem("rqr:primeiro-acesso", "1");
  })()`;
}

async function gravar(browser, nome, opcoesSemente, acoes) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    locale: "pt-BR", timezoneId: "America/Sao_Paulo",
  });
  await ctx.addInitScript(semear(opcoesSemente));
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log(`[${nome}] erro na página:`, e.message));
  const cdp = await ctx.newCDPSession(page);
  const quadros = [];
  cdp.on("Page.screencastFrame", async (f) => {
    quadros.push({ data: f.data, t: f.metadata.timestamp });
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await page.goto(URL, { waitUntil: "networkidle" });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
  const inicio = Date.now() / 1000;
  await acoes(page);
  const fim = Date.now() / 1000;
  await cdp.send("Page.stopScreencast");
  await ctx.close();

  // Quadros → MP4 com duração real de cada quadro.
  const dir = join(TMP, nome);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const lista = [];
  quadros.forEach((q, i) => {
    const arq = `q${String(i).padStart(5, "0")}.jpg`;
    writeFileSync(join(dir, arq), Buffer.from(q.data, "base64"));
    const prox = i + 1 < quadros.length ? quadros[i + 1].t : fim;
    lista.push(`file '${arq}'`, `duration ${Math.max(0.001, prox - q.t).toFixed(4)}`);
  });
  lista.push(`file 'q${String(quadros.length - 1).padStart(5, "0")}.jpg'`);
  writeFileSync(join(dir, "lista.txt"), lista.join("\n"));
  const mp4 = join(SAIDA, `${nome}.mp4`);
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "lista.txt",
    "-fps_mode", "cfr", "-r", "30", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-an", mp4],
    { cwd: dir, stdio: "inherit", env: { ...process.env, LD_LIBRARY_PATH: COMPOSITOR } });
  rmSync(dir, { recursive: true, force: true });
  console.log(`✓ ${nome}: ${quadros.length} quadros, ${(fim - inicio).toFixed(1)} s → ${mp4}`);
}

async function foto(browser, nome, opcoesSemente, acoes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "pt-BR", timezoneId: "America/Sao_Paulo" });
  await ctx.addInitScript(semear(opcoesSemente));
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await acoes(page);
  await page.screenshot({ path: join(SAIDA, `${nome}.png`) });
  await ctx.close();
  console.log(`✓ foto ${nome}`);
}

const botao = (page, nome) => page.getByRole("button", { name: nome }).first();
const toque = async (page, nome, depois = 900) => { await botao(page, nome).click(); await espera(depois); };
/** Avança o diálogo da história: completa a fala e segue, ou escolhe a primeira opção. */
async function avancarDialogo(page, vezes, pausa = 1500) {
  for (let i = 0; i < vezes; i++) {
    await espera(pausa);
    const seguir = page.locator(".historia-caixa__seguir");
    if (await seguir.isVisible().catch(() => false)) {
      if ((await seguir.innerText()).includes("Mostrar")) { await seguir.click(); await espera(600); }
      if (await seguir.isVisible().catch(() => false)) { await seguir.click(); continue; }
    }
    const opcao = page.locator(".historia-opcao").first();
    if (await opcao.isVisible().catch(() => false)) { await opcao.click(); continue; }
  }
}

/**
 * Roda dentro da página: acha o estado do Pulo do Bichinho (useRef com `plats`) pela fibra do React
 * e aperta as "setas" (g.teclas) mirando a plataforma onde o Broto vai cair. Só para a gravação.
 */
function pilotoDoPulo() {
  const canvas = document.querySelector(".pulo canvas, canvas");
  const chave = Object.keys(canvas).find((k) => k.startsWith("__reactFiber$"));
  let fibra = canvas[chave], g = null;
  while (fibra && !g) {
    for (let h = fibra.memoizedState; h && typeof h === "object" && "next" in h; h = h.next) {
      const v = h.memoizedState;
      if (v && v.current && Array.isArray(v.current.plats)) { g = v.current; break; }
    }
    fibra = fibra.return;
  }
  if (!g) { console.log("piloto: estado não encontrado"); return; }
  const BICHO = 56, GRAV = 0.42;
  const passo = () => {
    const pe = g.y + BICHO, cx = g.x + BICHO / 2;
    const vivas = g.plats.filter((p) => !p.quebrou);
    let alvo;
    if (g.vy < 0) {
      const apice = (g.vy * g.vy) / (2 * GRAV);
      const acima = vivas.filter((p) => p.y < pe - 4 && p.y > pe - apice * 0.92);
      alvo = acima.sort((a, b) => a.y - b.y)[0];
    }
    if (!alvo) alvo = vivas.filter((p) => p.y >= pe - 4).sort((a, b) => a.y - b.y)[0];
    if (alvo) {
      const dx = alvo.x + alvo.w / 2 + alvo.vx * 6 - cx;
      g.teclas.e = dx < -10; g.teclas.d = dx > 10;
    }
    requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

const CENAS = {
  // Primeiro acesso: logo do Broto, aviso, 18+, a queda e o começo da conversa.
  abertura: (b) => gravar(b, "abertura", { fresco: true }, async (p) => {
    await espera(5200);
    await toque(p, /^Começar$/, 1200);
    await toque(p, /^Sim$/, 400);
    await espera(5000);
    const cont = botao(p, /^Continuar$/);
    if (await cont.isVisible().catch(() => false)) await cont.click();
    await avancarDialogo(p, 9, 1700);
    await espera(1500);
  }),
  // Tela inicial: Broto vestido, contagem do plano, missão marcada com confete.
  inicio: (b) => gravar(b, "inicio", {}, async (p) => {
    await espera(5600);
    await p.locator(".missao-bloco").first().click();
    await espera(3200);
    await p.mouse.wheel(0, 500);
    await espera(1800);
    await p.mouse.wheel(0, -600);
    await espera(1200);
  }),
  missoes: (b) => gravar(b, "missoes", {}, async (p) => {
    await espera(4600);
    await toque(p, /^Missões$/, 2200);
    await p.locator("button.missao:not(.is-ok)").first().click();
    await espera(2200);
    await toque(p, /Próxima semana/, 1800);
    await toque(p, /Próxima semana/, 2000);
    await toque(p, /^Jogos$/, 2600);
  }),
  // "Deu vontade": respiração 4-4-6 com o Broto (um ciclo completo).
  respiracao: (b) => gravar(b, "respiracao", {}, async (p) => {
    await espera(4600);
    await p.locator(".deu-vontade").click();
    await espera(15500);
  }),
  // Pulo do Bichinho, a partir da aba Jogos.
  pulo: (b) => gravar(b, "pulo", {}, async (p) => {
    await espera(4600);
    await toque(p, /^Jogos$/, 1200);
    await p.locator(".jogo-cartao").first().click();
    await espera(1500);
    await toque(p, /^Começar$/, 100);
    await p.evaluate(pilotoDoPulo);
    await espera(16000);
  }),
  personalizar: (b) => gravar(b, "personalizar", {}, async (p) => {
    await espera(4600);
    await p.locator(".cena__broto").click();
    await espera(2000);
    const abas = p.getByRole("tab");
    const n = await abas.count();
    for (let i = 0; i < Math.min(n, 4); i++) {
      await abas.nth(i).click(); await espera(900);
      const opcoes = p.locator(".personalizar__painel button:not([disabled])");
      const k = await opcoes.count();
      if (k > 2) { await opcoes.nth(2).click(); await espera(1100); }
      if (k > 1) { await opcoes.nth(1).click(); await espera(1100); }
    }
    await espera(1200);
  }),
  // Tema escuro + ajustes de conforto.
  escuro: (b) => gravar(b, "escuro", { tema: "escuro" }, async (p) => {
    await espera(5200);
    await toque(p, /^Ajustes$/, 2400);
    await p.locator("label.ajuste").first().click();
    await espera(1500);
    await toque(p, /^Início$/, 2400);
  }),
  // Mapa da história e capítulo 2 (o Cometa da Sorte).
  historia: (b) => gravar(b, "historia", {}, async (p) => {
    await espera(4600);
    await p.locator(".tabbar__historia").click();
    await espera(2400);
    await p.locator(".historia-cap").nth(1).click();
    await espera(4500);
    const cont = botao(p, /^Continuar$/);
    if (await cont.isVisible().catch(() => false)) await cont.click();
    await avancarDialogo(p, 6, 1800);
    await espera(1200);
  }),
};

const FOTOS = {
  ajuda: (b) => foto(b, "ajuda", {}, async (p) => {
    await espera(4600);
    await p.locator(".tabbar__historia").click();
    await espera(1200);
    await p.locator(".historia-ajuda").click();
    await espera(1500);
  }),
  "respiracao-fim": (b) => foto(b, "respiracao-fim", {}, async (p) => {
    await p.clock.install();
    await p.reload({ waitUntil: "networkidle" });
    await p.clock.runFor(5000);
    await p.locator(".deu-vontade").click();
    for (let i = 0; i < 50; i++) { await p.clock.runFor(1000); }
    await espera(1500);
  }),
  libras: (b) => foto(b, "libras", {}, async (p) => {
    await espera(4600);
    await p.getByRole("button", { name: /VLibras/ }).first().click();
    await espera(9000);
  }),
};

const pedidas = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chromium", args: ["--autoplay-policy=no-user-gesture-required"] });
for (const [nome, f] of Object.entries({ ...CENAS, ...FOTOS })) {
  if (pedidas.length && !pedidas.includes(nome)) continue;
  try { await f(browser); } catch (e) { console.log(`✗ ${nome}:`, e.message); }
}
await browser.close();
