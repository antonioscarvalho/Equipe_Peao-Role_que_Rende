import { useCallback, useEffect, useRef, useState } from "react";
import { BotaoLibras } from "../../BotaoLibras";
import { Bichinho } from "../../Bichinho";
import { pararTrilha, tocar, tocarTrilha } from "../../sons";
import { useAparenciaVisivel } from "../../personalizacao";
import { BotaoTema } from "../../BotaoTema";
import { useEsconderVLibras } from "../../vlibras";
import type { PropsJogo } from "../../historia/tipos";
import { DURACAO_PARTIDA_MS, quadroMs } from "../../partida";
import "./cantiga.css";

/**
 * "Ritmo da Cantiga" (capítulo 2, O Cometa da Sorte).
 *
 * O Broto colhe poeira de luz no ritmo da cantiga da Vó ("tum-tum, tá-rá… a luz vem devagar", cap. 1).
 * A poeira desce até o pote; tocar na hora certa colhe. De tempos em tempos o Cometa da Sorte passa no céu
 * batendo mais rápido, com grãos dourados no meio da cantiga. Tocar no dourado não colhe nada: aparece um
 * "quase" e o cometa leva um pouco de brilho. Quem segue a cantiga, devagar, enche o pote.
 *
 * O jogo mostra na prática o que o Broto diz depois dele (cap2.ts):
 * - "O dourado brilha mais justo quando chega perto": o grão dourado cresce e brilha ao chegar no pote.
 * - "Quase ganhar é só um jeito bonito de perder": tocar no dourado só mostra um "quase".
 * - "O cometa sempre ia embora mais brilhante": cada toque no dourado deixa o cometa maior.
 * - Lição, "a semente simples, que tá sempre ali": a cantiga nunca muda e cada pote cheio faz a semente crescer.
 *
 * Regras (skills design-etico-saude-digital, gamificacao-etica, prevencao-recaida, sonorizar-componente):
 * - Nada é sorteado. A cantiga tem um padrão fixo e o cometa passa em compassos fixos.
 * - Sem vidas, sem derrota, sem sequência (combo) e sem som de erro. Errar o tempo não tira nada do pote.
 * - Som não é obrigatório: o pote pulsa em cada batida e a poeira se vê descendo.
 * - Ritmo "calmo" mais lento e com janela de acerto maior. Partida de até 3 minutos (partida.ts).
 */

type Velocidade = "calmo" | "normal";
const BPM: Record<Velocidade, number> = { calmo: 66, normal: 84 };
/** Janela de acerto, para mais e para menos (ms). Generosa de propósito. */
const JANELA: Record<Velocidade, number> = { calmo: 230, normal: 180 };
/** Cantiga da Vó num compasso de 4 tempos: tum (1), tum (2), tá (3), rá (3 e meio), pausa. */
const CANTIGA: { tempo: number; som: "tum" | "ta" }[] = [
  { tempo: 0, som: "tum" }, { tempo: 1, som: "tum" }, { tempo: 2, som: "ta" }, { tempo: 2.5, som: "ta" },
];
/** Batida do cometa, sempre entre as notas da cantiga (meio tempo de distância). */
const BATIDA_COMETA = [0.5, 1.5, 3, 3.5];
/** O cometa passa por 4 compassos a cada 10, a partir do 5º. Fixo: quem joga aprende quando ele vem. */
const cometaNoCompasso = (c: number) => c >= 5 && c % 10 >= 5 && c % 10 <= 8;
const INICIO_MS = 2200;
const DESCIDA_MS = 1900;
const GRAOS_POR_POTE = 8;
const BICHO = 64;

type Grao = { t: number; dourado: boolean; som: "tum" | "ta" | "cometa"; tocou: boolean; fim: "" | "colheu" | "quase" | "passou"; fimEm: number };
type Estado = "inicio" | "jogando" | "tempo";

export function RitmoDaCantiga({ aoTerminar, reduzir }: PropsJogo) {
  const aparencia = useAparenciaVisivel();
  const caixaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [estado, setEstado] = useState<Estado>("inicio");
  useEsconderVLibras(estado === "jogando");
  const [velocidade, setVelocidade] = useState<Velocidade>("calmo");
  const [sementes, setSementes] = useState(0);
  const [pote, setPote] = useState(0);
  const [puxado, setPuxado] = useState(false);
  const [cometaPassando, setCometaPassando] = useState(false);
  const [aviso, setAviso] = useState("");

  const jogo = useRef({
    w: 360, h: 640, tempo: 0, graos: [] as Grao[], proxCompasso: 0, beatMs: 60000 / BPM.calmo, janela: JANELA.calmo,
    pote: 0, sementes: 0, colhidos: 0, quases: 0, brilhoCometa: 0, puxadoAte: 0, cometa: false,
  });

  // Fechar ou sair sempre segue para a conversa com as sementes: não existe derrota.
  const sair = () => aoTerminar({ folhas: jogo.current.sementes });
  const sairRef = useRef(sair);
  sairRef.current = sair;

  // A cantiga é a música do jogo: a trilha do app para durante a partida e volta ao sair.
  useEffect(() => {
    pararTrilha();
    return () => tocarTrilha("/sons/trilha-alegre.opus", { titulo: "Rolê de Hoje", artista: "Tema do app" });
  }, []);

  const iniciar = useCallback(() => {
    const g = jogo.current;
    const caixa = caixaRef.current!;
    g.w = caixa.clientWidth; g.h = caixa.clientHeight;
    g.tempo = 0; g.graos = []; g.proxCompasso = 0;
    g.beatMs = 60000 / BPM[velocidade]; g.janela = JANELA[velocidade];
    g.pote = 0; g.sementes = 0; g.colhidos = 0; g.quases = 0; g.brilhoCometa = 0; g.puxadoAte = 0; g.cometa = false;
    setSementes(0); setPote(0); setPuxado(false); setCometaPassando(false); setAviso("");
    setEstado("jogando");
  }, [velocidade]);

  // Toque (ou espaço/Enter): colhe o grão mais perto do pote, se estiver dentro da janela.
  const colher = useCallback(() => {
    const g = jogo.current;
    let melhor: Grao | null = null;
    for (const gr of g.graos) {
      if (gr.fim) continue;
      const d = Math.abs(gr.t - g.tempo);
      if (d <= g.janela && (!melhor || d < Math.abs(melhor.t - g.tempo))) melhor = gr;
    }
    if (!melhor) return; // Fora do tempo: nada acontece. Nem som de erro.
    melhor.fimEm = g.tempo;
    if (melhor.dourado) {
      // Seguiu a batida do cometa: não colhe, mostra um "quase" e o cometa fica maior.
      melhor.fim = "quase"; g.quases++; g.brilhoCometa = Math.min(1, g.brilhoCometa + 0.12);
      g.puxadoAte = g.tempo + 900; setPuxado(true);
      return;
    }
    melhor.fim = "colheu"; g.colhidos++; tocar("colhe");
    g.pote++;
    if (g.pote >= GRAOS_POR_POTE) {
      g.pote = 0; g.sementes++; setSementes(g.sementes); tocar("folha");
      setAviso(`Pote cheio. A semente cresceu: ${g.sementes} ${g.sementes === 1 ? "semente" : "sementes"}.`);
    }
    setPote(g.pote);
  }, []);
  const colherRef = useRef(colher);
  colherRef.current = colher;
  const estadoRef = useRef(estado);
  estadoRef.current = estado;

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") { sairRef.current(); return; }
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowDown") {
        if (estadoRef.current !== "jogando") return;
        e.preventDefault();
        if (!e.repeat) colherRef.current();
      }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
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
      contorno: cor("--rqr-azul-escuro", "#1b1a4a"), poeira: "#e9fbd9", poeiraBorda: cor("--rqr-verde-agro", "#3a9b4a"),
      dourado: cor("--rqr-amarelo", "#f6c33b"),
    };
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const g = jogo.current;
    canvas.width = g.w * dpr; canvas.height = g.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const xTrilho = g.w / 2;
    const yPote = g.h - 120;
    const yTopo = 70;
    let ultimo = performance.now();
    let id = 0;

    const gerar = () => {
      // Cria os compassos que vão chegar no pote nos próximos instantes.
      while (INICIO_MS + g.proxCompasso * 4 * g.beatMs < g.tempo + DESCIDA_MS + 4 * g.beatMs) {
        const c = g.proxCompasso;
        const base = INICIO_MS + c * 4 * g.beatMs;
        for (const n of CANTIGA) g.graos.push({ t: base + n.tempo * g.beatMs, dourado: false, som: n.som, tocou: false, fim: "", fimEm: 0 });
        if (cometaNoCompasso(c)) {
          for (const b of BATIDA_COMETA) g.graos.push({ t: base + b * g.beatMs, dourado: true, som: "cometa", tocou: false, fim: "", fimEm: 0 });
        }
        g.proxCompasso++;
      }
    };

    const desenhar = () => {
      ctx.clearRect(0, 0, g.w, g.h);
      const compasso = Math.floor((g.tempo - INICIO_MS) / (4 * g.beatMs));
      const cometaAgora = compasso >= 0 && cometaNoCompasso(compasso);

      // Cometa no céu, sempre de longe. Atravessa da esquerda para a direita nos compassos dele.
      if (cometaAgora || g.brilhoCometa > 0) {
        const inicioJanela = Math.floor(compasso / 10) * 10 + 5;
        const prog = cometaAgora ? ((g.tempo - INICIO_MS) / (4 * g.beatMs) - inicioJanela) / 4 : 1.1;
        if (prog <= 1.1) {
          const cx = -40 + prog * (g.w + 80), cy = 46 + prog * 18;
          const r = 14 + g.brilhoCometa * 16;
          ctx.save();
          const rastro = ctx.createLinearGradient(cx - r * 6, cy - 10, cx, cy);
          rastro.addColorStop(0, "rgba(246,195,59,0)"); rastro.addColorStop(1, "rgba(246,195,59,.6)");
          ctx.fillStyle = rastro;
          ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.7); ctx.lineTo(cx - r * 6, cy - 14); ctx.lineTo(cx, cy + r * 0.7); ctx.fill();
          if (!reduzir) { ctx.shadowColor = C.dourado; ctx.shadowBlur = 16 + g.brilhoCometa * 20; }
          ctx.fillStyle = C.dourado; ctx.strokeStyle = C.contorno; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; ctx.stroke();
          ctx.restore();
        }
      }

      // Trilho da poeira e o pote, que pulsa em cada batida (o ritmo também se vê, não só se ouve).
      ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 2; ctx.setLineDash([4, 8]);
      ctx.beginPath(); ctx.moveTo(xTrilho, yTopo); ctx.lineTo(xTrilho, yPote); ctx.stroke(); ctx.setLineDash([]);
      const fase = ((g.tempo - INICIO_MS) % g.beatMs + g.beatMs) % g.beatMs / g.beatMs;
      const pulso = reduzir ? 0 : Math.max(0, 1 - fase * 3);
      ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(xTrilho, yPote, 26 + pulso * 6, 0, Math.PI * 2); ctx.stroke();

      for (const gr of g.graos) {
        const faltam = gr.t - g.tempo;
        if (faltam > DESCIDA_MS) continue;
        const y = yPote - (faltam / DESCIDA_MS) * (yPote - yTopo);
        if (gr.fim === "colheu") {
          // Cai no pote e some.
          const a = 1 - (g.tempo - gr.fimEm) / 250;
          if (a <= 0) continue;
          ctx.globalAlpha = a; ctx.fillStyle = C.poeira;
          ctx.beginPath(); ctx.arc(xTrilho, yPote + (1 - a) * 18, 10 * a, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
          continue;
        }
        if (gr.fim === "quase") {
          const a = 1 - (g.tempo - gr.fimEm) / 900;
          if (a <= 0) continue;
          ctx.globalAlpha = a * 0.7; ctx.fillStyle = "#fff"; ctx.font = "700 15px system-ui, sans-serif"; ctx.textAlign = "center";
          ctx.fillText("quase", xTrilho + 54, yPote - 30 - (reduzir ? 0 : (1 - a) * 16)); ctx.globalAlpha = 1;
          continue;
        }
        if (y > g.h + 20) continue;
        if (gr.dourado) {
          // Brilha mais quanto mais perto do pote: é de propósito.
          const perto = Math.max(0, Math.min(1, 1 - faltam / DESCIDA_MS));
          const r = 7 + perto * 6;
          ctx.save();
          if (!reduzir) { ctx.shadowColor = C.dourado; ctx.shadowBlur = 6 + perto * 18; }
          ctx.fillStyle = C.dourado; ctx.strokeStyle = C.contorno; ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const ang = (i / 8) * Math.PI * 2, rr = i % 2 ? r * 0.5 : r;
            ctx.lineTo(xTrilho + Math.cos(ang) * rr, y + Math.sin(ang) * rr);
          }
          ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0; ctx.stroke();
          ctx.restore();
        } else {
          ctx.fillStyle = C.poeira; ctx.strokeStyle = C.poeiraBorda; ctx.lineWidth = 3;
          ctx.globalAlpha = gr.fim === "passou" ? 0.35 : 1;
          ctx.beginPath(); ctx.arc(xTrilho, y, gr.som === "tum" ? 12 : 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    };

    const passo = (agora: number) => {
      g.tempo += quadroMs(agora, ultimo);
      ultimo = agora;
      gerar();

      for (const gr of g.graos) {
        // A cantiga toca sozinha quando cada grão chega no pote: é o guia do ritmo.
        if (!gr.tocou && g.tempo >= gr.t) { gr.tocou = true; tocar(gr.som); }
        // Passou do pote sem toque: só segue caindo, mais apagado. Não tira nada.
        if (!gr.fim && g.tempo > gr.t + g.janela) gr.fim = "passou";
      }
      g.graos = g.graos.filter((gr) => g.tempo - gr.t < 1200);

      const compasso = Math.floor((g.tempo - INICIO_MS) / (4 * g.beatMs));
      const cometa = compasso >= 0 && cometaNoCompasso(compasso);
      if (cometa !== g.cometa) {
        g.cometa = cometa; setCometaPassando(cometa);
        if (cometa) setAviso("O cometa está passando, batendo mais rápido. Siga a cantiga.");
      }
      if (!cometa && g.brilhoCometa > 0) g.brilhoCometa = Math.max(0, g.brilhoCometa - 0.002);
      if (g.puxadoAte && g.tempo >= g.puxadoAte) { g.puxadoAte = 0; setPuxado(false); }

      desenhar();

      if (g.tempo >= DURACAO_PARTIDA_MS) {
        setAviso(`3 minutos de colheita! ${g.sementes} ${g.sementes === 1 ? "semente cresceu" : "sementes cresceram"}.`);
        setEstado("tempo");
        return;
      }
      id = requestAnimationFrame(passoSeguro);
    };
    const passoSeguro = (agora: number) => {
      try { passo(agora); } catch (erro) { console.error("[cantiga] erro no laço do jogo:", erro); }
    };
    const visib = () => { if (!document.hidden) ultimo = performance.now(); };
    document.addEventListener("visibilitychange", visib);
    id = requestAnimationFrame(passoSeguro);
    return () => { cancelAnimationFrame(id); document.removeEventListener("visibilitychange", visib); };
  }, [estado, reduzir]);

  const tocarTela = (e: React.PointerEvent) => {
    if (estado !== "jogando") return;
    e.preventDefault();
    colher();
  };

  const nivel = Math.min(3, sementes);

  return (
    <div className="pulo cantiga" role="dialog" aria-modal="true" aria-labelledby="cantiga-titulo">
      <div className="pulo__topo">
        <h2 id="cantiga-titulo" className="pulo__titulo">Ritmo da Cantiga</h2>
        <span className="pulo__placar">🌱 {sementes} · pote {pote}/{GRAOS_POR_POTE}</span>
        <BotaoLibras />
        <BotaoTema compacto />
        <button className="crise__fechar pulo__fechar" onClick={sair} aria-label="Fechar jogo" data-vlibras-gloss="FECHAR JOGO">×</button>
      </div>

      <div ref={caixaRef} className="pulo__mundo cantiga__mundo" onPointerDown={tocarTela}>
        <canvas ref={canvasRef} className="pulo__canvas" aria-hidden="true" />
        {estado === "jogando" && (
          <div className={`cantiga__bicho ${puxado ? "is-puxado" : ""} ${reduzir ? "" : "is-balanca"}`} aria-hidden="true"
            style={{ ["--batida" as string]: `${jogo.current.beatMs}ms` }}>
            <Bichinho humor={puxado ? "cansado" : "calmo"} nivel={nivel} tamanho={BICHO} reduzir aparencia={aparencia} />
          </div>
        )}

        {estado === "inicio" && (
          <div className="pulo__painel rqr-escalonado">
            <Bichinho humor="calmo" nivel={1} tamanho={100} reduzir={reduzir} aparencia={aparencia} />
            <p className="pulo__chamada">Tum-tum, tá-rá… a luz vem devagar.</p>
            <ul className="pulo__dicas">
              <li>A poeira de luz desce até o pote. Toque na tela quando ela chegar no círculo.</li>
              <li><b>Computador:</b> espaço ou Enter.</li>
              <li>O círculo pulsa em cada batida. Dá pra jogar sem som.</li>
              <li>Às vezes o cometa passa batendo mais rápido, com grãos dourados. Esses não enchem o pote: deixe passar.</li>
              <li>A cada 8 grãos, o pote enche e a semente cresce. Errar o tempo não tira nada.</li>
              <li>Cada partida dura até 3 minutos.</li>
            </ul>
            <div className="cantiga__velocidade" role="group" aria-label="Ritmo">
              <span>Ritmo:</span>
              {(["calmo", "normal"] as const).map((v) => (
                <button key={v} className={`chip ${velocidade === v ? "is-on" : ""}`} aria-pressed={velocidade === v}
                  onClick={() => { tocar("clique"); setVelocidade(v); }}>{v === "calmo" ? "Calmo" : "Normal"}</button>
              ))}
            </div>
            <button className="rqr-botao" onClick={() => { tocar("clique"); iniciar(); }}>Começar</button>
          </div>
        )}

        {estado === "tempo" && (
          <div className="pulo__painel rqr-pop">
            <Bichinho humor="feliz" nivel={nivel} tamanho={90} reduzir={reduzir} aparencia={aparencia} />
            <p className="pulo__chamada">Ufa. Segurar o ritmo cansa.</p>
            <p className="pulo__resultado">🌱 {sementes} {sementes === 1 ? "semente cresceu" : "sementes cresceram"}</p>
            <p className="pulo__dicas">Que tal uma pausa agora? O Broto quer conversar.</p>
            <button className="rqr-botao" onClick={sair}>Conversar com o Broto</button>
            <button className="link" onClick={() => { tocar("clique"); iniciar(); }}>Jogar mais uma</button>
          </div>
        )}
      </div>

      {estado === "jogando" && (
        <p className="pulo__nota">
          {puxado ? "Era o cometa. Quase não é colheita." : cometaPassando ? "O cometa está passando. Siga a cantiga." : "Toque quando a poeira chegar no círculo."}
        </p>
      )}
      <p className="sr-only" aria-live="polite">{aviso}</p>
    </div>
  );
}
