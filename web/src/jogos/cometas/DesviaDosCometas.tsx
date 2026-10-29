import { useCallback, useEffect, useRef, useState } from "react";
import { BotaoLibras } from "../../BotaoLibras";
import { Bichinho } from "../../Bichinho";
import { tocar } from "../../sons";
import { useAparenciaVisivel } from "../../personalizacao";
import { BotaoTema } from "../../BotaoTema";
import { useEsconderVLibras } from "../../vlibras";
import type { PropsJogo } from "../../historia/tipos";
import { DURACAO_PARTIDA_MS, quadroMs } from "../../partida";
import "./cometas.css";

/**
 * "Desvia dos Cometas" (capítulo 2, O Cometa da Sorte). Treino de recusa: deixar passar o brilho
 * que promete o dobro e pegar a semente simples, que cai sempre no mesmo lugar.
 *
 * O jogo mostra na prática o que o Broto diz depois dele (cap2.ts, `depoisDoJogo`):
 * - "O dourado brilha mais justo quando chega perto": o cometa cresce e brilha mais ao descer.
 * - "Quase ganhar é só um jeito bonito de perder": quando passa raspando, aparece um "quase" apagado, que não vale nada.
 * - "O cometa sempre ia embora mais brilhante": se encosta, ele puxa um pouco do brilho do Broto e sobe maior.
 *
 * Regras (skills design-etico-saude-digital e gamificacao-etica, narrativa-broto.md "Jogos"):
 * - Nada é sorteado. Sementes e cometas seguem um padrão fixo de faixas (ver SEMENTES e COMETAS).
 * - Sem vidas, sem derrota, sem placar de perda. Encostar no cometa só deixa o Broto sem brilho por 2 s;
 *   nenhuma semente pega se perde ("Nada que foi aceso apaga").
 * - Sem som de erro. Partida de até 3 minutos (partida.ts), com saída gentil.
 */

const BICHO = 56;
const FAIXAS = 5;
const VEL_MAX_X = 6.5;
/** Ordem fixa das faixas das sementes: quem joga aprende onde elas caem. */
const SEMENTES = [2, 0, 3, 1, 4];
/** Ordem fixa das faixas dos cometas. Nunca na faixa da semente que está caindo junto. */
const COMETAS = [4, 1, 3, 0, 2, 3, 0, 4, 1, 2];
const SEMENTE_A_CADA_MS = 1800;
const APAGADO_MS = 2000;
const QUASE_MS = 900;

type Semente = { x: number; y: number; pega: boolean };
type Cometa = { x: number; y: number; r: number; vy: number; levou: boolean; passou: boolean };
type Quase = { x: number; y: number; t: number };
type Estado = "inicio" | "jogando" | "tempo";

export function DesviaDosCometas({ aoFechar, aoTerminar, reduzir }: PropsJogo) {
  const aparencia = useAparenciaVisivel();
  const caixaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bichoRef = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("inicio");
  useEsconderVLibras(estado === "jogando");
  const [sementes, setSementes] = useState(0);
  const [passaram, setPassaram] = useState(0);
  const [apagado, setApagado] = useState(false);
  // Espelho de `apagado` para o laço não chamar setState a cada quadro.
  const apagadoRef = useRef(false);
  const [sensor, setSensor] = useState<"desconhecido" | "ok" | "sem">("desconhecido");
  const [aviso, setAviso] = useState("");

  // Estado do jogo fora do React (muda 60x por segundo).
  const jogo = useRef({
    w: 360, h: 640, x: 0, vx: 0, olhaDireita: true,
    sementes: [] as Semente[], cometas: [] as Cometa[], quases: [] as Quase[],
    pegas: 0, passaram: 0, tempo: 0, proxSemente: 0, proxCometa: 0, iSemente: 0, iCometa: 0,
    apagadoAte: 0, inclinacao: 0, teclas: { e: false, d: false }, toque: 0,
  });

  // Fechar ou sair sempre segue para a conversa com as sementes pegas: não existe derrota.
  const sair = () => aoTerminar({ folhas: jogo.current.pegas });
  const sairRef = useRef(sair);
  sairRef.current = sair;

  const iniciar = useCallback(() => {
    const g = jogo.current;
    const caixa = caixaRef.current!;
    g.w = caixa.clientWidth; g.h = caixa.clientHeight;
    g.x = g.w / 2 - BICHO / 2; g.vx = 0;
    g.sementes = []; g.cometas = []; g.quases = [];
    g.pegas = 0; g.passaram = 0; g.tempo = 0; g.proxSemente = 600; g.proxCometa = 2200;
    g.iSemente = 0; g.iCometa = 0; g.apagadoAte = 0;
    setSementes(0); setPassaram(0); setApagado(false); setAviso(""); setEstado("jogando");
  }, []);

  // Giroscópio: no iPhone precisa pedir permissão num toque; no Android só exige HTTPS (igual ao Pulo).
  const pedirSensor = useCallback(async () => {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined;
    if (!DOE || !window.isSecureContext) { setSensor("sem"); return; }
    try {
      if (typeof DOE.requestPermission === "function") {
        const r = await DOE.requestPermission();
        if (r !== "granted") setSensor("sem");
      }
      window.setTimeout(() => setSensor((s) => (s === "ok" ? s : "sem")), 1500);
    } catch { setSensor("sem"); }
  }, []);

  const comecar = async () => { await pedirSensor(); tocar("clique"); iniciar(); };

  useEffect(() => {
    const ori = (e: DeviceOrientationEvent) => {
      if (e.gamma == null) return;
      const angulo = screen.orientation?.angle ?? 0;
      const lado = angulo === 90 ? e.beta ?? 0 : angulo === 270 ? -(e.beta ?? 0) : e.gamma;
      jogo.current.inclinacao = Math.max(-1, Math.min(1, lado / 25));
      setSensor("ok");
    };
    const tecla = (e: KeyboardEvent, v: boolean) => {
      const t = jogo.current.teclas;
      if (["ArrowLeft", "a", "A"].includes(e.key)) t.e = v;
      if (["ArrowRight", "d", "D"].includes(e.key)) t.d = v;
      if (e.key === "Escape" && v) sairRef.current();
    };
    const desce = (e: KeyboardEvent) => tecla(e, true);
    const sobe = (e: KeyboardEvent) => tecla(e, false);
    window.addEventListener("deviceorientation", ori);
    window.addEventListener("keydown", desce);
    window.addEventListener("keyup", sobe);
    return () => {
      window.removeEventListener("deviceorientation", ori);
      window.removeEventListener("keydown", desce);
      window.removeEventListener("keyup", sobe);
    };
  }, []);

  // Laço principal.
  useEffect(() => {
    if (estado !== "jogando") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const css = getComputedStyle(document.documentElement);
    const cor = (n: string, padrao: string) => css.getPropertyValue(n).trim() || padrao;
    const C = {
      contorno: cor("--rqr-azul-escuro", "#1b1a4a"), semente: cor("--rqr-verde-agro", "#3a9b4a"),
      cometa: cor("--rqr-amarelo", "#f6c33b"), quase: "rgba(255,255,255,.55)",
    };
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const g = jogo.current;
    canvas.width = g.w * dpr; canvas.height = g.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const largura = g.w / FAIXAS;
    const centroFaixa = (f: number) => largura * f + largura / 2;
    const chaoY = g.h - BICHO - 24;
    let ultimo = performance.now();
    let id = 0;

    const desenharSemente = (s: Semente) => {
      ctx.save(); ctx.translate(s.x, s.y);
      ctx.fillStyle = C.semente; ctx.strokeStyle = C.contorno; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(0, 0, 8, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -11); ctx.quadraticCurveTo(7, -18, 11, -15); ctx.stroke();
      ctx.restore();
    };

    const desenharCometa = (c: Cometa) => {
      // Brilha mais quanto mais perto do Broto: é de propósito (fala do Broto depois do jogo).
      const perto = Math.max(0, Math.min(1, c.y / chaoY));
      const brilho = reduzir ? 0.35 : 0.2 + perto * 0.6;
      ctx.save();
      // Rastro para cima: o cometa sempre aparece vindo de longe.
      const rastro = ctx.createLinearGradient(c.x, c.y - c.r * 5, c.x, c.y);
      rastro.addColorStop(0, "rgba(246,195,59,0)"); rastro.addColorStop(1, `rgba(246,195,59,${brilho})`);
      ctx.fillStyle = rastro;
      ctx.beginPath(); ctx.moveTo(c.x - c.r * 0.8, c.y); ctx.lineTo(c.x, c.y - c.r * 5); ctx.lineTo(c.x + c.r * 0.8, c.y); ctx.fill();
      if (!reduzir) { ctx.shadowColor = C.cometa; ctx.shadowBlur = 8 + perto * 22; }
      ctx.fillStyle = C.cometa; ctx.strokeStyle = C.contorno; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.stroke();
      // A promessa escrita no cometa. Decorativa: o mesmo texto está nas dicas, em DOM.
      if (!c.levou) {
        ctx.fillStyle = C.contorno; ctx.font = `800 ${Math.round(c.r * 0.8)}px system-ui, sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("+2", c.x, c.y + 1);
      }
      ctx.restore();
    };

    const passo = (agora: number) => {
      const dt = Math.min(2, (agora - ultimo) / (1000 / 60));
      const ms = quadroMs(agora, ultimo);
      g.tempo += ms;
      ultimo = agora;
      // Fica um pouco mais rápido com o tempo, sempre no mesmo ritmo (sem surpresa).
      const nivel = Math.min(1, g.tempo / DURACAO_PARTIDA_MS);

      let alvo = g.inclinacao;
      if (g.teclas.e) alvo = -1;
      if (g.teclas.d) alvo = 1;
      if (g.toque) alvo = g.toque;
      g.vx += (alvo * VEL_MAX_X - g.vx) * 0.25 * dt;
      if (Math.abs(g.vx) > 0.3) g.olhaDireita = g.vx > 0;
      g.x = Math.max(0, Math.min(g.w - BICHO, g.x + g.vx * dt));

      // Sementes: faixa fixa, intervalo fixo.
      g.proxSemente -= ms;
      let faixaSemente = SEMENTES[g.iSemente % SEMENTES.length];
      if (g.proxSemente <= 0) {
        g.sementes.push({ x: centroFaixa(faixaSemente), y: -20, pega: false });
        g.iSemente++; g.proxSemente += SEMENTE_A_CADA_MS;
        faixaSemente = SEMENTES[g.iSemente % SEMENTES.length];
      }
      // Cometas: padrão fixo, intervalo encurta devagar (2,2 s → 1,1 s).
      g.proxCometa -= ms;
      if (g.proxCometa <= 0) {
        let faixa = COMETAS[g.iCometa % COMETAS.length];
        if (faixa === faixaSemente) faixa = (faixa + 2) % FAIXAS;
        g.cometas.push({ x: centroFaixa(faixa), y: -30, r: 10, vy: 2.4 + nivel * 1.8, levou: false, passou: false });
        g.iCometa++; g.proxCometa += 2200 - nivel * 1100;
      }

      const cx = g.x + BICHO / 2, cy = chaoY + BICHO / 2;
      const brilhando = g.tempo >= g.apagadoAte;
      // O brilho voltou: avisa o React uma vez só.
      if (brilhando && apagadoRef.current) { apagadoRef.current = false; setApagado(false); }

      for (const s of g.sementes) {
        s.y += 2.1 * dt;
        if (!s.pega && Math.hypot(s.x - cx, s.y - cy) < BICHO * 0.6) {
          s.pega = true; g.pegas++; setSementes(g.pegas); tocar("folha");
        }
      }

      for (const c of g.cometas) {
        if (c.levou) {
          // Leva o brilho embora e sobe maior do que chegou.
          c.y += c.vy * dt; c.r = Math.min(30, c.r + 0.25 * dt);
          continue;
        }
        c.y += c.vy * dt;
        c.r = 10 + Math.max(0, Math.min(1, c.y / chaoY)) * 10;
        const dist = Math.hypot(c.x - cx, c.y - cy);
        if (brilhando && dist < c.r + BICHO * 0.38) {
          c.levou = true; c.vy = -3.2;
          g.apagadoAte = g.tempo + APAGADO_MS;
          apagadoRef.current = true; setApagado(true);
          setAviso("O cometa puxou um pouco do brilho do Broto. Já volta. Nenhuma semente se perdeu.");
          continue;
        }
        if (!c.passou && c.y > cy + BICHO / 2) {
          c.passou = true; g.passaram++; setPassaram(g.passaram);
          // Passou raspando: um "quase" apagado, que some e não vale nada.
          if (Math.abs(c.x - cx) < c.r + BICHO) g.quases.push({ x: c.x, y: cy - BICHO * 0.4, t: QUASE_MS });
        }
      }

      g.sementes = g.sementes.filter((s) => !s.pega && s.y < g.h + 30);
      g.cometas = g.cometas.filter((c) => c.y < g.h + 40 && c.y > -120);
      for (const q of g.quases) { q.t -= ms; if (!reduzir) q.y -= 0.4 * dt; }
      g.quases = g.quases.filter((q) => q.t > 0);

      ctx.clearRect(0, 0, g.w, g.h);
      g.sementes.forEach(desenharSemente);
      g.cometas.forEach(desenharCometa);
      for (const q of g.quases) {
        ctx.globalAlpha = q.t / QUASE_MS;
        ctx.fillStyle = C.quase; ctx.font = "700 15px system-ui, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("quase", q.x, q.y);
        ctx.globalAlpha = 1;
      }

      const el = bichoRef.current;
      if (el) el.style.transform = `translate(${g.x}px, ${chaoY}px) scaleX(${g.olhaDireita ? 1 : -1})`;

      if (g.tempo >= DURACAO_PARTIDA_MS) {
        setAviso(`3 minutos de rolê! Você pegou ${g.pegas} sementes e deixou ${g.passaram} cometas passarem.`);
        setEstado("tempo");
        return;
      }
      id = requestAnimationFrame(passoSeguro);
    };
    const passoSeguro = (agora: number) => {
      try { passo(agora); } catch (erro) { console.error("[cometas] erro no laço do jogo:", erro); }
    };

    const visib = () => { if (!document.hidden) ultimo = performance.now(); };
    document.addEventListener("visibilitychange", visib);
    id = requestAnimationFrame(passoSeguro);
    return () => { cancelAnimationFrame(id); document.removeEventListener("visibilitychange", visib); };
  }, [estado, reduzir]);

  const tocarTela = (e: React.PointerEvent) => {
    if (estado !== "jogando") return;
    const r = e.currentTarget.getBoundingClientRect();
    jogo.current.toque = e.clientX - r.left < r.width / 2 ? -1 : 1;
  };
  const soltar = () => { jogo.current.toque = 0; };

  const nivel = Math.min(3, Math.floor(sementes / 4));

  return (
    <div className="pulo cometas" role="dialog" aria-modal="true" aria-labelledby="cometas-titulo">
      <div className="pulo__topo">
        <h2 id="cometas-titulo" className="pulo__titulo">Desvia dos Cometas</h2>
        <span className="pulo__placar">🌱 {sementes} sementes</span>
        <BotaoLibras />
        <BotaoTema compacto />
        <button className="crise__fechar pulo__fechar" onClick={sair} aria-label="Fechar jogo" data-vlibras-gloss="FECHAR JOGO">×</button>
      </div>

      <div ref={caixaRef} className="pulo__mundo cometas__mundo"
        onPointerDown={tocarTela} onPointerUp={soltar} onPointerCancel={soltar} onPointerLeave={soltar}>
        <canvas ref={canvasRef} className="pulo__canvas" aria-hidden="true" />
        <div ref={bichoRef} className={`pulo__bicho cometas__bicho ${apagado ? "is-apagado" : ""}`}
          style={{ width: BICHO, height: BICHO }} aria-hidden="true">
          <Bichinho humor={apagado ? "cansado" : "calmo"} nivel={nivel} tamanho={BICHO} reduzir aparencia={aparencia} />
        </div>

        {estado === "inicio" && (
          <div className="pulo__painel rqr-escalonado">
            <Bichinho humor="calmo" nivel={1} tamanho={100} reduzir={reduzir} aparencia={aparencia} />
            <p className="pulo__chamada">Deixe o brilho passar. Pegue a semente.</p>
            <ul className="pulo__dicas">
              <li><b>Celular:</b> incline para os lados</li>
              <li><b>Computador:</b> setas ← → ou A / D</li>
              <li><b>Ou:</b> segure o lado esquerdo ou direito da tela</li>
              <li>O cometa dourado promete "+2". Encostar nele puxa um pouco do brilho do Broto, que volta logo.</li>
              <li>A semente verde cai sempre no mesmo caminho. Cada uma faz o Broto crescer.</li>
              <li>Cada partida dura até 3 minutos. Nada que você pegou se perde.</li>
            </ul>
            <button className="rqr-botao" onClick={comecar}>Começar</button>
          </div>
        )}

        {estado === "tempo" && (
          <div className="pulo__painel rqr-pop">
            <Bichinho humor="feliz" nivel={nivel} tamanho={90} reduzir={reduzir} aparencia={aparencia} />
            <p className="pulo__chamada">Ufa. Desviar do brilho cansa.</p>
            <p className="pulo__resultado">🌱 {sementes} sementes · {passaram} cometas passaram</p>
            <p className="pulo__dicas">Que tal uma pausa agora? O Broto quer conversar.</p>
            <button className="rqr-botao" onClick={sair}>Conversar com o Broto</button>
            <button className="link" onClick={() => { tocar("clique"); iniciar(); }}>Jogar mais uma</button>
          </div>
        )}
      </div>

      {estado === "jogando" && (
        <p className="pulo__nota">
          {apagado
            ? "O cometa puxou um pouco do brilho. Já volta."
            : sensor === "ok" ? "Inclinação ativa." : "Use as setas ou toque nos lados da tela."}
        </p>
      )}
      <p className="sr-only" aria-live="polite">{aviso}</p>
    </div>
  );
}
