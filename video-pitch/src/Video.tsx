import { loadFont as fredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as nunito } from "@remotion/google-fonts/Nunito";
import React from "react";
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { APP_URL_TEXTO, DURACAO_S } from "./config";
import { Qr } from "./Qr";
import { T, compasso, f } from "./tempo";

const { fontFamily: TITULO } = fredoka("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });
const { fontFamily: TEXTO } = nunito("normal", { weights: ["600", "700", "800"], subsets: ["latin", "latin-ext"] });

// Cores do tema livro do app (web/src/tema-livro.css). Texto sempre tinta sobre papel ou sol (contraste ≥ 10:1).
const C = {
  tinta: "#2E2C66", funda: "#1B1A45", papel: "#FBF6E8", cartao: "#FFFCF4", sol: "#F9DC6E",
  lavanda: "#C9BEF0", menta: "#A4DFCF", rosa: "#F7BED0", ceu: "#AFC8F2", salvia: "#B9DCA0", creme: "#FFFCF4",
};
const NOITE = `radial-gradient(ellipse at 50% 45%, #34327A 0%, ${C.funda} 70%)`;
const suave = Easing.bezier(0.2, 0.8, 0.2, 1);

const entre = (fr: number, a: number, b: number, de = 0, para = 1, easing = suave) =>
  interpolate(fr, [a, b], [de, para], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/* ---------------------------------------------------------------- abertura */

function FundoNoite() {
  return <AbsoluteFill style={{ background: NOITE }} />;
}

/** Raios girando devagar atrás dos logos, como no vídeo anterior. */
function Raios({ opacidade }: { opacidade: number }) {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: opacidade, overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: "50%", top: "45%", width: 1800, height: 1800, marginLeft: -900, marginTop: -900,
        transform: `rotate(${fr * 0.08}deg)`,
        background: "repeating-conic-gradient(from 0deg, rgba(175,200,242,.13) 0deg 6deg, transparent 6deg 18deg)",
        WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 55%)", maskImage: "radial-gradient(circle, #000 0%, transparent 55%)",
      }} />
    </AbsoluteFill>
  );
}

function Logo({ src, largura, ini, fim, legenda }: { src: string; largura: number; ini: number; fim: number; legenda: string }) {
  const fr = useCurrentFrame();
  const entra = entre(fr, f(ini), f(ini + 0.6));
  const sai = entre(fr, f(fim - 0.45), f(fim), 1, 0, Easing.in(Easing.quad));
  const escala = 0.94 + 0.06 * entra + 0.02 * (1 - sai);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: Math.min(entra, sai) }}>
      <Img src={staticFile(src)} style={{ width: largura, transform: `scale(${escala})`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,.35))" }} />
      <div style={{ marginTop: 26, fontFamily: TEXTO, fontWeight: 800, fontSize: 24, color: C.creme, letterSpacing: ".04em", opacity: entre(fr, f(ini + 0.4), f(ini + 1)) }}>
        {legenda}
      </div>
    </AbsoluteFill>
  );
}

const CORPO = "M100 50 C146 50 162 86 160 124 C158 160 132 178 100 178 C68 178 42 160 40 124 C38 86 54 50 100 50Z";
const TRACOS = [
  CORPO,
  "M48 140 C30 136 22 150 28 158 C34 164 46 156 52 150",
  "M152 140 C170 136 178 150 172 158 C166 164 154 156 148 150",
  "M100 52 C100 40 100 34 100 26",
  "M100 38 C88 30 80 34 78 26 C90 22 98 28 100 38Z",
  "M100 32 C112 24 120 28 124 20 C110 16 102 22 100 32Z",
  "M68 110 Q78 98 88 110 M112 110 Q122 98 132 110",
  "M88 132 Q100 146 112 132",
];

/** A logo do app como na abertura do próprio app: o contorno do Broto se desenha, o amarelo toma a tela e ele ganha cor. */
function LogoApp() {
  const fr = useCurrentFrame();
  const ini = T.parceiroFim;
  if (fr < f(ini)) return null;
  const amarelo = entre(fr, f(T.amarelo), f(T.amarelo + 0.65), 0, 1, Easing.bezier(0.65, 0, 0.35, 1));
  const cor = entre(fr, f(T.amarelo + 0.15), f(T.amarelo + 0.6));
  const sobe = entre(fr, f(compasso(-3) - 0.2), f(compasso(-3) + 0.5));
  const nome = entre(fr, f(compasso(-3)), f(compasso(-3) + 0.6));
  const frase = entre(fr, f(compasso(-2)), f(compasso(-2) + 0.6));
  const selos = (i: number) => entre(fr, f(compasso(-2) + 0.6 + i * 0.25), f(compasso(-2) + 1.1 + i * 0.25));
  const respira = 1 + 0.025 * Math.sin((fr / 30) * Math.PI * 2 * (139.5 / 60 / 2));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.sol, clipPath: `circle(${amarelo * 820}px at 640px 360px)` }} />
      <div style={{ position: "absolute", left: 540, top: 260 - sobe * 120, width: 200, height: 200, transform: `scale(${(1 + sobe * 0.05) * (cor > 0.99 ? respira : 1)})` }}>
        <svg viewBox="0 0 200 200" width={200} height={200} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: 1 - cor }}>
          {TRACOS.map((d, i) => {
            const a = ini + 0.35 + (i === 0 ? 0 : i < 3 ? 0.2 : i < 6 ? 0.45 : 0.7);
            const p = entre(fr, f(a), f(a + (i === 0 ? 1.1 : 0.6)), 0, 1, Easing.bezier(0.45, 0, 0.2, 1));
            return <path key={i} d={d} pathLength={1} fill="none" stroke={C.creme} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - p} />;
          })}
        </svg>
        <Img src={staticFile("marca/broto.svg")} style={{ position: "absolute", inset: 0, width: 200, height: 200, opacity: cor }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", color: C.tinta }}>
        <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 76, lineHeight: 1, opacity: nome, transform: `translateY(${(1 - nome) * 16}px)` }}>Meu amigo Broto!</div>
        <div style={{ fontFamily: TEXTO, fontWeight: 700, fontSize: 28, marginTop: 16, opacity: frase, transform: `translateY(${(1 - frase) * 12}px)` }}>
          Um amigo do lado de quem quer parar de apostar.
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 26 }}>
          {[["Libras com VLibras", C.ceu], ["Linguagem simples", C.menta], ["Alto contraste", C.lavanda]].map(([t, cor], i) => (
            <Chip key={t} cor={cor} opacidade={selos(i)} grande>{t}</Chip>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------- peças */

function Chip({ children, cor, opacidade = 1, grande = false }: { children: React.ReactNode; cor: string; opacidade?: number; grande?: boolean }) {
  return (
    <span style={{
      display: "inline-block", fontFamily: TEXTO, fontWeight: 800, fontSize: grande ? 20 : 18, color: C.tinta, background: cor,
      border: `2.5px solid ${C.tinta}`, borderRadius: 999, padding: grande ? "6px 16px" : "5px 14px", boxShadow: `0 3px 0 ${C.tinta}`,
      opacity: opacidade, transform: `translateY(${(1 - opacidade) * 10}px) scale(${0.9 + 0.1 * opacidade})`,
    }}>{children}</span>
  );
}

/** Título com uma palavra entre *asteriscos* marcada com a caneta amarela, entrando palavra por palavra. */
function Titulo({ texto, inicio, tamanho = 50 }: { texto: string; inicio: number; tamanho?: number }) {
  const fr = useCurrentFrame();
  const partes = texto.split(" ");
  return (
    <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: tamanho, lineHeight: 1.12, color: C.tinta }}>
      {partes.map((p, i) => {
        const marcada = p.startsWith("*");
        const palavra = p.replace(/\*/g, "");
        const a = entre(fr, inicio + i * 2, inicio + i * 2 + 10);
        const caneta = entre(fr, inicio + partes.length * 2 + 4, inicio + partes.length * 2 + 16);
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.24em", opacity: a, transform: `translateY(${(1 - a) * 22}px)`, position: "relative" }}>
            {marcada && <span style={{ position: "absolute", left: -4, right: -4, bottom: 4, height: "0.38em", background: C.sol, borderRadius: 6, zIndex: -1, transformOrigin: "left", transform: `scaleX(${caneta})` }} />}
            {palavra}
          </span>
        );
      })}
    </div>
  );
}

/** Celular com a tela do app; troca de tela com um deslize curto. */
function Celular({ telas, ini, fim, x = 955, y = 360, altura = 620, giro = 0 }: {
  telas: string[]; ini: number; fim: number; x?: number; y?: number; altura?: number; giro?: number;
}) {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const largura = Math.round(altura * (390 / 844));
  const entra = spring({ frame: fr - ini, fps, config: { damping: 16, mass: 0.8 } });
  const sai = entre(fr, fim - 8, fim, 0, 1, Easing.in(Easing.cubic));
  const cada = (fim - ini) / telas.length;
  const atual = Math.min(telas.length - 1, Math.max(0, Math.floor((fr - ini) / cada)));
  const boia = Math.sin((fr / 30) * 1.3) * 5;
  return (
    <div style={{
      position: "absolute", left: x - largura / 2, top: y - altura / 2 + boia, width: largura, height: altura,
      transform: `translateX(${(1 - entra) * 260 + sai * -40}px) rotate(${giro + (1 - entra) * 8}deg) scale(${1 - sai * 0.06})`,
      opacity: Math.min(1, entra * 1.4) * (1 - sai),
    }}>
      <div style={{ position: "absolute", inset: -11, borderRadius: 50, background: C.funda, boxShadow: `0 14px 0 ${C.tinta}, 0 30px 60px rgba(27,26,69,.35)` }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, overflow: "hidden", background: C.papel }}>
        {telas.map((t, i) => {
          if (Math.abs(i - atual) > 1) return null;
          const tIni = ini + i * cada;
          const a = i === 0 ? 1 : entre(fr, tIni, tIni + 9);
          if (i > atual) return null;
          const estilo: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: a, transform: `translateY(${(1 - a) * 30}px)` };
          return t.endsWith(".mp4")
            ? <OffthreadVideo key={t} src={staticFile(t)} muted style={estilo} startFrom={0} />
            : <Img key={t} src={staticFile(t)} style={estilo} />;
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- demonstração */

type Cena = {
  de: number; ate: number; rotulo: string; tag: string; cor: string; titulo: string; texto?: string;
  chips: [string, string][]; telas: string[]; icone?: string; numeros?: [string, string][];
};

const CENAS: Cena[] = [
  {
    de: -1, ate: 1, rotulo: "Problema", tag: "O problema", cor: C.rosa, titulo: "A aposta mora no *bolso* de milhões.",
    numeros: [["25 mi", "de CPFs em sites de apostas .bet.br"], ["75%", "dos apostadores estão nas classes D e E"]],
    chips: [], telas: ["cap2-nave-cometa.webp"],
  },
  {
    de: 1, ate: 3, rotulo: "Solução", tag: "A solução", cor: C.sol, titulo: "Um *amigo* do lado, não um sermão.",
    texto: "Um alien caiu na praça. Vocês se recuperam juntos, numa história em capítulos.",
    chips: [["História interativa", C.sol], ["Base em TCC", C.menta], ["Entrevista motivacional", C.lavanda]],
    telas: ["telas/historia-1.png", "telas/historia-2.png"],
  },
  {
    de: 3, ate: 5, rotulo: "Libras", tag: "Acessibilidade", cor: C.ceu, titulo: "Libras em toda tela, com o *VLibras*.",
    texto: "Um toque no botão azul e o avatar traduz o texto para Libras.", icone: "marca/vlibras.svg",
    chips: [["VLibras gov.br", C.ceu], ["Leitor de tela", C.menta], ["Só teclado", C.lavanda]],
    telas: ["telas/vlibras.png"],
  },
  {
    de: 5, ate: 7, rotulo: "Foco", tag: "Menos carga cognitiva", cor: C.menta, titulo: "Uma coisa por vez, sem *pressa*.",
    texto: "Frases curtas, botões grandes, nada de contagem regressiva. Bateu a vontade? Um toque e o Broto respira junto.",
    chips: [["Linguagem simples", C.menta], ["Uma tarefa por tela", C.sol], ["Respiração guiada", C.ceu]],
    telas: ["telas/missoes.png", "telas/deu-vontade.png"],
  },
  {
    de: 7, ate: 9, rotulo: "Seu jeito", tag: "Do seu jeito", cor: C.lavanda, titulo: "Cada pessoa vê do *seu* jeito.",
    texto: "Alto contraste, tema escuro, menos animação, vibração e o Broto com a sua cara.",
    chips: [["Alto contraste", C.sol], ["Tema escuro", C.lavanda], ["Reduzir animações", C.menta], ["Personalização", C.rosa]],
    telas: ["telas/acessibilidade.png", "telas/contraste.png", "telas/escuro.png", "telas/personalizar.png"], icone: "marca/simbolo-acessibilidade.svg",
  },
  {
    de: 9, ate: 11, rotulo: "Jogos", tag: "Na hora da vontade", cor: C.salvia, titulo: "Jogos de 3 minutos, *zero* aposta.",
    texto: "Distração para a onda passar. Sem moeda, sem sorte, sem ranking. E o CVV 188 a um toque.",
    chips: [["Pulo do Bichinho", C.sol], ["Mais jogos na história", C.menta], ["Ajuda 24 h", C.rosa]],
    telas: ["telas/jogos.png", "telas/pulo.mp4", "telas/ajuda.png"],
  },
];

function FundoPapel() {
  const fr = useCurrentFrame();
  const d = (k: number) => Math.sin(fr / 60 + k) * 10;
  const bola = (x: number, y: number, r: number, cor: string, k: number): React.CSSProperties => ({
    position: "absolute", left: x - r + d(k), top: y - r + d(k + 2), width: r * 2, height: r * 2, borderRadius: "50%", background: cor, border: `3px solid ${C.tinta}`,
  });
  return (
    <AbsoluteFill style={{ background: C.papel, overflow: "hidden" }}>
      <div style={bola(40, 30, 190, C.sol, 0)} />
      <div style={bola(1250, 700, 170, C.lavanda, 1)} />
      <div style={bola(720, 770, 90, C.salvia, 2)} />
      {Array.from({ length: 18 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: (i * 211) % 1280, top: (i * 137) % 720, width: 5, height: 5, borderRadius: 3, background: C.tinta, opacity: 0.12 }} />
      ))}
    </AbsoluteFill>
  );
}

function TextoCena({ c }: { c: Cena }) {
  const fr = useCurrentFrame();
  const ini = f(compasso(c.de));
  const fim = f(compasso(c.ate));
  const sai = entre(fr, fim - 8, fim, 0, 1, Easing.in(Easing.cubic));
  const tag = entre(fr, ini, ini + 8);
  const corpo = entre(fr, ini + 14, ini + 26);
  return (
    <div style={{ position: "absolute", left: 48, top: 214, width: 560, opacity: 1 - sai, transform: `translateY(${-sai * 14}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, opacity: tag, transform: `translateX(${(1 - tag) * -20}px)` }}>
        {c.icone && <Img src={staticFile(c.icone)} style={{ width: 44, height: 44 }} />}
        <Chip cor={c.cor}>{c.tag}</Chip>
      </div>
      <Titulo texto={c.titulo} inicio={ini + 4} />
      {c.texto && (
        <div style={{ fontFamily: TEXTO, fontWeight: 700, fontSize: 24, lineHeight: 1.38, color: C.tinta, marginTop: 14, opacity: corpo, transform: `translateY(${(1 - corpo) * 10}px)` }}>
          {c.texto}
        </div>
      )}
      {c.numeros && (
        <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
          {c.numeros.map(([n, t], i) => {
            // O segundo número entra na pancada do drop.
            const a = entre(fr, i === 0 ? ini + 12 : f(compasso(0)), (i === 0 ? ini + 12 : f(compasso(0))) + 10);
            return (
              <div key={n} style={{
                display: "flex", alignItems: "center", gap: 18, background: C.cartao, border: `3px solid ${C.tinta}`, borderRadius: 22, padding: "12px 22px",
                boxShadow: `0 6px 0 ${C.tinta}`, opacity: a, transform: `scale(${0.85 + 0.15 * a})`, transformOrigin: "left",
              }}>
                <span style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 52, color: C.tinta, minWidth: 140 }}>{n}</span>
                <span style={{ fontFamily: TEXTO, fontWeight: 800, fontSize: 22, color: C.tinta, lineHeight: 1.25 }}>{t}</span>
              </div>
            );
          })}
          <div style={{ fontFamily: TEXTO, fontWeight: 700, fontSize: 15, color: C.tinta, opacity: entre(fr, f(compasso(0)) + 8, f(compasso(0)) + 18) }}>
            Fonte: Legitimuz, white paper setorial, mai/2026.
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
        {c.chips.map(([t, cor], i) => <Chip key={t} cor={cor} opacidade={entre(fr, ini + 22 + i * 4, ini + 32 + i * 4)}>{t}</Chip>)}
      </div>
    </div>
  );
}

/** Onde estou: os seis assuntos embaixo, o atual em destaque (ajuda a acompanhar sem som e sem pressa). */
function Trilho() {
  const fr = useCurrentFrame();
  const vis = Math.min(entre(fr, f(T.demo), f(T.demo) + 12), 1 - entre(fr, f(T.cta) - 8, f(T.cta)));
  return (
    <div style={{ position: "absolute", left: 48, top: 664, display: "flex", gap: 8, opacity: vis }}>
      {CENAS.map((c) => {
        const ativa = fr >= f(compasso(c.de)) && fr < f(compasso(c.ate));
        return (
          <span key={c.rotulo} style={{
            fontFamily: TEXTO, fontWeight: 800, fontSize: 15, padding: "4px 11px", borderRadius: 999, border: `2px solid ${C.tinta}`,
            background: ativa ? C.tinta : "transparent", color: ativa ? C.sol : C.tinta,
          }}>{c.rotulo}</span>
        );
      })}
    </div>
  );
}

function Demonstracao() {
  const fr = useCurrentFrame();
  if (fr < f(T.transicao) || fr >= f(T.cta) + 20) return null;
  const abre = entre(fr, f(T.transicao), f(T.demo) + 6, 0, 1, Easing.bezier(0.65, 0, 0.35, 1));
  return (
    <AbsoluteFill style={{ clipPath: `circle(${abre * 1500}px at 955px 360px)` }}>
      <FundoPapel />
      {CENAS.map((c) => {
        const ini = f(compasso(c.de));
        const fim = f(compasso(c.ate));
        if (fr < ini - 2 || fr > fim) return null;
        return (
          <React.Fragment key={c.rotulo}>
            <TextoCena c={c} />
            <Celular telas={c.telas} ini={ini} fim={fim} giro={c.de % 4 === 1 ? -3 : 3} />
          </React.Fragment>
        );
      })}
      <Trilho />
    </AbsoluteFill>
  );
}

/* ---------------------------------------------------------------- QR e chamada final */

/** Cartão do QR: fica fixo no canto superior esquerdo e cresce na chamada final. */
function CartaoQr() {
  const fr = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cresce = spring({ frame: fr - f(T.cta) - 4, fps, config: { damping: 18, mass: 0.9 } });
  const volta = entre(fr, f(T.volta), f(T.volta) + 18, 0, 1, Easing.inOut(Easing.cubic));
  const p = cresce * (1 - volta);
  const lado = interpolate(p, [0, 1], [124, 380]);
  const x = interpolate(p, [0, 1], [20, 790]);
  const y = interpolate(p, [0, 1], [20, 92]);
  const pad = interpolate(p, [0, 1], [9, 18]);
  return (
    <div style={{
      position: "absolute", left: x, top: y, padding: pad, background: "#FFFFFF", borderRadius: 14 + p * 14,
      border: `3px solid ${C.tinta}`, boxShadow: `0 ${4 + p * 6}px 0 ${C.tinta}, 0 10px 30px rgba(0,0,0,.25)`,
    }}>
      <Qr tamanho={lado} />
      <div style={{ fontFamily: TEXTO, fontWeight: 800, fontSize: interpolate(p, [0, 1], [13.5, 24]), color: C.tinta, textAlign: "center", marginTop: 4 + p * 6, width: lado }}>
        {p > 0.5 ? APP_URL_TEXTO : "Acesse o app"}
      </div>
      <Img src={staticFile("marca/broto.svg")} style={{ position: "absolute", right: -26, top: -40, width: 84, height: 84, opacity: p, transform: `rotate(${12 + Math.sin(fr / 9) * 5}deg) scale(${p})` }} />
    </div>
  );
}

function Chamada() {
  const fr = useCurrentFrame();
  if (fr < f(T.cta) - 2) return null;
  const abre = entre(fr, f(T.cta), f(T.cta) + 14, 0, 1, Easing.bezier(0.65, 0, 0.35, 1));
  const ini = f(T.cta) + 6;
  const corpo = entre(fr, ini + 14, ini + 26);
  return (
    <AbsoluteFill style={{ background: C.sol, clipPath: `circle(${abre * 1500}px at 90px 90px)` }}>
      <div style={{ position: "absolute", left: 1170, top: 580, width: 300, height: 300, borderRadius: "50%", background: C.lavanda, border: `3px solid ${C.tinta}` }} />
      <div style={{ position: "absolute", left: 48, top: 150, width: 690 }}>
        <Chip cor={C.cartao} opacidade={entre(fr, ini, ini + 8)}>Já está no ar</Chip>
        <div style={{ height: 14 }} />
        <Titulo texto="Experimente *agora*." inicio={ini + 4} tamanho={64} />
        <div style={{ fontFamily: TEXTO, fontWeight: 800, fontSize: 28, lineHeight: 1.35, color: C.tinta, marginTop: 14, opacity: corpo }}>
          Aponte a câmera do celular para o QR code ou digite:
        </div>
        <div style={{
          display: "inline-block", marginTop: 12, fontFamily: TITULO, fontWeight: 700, fontSize: 30, color: C.tinta, background: C.cartao,
          border: `3px solid ${C.tinta}`, borderRadius: 16, padding: "6px 18px", boxShadow: `0 5px 0 ${C.tinta}`, opacity: entre(fr, ini + 22, ini + 32),
        }}>{APP_URL_TEXTO}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
          {[["Sem login, sem CPF", C.cartao], ["Grátis, no navegador", C.menta], ["Libras com VLibras", C.ceu]].map(([t, cor], i) => (
            <Chip key={t} cor={cor} opacidade={entre(fr, ini + 30 + i * 4, ini + 40 + i * 4)}>{t}</Chip>
          ))}
        </div>
      </div>
      <div style={{
        position: "absolute", left: 48, right: 48, bottom: 22, textAlign: "center", fontFamily: TEXTO, fontWeight: 800, fontSize: 17, color: C.tinta,
        background: C.cartao, border: `2px solid ${C.tinta}`, borderRadius: 999, padding: "7px 16px", opacity: entre(fr, ini + 40, ini + 52),
      }}>
        Apoio complementar, não substitui atendimento profissional. Precisa conversar agora? CVV 188, 24 h, gratuito.
      </div>
    </AbsoluteFill>
  );
}

/** Fecha no mesmo azul da abertura, com o QR já de volta ao canto: o último quadro emenda no primeiro. */
function Volta() {
  const fr = useCurrentFrame();
  if (fr < f(T.volta)) return null;
  const r = entre(fr, f(T.volta), f(T.volta) + 20, 0, 1, Easing.inOut(Easing.cubic));
  return <AbsoluteFill style={{ clipPath: `circle(${r * 1500}px at 640px 360px)` }}><FundoNoite /></AbsoluteFill>;
}

/* ---------------------------------------------------------------- vídeo */

export function VideoLoop() {
  const fr = useCurrentFrame();
  const total = f(DURACAO_S);
  const raios = Math.min(entre(fr, 0, f(0.8)), 1 - entre(fr, f(T.amarelo) - 10, f(T.amarelo) + 10));
  return (
    <AbsoluteFill style={{ background: C.funda }}>
      <Audio
        src={staticFile("trilha.mp3")}
        endAt={total}
        volume={(q) => Math.min(entre(q, 0, 6), 1 - entre(q, f(T.volta), total - 1, 0, 1, Easing.linear))}
      />
      <FundoNoite />
      <Raios opacidade={raios} />
      {fr < f(T.marcaFim) + 2 && <Logo src="marca/role-que-rende.webp" largura={430} ini={0.25} fim={T.marcaFim} legenda="Equipe Peão apresenta" />}
      {fr >= f(T.marcaFim) && fr < f(T.parceiroFim) + 2 && <Logo src="marca/acai-valley.webp" largura={500} ini={T.marcaFim + 0.15} fim={T.parceiroFim} legenda="Inovathon Rolê que Rende · Açaí Valley" />}
      {fr < f(T.demo) + 10 && <LogoApp />}
      <Demonstracao />
      <Chamada />
      <Volta />
      <CartaoQr />
    </AbsoluteFill>
  );
}
