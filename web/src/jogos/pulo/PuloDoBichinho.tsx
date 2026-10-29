import { Icone } from "../../Icone";
import { TRILHA_PULO, imagemCenarioPulo } from "./precarregar";
import { useCallback, useEffect, useRef, useState } from "react";
import { BotaoLibras } from "../../BotaoLibras";
import { Bichinho } from "../../Bichinho";
import { tocar, tocarTrilha } from "../../sons";
import { vibrar } from "../../tato";
import { useAparenciaVisivel } from "../../personalizacao";
import { BotaoTema } from "../../BotaoTema";
import { useEsconderVLibras } from "../../vlibras";
import type { PropsJogo } from "../../historia/tipos";
import { DURACAO_PARTIDA_MS, FOLHA_A_CADA_PLATAFORMAS, quadroMs } from "../../partida";

/**
 * "Pulo do Bichinho": mini jogo de pulo infinito (estilo Sky Jump).
 * Controles: inclinar o celular (giroscópio), setas/A-D no teclado, ou segurar o lado esquerdo/direito da tela.
 * Regras do tema: o bichinho nunca morre. Ao cair, ele pousa na grama e pode tentar de novo.
 * Coleta folhas (hábitos), não moedas, em lugares previsíveis. Sem vidas, sem compra, sem "última chance".
 * A partida dura no máximo 3 minutos (ver partida.ts).
 */

type Tipo = "normal" | "move" | "nuvem" | "mola";
type Plataforma = { x: number; y: number; w: number; tipo: Tipo; vx: number; quebrou: boolean };
type Folha = { x: number; y: number; pega: boolean };

const BICHO = 56; // tamanho do mascote em px
const PLAT_W = 72;
const PLAT_H = 14;
const GRAVIDADE = 0.42;
const PULO = -12.2;
const PULO_MOLA = -19;
const VEL_MAX_X = 7;
const CHAVE_RECORDE = "rqr-pulo-recorde";

type Estado = "inicio" | "jogando" | "caiu" | "tempo";

function aleatorio(a: number, b: number) { return a + Math.random() * (b - a); }

/**
 * Segue o contrato `PropsJogo` da história. `aoTerminar` é opcional para manter os usos antigos
 * (início e "Deu vontade"): sem ele, "Voltar pro início" só fecha.
 * `chamada` troca o convite do início (o "Deu vontade" abre o jogo com "3 minutos para a onda passar").
 */
type Props = Omit<PropsJogo, "aoTerminar"> & Partial<Pick<PropsJogo, "aoTerminar">> & { chamada?: string };

export function PuloDoBichinho({ aoFechar, aoTerminar, reduzir, chamada, trilhaRetorno = "jogos" }: Props) {
  const aparencia = useAparenciaVisivel();
  const caixaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bichoRef = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("inicio");
  useEsconderVLibras(estado === "jogando");
  const [pontos, setPontos] = useState(0);
  const [folhas, setFolhas] = useState(0);
  const [recorde, setRecorde] = useState(() => Number(localStorage.getItem(CHAVE_RECORDE) ?? 0));
  // "ok" só quando chega leitura de verdade do giroscópio.
  const [sensor, setSensor] = useState<"desconhecido" | "ok" | "sem">("desconhecido");
  const [aviso, setAviso] = useState("");
  // Na história, fechar também segue para a conversa levando as folhas pegas (não existe derrota).
  const fechar = () => { tocar("clique"); return aoTerminar ? aoTerminar({ folhas: jogo.current.folhasPegas }) : aoFechar(); };
  const fecharRef = useRef(fechar);
  fecharRef.current = fechar;

  // Trilha própria do jogo; ao fechar, volta ao menu de origem e à trilha correspondente.
  // O StrictMode do React (só em dev) monta, desmonta e monta de novo todo componente pra pegar
  // bug de efeito — sem o adiamento abaixo, isso troca de trilha 3x em sequência (pulo → alegre →
  // pulo) e às vezes a última troca nem chega a tocar de verdade. Adiando um tique, a "desmontagem"
  // falsa cancela antes de pedir qualquer coisa, e só a montagem de verdade troca a trilha.
  useEffect(() => {
    const urlRetorno = trilhaRetorno === "jogos" ? "/sons/trilha-alegre.opus" : "/sons/trilha-leve.opus";
    const infoRetorno = trilhaRetorno === "jogos"
      ? { titulo: "Rolê de Hoje", artista: "Tema do menu de jogos" }
      : { titulo: "Um Passo de Cada Vez", artista: "Trilha do app" };
    let cancelado = false;
    const id = window.setTimeout(() => {
      if (cancelado) return;
      console.log("[pulo] trocando pra trilha-pulo.opus");
      tocarTrilha(TRILHA_PULO, { titulo: "Pulo do Bichinho", artista: "Trilha do jogo" });
    }, 0);
    return () => {
      cancelado = true;
      window.clearTimeout(id);
      console.log(`[pulo] saindo, voltando pra ${urlRetorno}`);
      tocarTrilha(urlRetorno, infoRetorno);
    };
  }, [trilhaRetorno]);

  // Estado do jogo fora do React (muda 60x por segundo).
  const jogo = useRef({
    w: 360, h: 640, x: 0, y: 0, vx: 0, vy: 0, olhaDireita: true,
    plats: [] as Plataforma[], folhas: [] as Folha[], altura: 0, maisAlta: 0,
    folhasPegas: 0, inclinacao: 0, teclas: { e: false, d: false }, toque: 0, criadas: 0, tempo: 0,
  });

  const gerarPlataforma = (y: number, altura: number): Plataforma => {
    const g = jogo.current;
    // Fica mais difícil com a altura: mais plataformas que andam e nuvens que somem.
    const nivel = Math.min(1, altura / 6000);
    const r = Math.random();
    let tipo: Tipo = "normal";
    if (r < 0.08) tipo = "mola";
    else if (r < 0.08 + 0.12 + nivel * 0.2) tipo = "move";
    else if (r < 0.2 + nivel * 0.2 + 0.08 + nivel * 0.15) tipo = "nuvem";
    return {
      x: aleatorio(0, g.w - PLAT_W), y, w: PLAT_W, tipo,
      vx: tipo === "move" ? aleatorio(1, 1.8 + nivel * 1.5) * (Math.random() < 0.5 ? -1 : 1) : 0,
      quebrou: false,
    };
  };

  const iniciar = useCallback(() => {
    const g = jogo.current;
    const caixa = caixaRef.current!;
    g.w = caixa.clientWidth; g.h = caixa.clientHeight;
    g.plats = []; g.folhas = [];
    // Chão inicial seguro, depois plataformas subindo.
    g.plats.push({ x: g.w / 2 - PLAT_W / 2, y: g.h - 40, w: PLAT_W, tipo: "normal", vx: 0, quebrou: false });
    let y = g.h - 40;
    while (y > -g.h) {
      y -= aleatorio(55, 85);
      const p = gerarPlataforma(y, 0);
      if (p.tipo === "nuvem") p.tipo = "normal";
      g.plats.push(p);
    }
    g.x = g.w / 2 - BICHO / 2; g.y = g.h - 40 - BICHO; g.vx = 0; g.vy = PULO;
    g.altura = 0; g.maisAlta = 0; g.folhasPegas = 0; g.criadas = 0; g.tempo = 0;
    setPontos(0); setFolhas(0); setAviso(""); setEstado("jogando");
  }, []);

  // Giroscópio: no iPhone precisa pedir permissão num toque; no Android só exige HTTPS.
  const pedirSensor = useCallback(async () => {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined;
    if (!DOE || !window.isSecureContext) { setSensor("sem"); return; }
    try {
      if (typeof DOE.requestPermission === "function") {
        const r = await DOE.requestPermission();
        if (r !== "granted") setSensor("sem");
      }
      // Se em 1,5 s nenhuma leitura chegar, avisa que o sensor não respondeu.
      window.setTimeout(() => setSensor((s) => (s === "ok" ? s : "sem")), 1500);
    } catch { setSensor("sem"); }
  }, []);

  const comecar = async () => { await pedirSensor(); tocar("clique"); iniciar(); };

  useEffect(() => {
    const ori = (e: DeviceOrientationEvent) => {
      if (e.gamma == null) return;
      // gamma: inclinação lateral em graus (-90 a 90). ±25° já é velocidade máxima.
      const angulo = screen.orientation?.angle ?? 0;
      const lado = angulo === 90 ? e.beta ?? 0 : angulo === 270 ? -(e.beta ?? 0) : e.gamma;
      jogo.current.inclinacao = Math.max(-1, Math.min(1, lado / 25));
      setSensor("ok");
    };
    const tecla = (e: KeyboardEvent, v: boolean) => {
      const t = jogo.current.teclas;
      if (["ArrowLeft", "a", "A"].includes(e.key)) t.e = v;
      if (["ArrowRight", "d", "D"].includes(e.key)) t.d = v;
      if (e.key === "Escape" && v) fecharRef.current();
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

  // Laço principal do jogo.
  useEffect(() => {
    if (estado !== "jogando") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) { console.error("[pulo] sem canvas/contexto 2d — jogo não roda, sem som de pulo"); return; }
    console.log("[pulo] laço do jogo começou");
    const css = getComputedStyle(document.documentElement);
    const cor = (n: string) => css.getPropertyValue(n).trim() || "#000";
    const C = {
      contorno: cor("--rqr-azul-escuro"), normal: cor("--rqr-verde-agro"), move: cor("--rqr-azul"),
      nuvem: cor("--rqr-branco"), mola: cor("--rqr-rosa-escuro"), folha: cor("--rqr-verde-agro"),
      ceu1: cor("--rqr-ceu-topo"), ceu2: cor("--rqr-ceu-base"),
    };
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const g = jogo.current;
    canvas.width = g.w * dpr; canvas.height = g.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Cenários ilustrados para a subida: Praça/Cidade (cap1) -> Céu/Telhados/Cometa (cap2) -> Espaço e Vila Estrela.
    const imgCidade = imagemCenarioPulo(); // já baixada na abertura do app (precarregar.ts)

    // Estrelas do espaço profundo (geradas uma vez para a partida).
    const estrelasEspaco = Array.from({ length: 48 }, (_, i) => ({
      x: ((i * 73 + 19) % 100) / 100 * g.w,
      y: ((i * 41 + 7) % 100) / 100 * g.h,
      r: (i % 3 === 0 ? 2.2 : i % 2 === 0 ? 1.5 : 1),
      camada: i % 2 === 0 ? 0.08 : 0.16,
      fase: i * 0.9,
    }));

    const desenharFundoElevando = (alturaPx: number, agoraMs: number) => {
      // Paralaxe suave: a cada ~2400px de subida (~120m), percorremos da cidade até o espaço profundo.
      const sub = reduzir ? Math.min(2600, alturaPx) : alturaPx;
      // Fundo em faixas que se misturam devagar, sem troca brusca (revisão 29/10):
      // praça (ilustração) → só céu → céu escurecendo → espaço com estrelas.
      const misturar = (c1: string, c2: string, t: number) => {
        const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
        const [a1, a2] = [h(c1), h(c2)];
        return `rgb(${a1.map((v, i) => Math.round(v + (a2[i] - v) * t)).join(",")})`;
      };
      const suave = (x: number) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
      // 0 = céu de dia (azul-claro), 1 = espaço. Fica só céu entre ~45 m e ~70 m e escurece até ~130 m.
      const escuro = suave((sub - 1400) / 1200);
      const topo = misturar("#AFC8F2", "#0C0B24", escuro);
      const base = misturar("#F8E7B8", "#262154", escuro);
      const grad = ctx.createLinearGradient(0, 0, 0, g.h);
      grad.addColorStop(0, topo);
      grad.addColorStop(1, base);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, g.w, g.h);

      // Ilustração da praça só no começo: desce da tela e some por igual, revelando o céu.
      const desenharCenarioVertical = (img: HTMLImageElement, posY: number, alpha: number, deslocamentoExtraY = 0) => {
        if (alpha <= 0 || !img.complete || !img.naturalWidth) return;
        const escala = Math.max(g.w / img.naturalWidth, (g.h * 1.35) / img.naturalHeight);
        const dw = img.naturalWidth * escala;
        const dh = img.naturalHeight * escala;
        const dx = (g.w - dw) / 2;
        const maxScroll = Math.max(0, dh - g.h);
        const dy = -maxScroll * posY + deslocamentoExtraY;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      };
      if (sub < 1000) {
        const alphaCidade = 1 - suave((sub - 300) / 600);
        const posY = Math.max(0, 1 - sub / 900);
        desenharCenarioVertical(imgCidade, posY, alphaCidade, sub > 500 ? (sub - 500) * 0.4 : 0);
      }

      // 4. Camada de Espaço Sideral + Luas + Vila Estrela (a partir de ~80m, intensificando no espaço)
      const visEspaco = suave((sub - 1900) / 900);
      if (visEspaco > 0) {
        ctx.save();
        // Estrelas em duas camadas de paralaxe
        for (const e of estrelasEspaco) {
          const yEstrela = ((e.y + sub * e.camada) % (g.h + 20)) - 10;
          const cintila = reduzir ? 0.85 : 0.55 + 0.45 * Math.sin(agoraMs * 0.003 + e.fase);
          ctx.globalAlpha = visEspaco * cintila;
          ctx.fillStyle = "#FFF2C6";
          ctx.beginPath();
          ctx.arc(e.x, yEstrela, e.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Três luas da Vila e a Vila Estrela lá no alto, descendo devagar conforme a pessoa sobe no espaço
        const progressoEspaco = Math.max(0, sub - 2000);
        const yVila = Math.min(g.h * 0.28, -90 + progressoEspaco * 0.14);
        const xVila = g.w * 0.72;

        ctx.globalAlpha = visEspaco;
        // Luas pequenas
        ctx.fillStyle = "#C9BEF0";
        ctx.strokeStyle = "#2E2C66";
        ctx.lineWidth = 2;
        for (const [dx, dy, r] of [[-78, 42, 7], [-54, 56, 10], [-28, 40, 13]] as const) {
          ctx.beginPath();
          ctx.arc(xVila + dx, yVila + dy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // Halo da Vila Estrela
        const halo = ctx.createRadialGradient(xVila, yVila, 6, xVila, yVila, 56);
        halo.addColorStop(0, "rgba(249, 220, 110, 0.45)");
        halo.addColorStop(1, "rgba(249, 220, 110, 0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(xVila, yVila, 56, 0, Math.PI * 2);
        ctx.fill();

        // Asteroide da Vila Estrela + casinhas acesas
        ctx.fillStyle = "#C9BEF0";
        ctx.beginPath();
        ctx.arc(xVila, yVila, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Casinhas no topo do asteroide
        ctx.fillStyle = "#F9DC6E";
        ctx.beginPath();
        ctx.moveTo(xVila - 12, yVila - 20);
        ctx.lineTo(xVila - 6, yVila - 27);
        ctx.lineTo(xVila, yVila - 20);
        ctx.lineTo(xVila, yVila - 13);
        ctx.lineTo(xVila - 12, yVila - 13);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(xVila + 2, yVila - 21);
        ctx.lineTo(xVila + 7, yVila - 27);
        ctx.lineTo(xVila + 12, yVila - 21);
        ctx.lineTo(xVila + 12, yVila - 13);
        ctx.lineTo(xVila + 2, yVila - 13);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }
    };

    let ultimo = performance.now();
    let id = 0;

    const desenharPlataforma = (p: Plataforma) => {
      if (p.quebrou) return;
      ctx.lineWidth = 3; ctx.strokeStyle = C.contorno;
      if (p.tipo === "nuvem") {
        ctx.fillStyle = C.nuvem;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) ctx.arc(p.x + 12 + i * 16, p.y + 7 + (i % 2 ? -3 : 0), 10, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        return;
      }
      ctx.fillStyle = p.tipo === "move" ? C.move : C.normal;
      ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, PLAT_H, 7); ctx.fill(); ctx.stroke();
      if (p.tipo === "mola") {
        ctx.fillStyle = C.mola;
        ctx.beginPath(); ctx.roundRect(p.x + p.w / 2 - 10, p.y - 10, 20, 10, 4); ctx.fill(); ctx.stroke();
      }
    };

    const desenharFolha = (f: Folha) => {
      if (f.pega) return;
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(-0.6);
      ctx.fillStyle = C.folha; ctx.strokeStyle = C.contorno; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(0, 9); ctx.bezierCurveTo(-10, 0, -6, -10, 0, -11);
      ctx.bezierCurveTo(6, -10, 10, 0, 0, 9); ctx.fill(); ctx.stroke();
      ctx.restore();
    };

    const passo = (agora: number) => {
      // dt normalizado para 60 fps; limita para não "teletransportar" após travadas.
      const dt = Math.min(2, (agora - ultimo) / (1000 / 60));
      g.tempo += quadroMs(agora, ultimo);
      ultimo = agora;

      // Controle horizontal: inclinação, teclado ou toque.
      let alvo = g.inclinacao;
      if (g.teclas.e) alvo = -1;
      if (g.teclas.d) alvo = 1;
      if (g.toque) alvo = g.toque;
      g.vx += (alvo * VEL_MAX_X - g.vx) * 0.25 * dt;
      if (Math.abs(g.vx) > 0.3) g.olhaDireita = g.vx > 0;
      g.x += g.vx * dt;
      // Sai de um lado, entra pelo outro.
      if (g.x > g.w) g.x = -BICHO;
      if (g.x < -BICHO) g.x = g.w;

      const yAntes = g.y + BICHO;
      g.vy += GRAVIDADE * dt;
      g.y += g.vy * dt;

      // Plataformas que andam.
      for (const p of g.plats) {
        if (p.tipo !== "move") continue;
        p.x += p.vx * dt;
        if (p.x < 0 || p.x + p.w > g.w) p.vx *= -1;
      }

      // Colisão só caindo, com os "pés" (parte de baixo do mascote).
      if (g.vy > 0) {
        const pes = g.y + BICHO;
        const meio = g.x + BICHO / 2;
        for (const p of g.plats) {
          if (p.quebrou) continue;
          if (meio > p.x - 6 && meio < p.x + p.w + 6 && yAntes <= p.y + 2 && pes >= p.y) {
            g.y = p.y - BICHO;
            if (p.tipo === "nuvem") { p.quebrou = true; g.vy = PULO * 0.9; tocar("clique"); }
            else if (p.tipo === "mola") { g.vy = PULO_MOLA; tocar("folha"); }
            else { g.vy = PULO; tocar("pulo"); }
            break;
          }
        }
      }

      // Câmera: quando o bichinho passa de 40% da tela, o mundo desce.
      const limite = g.h * 0.4;
      if (g.y < limite) {
        const d = limite - g.y;
        g.y = limite;
        g.altura += d;
        for (const p of g.plats) p.y += d;
        for (const f of g.folhas) f.y += d;
      }

      // Recicla o que saiu por baixo e cria plataformas acima.
      g.plats = g.plats.filter((p) => p.y < g.h + 40);
      g.folhas = g.folhas.filter((f) => f.y < g.h + 40 && !f.pega);
      let topo = Math.min(...g.plats.map((p) => p.y));
      while (topo > -60) {
        const espaco = aleatorio(60, 82 + Math.min(40, g.altura / 200));
        topo -= espaco;
        const p = gerarPlataforma(topo, g.altura);
        g.plats.push(p);
        g.criadas++;
        if (g.criadas % FOLHA_A_CADA_PLATAFORMAS === 0) {
          // A plataforma da folha nunca é nuvem, para a folha não ficar no ar.
          if (p.tipo === "nuvem") p.tipo = "normal";
          g.folhas.push({ x: p.x + p.w / 2, y: p.y - 34, pega: false });
        }
      }

      // Coleta de folhas.
      const cx = g.x + BICHO / 2, cy = g.y + BICHO / 2;
      for (const f of g.folhas) {
        if (!f.pega && Math.hypot(f.x - cx, f.y - cy) < BICHO * 0.6) {
          f.pega = true; g.folhasPegas++; setFolhas(g.folhasPegas); tocar("folha");
        }
      }

      const metros = Math.floor(g.altura / 20);
      if (metros > g.maisAlta) { g.maisAlta = metros; setPontos(metros); }

      // Desenho: fundo que se eleva (Praça/Cidade -> Telhados e Céu com Cometa -> Espaço e Vila Estrela).
      desenharFundoElevando(g.altura, agora);
      g.plats.forEach(desenharPlataforma);
      g.folhas.forEach(desenharFolha);

      // Mascote é o SVG do Bichinho (DOM), posicionado por transform.
      const el = bichoRef.current;
      if (el) {
        const estica = reduzir ? 1 : 1 + Math.max(-0.12, Math.min(0.12, -g.vy / 90));
        el.style.transform = `translate(${g.x}px, ${g.y}px) scaleX(${g.olhaDireita ? 1 : -1}) scaleY(${estica})`;
      }

      const encerrar = (fim: "caiu" | "tempo", aviso: string) => {
        const final = g.maisAlta;
        setRecorde((r) => {
          const novo = Math.max(r, final);
          localStorage.setItem(CHAVE_RECORDE, String(novo));
          return novo;
        });
        setAviso(aviso);
        setEstado(fim);
      };

      // Caiu: pousa na grama. Nunca morre.
      if (g.y > g.h) {
        vibrar("impacto"); // pousa na grama: um "tum" leve, o texto abaixo diz o que houve
        encerrar("caiu", `Ufa, caiu na grama macia! Você subiu ${g.maisAlta} metros e pegou ${g.folhasPegas} folhas.`);
        return;
      }
      // 3 minutos: termina com calma, sem cortar no meio de uma queda.
      if (g.tempo >= DURACAO_PARTIDA_MS) {
        encerrar("tempo", `3 minutos de passeio! Você subiu ${g.maisAlta} metros e pegou ${g.folhasPegas} folhas. Que tal uma pausa?`);
        return;
      }
      id = requestAnimationFrame(passoSeguro);
    };
    // Qualquer erro no laço (ex.: canvas/estado inesperado) aparece no console em vez de travar
    // a partida em silêncio sem explicação.
    const passoSeguro = (agora: number) => {
      try { passo(agora); } catch (erro) { console.error("[pulo] erro no laço do jogo:", erro); }
    };

    // Pausa se a aba ficar escondida.
    const visib = () => { if (!document.hidden) ultimo = performance.now(); };
    document.addEventListener("visibilitychange", visib);
    id = requestAnimationFrame(passoSeguro);
    return () => { cancelAnimationFrame(id); document.removeEventListener("visibilitychange", visib); };
  }, [estado, reduzir]);

  // Toque/clique segurado: metade esquerda ou direita da tela.
  const tocarTela = (e: React.PointerEvent) => {
    if (estado !== "jogando") return;
    const r = e.currentTarget.getBoundingClientRect();
    jogo.current.toque = e.clientX - r.left < r.width / 2 ? -1 : 1;
  };
  const soltar = () => { jogo.current.toque = 0; };

  // Saída gentil depois da partida: na história, segue para a conversa com as folhas pegas.
  const sair = () => { tocar("clique"); return aoTerminar ? aoTerminar({ folhas: jogo.current.folhasPegas }) : aoFechar(); };
  const rotuloSair = aoTerminar ? "Conversar com o Broto" : "Voltar pro início";

  const novoRecorde = estado === "caiu" && pontos > 0 && pontos >= recorde;

  return (
    <div className={`pulo ${chamada ? "sem-pop" : ""}`} role="dialog" aria-modal="true" aria-labelledby="pulo-titulo">
      <div className="pulo__topo">
        <h2 id="pulo-titulo" className="sr-only">Pulo do Bichinho</h2>
        <span className="pulo__placar" aria-label={`${pontos} metros, ${folhas} folhas`}>
          <b>{pontos} m</b> · <Icone nome="sprout" tamanho={16} /> {folhas}
        </span>
        <BotaoLibras />
        <BotaoTema compacto />
        <button className="crise__fechar pulo__fechar botao-fechar-gov" onClick={fechar} aria-label="Fechar jogo" data-vlibras-gloss="FECHAR JOGO"><Icone nome="fechar" tamanho={20} /></button>
      </div>

      <div ref={caixaRef} className="pulo__mundo"
        onPointerDown={tocarTela} onPointerUp={soltar} onPointerCancel={soltar} onPointerLeave={soltar}>
        <canvas ref={canvasRef} className="pulo__canvas" aria-hidden="true" />
        <div ref={bichoRef} className="pulo__bicho" style={{ width: BICHO, height: BICHO }} aria-hidden="true">
          <Bichinho humor={estado === "caiu" ? "cansado" : "calmo"} nivel={Math.min(3, Math.floor(folhas / 3))} tamanho={BICHO} reduzir aparencia={aparencia} />
        </div>

        {estado === "inicio" && (
          <div className="pulo__painel rqr-escalonado">
            <Bichinho humor="feliz" nivel={1} tamanho={110} reduzir={reduzir} aparencia={aparencia} />
            <p className="pulo__chamada">{chamada ?? "Ajude o bichinho a subir até as nuvens!"}</p>
            {/* Como jogar em animação, com pouco texto: o celular inclina e as setas apertam juntos. */}
            <div className="pulo__como" role="img" aria-label="Incline o celular ou use as setas do teclado para os lados. Também dá pra segurar um lado da tela.">
              <div className="pulo__como-item" aria-hidden="true">
                <span className="pulo__celular"><span className="pulo__celular-tela" /></span>
                <small>Incline</small>
              </div>
              <span className="pulo__como-ou" aria-hidden="true">ou</span>
              <div className="pulo__como-item" aria-hidden="true">
                <span className="pulo__teclas"><kbd className="pulo__tecla pulo__tecla--esq">←</kbd><kbd className="pulo__tecla pulo__tecla--dir">→</kbd></span>
                <small>Setas</small>
              </div>
            </div>
            <p className="pulo__dica">Pegue as folhas 🍃 e cuidado com a nuvem branca.</p>
            <button className="rqr-botao" onClick={comecar}>Começar</button>
            {recorde > 0 && <small>Seu recorde: {recorde} m</small>}
          </div>
        )}

        {estado === "caiu" && (
          <div className="pulo__painel rqr-pop">
            <p className="pulo__chamada">Ufa, caiu na grama macia!</p>
            <p className="pulo__resultado"><b>{pontos} m</b> de altura · 🍃 {folhas} folhas</p>
            {novoRecorde ? <p className="pulo__recorde">Seu melhor pulo até agora!</p> : <small>Seu recorde: {recorde} m</small>}
            <button className="rqr-botao" onClick={() => { tocar("clique"); iniciar(); }}>Pular de novo</button>
            <button className="link" onClick={sair}>{rotuloSair}</button>
          </div>
        )}

        {estado === "tempo" && (
          <div className="pulo__painel rqr-pop">
            <Bichinho humor="feliz" nivel={Math.min(3, Math.floor(folhas / 3))} tamanho={90} reduzir={reduzir} aparencia={aparencia} />
            <p className="pulo__chamada">3 minutos de passeio!</p>
            <p className="pulo__resultado"><b>{pontos} m</b> de altura · 🍃 {folhas} folhas</p>
            <p className="pulo__dicas">Que tal uma pausa agora? O bichinho também vai descansar.</p>
            <button className="rqr-botao" onClick={sair}>{rotuloSair}</button>
            <button className="link" onClick={() => { tocar("clique"); iniciar(); }}>Jogar mais uma</button>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">{aviso}</p>
    </div>
  );
}
