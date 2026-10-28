import type { PropsCena } from "./tipos";
import "./cenas.css";

/**
 * Cena do Capítulo 1, A Queda: noite na praça, cratera onde o Broto caiu e a Vila Estrela lá no alto.
 * O roteiro escolhe o momento (`Passo.cena`); as perguntas da pessoa também mudam a cena:
 * - cratera (padrão), bairro (janelas apagadas), lua (as três luas da Vila), estrelas (constelação)
 * - vila, colheita (poeira de luz subindo), familia (janelas da Vila acesas), musica (notas no ar)
 * - nave (sem combustível e o caminho da queda), regua (a altura já subida)
 * - amanhecer (lição): plataformas sobem uma de cada vez e a primeira janela do bairro acende,
 *   plantando a promessa "a família vai achar o Broto" (historia-broto/continuity/promises).
 * Movimento (skill motion-design): uma "câmera" sobe para o céu nos momentos da Vila e desce para a
 * praça nos outros; camadas de estrelas em parallax lento; nada pisca rápido. Tudo para com reduzir.
 * Desenho próprio da equipe em SVG (sem asset de terceiros). Cores só por tokens.
 */
const ESTRELAS: [number, number, number][] = [
  [40, 60, 2.5], [92, 140, 1.8], [150, 40, 2], [210, 120, 1.6], [250, 50, 2.4], [360, 70, 1.8],
  [380, 190, 2.2], [60, 230, 1.6], [130, 300, 2], [330, 290, 1.6], [20, 360, 1.8], [270, 220, 1.4],
  [180, 200, 1.2], [110, 80, 1.3], [300, 10, 1.6], [70, 10, 1.2], [230, -40, 1.8], [40, -80, 1.4], [340, -60, 2],
  [-160, 80, 2], [-120, 200, 1.6], [-60, 40, 1.8], [-180, 320, 1.4], [-90, 380, 2], [440, 60, 2.2], [500, 180, 1.6],
  [560, 40, 1.8], [470, 330, 1.4], [580, 280, 2], [-20, 140, 1.4], [420, 400, 1.6],
];
/** Constelação que se desenha no momento "estrelas". */
const CONSTELACAO = "M90 140 L150 100 L210 120 L250 60 L320 90 L360 70";

const CEU = ["vila", "colheita", "familia", "nave", "lua"];

const ROTULOS: Record<string, string> = {
  cratera: "Noite na praça. As casas do bairro estão apagadas. O Broto está ao lado da cratera onde caiu. Lá no alto, a Vila Estrela.",
  bairro: "As casas em volta da praça, quase todas com as janelas apagadas.",
  vila: "Lá no alto brilha a Vila Estrela, um asteroide pequenininho com casinhas.",
  colheita: "Na Vila Estrela, pontinhos de poeira de luz sobem das pedras.",
  familia: "As janelas das casinhas da Vila Estrela acendem, uma a uma.",
  musica: "Notas de música flutuam em volta do Broto, e as estrelas pulsam devagar.",
  lua: "Uma lua grande sobre a praça e, ao lado, as três luas pequenas da Vila Estrela.",
  estrelas: "Estrelas se ligam por linhas e formam um desenho no céu.",
  nave: "A nave da família, sem combustível, perto da Vila Estrela. Uma linha tracejada mostra a queda até a cratera.",
  regua: "Uma régua vai da grama até o alto e marca a altura que o Broto já subiu.",
  queda: "Uma estrelinha risca o céu da noite e cai na grama da praça, ao lado da cratera. É o Broto.",
  amanhecer: "Amanhece na praça. Plataformas sobem, uma de cada vez, da grama até o céu. Uma janela do bairro acende.",
};

const PERGUNTA_CENA = ["vila", "nave", "regua"];

export function momentoCap1({ etapa, pergunta, cena }: PropsCena["momento"]): string {
  if (etapa === "licao") return "amanhecer";
  if (etapa === "perguntas" && pergunta !== null) return PERGUNTA_CENA[pergunta] ?? "cratera";
  return cena && ROTULOS[cena] ? cena : "cratera";
}

export function rotuloCenaCap1(m: PropsCena["momento"]) {
  return ROTULOS[momentoCap1(m)];
}

export function CenaCap1({ momento, ator }: PropsCena) {
  const m = momentoCap1(momento);
  const noCeu = CEU.includes(m);

  return (
    <svg className={`cena cena--${m} ${noCeu ? "cena--ceu" : ""}`} viewBox="-200 0 800 700"
      preserveAspectRatio="xMidYMax slice" role="img" aria-label={ROTULOS[m]}>
      <defs>
        <linearGradient id="cena1-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="cena__ceu-topo" />
          <stop offset="1" className="cena__ceu-base" />
        </linearGradient>
        <radialGradient id="cena1-brilho">
          <stop offset="0" className="cena__brilho-centro" />
          <stop offset="1" className="cena__brilho-borda" />
        </radialGradient>
      </defs>
      <rect x="-200" width="800" height="700" fill="url(#cena1-ceu)" />

      {/* Céu: aproxima quando a conversa é sobre a Vila (efeito de câmera). */}
      <g className="cena__camera">
        <g className="cena__estrelas cena__estrelas--longe">
          {ESTRELAS.filter((_, i) => i % 2).map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r * 0.8} className="cena__estrela" style={{ animationDelay: `${(i % 5) * 1.1}s` }} />
          ))}
        </g>
        <g className="cena__estrelas cena__estrelas--perto">
          {ESTRELAS.filter((_, i) => !(i % 2)).map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} className="cena__estrela" style={{ animationDelay: `${(i % 4) * 1.3}s` }} />
          ))}
        </g>
        <path d={CONSTELACAO} className="cena__constelacao" pathLength={1} />
        <path d="M-40 40 l60 30" className="cena__cadente-traco" />

        {/* Luas: a nossa, grande, e as três da Vila. */}
        <g className="cena__luas">
          <circle cx="90" cy="150" r="34" className="cena__lua" />
          <circle cx="78" cy="140" r="6" className="cena__lua-mancha" /><circle cx="100" cy="162" r="4" className="cena__lua-mancha" />
          <circle cx="300" cy="230" r="7" className="cena__lua cena__lua--vila" />
          <circle cx="322" cy="244" r="10" className="cena__lua cena__lua--vila" />
          <circle cx="350" cy="226" r="14" className="cena__lua cena__lua--vila" />
        </g>

        {/* Vila Estrela: asteroide com casinhas. */}
        <g className="cena__vila">
          <circle cx="300" cy="120" r="60" fill="url(#cena1-brilho)" className="cena__halo" />
          <circle cx="300" cy="120" r="26" className="cena__asteroide" />
          <circle cx="290" cy="112" r="4" className="cena__cratera-pequena" />
          <circle cx="312" cy="130" r="3" className="cena__cratera-pequena" />
          <path d="M286 96 l6 -7 l6 7 v7 h-12z M302 95 l5 -6 l5 6 v8 h-10z M276 104 l5 -6 l5 6 v7 h-10z" className="cena__casinha" />
          <rect x="290" y="98" width="4" height="4" className="cena__vila-janela" style={{ transitionDelay: ".2s" }} />
          <rect x="305" y="97" width="4" height="4" className="cena__vila-janela" style={{ transitionDelay: ".6s" }} />
          <rect x="279" y="105" width="4" height="4" className="cena__vila-janela" style={{ transitionDelay: "1s" }} />
          <g className="cena__poeira">
            {[[288, 92], [300, 88], [314, 94], [294, 82], [308, 80], [282, 98]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2" style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          </g>
        </g>

        {/* Nave da família, parada sem combustível. */}
        <g className="cena__nave">
          <path d="M232 168 q14 -18 30 -2 l-6 12 h-18z" className="cena__nave-corpo" />
          <circle cx="246" cy="168" r="4" className="cena__nave-janela" />
          <path d="M240 178 l-4 8 M254 178 l4 8" className="cena__traco" />
          <rect x="266" y="160" width="18" height="6" rx="3" className="cena__tanque" />
        </g>

      </g>

      {/* Chão: a praça, o bairro e o Broto. Desce um pouco quando o olhar sobe, e o Broto continua à vista. */}
      <g className="cena__chao">
        {/* Caminho da queda: termina na cratera, por isso fica no chão. */}
        <path d="M244 150 C 200 300, 120 380, 120 520" className="cena__rastro cena__nave-rastro" />

        {/* Régua da altura já subida. */}
        <g className="cena__regua">
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

        {/* O bairro em volta da praça, apagado. Na lição, a primeira janela acende. */}
        <g className="cena__bairro">
          {[[-170, 490, 56, 54], [-100, 476, 60, 66], [188, 488, 54, 56], [252, 470, 62, 72], [324, 492, 58, 52], [410, 484, 60, 60], [486, 496, 54, 50]].map(([x, y, w, h], i) => (
            <g key={i}>
              <path d={`M${x} ${y} l${w / 2} -${h * 0.45} l${w / 2} ${h * 0.45} v${h} h-${w}z`} className="cena__casa" />
              <rect x={x + w / 2 - 9} y={y + h * 0.25} width="18" height="18" rx="3" className={`cena__janela ${i === 3 ? "cena__janela--primeira" : ""}`} />
            </g>
          ))}
        </g>

        {/* Chão: morro de grama com a cratera da queda. */}
        <path d="M-200 545 Q -100 520 0 560 Q 100 520 200 540 T 400 530 T 600 540 V 900 H -200 Z" className="cena__grama" />
        <ellipse cx="120" cy="552" rx="54" ry="12" className="cena__cratera" />
        <g className="cena__fumaca">
          <circle cx="104" cy="530" r="9" /><circle cx="124" cy="518" r="11" /><circle cx="142" cy="532" r="8" />
        </g>

        {/* Música: notas que sobem perto do Broto. */}
        <g className="cena__notas">
          {[[150, 470], [190, 440], [130, 420], [210, 400]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} v-18 l12 -4 v18 M${x} ${y} a4 3 0 1 1 -1 -1 M${x + 12} ${y - 4} a4 3 0 1 1 -1 -1`}
              className="cena__nota" style={{ animationDelay: `${i * 0.7}s` }} />
          ))}
        </g>
      {/* Rastro da queda (abertura do capítulo). */}
        <path d="M640 -40 C 420 120, 200 300, 120 520" className="cena__queda-rastro" pathLength={1} />

        {/* O Broto: no chão, ao lado da cratera. A câmera leva ele junto. */}
        {ator && (
          <foreignObject x="58" y="440" width="124" height="120" className="cena__ator">
            <div className="cena__ator-caixa">{ator}</div>
          </foreignObject>
        )}
      </g>
    </svg>
  );
}
