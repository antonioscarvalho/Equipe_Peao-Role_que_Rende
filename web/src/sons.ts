/**
 * Sons: efeitos sintetizados com Web Audio (sem arquivo, sem licença, offline) e as músicas
 * (arquivo próprio: a cantiga da Vó, o tema do app e a trilha de cada mini jogo) por `<audio>`.
 * Regras (spec 003 CA-3 e design-etico-saude-digital):
 * - Volume baixo, timbres suaves (seno/triângulo), nada de "jackpot", sirene ou som de cassino.
 * - Som de recompensa só em missões (esforço). Na respiração, apenas tons calmos de ritmo.
 * - Dois controles separados (efeitos e música), 0 a 10, sempre visíveis e guardados no aparelho.
 */

export type NomeSom =
  | "missao" | "moeda" | "folha" | "inspira" | "expira" | "clique" | "conquista" | "pulo"
  // Cenas do modo história (ver SOM_DA_CENA em Dialogo.tsx): um toque curto por cena, pra combinar
  // com a arte de fundo. "musica" tem a sua própria cantiga (tocarMusica), não entra aqui.
  | "queda" | "aproximar" | "lua" | "constelacao" | "nave" | "medir" | "amanhecer" | "familia"
  | "cratera" | "bairro" | "transicao" | "pergunta" | "pouso";

let ctx: AudioContext | null = null;

function contexto(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    // Se o contexto morreu (closed) por algum motivo, troca por um novo em vez de ficar mudo pra sempre.
    if (ctx && ctx.state === "closed") ctx = null;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume().catch((erro) => console.warn("[sons] AudioContext não liberou:", erro));
    return ctx;
  } catch (erro) {
    console.warn("[sons] AudioContext indisponível:", erro);
    return null;
  }
}

type Nota = {
  freq: number;
  freqFim?: number;
  inicio: number; // segundos a partir de agora
  dur: number;
  volume?: number;
  tipo?: OscillatorType;
  ataque?: number;
};

function tocarNotas(notas: Nota[], volumeGeral = 1) {
  const ac = contexto();
  if (!ac) return;
  const agora = ac.currentTime + 0.01;
  for (const n of notas) {
    const osc = ac.createOscillator();
    const ganho = ac.createGain();
    const t0 = agora + n.inicio;
    const t1 = t0 + n.dur;
    const pico = (n.volume ?? 0.1) * volumeGeral;
    const ataque = n.ataque ?? 0.01;
    osc.type = n.tipo ?? "sine";
    osc.frequency.setValueAtTime(n.freq, t0);
    if (n.freqFim) osc.frequency.exponentialRampToValueAtTime(n.freqFim, t1);
    ganho.gain.setValueAtTime(0.0001, t0);
    ganho.gain.exponentialRampToValueAtTime(pico, t0 + ataque);
    ganho.gain.exponentialRampToValueAtTime(0.0001, t1);
    osc.connect(ganho).connect(ac.destination);
    osc.start(t0);
    osc.stop(t1 + 0.05);
  }
}

const receitas: Record<NomeSom, Nota[]> = {
  // Acorde maior suave subindo (Dó-Mi-Sol): "você fez", sem fanfarra.
  missao: [
    { freq: 523.25, inicio: 0, dur: 0.35, volume: 0.08, tipo: "triangle" },
    { freq: 659.25, inicio: 0.08, dur: 0.35, volume: 0.07, tipo: "triangle" },
    { freq: 783.99, inicio: 0.16, dur: 0.5, volume: 0.06, tipo: "triangle" },
  ],
  // Duas notas curtas e limpas, uma moeda só (nada de chuva de moedas).
  moeda: [
    { freq: 987.77, inicio: 0, dur: 0.09, volume: 0.06 },
    { freq: 1318.51, inicio: 0.07, dur: 0.22, volume: 0.05 },
  ],
  // "Plim" orgânico subindo de leve: folha brotando.
  folha: [{ freq: 440, freqFim: 880, inicio: 0, dur: 0.28, volume: 0.06, ataque: 0.04 }],
  // Respiração: tom grave e longo que sobe (inspira) ou desce (expira).
  inspira: [{ freq: 196, freqFim: 261.63, inicio: 0, dur: 3.8, volume: 0.05, ataque: 1.2 }],
  expira: [{ freq: 261.63, freqFim: 174.61, inicio: 0, dur: 5.8, volume: 0.05, ataque: 0.8 }],
  // Conquista do dia: arpejo subindo (Sol-Dó-Mi-Sol-Dó') e acorde aberto com brilho suave.
  // Celebra esforço concluído; sem moedas, sem sirene, sem "jackpot".
  conquista: [
    { freq: 392.0, inicio: 0, dur: 0.22, volume: 0.07, tipo: "triangle" },
    { freq: 523.25, inicio: 0.12, dur: 0.22, volume: 0.07, tipo: "triangle" },
    { freq: 659.25, inicio: 0.24, dur: 0.22, volume: 0.07, tipo: "triangle" },
    { freq: 783.99, inicio: 0.36, dur: 0.3, volume: 0.07, tipo: "triangle" },
    { freq: 1046.5, inicio: 0.5, dur: 1.4, volume: 0.06, tipo: "triangle", ataque: 0.02 },
    { freq: 523.25, inicio: 0.5, dur: 1.6, volume: 0.04, ataque: 0.05 },
    { freq: 659.25, inicio: 0.5, dur: 1.6, volume: 0.035, ataque: 0.05 },
    { freq: 783.99, inicio: 0.5, dur: 1.6, volume: 0.035, ataque: 0.05 },
    { freq: 2093.0, inicio: 0.62, dur: 0.6, volume: 0.015, ataque: 0.1 },
    { freq: 2637.02, inicio: 0.8, dur: 0.6, volume: 0.012, ataque: 0.1 },
  ],
  // Pulo do mini jogo: "boing" curto e baixinho (toca muito, então bem discreto).
  pulo: [{ freq: 330, freqFim: 520, inicio: 0, dur: 0.14, volume: 0.09, ataque: 0.008 }],
  clique: [{ freq: 660, inicio: 0, dur: 0.05, volume: 0.04, tipo: "triangle" }],

  // Queda da nave: descida rápida, impacto grave e um breve brilho de alerta no pouso.
  queda: [
    { freq: 760, freqFim: 95, inicio: 0, dur: 1.65, volume: 0.13, tipo: "sawtooth", ataque: 0.08 },
    { freq: 1500, freqFim: 520, inicio: 0.1, dur: 1.55, volume: 0.07, tipo: "triangle", ataque: 0.04 },
  ],
  // O impacto é disparado junto ao fim da queda visual (Queda.tsx: 1700 ms).
  pouso: [
    { freq: 115, freqFim: 48, inicio: 0, dur: 0.62, volume: 0.2, tipo: "triangle", ataque: 0.012 },
    { freq: 220, freqFim: 72, inicio: 0, dur: 0.48, volume: 0.12, tipo: "sawtooth", ataque: 0.008 },
    { freq: 880, freqFim: 660, inicio: 0.08, dur: 0.52, volume: 0.08, tipo: "triangle", ataque: 0.012 },
    { freq: 1320, freqFim: 990, inicio: 0.2, dur: 0.38, volume: 0.045, tipo: "sine", ataque: 0.02 },
  ],
  // Aproximação da Vila Estrela: dois glissandos subindo de leve, como a câmera se aproximando.
  aproximar: [
    { freq: 300, freqFim: 700, inicio: 0, dur: 1.1, volume: 0.045, ataque: 0.3 },
    { freq: 600, freqFim: 1400, inicio: 0.15, dur: 1.0, volume: 0.03, ataque: 0.35 },
  ],
  // Luas: duas notas serenas, descendo de leve — luz de lua, não alarme.
  lua: [
    { freq: 523.25, inicio: 0, dur: 0.6, volume: 0.05 },
    { freq: 392.0, inicio: 0.25, dur: 0.9, volume: 0.045 },
  ],
  // Constelação: 4 toques curtos conectando as estrelas, sem crescer de volume (não é prêmio).
  constelacao: [
    { freq: 1046.5, inicio: 0, dur: 0.12, volume: 0.035 },
    { freq: 1318.51, inicio: 0.1, dur: 0.12, volume: 0.035 },
    { freq: 1567.98, inicio: 0.2, dur: 0.12, volume: 0.035 },
    { freq: 2093.0, inicio: 0.3, dur: 0.3, volume: 0.03 },
  ],
  // Nave sem combustível: intervalo breve e fosco (quarta descendente), sem soar triste, só quieto.
  nave: [
    { freq: 440, inicio: 0, dur: 0.3, volume: 0.04, tipo: "triangle" },
    { freq: 349.23, inicio: 0.18, dur: 0.5, volume: 0.035, tipo: "triangle" },
  ],
  // Régua: três tiques subindo rápido, como contar degraus.
  medir: [
    { freq: 392.0, inicio: 0, dur: 0.1, volume: 0.04, tipo: "triangle" },
    { freq: 523.25, inicio: 0.09, dur: 0.1, volume: 0.04, tipo: "triangle" },
    { freq: 659.25, inicio: 0.18, dur: 0.18, volume: 0.045, tipo: "triangle" },
  ],
  // Amanhecer da lição: acorde maior quente, mais curto que "conquista" (não é recompensa, é esperança).
  amanhecer: [
    { freq: 523.25, inicio: 0, dur: 1.0, volume: 0.045, ataque: 0.15 },
    { freq: 659.25, inicio: 0.1, dur: 1.0, volume: 0.04, ataque: 0.18 },
    { freq: 783.99, inicio: 0.2, dur: 1.1, volume: 0.035, ataque: 0.2 },
  ],
  // Janelas da família acendendo, uma a uma: três notas quentes e escalonadas.
  familia: [
    { freq: 659.25, inicio: 0, dur: 0.35, volume: 0.04, tipo: "triangle" },
    { freq: 783.99, inicio: 0.22, dur: 0.35, volume: 0.038, tipo: "triangle" },
    { freq: 987.77, inicio: 0.44, dur: 0.5, volume: 0.035, tipo: "triangle" },
  ],
  // Cratera: um sopro oco e curto, como a fumaça se dissipando depois do pouso.
  cratera: [
    { freq: 420, freqFim: 170, inicio: 0, dur: 0.48, volume: 0.045, tipo: "triangle", ataque: 0.08 },
    { freq: 820, freqFim: 360, inicio: 0.04, dur: 0.36, volume: 0.018, tipo: "sine", ataque: 0.06 },
  ],
  // Bairro: notas quentes e discretas, marcando a chegada à praça da Vila.
  bairro: [
    { freq: 392, inicio: 0, dur: 0.32, volume: 0.035, tipo: "triangle" },
    { freq: 523.25, inicio: 0.12, dur: 0.38, volume: 0.032, tipo: "triangle" },
    { freq: 659.25, inicio: 0.24, dur: 0.48, volume: 0.028, tipo: "sine" },
  ],
  // Transições de capítulo e de atividade: sopro ascendente, sem cara de recompensa.
  transicao: [
    { freq: 280, freqFim: 440, inicio: 0, dur: 0.24, volume: 0.035, tipo: "sine", ataque: 0.04 },
    { freq: 440, freqFim: 660, inicio: 0.12, dur: 0.3, volume: 0.03, tipo: "triangle", ataque: 0.04 },
  ],
  // Marcador de pergunta: dois toques macios para sinalizar a nova etapa da conversa.
  pergunta: [
    { freq: 587.33, inicio: 0, dur: 0.16, volume: 0.035, tipo: "sine" },
    { freq: 783.99, inicio: 0.14, dur: 0.24, volume: 0.03, tipo: "triangle" },
  ],
};

const CHAVE_VOL_EFEITOS = "rqr:volume-efeitos";
const CHAVE_VOL_MUSICA = "rqr:volume-musica";

function lerVolumeGravado(chave: string, padrao: number): number {
  if (typeof window === "undefined") return padrao;
  try {
    const v = Number(localStorage.getItem(chave));
    return Number.isFinite(v) && v >= 0 && v <= 10 ? v : padrao;
  } catch {
    return padrao;
  }
}

function gravarVolume(chave: string, v: number) {
  try {
    localStorage.setItem(chave, String(v));
  } catch {
    /* modo privado: vale só nesta sessão */
  }
}

// Escala 0 a 10 (como a régua de vontade), não um booleano: 0 é mudo, sem precisar de outro estado.
let volumeEfeitos = lerVolumeGravado(CHAVE_VOL_EFEITOS, 4);
let volumeMusica = lerVolumeGravado(CHAVE_VOL_MUSICA, 4);

export function volumesIniciais() {
  return { efeitos: volumeEfeitos, musica: volumeMusica };
}

export function definirVolumeEfeitos(v: number) {
  volumeEfeitos = v;
  gravarVolume(CHAVE_VOL_EFEITOS, v);
  if (v > 0) contexto(); // o navegador só libera áudio depois de um gesto; mexer na régua é esse gesto.
}

export function definirVolumeMusica(v: number) {
  const eraMudo = volumeMusica <= 0;
  volumeMusica = v;
  gravarVolume(CHAVE_VOL_MUSICA, v);
  aplicarVolumeNaTrilhaAoVivo();
  if (!trilhaAudio) return;
  if (v <= 0) trilhaAudio.pause();
  else if (eraMudo && trilhaAudio.paused && !document.hidden) void trilhaAudio.play().catch(() => {});
}

/**
 * Som de missão que cresce com o progresso (1ª, 2ª... até a última).
 * Cada passo sobe na escala e ganha uma nota a mais; a última fecha com acorde completo
 * resolvendo na oitava. Cresce em altura e riqueza, não em volume nem duração: sem fanfarra.
 */
export function tocarMissao(feitas: number, total: number) {
  if (volumeEfeitos <= 0) { console.debug("[sons] mudo: régua de Efeitos em 0 (Ajustes)"); return; }
  // Dó maior: Dó Ré Mi Sol Lá Dó' Mi' Sol'
  const escala = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1318.51, 1567.98];
  const ultima = feitas >= total;
  const passo = Math.min(feitas - 1, escala.length - 4);
  const qtd = ultima ? 4 : Math.min(2 + passo, 4); // 2, 3, 4 notas...
  const notas: Nota[] = Array.from({ length: qtd }, (_, i) => ({
    freq: escala[Math.min(passo + i, escala.length - 1)],
    inicio: i * 0.09,
    dur: 0.3 + i * 0.05,
    volume: 0.07,
    tipo: "triangle",
  }));
  if (ultima) {
    // Acorde de chegada: Dó-Mi-Sol-Dó' juntos, suave e um pouco mais longo.
    const t = qtd * 0.09 + 0.05;
    for (const f of [523.25, 659.25, 783.99, 1046.5]) {
      notas.push({ freq: f, inicio: t, dur: 0.9, volume: 0.045, tipo: "sine", ataque: 0.03 });
    }
  }
  tocarNotas(notas, volumeEfeitos / 10);
}

export function tocar(nome: NomeSom) {
  if (volumeEfeitos <= 0) { console.debug(`[sons] mudo: régua de Efeitos em 0, "${nome}" não tocou`); return; }
  tocarNotas(receitas[nome], volumeEfeitos / 10);
}

/** Vocalizações breves e suaves do Broto, chamadas durante o texto progressivo. */
let ultimaVocalizacao = 0;
export function vocalizarBroto() {
  if (volumeEfeitos <= 0) return;
  const agoraMs = typeof performance === "undefined" ? Date.now() : performance.now();
  if (agoraMs - ultimaVocalizacao < 150) return;
  ultimaVocalizacao = agoraMs;
  const base = 260 + Math.random() * 90;
  tocarNotas([
    { freq: base, freqFim: base * (0.82 + Math.random() * 0.28), inicio: 0, dur: 0.11 + Math.random() * 0.06, volume: 0.045, tipo: "triangle", ataque: 0.025 },
    { freq: base * 1.42, freqFim: base * 1.1, inicio: 0.035, dur: 0.1, volume: 0.018, ataque: 0.025 },
  ], volumeEfeitos / 10);
}

/** Tique de digitação deliberadamente discreto, sintetizado e espaçado para não competir com a fala. */
let ultimoTique = 0;
export function tocarTecla() {
  if (volumeEfeitos <= 0) return;
  const agoraMs = typeof performance === "undefined" ? Date.now() : performance.now();
  if (agoraMs - ultimoTique < 55) return;
  ultimoTique = agoraMs;
  const freq = 1500 + Math.random() * 450;
  tocarNotas([{ freq, freqFim: freq * 0.72, inicio: 0, dur: 0.018, volume: 0.009, tipo: "triangle", ataque: 0.002 }], volumeEfeitos / 10);
}

let motorOsc: OscillatorNode | null = null;
let motorGanho: GainNode | null = null;

/**
 * "Motor" contínuo (ex.: Rolê de Carrinho): um zumbido grave e suave que sobe de tom e volume
 * com a velocidade, pra dar sensação de aceleração sem virar barulho de motor de verdade.
 * `iniciarMotor` liga uma vez (início da partida); `atualizarMotor(0 a 1)` chama a cada quadro
 * do jogo; `pararMotor` desliga (fim da partida / desmontar).
 */
export function iniciarMotor() {
  if (volumeEfeitos <= 0 || motorOsc) return;
  const ac = contexto();
  if (!ac) return;
  const osc = ac.createOscillator();
  const ganho = ac.createGain();
  osc.type = "triangle";
  osc.frequency.value = 55;
  ganho.gain.value = 0.0001;
  osc.connect(ganho).connect(ac.destination);
  osc.start();
  motorOsc = osc;
  motorGanho = ganho;
}

export function atualizarMotor(velocidade: number) {
  if (!motorOsc || !motorGanho) return;
  const ac = contexto();
  if (!ac) return;
  const v = Math.max(0, Math.min(1, velocidade));
  const freq = 55 + v * 150; // parado ≈ 55Hz, no máximo ≈ 205Hz — grave, nunca agudo/irritante
  const alvoVol = v < 0.02 ? 0.0001 : (0.012 + v * 0.05) * (volumeEfeitos / 10);
  const t = ac.currentTime;
  motorOsc.frequency.setTargetAtTime(freq, t, 0.09);
  motorGanho.gain.setTargetAtTime(alvoVol, t, 0.12);
}

export function pararMotor() {
  if (motorOsc) {
    try { motorOsc.stop(); } catch { /* já parado */ }
    motorOsc.disconnect();
  }
  motorGanho?.disconnect();
  motorOsc = null;
  motorGanho = null;
}

let musicaAtual: HTMLAudioElement | null = null;
let trilhaAudio: HTMLAudioElement | null = null;
let trilhaUrlAtual: string | null = null;
// Contador, não booleano: duas coisas podem pedir "mais baixo" ao mesmo tempo (ex.: a cantiga
// toca durante uma tela de crise); só volta ao normal quando a última delas devolver.
let pedidosDeAbaixar = 0;

function volumeAlvoTrilha(): number {
  return (volumeMusica / 10) * (pedidosDeAbaixar > 0 ? 0.3 : 1);
}

function aplicarVolumeNaTrilhaAoVivo() {
  if (trilhaAudio) trilhaAudio.volume = volumeAlvoTrilha();
}

// Uma "geração" por elemento: se outra animação assumir o mesmo <audio> (raro, só numa troca bem
// rápida), a antiga para de escrever o volume sem precisar cancelar nada mais.
const geracaoAnimacao = new WeakMap<HTMLAudioElement, number>();

function animarVolume(audio: HTMLAudioElement, ateVolume: number, duracaoMs: number, aoAcabar?: () => void) {
  const minhaGeracao = (geracaoAnimacao.get(audio) ?? 0) + 1;
  geracaoAnimacao.set(audio, minhaGeracao);
  const inicio = audio.volume;
  const t0 = performance.now();
  const passo = () => {
    if (geracaoAnimacao.get(audio) !== minhaGeracao) return;
    const x = Math.min(1, (performance.now() - t0) / duracaoMs);
    audio.volume = inicio + (ateVolume - inicio) * x;
    if (x < 1) requestAnimationFrame(passo);
    else aoAcabar?.();
  };
  requestAnimationFrame(passo);
}

export type InfoTrilha = { titulo: string; artista: string };
const EVENTO_TRILHA_INFO = "rqr:trilha-info";
let infoTrilhaAtual: InfoTrilha | null = null;

export function trilhaAtualInfo() {
  return infoTrilhaAtual;
}

/** HUD "tocando agora" (estilo Forza Horizon / Cozy Plants): chama de volta a cada troca de trilha. */
export function ouvirTrilhaInfo(cb: (info: InfoTrilha) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const ouvinte = (e: Event) => cb((e as CustomEvent<InfoTrilha>).detail);
  window.addEventListener(EVENTO_TRILHA_INFO, ouvinte);
  return () => window.removeEventListener(EVENTO_TRILHA_INFO, ouvinte);
}

/**
 * Abaixa (não para) a trilha de fundo enquanto algo mais sensível precisa de silêncio relativo
 * — painel de crise, respiração. Chame de novo com `false` pra devolver; cada `true` precisa
 * do seu `false` correspondente (ex.: no `return` de limpeza de um `useEffect`).
 */
export function abaixarTrilha(ligar: boolean) {
  pedidosDeAbaixar = Math.max(0, pedidosDeAbaixar + (ligar ? 1 : -1));
  if (trilhaAudio) animarVolume(trilhaAudio, volumeAlvoTrilha(), 300);
}

/**
 * Toca um arquivo de áudio curto (composição própria, ex.: a cantiga da Vó no capítulo 1).
 * Abaixa a trilha de fundo enquanto dura (sem parar: só mais baixinho) e devolve o volume
 * dela ao terminar. Nunca em loop; para a anterior antes de tocar a próxima.
 */
export function tocarMusica(url: string, volume = 1) {
  if (typeof window === "undefined") return;
  if (volumeMusica <= 0) { console.debug(`[sons] mudo: régua de Música em 0, "${url}" não tocou`); return; }
  musicaAtual?.pause();
  const audio = new Audio(url);
  audio.volume = (volumeMusica / 10) * volume;
  audio.loop = false;
  musicaAtual = audio;
  abaixarTrilha(true);
  let devolvida = false;
  const devolverTrilha = () => { if (!devolvida) { devolvida = true; abaixarTrilha(false); } };
  audio.addEventListener("ended", devolverTrilha, { once: true });
  void audio.play().catch((erro) => { console.warn(`[sons] não tocou ${url}:`, erro); devolverTrilha(); });
}

/**
 * Trilha de fundo em loop (tema do app, de cada mini jogo etc.). Troca com transição suave
 * (a antiga desce, a nova sobe, ~0,6–0,9s) em vez de cortar — chame de novo com outra URL ao
 * entrar/sair de um jogo. Pausa quando a aba perde foco e quando o volume vai a zero; tenta
 * retomar no primeiro toque se o navegador bloqueou o autoplay. `info` alimenta o HUD "tocando
 * agora" (`ouvirTrilhaInfo`); omita pra trocar de trilha sem notificar (ex.: já está tocando).
 */
export function tocarTrilha(url: string, info?: InfoTrilha) {
  console.debug(`[sons] tocarTrilha("${url}")`, { volumeMusica, trilhaUrlAtual });
  if (typeof window === "undefined") return;
  if (trilhaUrlAtual === url && trilhaAudio) {
    if (volumeMusica > 0 && trilhaAudio.paused && !document.hidden) void trilhaAudio.play().catch(() => {});
    return;
  }
  const antiga = trilhaAudio;
  const nova = new Audio(url);
  nova.loop = true;
  nova.volume = 0;
  trilhaUrlAtual = url;
  trilhaAudio = nova;
  if (volumeMusica > 0) {
    void nova.play()
      .then(() => console.debug(`[sons] trilha "${url}" tocando`))
      .catch((erro) => console.warn(`[sons] trilha não tocou ${url}:`, erro));
  } else console.debug(`[sons] trilha "${url}" carregada, mas muda (régua de Música em 0)`);
  animarVolume(nova, volumeAlvoTrilha(), 450);
  if (antiga) animarVolume(antiga, 0, 300, () => antiga.pause());
  if (info) {
    infoTrilhaAtual = info;
    window.dispatchEvent(new CustomEvent<InfoTrilha>(EVENTO_TRILHA_INFO, { detail: info }));
  }
}

export function pararTrilha() {
  trilhaAudio?.pause();
  trilhaAudio = null;
  trilhaUrlAtual = null;
}

/** Catálogo das músicas do app (tema, cada mini jogo, cantiga e respiração). */
export const URLS_TRILHAS = [
  "/sons/trilha-alegre.opus",
  "/sons/trilha-leve.opus",
  "/sons/trilha-pulo.opus",
  "/sons/trilha-carrinho.opus",
  "/sons/respirar-calma.opus",
] as const;

const precarregados = new Set<string>();

/**
 * Baixa com antecedência apenas as faixas que devem ser usadas em seguida. O áudio fica no
 * pipeline nativo do navegador via `<audio>`; não criamos buffers PCM grandes em JavaScript.
 * A lista é obrigatória para evitar baixar todas as trilhas sem necessidade em dispositivos móveis.
 */
export function precarregarTrilhas(urls: readonly string[]) {
  if (typeof window === "undefined") return;
  for (const url of urls) {
    if (precarregados.has(url)) continue;
    precarregados.add(url);
    const audio = new Audio();
    audio.preload = "auto";
    audio.muted = true; // nunca deve ser ouvido — é só pra encher o cache do navegador
    audio.src = url;
    audio.load();
  }
}

if (typeof document !== "undefined") {
  // Minimizou, trocou de aba, bloqueou a tela: a trilha para. Volta ao focar de novo.
  document.addEventListener("visibilitychange", () => {
    if (!trilhaAudio) return;
    if (document.hidden) trilhaAudio.pause();
    else if (volumeMusica > 0) void trilhaAudio.play().catch(() => {});
  });
  // Autoplay sem gesto nenhum (ex.: trilha ligada automaticamente ao abrir o app) é bloqueado
  // pelo navegador — é esperado ver o aviso "NotAllowedError" no console nesse momento, não é
  // erro de verdade. O primeiro toque em qualquer lugar da página libera e a trilha retoma;
  // "touchend" entra também porque o Safari do iPhone só libera áudio nesse evento, não no
  // "touchstart"/"pointerdown".
  const tentarDesbloquear = () => {
    if (trilhaAudio?.paused && volumeMusica > 0 && !document.hidden) void trilhaAudio.play().catch(() => {});
  };
  document.addEventListener("pointerdown", tentarDesbloquear, { passive: true });
  document.addEventListener("touchend", tentarDesbloquear, { passive: true });
  document.addEventListener("keydown", tentarDesbloquear);
}
