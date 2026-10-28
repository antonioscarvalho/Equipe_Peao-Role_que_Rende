import type { PropsCena } from "./tipos";
import "./cenas.css";

/**
 * Cena do Capítulo 1, A Queda: noite na praça, cratera onde o Broto caiu e a Vila Estrela lá no alto.
 * Cada momento da conversa mostra o que o Broto está contando:
 * - "De onde você veio?": a Vila Estrela acende e chega mais perto.
 * - "Por que você caiu?": a nave sem combustível e o caminho da queda.
 * - "Você tá machucado?": a régua da altura que ele já subiu.
 * - Lição: amanhece e aparecem plataformas, uma de cada vez, até o céu.
 * Desenho próprio da equipe em SVG (sem asset de terceiros). Cores só por tokens.
 */
const ESTRELAS: [number, number, number][] = [
  [40, 60, 2.5], [92, 140, 1.8], [150, 40, 2], [210, 120, 1.6], [250, 50, 2.4], [360, 70, 1.8],
  [380, 190, 2.2], [60, 230, 1.6], [130, 300, 2], [330, 290, 1.6], [20, 360, 1.8], [270, 220, 1.4],
];

export function rotuloCenaCap1({ etapa, pergunta }: PropsCena["momento"]) {
  if (etapa === "licao") return "Amanhece na praça. Plataformas sobem, uma de cada vez, da grama até o céu.";
  if (etapa === "perguntas" && pergunta === 0) return "Lá no alto brilha a Vila Estrela, um asteroide pequenininho com casinhas.";
  if (etapa === "perguntas" && pergunta === 1) return "A nave da família, sem combustível, perto da Vila Estrela. Uma linha tracejada mostra a queda até a cratera.";
  if (etapa === "perguntas" && pergunta === 2) return "Uma régua vai da grama até o alto e marca a altura que o Broto já subiu.";
  return "Noite na praça. O Broto está ao lado da cratera onde caiu. Lá no alto, a Vila Estrela.";
}

export function CenaCap1({ momento }: PropsCena) {
  const { etapa, pergunta } = momento;
  const amanhecer = etapa === "licao";
  const vila = etapa === "perguntas" && pergunta === 0;
  const nave = etapa === "perguntas" && pergunta === 1;
  const regua = etapa === "perguntas" && pergunta === 2;

  return (
    <svg className={`cena ${amanhecer ? "cena--amanhecer" : ""}`} viewBox="0 0 400 700"
      preserveAspectRatio="xMidYMax slice" role="img" aria-label={rotuloCenaCap1(momento)}>
      <defs>
        <linearGradient id="cena1-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="cena__ceu-topo" />
          <stop offset="1" className="cena__ceu-base" />
        </linearGradient>
      </defs>
      <rect width="400" height="700" fill="url(#cena1-ceu)" />

      <g className="cena__estrelas">
        {ESTRELAS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} className="cena__estrela" style={{ animationDelay: `${(i % 4) * 1.2}s` }} />
        ))}
      </g>

      {/* Vila Estrela: asteroide com casinhas. */}
      <g className={`cena__vila ${vila ? "is-foco" : ""}`}>
        <circle cx="300" cy="120" r="44" className="cena__halo" />
        <circle cx="300" cy="120" r="26" className="cena__asteroide" />
        <circle cx="290" cy="112" r="4" className="cena__cratera-pequena" />
        <circle cx="312" cy="130" r="3" className="cena__cratera-pequena" />
        <path d="M286 96 l6 -7 l6 7 v7 h-12z M302 95 l5 -6 l5 6 v8 h-10z" className="cena__casinha" />
      </g>

      {/* Nave da família, parada sem combustível. */}
      <g className={`cena__nave ${nave ? "is-foco" : ""}`}>
        <path d="M232 168 q14 -18 30 -2 l-6 12 h-18z" className="cena__nave-corpo" />
        <circle cx="246" cy="168" r="4" className="cena__nave-janela" />
        <path d="M240 178 l-4 8 M254 178 l4 8" className="cena__traco" />
        <rect x="266" y="160" width="18" height="6" rx="3" className="cena__tanque" />
        <path d="M244 190 C 200 300, 120 380, 120 520" className="cena__rastro" />
      </g>

      {/* Régua da altura já subida. */}
      <g className={`cena__regua ${regua ? "is-foco" : ""}`}>
        <path d="M44 540 V 200" className="cena__regua-linha" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M36 ${540 - i * 55} h16`} className="cena__regua-linha" />)}
        <path d="M34 214 l10 -16 l10 16" className="cena__regua-linha" />
      </g>

      {/* Plataformas da lição: uma de cada vez até o céu. */}
      <g className="cena__plataformas">
        {[[250, 470], [190, 400], [250, 330], [200, 260], [260, 190]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="72" height="14" rx="7" className="cena__plataforma" style={{ animationDelay: `${i * 0.25}s` }} />
        ))}
      </g>

      {/* Chão: morro de grama com a cratera da queda. */}
      <path d="M0 560 Q 100 520 200 540 T 400 530 V 700 H 0 Z" className="cena__grama" />
      <ellipse cx="120" cy="552" rx="54" ry="12" className="cena__cratera" />
      {!amanhecer && (
        <g className="cena__fumaca">
          <circle cx="104" cy="530" r="9" /><circle cx="124" cy="518" r="11" /><circle cx="142" cy="532" r="8" />
        </g>
      )}
    </svg>
  );
}
