import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bichinho } from "../Bichinho";
import { tocar } from "../sons";
import { CORES_ROUPA, corDe } from "../personalizacao/aparencia";
import { useAparenciaVisivel } from "../personalizacao";
import { BotaoTema } from "../BotaoTema";
import { useEsconderVLibras } from "../vlibras";
import { DURACAO_PARTIDA_MS, FOLHA_ALTA_A_CADA, FOLHA_A_CADA_PX, quadroMs } from "../partida";
import "./carrinho.css";

/**
 * "Rolê de Carrinho": mini jogo de dirigir nos morros (estilo Hill Drive do Pou).
 * Controles: segurar os pedais da tela, setas ← → / A D, ou espaço para acelerar.
 * No ar, acelerar inclina o carrinho para trás e frear inclina para frente.
 * Regras do tema: ninguém se machuca. Se o carrinho virar, cai na grama macia e tenta de novo.
 * Coleta folhas (hábitos), não moedas, em lugares previsíveis. Sem combustível, vidas, compra nem "última chance".
 * A partida dura no máximo 3 minutos (ver partida.ts).
 */

type Estado = "inicio" | "jogando" | "virou" | "tempo";
type Folha = { x: number; y: number; pega: boolean };

const BICHO = 50;
const RODA = 11;
/** Distância do ponto de contato com o chão até o topo da carroceria. */
const ALTURA_CARRO = 34;
/** Gravidade baixa (como no Pou): o carrinho decola fácil e é preciso equilibrar. */
const GRAVIDADE = 0.22;
/** Quanto o pedal gira o carrinho no chão (empina/abaixa o bico) e no ar. */
const TORQUE_CHAO = 0.004;
const TORQUE_AR = 0.006;
/** Força que traz o carrinho de volta às quatro rodas enquanto não passou do ponto de tombar. */
const ENDIREITAR = 0.012;
const VEL_MAX = 12;
const VEL_RE = -3;
const CHAVE_RECORDE = "rqr-carrinho-recorde";
const PX_POR_METRO = 25;

/** Morros: soma de senos, ficando mais altos com a distância. Começo plano para dar partida. */
function terreno(x: number, base: number) {
  const d = Math.max(0, x - 300);
  const forca = Math.min(1, d / 3000);
  const amp = 40 + forca * 80;
  return base
    - Math.sin(d / 260) * amp * Math.min(1, d / 400)
    - Math.sin(d / 97 + 1.3) * amp * 0.35 * forca
    - Math.sin(d / 610 + 0.4) * amp * 0.8 * Math.min(1, d / 800);
}

const inclinacaoEm = (x: number, base: number) => Math.atan2(terreno(x + 4, base) - terreno(x - 4, base), 8);

/** Ângulo no intervalo -π..π. */
const normalizar = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export function RoleDeCarrinho({ aoFechar, reduzir }: { aoFechar: () => void; reduzir: boolean }) {
  const aparencia = useAparenciaVisivel();
  const corCarro = corDe(CORES_ROUPA, aparencia.corRoupa);
  const caixaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bichoRef = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("inicio");
  useEsconderVLibras(estado === "jogando");
  const [metros, setMetros] = useState(0);
  const [folhas, setFolhas] = useState(0);
  const [recorde, setRecorde] = useState(() => Number(localStorage.getItem(CHAVE_RECORDE) ?? 0));
  const [aviso, setAviso] = useState("");

  // Estado do jogo fora do React (muda 60x por segundo).
  const jogo = useRef({
    w: 360, h: 600, base: 400, x: 0, y: 0, vel: 0, vx: 0, vy: 0, ang: 0, rel: 0, angVel: 0, noChao: true,
    camY: 0, giroRoda: 0, folhas: [] as Folha[], proxFolha: 600, folhasCriadas: 0, folhasPegas: 0, maisLonge: 0, tempo: 0,
    gas: false, freio: false, teclas: { gas: false, freio: false },
  });

  const iniciar = useCallback(() => {
    const g = jogo.current;
    const caixa = caixaRef.current!;
    g.w = caixa.clientWidth; g.h = caixa.clientHeight; g.base = g.h * 0.62;
    g.x = 120; g.y = terreno(g.x, g.base); g.vel = 0; g.vx = 0; g.vy = 0;
    g.ang = 0; g.rel = 0; g.angVel = 0; g.noChao = true; g.camY = g.y - g.h * 0.62;
    g.folhas = []; g.proxFolha = 500; g.folhasCriadas = 0; g.folhasPegas = 0; g.maisLonge = 0; g.tempo = 0;
    setMetros(0); setFolhas(0); setAviso(""); setEstado("jogando");
  }, []);

  useEffect(() => {
    const tecla = (e: KeyboardEvent, v: boolean) => {
      const t = jogo.current.teclas;
      if (["ArrowRight", "d", "D", " ", "ArrowUp", "w", "W"].includes(e.key)) { t.gas = v; e.preventDefault(); }
      if (["ArrowLeft", "a", "A", "ArrowDown", "s", "S"].includes(e.key)) { t.freio = v; e.preventDefault(); }
      if (e.key === "Escape" && v) aoFechar();
    };
    const desce = (e: KeyboardEvent) => tecla(e, true);
    const sobe = (e: KeyboardEvent) => tecla(e, false);
    window.addEventListener("keydown", desce);
    window.addEventListener("keyup", sobe);
    return () => { window.removeEventListener("keydown", desce); window.removeEventListener("keyup", sobe); };
  }, [aoFechar]);

  // Laço principal do jogo.
  useEffect(() => {
    if (estado !== "jogando") return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const cor = (n: string) => css.getPropertyValue(n).trim() || "#000";
    const C = {
      contorno: cor("--rqr-azul-escuro"), grama: cor("--rqr-verde-agro"), terra: cor("--rqr-terra"),
      ceu1: cor("--rqr-ceu-topo"), ceu2: cor("--rqr-ceu-base"), morroLonge: cor("--rqr-roxo-claro"),
      branco: cor("--rqr-branco"), folha: cor("--rqr-verde-agro"), roda: cor("--rqr-azul-escuro"),
    };
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const g = jogo.current;
    canvas.width = g.w * dpr; canvas.height = g.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let ultimo = performance.now();
    let id = 0;

    const virou = () => {
      const final = g.maisLonge;
      setRecorde((r) => { const novo = Math.max(r, final); localStorage.setItem(CHAVE_RECORDE, String(novo)); return novo; });
      setAviso(`O carrinho virou na grama macia, tudo bem! Você andou ${final} metros e pegou ${g.folhasPegas} folhas.`);
      tocar("clique");
      setEstado("virou");
    };

    const passo = (agora: number) => {
      const dt = Math.min(2, (agora - ultimo) / (1000 / 60));
      g.tempo += quadroMs(agora, ultimo);
      ultimo = agora;
      // Se a área do jogo mudou de tamanho (fonte carregou, girou o celular), refaz o canvas.
      const caixa = caixaRef.current;
      if (caixa && (caixa.clientWidth !== g.w || caixa.clientHeight !== g.h)) {
        g.w = caixa.clientWidth; g.h = caixa.clientHeight;
        canvas.width = g.w * dpr; canvas.height = g.h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const gas = g.gas || g.teclas.gas;
      const freio = g.freio || g.teclas.freio;

      if (g.noChao) {
        const th = inclinacaoEm(g.x, g.base);
        let acel = GRAVIDADE * Math.sin(th) * 0.8 - g.vel * 0.006;
        if (gas) acel += 0.14;
        if (freio) acel -= g.vel > 0 ? 0.3 : 0.08;
        g.vel = Math.max(VEL_RE, Math.min(VEL_MAX, g.vel + acel * dt));
        g.vx = g.vel * Math.cos(th); g.vy = g.vel * Math.sin(th);
        // Inclinação em relação ao chão: acelerar empina, frear abaixa o bico.
        // Até ~63° o peso puxa de volta; passou disso, o peso ajuda a tombar.
        if (gas) g.angVel -= TORQUE_CHAO * dt;
        if (freio) g.angVel += TORQUE_CHAO * 0.8 * dt;
        g.angVel -= Math.sin(g.rel) * ENDIREITAR * (Math.abs(g.rel) < 1.1 ? 1 : -1) * dt;
        g.angVel *= Math.pow(0.94, dt);
        g.rel += g.angVel * dt;
        // Bico no chão: as rodas da frente seguram (só freando ele afunda um pouco).
        if (g.rel > 0.05 && !freio) { g.rel = 0.05; g.angVel = Math.min(0, g.angVel); }
        if (Math.abs(g.rel) > 1.6) { virou(); return; }
        const nx = g.x + g.vx * dt;
        const chao = terreno(nx, g.base);
        // Se o chão "foge" mais rápido do que a gravidade puxa, ele decola (topo do morro).
        if (chao - (g.y + g.vy * dt) > GRAVIDADE * dt && g.vel > 3) {
          g.noChao = false; g.ang = th + g.rel;
          g.x = nx; g.y += g.vy * dt;
        } else {
          g.x = nx; g.y = chao;
          g.ang = th + g.rel;
        }
      } else {
        g.vy += GRAVIDADE * dt;
        g.x += g.vx * dt; g.y += g.vy * dt;
        if (gas) g.angVel -= TORQUE_AR * dt;
        if (freio) g.angVel += TORQUE_AR * dt;
        g.angVel *= Math.pow(0.995, dt);
        g.ang += g.angVel * dt;
        const chao = terreno(g.x, g.base);
        if (g.y >= chao) {
          const th = inclinacaoEm(g.x, g.base);
          g.y = chao; g.noChao = true;
          g.rel = normalizar(g.ang - th); g.angVel *= 0.4;
          if (Math.abs(g.rel) > 1.3) { virou(); return; }
          g.vel = Math.max(VEL_RE, g.vx * Math.cos(th) + g.vy * Math.sin(th));
          tocar("pulo");
        }
      }
      g.giroRoda += (g.noChao ? g.vel : g.vx) * dt / RODA;

      // Folhas em ritmo fixo: a maioria no chão, uma em cada 3 no alto (para pegar no pulo).
      while (g.proxFolha < g.x + g.w * 1.5) {
        g.folhasCriadas++;
        const alto = g.folhasCriadas % FOLHA_ALTA_A_CADA === 0 ? 70 : 26;
        g.folhas.push({ x: g.proxFolha, y: terreno(g.proxFolha, g.base) - alto, pega: false });
        g.proxFolha += FOLHA_A_CADA_PX;
      }
      const cx = g.x, cy = g.y - ALTURA_CARRO;
      for (const f of g.folhas) {
        if (!f.pega && Math.hypot(f.x - cx, f.y - cy) < 42) { f.pega = true; g.folhasPegas++; setFolhas(g.folhasPegas); tocar("folha"); }
      }
      g.folhas = g.folhas.filter((f) => !f.pega && f.x > g.x - g.w);

      const m = Math.max(0, Math.floor((g.x - 120) / PX_POR_METRO));
      if (m > g.maisLonge) { g.maisLonge = m; setMetros(m); }

      // Câmera segue o carrinho (vertical suavizado).
      const camX = g.x - g.w * 0.3;
      g.camY += (g.y - g.h * 0.6 - g.camY) * Math.min(1, 0.12 * dt);
      const sx = (wx: number) => wx - camX;
      const sy = (wy: number) => wy - g.camY;

      // Céu e morros ao longe (parallax).
      const ceu = ctx.createLinearGradient(0, 0, 0, g.h);
      ceu.addColorStop(0, C.ceu1); ceu.addColorStop(1, C.ceu2);
      ctx.fillStyle = ceu; ctx.fillRect(0, 0, g.w, g.h);
      ctx.fillStyle = C.morroLonge; ctx.strokeStyle = C.contorno; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, g.h);
      for (let px = 0; px <= g.w + 10; px += 10) {
        const wx = (px + camX * 0.3);
        ctx.lineTo(px, g.h * 0.55 - Math.sin(wx / 180) * 30 - Math.sin(wx / 70) * 10);
      }
      ctx.lineTo(g.w, g.h); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 0.4; ctx.stroke(); ctx.globalAlpha = 1;

      // Chão: terra amarela com faixa de grama.
      ctx.beginPath(); ctx.moveTo(0, g.h);
      for (let px = -10; px <= g.w + 10; px += 6) ctx.lineTo(px, sy(terreno(px + camX, g.base)));
      ctx.lineTo(g.w + 10, g.h); ctx.closePath();
      ctx.fillStyle = C.terra; ctx.fill();
      // Grama logo abaixo da linha do chão, e o contorno exatamente onde as rodas tocam.
      ctx.beginPath();
      for (let px = -10; px <= g.w + 10; px += 6) ctx.lineTo(px, sy(terreno(px + camX, g.base)) + 8);
      ctx.lineWidth = 16; ctx.strokeStyle = C.grama; ctx.lineJoin = "round"; ctx.stroke();
      ctx.lineWidth = 3; ctx.strokeStyle = C.contorno;
      ctx.beginPath();
      for (let px = -10; px <= g.w + 10; px += 6) ctx.lineTo(px, sy(terreno(px + camX, g.base)));
      ctx.stroke();

      // Placas de distância a cada 50 m.
      ctx.font = "800 12px Nunito Sans, sans-serif"; ctx.textAlign = "center";
      for (let mm = Math.ceil(camX / PX_POR_METRO / 50) * 50; mm * PX_POR_METRO < camX + g.w; mm += 50) {
        if (mm <= 0) continue;
        const wx = 120 + mm * PX_POR_METRO, py = sy(terreno(wx, g.base));
        ctx.fillStyle = C.contorno; ctx.fillRect(sx(wx) - 2, py - 34, 4, 34);
        ctx.fillStyle = C.branco; ctx.beginPath(); ctx.roundRect(sx(wx) - 22, py - 54, 44, 22, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = C.contorno; ctx.fillText(`${mm} m`, sx(wx), py - 39);
      }

      // Folhas.
      for (const f of g.folhas) {
        ctx.save(); ctx.translate(sx(f.x), sy(f.y)); ctx.rotate(-0.6);
        ctx.fillStyle = C.folha; ctx.strokeStyle = C.contorno; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(0, 9); ctx.bezierCurveTo(-10, 0, -6, -10, 0, -11);
        ctx.bezierCurveTo(6, -10, 10, 0, 0, 9); ctx.fill(); ctx.stroke(); ctx.restore();
      }

      // Carrinho: desenhado no referencial dele (origem no ponto de contato, girado pelo ângulo).
      ctx.save(); ctx.translate(sx(g.x), sy(g.y)); ctx.rotate(g.ang);
      ctx.lineWidth = 3; ctx.strokeStyle = C.contorno; ctx.lineJoin = "round";
      ctx.fillStyle = corCarro;
      ctx.beginPath(); ctx.roundRect(-34, -ALTURA_CARRO, 68, 20, 9); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(22, -ALTURA_CARRO - 6, 10, 8, 3); ctx.fillStyle = C.branco; ctx.fill(); ctx.stroke();
      for (const rx of [-22, 22]) {
        ctx.save(); ctx.translate(rx, -RODA); ctx.rotate(g.giroRoda);
        ctx.fillStyle = C.roda; ctx.beginPath(); ctx.arc(0, 0, RODA, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = C.branco; ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = C.branco; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-RODA + 3, 0); ctx.lineTo(RODA - 3, 0); ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // Bichinho (SVG no DOM) sentado no carrinho, girando junto.
      const el = bichoRef.current;
      if (el) {
        const tx = sx(g.x) + Math.sin(g.ang) * (ALTURA_CARRO - 6);
        const ty = sy(g.y) - Math.cos(g.ang) * (ALTURA_CARRO - 6);
        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${g.ang}rad) translate(-50%, -100%)`;
      }

      // 3 minutos: termina com calma.
      if (g.tempo >= DURACAO_PARTIDA_MS) {
        const final = g.maisLonge;
        setRecorde((r) => { const novo = Math.max(r, final); localStorage.setItem(CHAVE_RECORDE, String(novo)); return novo; });
        setAviso(`3 minutos de rolê! Você andou ${final} metros e pegou ${g.folhasPegas} folhas. Que tal uma pausa?`);
        setEstado("tempo");
        return;
      }

      id = requestAnimationFrame(passo);
    };

    const visib = () => { if (!document.hidden) ultimo = performance.now(); };
    document.addEventListener("visibilitychange", visib);
    id = requestAnimationFrame(passo);
    return () => { cancelAnimationFrame(id); document.removeEventListener("visibilitychange", visib); };
  }, [estado, corCarro]);

  // Pedais: segurar. Também vale segurar a metade esquerda/direita da tela.
  const pedal = (qual: "gas" | "freio", v: boolean) => () => { jogo.current[qual] = v; };
  const tocarTela = (e: React.PointerEvent) => {
    if (estado !== "jogando") return;
    const r = e.currentTarget.getBoundingClientRect();
    if (e.clientX - r.left < r.width / 2) jogo.current.freio = true; else jogo.current.gas = true;
  };
  const soltar = () => { jogo.current.gas = false; jogo.current.freio = false; };

  const novoRecorde = estado === "virou" && metros > 0 && metros >= recorde;

  return (
    <div className="pulo carrinho" role="dialog" aria-modal="true" aria-labelledby="carrinho-titulo">
      <div className="pulo__topo">
        <h2 id="carrinho-titulo" className="pulo__titulo">Rolê de Carrinho</h2>
        <span className="pulo__placar" aria-label={`${metros} metros, ${folhas} folhas`}>
          <b>{metros} m</b> · 🍃 {folhas}
        </span>
        <BotaoTema compacto />
        <button className="crise__fechar pulo__fechar" onClick={aoFechar} aria-label="Fechar jogo" data-vlibras-gloss="FECHAR JOGO">×</button>
      </div>

      <div ref={caixaRef} className="pulo__mundo"
        onPointerDown={tocarTela} onPointerUp={soltar} onPointerCancel={soltar} onPointerLeave={soltar}>
        <canvas ref={canvasRef} className="pulo__canvas" aria-hidden="true" />
        {estado !== "inicio" && (
          <div ref={bichoRef} className="carrinho__bicho" style={{ width: BICHO, height: BICHO }} aria-hidden="true">
            <Bichinho humor={estado === "virou" ? "cansado" : "calmo"} nivel={Math.min(3, Math.floor(folhas / 3))}
              tamanho={BICHO} reduzir aparencia={aparencia} />
          </div>
        )}

        {estado === "jogando" && (
          <div className="carrinho__pedais">
            <button className="carrinho__pedal" aria-label="Frear e dar ré"
              onPointerDown={(e) => { e.stopPropagation(); pedal("freio", true)(); }}
              onPointerUp={pedal("freio", false)} onPointerLeave={pedal("freio", false)} onPointerCancel={pedal("freio", false)}>
              Freio
            </button>
            <button className="carrinho__pedal carrinho__pedal--gas" aria-label="Acelerar"
              onPointerDown={(e) => { e.stopPropagation(); pedal("gas", true)(); }}
              onPointerUp={pedal("gas", false)} onPointerLeave={pedal("gas", false)} onPointerCancel={pedal("gas", false)}>
              Acelerar
            </button>
          </div>
        )}

        {estado === "inicio" && (
          <div className="pulo__painel rqr-escalonado">
            <Bichinho humor="feliz" nivel={1} tamanho={110} reduzir={reduzir} aparencia={aparencia} />
            <p className="pulo__chamada">Bora dar um rolê pelos morros do bairro!</p>
            <ul className="pulo__dicas">
              <li><b>Celular:</b> segure os pedais Acelerar e Freio</li>
              <li><b>Computador:</b> → acelera, ← freia (ou A / D)</li>
              <li>Acelerar empina o carrinho e frear abaixa o bico, no chão e no ar. Equilibre pra não tombar e caia de rodas no chão!</li>
              <li>Pegue as folhas 🍃 no caminho</li>
              <li>Cada partida dura até 3 minutos.</li>
            </ul>
            <button className="rqr-botao" onClick={() => { tocar("clique"); iniciar(); }}>Começar</button>
            {recorde > 0 && <small>Seu recorde: {recorde} m</small>}
          </div>
        )}

        {estado === "virou" && (
          <div className="pulo__painel rqr-pop">
            <p className="pulo__chamada">Virou na grama macia, tudo bem!</p>
            <p className="pulo__resultado"><b>{metros} m</b> de rolê · 🍃 {folhas} folhas</p>
            {novoRecorde ? <p className="pulo__recorde">Seu rolê mais longo até agora!</p> : <small>Seu recorde: {recorde} m</small>}
            <button className="rqr-botao" onClick={() => { tocar("clique"); iniciar(); }}>Dirigir de novo</button>
            <button className="link" onClick={aoFechar}>Voltar pro meu rolê</button>
          </div>
        )}

        {estado === "tempo" && (
          <div className="pulo__painel rqr-pop">
            <Bichinho humor="feliz" nivel={Math.min(3, Math.floor(folhas / 3))} tamanho={90} reduzir={reduzir} aparencia={aparencia} />
            <p className="pulo__chamada">3 minutos de rolê!</p>
            <p className="pulo__resultado"><b>{metros} m</b> de rolê · 🍃 {folhas} folhas</p>
            <p className="pulo__dicas">Que tal uma pausa agora? O bichinho também vai estacionar.</p>
            <button className="rqr-botao" onClick={aoFechar}>Voltar pro meu rolê</button>
            <button className="link" onClick={() => { tocar("clique"); iniciar(); }}>Dirigir mais uma</button>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">{aviso}</p>
    </div>
  );
}

/** Botão da tela inicial que abre o jogo. Guarda o próprio estado para não mexer no App. */
export function BotaoCarrinho({ reduzir }: { reduzir: boolean }) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <button className="rqr-botao jogo-botao" onClick={() => setAberto(true)}>Jogar: Rolê de Carrinho</button>
      {/* Portal: o cartão da tela inicial tem transform, que prenderia o position: fixed dentro dele. */}
      {aberto && createPortal(<RoleDeCarrinho aoFechar={() => setAberto(false)} reduzir={reduzir} />, document.body)}
    </>
  );
}
