import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as carregarFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as carregarNunito } from "@remotion/google-fonts/NunitoSans";

// Mesmas fontes do app (tema-livro.css): Fredoka nos títulos, Nunito Sans no texto.
export const TITULO = carregarFredoka("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;
export const TEXTO = carregarNunito("normal", { weights: ["600", "700", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;

/** Paleta do tema "livro ilustrado" do app (web/src/tema-livro.css). */
export const C = {
  tinta: "#2E2C66", funda: "#1B1A45", papel: "#FBF6E8", cartao: "#FFFCF4", papelSuave: "#F1E9D4",
  sol: "#F9DC6E", salvia: "#B9DCA0", ceu: "#AFC8F2", lavanda: "#C9BEF0", rosa: "#F7BED0",
  menta: "#A4DFCF", terracota: "#EBA585", roxo: "#7B6AC4", azul: "#6F86E3", azulClaro: "#79D3EE",
};

const GRAO = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .18  0 0 0 0 .17  0 0 0 0 .4  0 0 0 .1 0'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>")`;

/** Entrada com mola, atrasada `atraso` quadros. Devolve 0→1. */
export function useEntrada(atraso = 0, config = { damping: 14, mass: 0.8 }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - atraso, fps, config });
}

export function Papel({ cor = C.papel, children, style }: { cor?: string; children?: ReactNode; style?: CSSProperties }) {
  return (
    <AbsoluteFill style={{ background: cor, ...style }}>
      <AbsoluteFill style={{ backgroundImage: GRAO, opacity: 0.9 }} />
      {children}
    </AbsoluteFill>
  );
}

/** Cenário ilustrado do app ao fundo, com leve zoom contínuo (Ken Burns). */
export function Cenario({ arquivo, escurecer = 0.55, cor = C.funda, desfoque = 0 }: { arquivo: string; escurecer?: number; cor?: string; desfoque?: number }) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(f, [0, durationInFrames], [1.06, 1.16]);
  return (
    <AbsoluteFill>
      <Img src={staticFile(`arte/${arquivo}`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: desfoque ? `blur(${desfoque}px)` : undefined }} />
      <AbsoluteFill style={{ background: cor, opacity: escurecer }} />
    </AbsoluteFill>
  );
}

/** Duração (s) de cada gravação do app, para congelar no último quadro em vez de sumir. */
const DURACAO_CENA: Record<string, number> = {
  abertura: 35.6, historia: 39.9, inicio: 12.1, missoes: 15.9, respiracao: 20.4, pulo: 24.6, personalizar: 13.4, escuro: 15.2,
};

function Gravacao({ nome, de, velocidade }: { nome: string; de: number; velocidade: number }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ultimo = Math.floor(((DURACAO_CENA[nome] - de - 0.2) / velocidade) * fps);
  const video = (
    <OffthreadVideo muted src={staticFile(`cenas/${nome}.mp4`)} trimBefore={Math.round(de * fps)} playbackRate={velocidade}
      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  );
  return f > ultimo ? <Freeze frame={ultimo}>{video}</Freeze> : video;
}

/**
 * Celular com a tela real do app: gravação (`video`, a partir de `de` segundos) ou foto (`foto`).
 * A tela tem a proporção da captura (390×844).
 */
export function Celular({ video, foto, de = 0, velocidade = 1, altura = 860, atraso = 0, girar = 0, style }: {
  video?: string; foto?: string; de?: number; velocidade?: number; altura?: number; atraso?: number; girar?: number; style?: CSSProperties;
}) {
  const e = useEntrada(atraso, { damping: 16, mass: 0.9 });
  const largura = (altura * 390) / 844;
  const borda = Math.round(altura * 0.018);
  return (
    <div style={{
      position: "relative", width: largura + borda * 2, height: altura + borda * 2, borderRadius: altura * 0.07,
      background: C.tinta, padding: borda, boxShadow: `0 ${altura * 0.018}px 0 ${C.funda}, 0 30px 60px rgba(27,26,69,.35)`,
      transform: `translateY(${(1 - e) * 500}px) rotate(${girar + (1 - e) * 8}deg)`, opacity: Math.min(1, e * 2), ...style,
    }}>
      <div style={{ width: largura, height: altura, borderRadius: altura * 0.055, overflow: "hidden", background: C.papel, position: "relative" }}>
        {video && <Gravacao nome={video} de={de} velocidade={velocidade} />}
        {foto && <Img src={staticFile(`cenas/${foto}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </div>
    </div>
  );
}

/** Etiqueta pequena acima do título ("Pilar 1 · Na hora da vontade"). */
export function Selo({ children, cor = C.sol, atraso = 0 }: { children: ReactNode; cor?: string; atraso?: number }) {
  const e = useEntrada(atraso);
  return (
    <div style={{
      display: "inline-block", alignSelf: "flex-start", padding: "10px 24px", borderRadius: 999, background: cor, color: C.tinta,
      border: `4px solid ${C.tinta}`, boxShadow: `0 5px 0 ${C.tinta}`, font: `700 30px ${TITULO}`, letterSpacing: 0.5,
      transform: `scale(${0.6 + e * 0.4}) rotate(${(1 - e) * -6}deg)`, opacity: e, transformOrigin: "left center",
    }}>{children}</div>
  );
}

/** Título que entra palavra por palavra. `destaque`: palavras com marca-texto amarelo. */
export function Titulo({ texto, tamanho = 84, cor = C.tinta, atraso = 0, destaque = [], marca = C.sol, centro = false }: {
  texto: string; tamanho?: number; cor?: string; atraso?: number; destaque?: string[]; marca?: string; centro?: boolean;
}) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linhas = texto.split("\n");
  let i = 0;
  return (
    <h1 style={{ margin: 0, font: `600 ${tamanho}px/1.08 ${TITULO}`, color: cor, letterSpacing: -0.5, textAlign: centro ? "center" : "left" }}>
      {linhas.map((linha, li) => (
        <div key={li}>
          {linha.split(" ").map((p, pi) => {
            const k = i++;
            const e = spring({ frame: f - atraso - k * 3, fps, config: { damping: 13, mass: 0.6 } });
            const limpa = p.replace(/[.,!?:]/g, "");
            const real = destaque.includes(limpa);
            const m = interpolate(f - atraso - k * 3 - 8, [0, 10], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <span key={pi} style={{
                display: "inline-block", marginRight: "0.24em", opacity: e, transform: `translateY(${(1 - e) * 40}px)`,
                background: real ? `linear-gradient(${marca}, ${marca}) no-repeat 0 88% / ${m}% 42%` : undefined, padding: real ? "0 .08em" : undefined,
              }}>{p}</span>
            );
          })}
        </div>
      ))}
    </h1>
  );
}

export function Texto({ children, tamanho = 36, cor = C.tinta, atraso = 0, style }: { children: ReactNode; tamanho?: number; cor?: string; atraso?: number; style?: CSSProperties }) {
  const e = useEntrada(atraso);
  return <p style={{ margin: 0, font: `700 ${tamanho}px/1.35 ${TEXTO}`, color: cor, opacity: e, transform: `translateY(${(1 - e) * 24}px)`, ...style }}>{children}</p>;
}

/** Item de lista em bloco colorido, no estilo dos botões "Kahoot" do app. */
export function Bloco({ children, cor = C.cartao, atraso = 0, icone, tamanho = 34 }: { children: ReactNode; cor?: string; atraso?: number; icone?: ReactNode; tamanho?: number }) {
  const e = useEntrada(atraso, { damping: 12, mass: 0.7 });
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 22, padding: "20px 28px", borderRadius: 26, background: cor,
      border: `4px solid ${C.tinta}`, boxShadow: `0 7px 0 ${C.tinta}`, color: C.tinta, font: `700 ${tamanho}px/1.25 ${TEXTO}`,
      opacity: e, transform: `translateX(${(1 - e) * 80}px) scale(${0.9 + e * 0.1})`,
    }}>
      {icone && <span style={{ flex: "none", display: "grid", placeItems: "center", width: 58, height: 58, borderRadius: 999, background: C.cartao, border: `4px solid ${C.tinta}`, font: `700 30px ${TITULO}` }}>{icone}</span>}
      <span>{children}</span>
    </div>
  );
}

/** Pílula curta ("sem moeda", "CVV 188"). */
export function Chip({ children, cor = C.cartao, atraso = 0, tamanho = 30 }: { children: ReactNode; cor?: string; atraso?: number; tamanho?: number }) {
  const e = useEntrada(atraso, { damping: 10, mass: 0.6 });
  return (
    <span style={{
      display: "inline-block", padding: "12px 26px", borderRadius: 999, background: cor, border: `4px solid ${C.tinta}`,
      boxShadow: `0 5px 0 ${C.tinta}`, color: C.tinta, font: `700 ${tamanho}px ${TITULO}`, opacity: e, transform: `scale(${0.5 + e * 0.5})`,
    }}>{children}</span>
  );
}

export function Fonte({ children, cor = C.tinta, atraso = 20 }: { children: ReactNode; cor?: string; atraso?: number }) {
  const e = useEntrada(atraso);
  return <p style={{ margin: 0, font: `600 22px/1.3 ${TEXTO}`, color: cor, opacity: e * 0.8 }}>{children}</p>;
}

/** Broto (ícone oficial do app, web/public/icones/broto.svg) flutuando. */
export function Broto({ tamanho = 300, atraso = 0, style }: { tamanho?: number; atraso?: number; style?: CSSProperties }) {
  const f = useCurrentFrame();
  const e = useEntrada(atraso, { damping: 9, mass: 0.8 });
  const flutua = Math.sin((f - atraso) / 14) * 10;
  return <Img src={staticFile("arte/broto.svg")} style={{ width: tamanho, height: tamanho, transform: `translateY(${flutua}px) scale(${e}) rotate(${(1 - e) * -20}deg)`, ...style }} />;
}

/** Layout padrão: celular(es) de um lado, texto do outro. */
export function Dividida({ celulares, children, inverter = false }: { celulares: ReactNode; children: ReactNode; inverter?: boolean }) {
  return (
    <AbsoluteFill style={{ flexDirection: inverter ? "row-reverse" : "row", alignItems: "center", padding: "0 110px", gap: 90 }}>
      <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 40, width: 820 }}>{celulares}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 30 }}>{children}</div>
    </AbsoluteFill>
  );
}
