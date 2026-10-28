/**
 * Sons sintetizados com Web Audio API: sem arquivos, sem licença de terceiros, funciona offline.
 * Regras (spec 003 CA-3 e design-etico-saude-digital):
 * - Desligados por padrão; só tocam depois que a pessoa liga o interruptor "Sons".
 * - Volume baixo, timbres suaves (seno/triângulo), nada de "jackpot", sirene ou som de cassino.
 * - Som de recompensa só em missões (esforço). Na respiração, apenas tons calmos de ritmo.
 */

export type NomeSom = "missao" | "moeda" | "folha" | "inspira" | "expira" | "clique" | "conquista" | "pulo";

let ctx: AudioContext | null = null;

function contexto(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
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
  pulo: [{ freq: 330, freqFim: 520, inicio: 0, dur: 0.12, volume: 0.035, ataque: 0.01 }],
  clique: [{ freq: 660, inicio: 0, dur: 0.05, volume: 0.04, tipo: "triangle" }],
};

let ligado = false;

export function ligarSons(valor: boolean) {
  ligado = valor;
  // O navegador só libera áudio após um gesto; ligar o interruptor é esse gesto.
  if (valor) contexto();
}

/**
 * Som de missão que cresce com o progresso (1ª, 2ª... até a última).
 * Cada passo sobe na escala e ganha uma nota a mais; a última fecha com acorde completo
 * resolvendo na oitava. Cresce em altura e riqueza, não em volume nem duração: sem fanfarra.
 */
export function tocarMissao(feitas: number, total: number) {
  if (!ligado) return;
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
  tocarNotas(notas);
}

export function tocar(nome: NomeSom) {
  if (!ligado) return;
  tocarNotas(receitas[nome]);
}
