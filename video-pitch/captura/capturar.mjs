// Captura as telas e os clipes do app para o vídeo de pitch.
// Uso: node captura/capturar.mjs   (APP_URL muda o endereço; FFMPEG muda o ffmpeg usado)
// Saída: public/telas/*.png (780x1688) e public/telas/*.mp4 (30 fps, H.264, sem áudio).
// Só dados sintéticos: o nome digitado na história é "Marcos".
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const URL_APP = process.env.APP_URL ?? "https://equipepeao-ci7r.vercel.app/";
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SAIDA = join(RAIZ, "public", "telas");
const QUADROS = process.env.QUADROS_DIR ?? join(tmpdir(), "captura-quadros");
const FFMPEG = process.env.FFMPEG ??
  "/mnt/c/Users/antonioa.carvalho/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe";
const FFMPEG_WINDOWS = FFMPEG.endsWith(".exe");
// O ffmpeg do Windows só entende caminhos do Windows.
const caminho = (p) => (FFMPEG_WINDOWS ? execFileSync("wslpath", ["-w", p]).toString().trim() : p);

mkdirSync(SAIDA, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const navegador = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const OPCOES_CONTEXTO = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
let contexto = await navegador.newContext(OPCOES_CONTEXTO);
let pagina = await contexto.newPage();

// O avatar do VLibras é Unity/WebGL: ele roda num segundo Chromium com WebGL pelo SwiftShader
// (no primeiro, sem essas flags, as animações e o jogo ficam mais fluidos).
const navegadorWebGL = await chromium.launch({
  args: [
    "--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl",
  ],
});

// O player do VLibras baixa ~20 MB do jsDelivr e desiste se demorar (a rede às vezes leva 40 s+).
// Baixamos uma vez para um cache local e servimos de lá, para o avatar carregar a tempo.
const VLIBRAS_UNITY = "https://cdn.jsdelivr.net/gh/spbgovbr-vlibras/vlibras-portal@v7.12.2/app/unity";
const CACHE_VLIBRAS = join(QUADROS, "..", "vlibras-cache");
mkdirSync(CACHE_VLIBRAS, { recursive: true });
await Promise.all(["playerweb.data.unityweb", "playerweb.wasm.code.unityweb", "playerweb.wasm.framework.unityweb"].map(async (n) => {
  const destino = join(CACHE_VLIBRAS, n);
  if (existsSync(destino)) return;
  const resp = await fetch(`${VLIBRAS_UNITY}/${n}?v=7.12.2`);
  writeFileSync(destino, Buffer.from(await resp.arrayBuffer()));
}));
const servirVLibrasDoCache = (ctx) => ctx.route(/playerweb\.(data|wasm\.code|wasm\.framework)\.unityweb/, (rota) => {
  const nome = rota.request().url().match(/(playerweb\.[a-z.]+\.unityweb)/)[1];
  rota.fulfill({
    status: 200, contentType: "application/vnd.unity", headers: { "access-control-allow-origin": "*" },
    body: readFileSync(join(CACHE_VLIBRAS, nome)),
  });
});

/** Foto da tela inteira, depois de as animações de entrada assentarem. */
async function foto(nome, ms = 1500) {
  await espera(ms);
  await pagina.screenshot({ path: join(SAIDA, `${nome}.png`) });
  console.log("foto", nome);
}

/**
 * Grava um clipe pelo screencast do Chrome (CDP) enquanto `acao` roda e monta um mp4
 * de 30 fps constantes: cada quadro dura até a chegada do próximo (ffconcat).
 */
async function clipe(nome, segundos, acao) {
  const pasta = join(QUADROS, nome);
  rmSync(pasta, { recursive: true, force: true });
  mkdirSync(pasta, { recursive: true });
  const cdp = await contexto.newCDPSession(pagina);
  const quadros = [];
  cdp.on("Page.screencastFrame", async ({ data, sessionId, metadata }) => {
    const arquivo = join(pasta, `q${String(quadros.length).padStart(5, "0")}.jpg`);
    writeFileSync(arquivo, Buffer.from(data, "base64"));
    quadros.push({ arquivo, t: metadata.timestamp });
    await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 90, maxWidth: 780, maxHeight: 1688 });
  const inicio = Date.now();
  await acao();
  const resto = segundos * 1000 + 300 - (Date.now() - inicio);
  if (resto > 0) await espera(resto);
  await cdp.send("Page.stopScreencast");
  await cdp.detach();
  if (quadros.length < 2) throw new Error(`clipe ${nome}: poucos quadros`);

  const linhas = ["ffconcat version 1.0"];
  quadros.forEach((q, i) => {
    const dur = i + 1 < quadros.length ? quadros[i + 1].t - q.t : 0.1;
    linhas.push(`file '${caminho(q.arquivo).replace(/\\/g, "/")}'`, `duration ${dur.toFixed(4)}`);
  });
  linhas.push(`file '${caminho(quadros.at(-1).arquivo).replace(/\\/g, "/")}'`);
  const lista = join(pasta, "lista.txt");
  writeFileSync(lista, linhas.join("\n"));
  execFileSync(FFMPEG, [
    "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", caminho(lista),
    "-vf", "fps=30,scale=780:1688:force_original_aspect_ratio=decrease:out_range=tv,pad=780:1688:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
    "-t", String(segundos), "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-color_range", "tv", "-movflags", "+faststart",
    caminho(join(SAIDA, `${nome}.mp4`)),
  ]);
  console.log("clipe", nome, quadros.length, "quadros");
}

const botao = (nome, exato = false) => pagina.getByRole("button", { name: nome, exact: exato });
const aba = (nome) => pagina.locator(".tabbar").getByRole("button", { name: nome });

// 1. Primeiro acesso: abertura (~8 s) e o modal de acessibilidade.
await pagina.goto(URL_APP, { waitUntil: "load", timeout: 60000 });
await botao(/Pronto, começar/).waitFor({ timeout: 40000 });
await foto("acessibilidade", 2000);
await botao(/Pronto, começar/).click();

// 2. História do Alien: aviso, pergunta da idade e o capítulo 1 ("A Queda").
await botao("Começar", true).click();
await botao("Sim", true).click();
for (let passo = 0; passo < 40; passo++) {
  await espera(1200);
  const opcoes = await pagina.locator(".historia-opcao:visible").allTextContents();
  if (opcoes.includes("Tô bem.")) await foto("historia-1", 4500);
  if (opcoes.includes("É, só uma.")) { await foto("historia-2", 4500); break; }
  const campo = pagina.locator(".historia-dialogo input[type=text]:visible, .historia-dialogo input:not([type]):visible").first();
  if (await campo.count()) { await campo.fill("Marcos"); await campo.press("Enter"); continue; }
  const proximo = pagina.locator(".historia-caixa__seguir:visible, .historia-opcao:visible, .queda__pular:visible").first();
  if (!(await proximo.count())) break;
  await proximo.click({ timeout: 5000 }).catch(() => {});
}

// Para o resto do roteiro, o capítulo 1 conta como concluído (libera o jogo dele) e o app recarrega.
await pagina.evaluate(() => {
  localStorage.setItem("rqr:historia", JSON.stringify({ concluidos: ["cap1"], avisoVisto: true, partes: {} }));
  localStorage.setItem("rqr:primeiro-acesso", "1");
});
await pagina.reload({ waitUntil: "load", timeout: 60000 });
await aba("Início").waitFor({ timeout: 40000 });
await espera(2000);

// 3. Início com duas missões feitas (o confete precisa acabar antes da foto).
for (const bloco of (await pagina.locator(".missao-bloco:not(.is-ok)").all()).slice(0, 2)) {
  await bloco.click();
  await espera(800);
}
await pagina.evaluate(() => window.scrollTo(0, 0));
await foto("inicio", 5000);

// 4. Deu vontade? (respiração) e Preciso de ajuda agora (aberto pela lista de capítulos da História).
await pagina.locator(".deu-vontade").click();
await foto("deu-vontade", 3000);
await pagina.locator(".respiro__fechar").click();
await espera(800);
await aba("História").click();
await pagina.locator(".historia-ajuda").click();
await foto("ajuda", 1500);
await botao("Voltar, sem pressa").click();
await espera(500);
await botao("Fechar a história").click();
await espera(800);

// 5. Personalizar o Broto.
await pagina.locator(".cena__broto").click();
await foto("personalizar", 2000);
await pagina.locator(".personalizar__pronto").click();
await espera(800);

// 6. Abas Missões, Jogos e Ajustes.
await aba("Missões").click();
await foto("missoes");
await aba("Jogos").click();
await foto("jogos");
await aba("Ajustes").click();
await foto("ajustes");

// 7. Alto contraste e tema escuro na tela inicial.
await pagina.getByRole("switch", { name: /Alto contraste/ }).check();
await aba("Início").click();
await pagina.evaluate(() => window.scrollTo(0, 0));
await foto("contraste", 2000);
await aba("Ajustes").click();
await pagina.getByRole("switch", { name: /Alto contraste/ }).uncheck();
await aba("Início").click();
await pagina.evaluate(() => {
  localStorage.setItem("rqr-tema", "escuro");
  document.documentElement.dataset.tema = "escuro";
});
await foto("escuro", 2000);
await pagina.evaluate(() => {
  localStorage.setItem("rqr-tema", "claro");
  document.documentElement.dataset.tema = "claro";
});

// 8. Pulo do Bichinho: começa a partida e um "piloto" mira a plataforma mais próxima.
//    O piloto lê o estado do jogo pela fibra do React (a ref `jogo`) e só aperta as setas virtuais.
await aba("Jogos").click();
await botao(/Pulo do Bichinho/).click();
await pagina.locator(".pulo .rqr-botao", { hasText: "Começar" }).click();
await pagina.evaluate(() => {
  const bicho = document.querySelector(".pulo__bicho");
  const chave = Object.keys(bicho).find((k) => k.startsWith("__reactFiber"));
  let fibra = bicho[chave], g = null;
  while (fibra && !g) {
    for (let h = fibra.memoizedState; h && !g; h = h.next) {
      const v = h.memoizedState?.current;
      if (v && Array.isArray(v.plats) && v.teclas) g = v;
    }
    fibra = fibra.return;
  }
  if (!g) return;
  const BICHO = 56, PLAT_W = 72;
  const pilotar = () => {
    const pes = g.y + BICHO;
    const candidatas = g.plats.filter((p) => !p.quebrou && p.tipo !== "nuvem" && (g.vy > 0 ? p.y >= pes - 4 : p.y < pes - 10));
    candidatas.sort((a, b) => Math.abs(a.y - pes) - Math.abs(b.y - pes));
    const alvo = candidatas[0];
    if (alvo) {
      const dx = alvo.x + (alvo.w ?? PLAT_W) / 2 - (g.x + BICHO / 2);
      g.teclas.e = dx < -8; g.teclas.d = dx > 8;
    }
    requestAnimationFrame(pilotar);
  };
  pilotar();
});
await espera(1500);
await clipe("pulo", 4, () => espera(4000));
await pagina.keyboard.press("Escape");
await espera(1000);

// 9. VLibras: abre a bolha, espera o avatar 3D, dispensa o tutorial e o aviso de dados
//    e toca no título da tela para ele sinalizar.
//    Abre no Chromium com WebGL, levando o mesmo localStorage (nome, missões, capítulo 1).
try {
  const estado = await contexto.storageState();
  await navegador.close();
  contexto = await navegadorWebGL.newContext({ ...OPCOES_CONTEXTO, storageState: estado });
  await servirVLibrasDoCache(contexto);
  pagina = await contexto.newPage();
  await pagina.goto(URL_APP, { waitUntil: "load", timeout: 60000 });
  await aba("Início").waitFor({ timeout: 40000 });
  await espera(2000);
  await botao("Traduzir para Libras com o VLibras").click();
  await pagina.getByText("Pular", { exact: true }).last().click({ timeout: 60000 }).catch(() => {});
  await pagina.getByText("Não aceitar", { exact: true }).click({ timeout: 15000 }).catch(() => {});
  await espera(1500);
  await pagina.locator(".topo__titulo").click();
  await clipe("vlibras", 4, async () => {
    await espera(600);
    await pagina.screenshot({ path: join(SAIDA, "vlibras.png") });
    console.log("foto vlibras");
  });
} catch (erro) {
  console.log("VLibras não capturado:", erro.message);
}

await navegadorWebGL.close();
