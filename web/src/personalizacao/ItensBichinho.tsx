/**
 * Camadas de roupa e acessórios do bichinho, desenhadas no mesmo viewBox 0 0 200 200 do Bichinho.
 * Arte original da Equipe Peão (sem asset de terceiros), no estilo livro ilustrado dos cenários
 * (skill estilo-livro-ilustrado): contorno de tinta, volume com sombra e luz, costura e textura,
 * e o mesmo filtro de pincel do corpo (`pincel`).
 *
 * Referências do corpo: topo em y=50, laterais x 40–160, base y=178; olhos em (78,108) e (122,108);
 * boca entre y 130 e 146; broto saindo de (100,52). Os braços giram com o humor, por isso a roupa
 * fica só no corpo (sem mangas).
 */

const CONTORNO = 'var(--rqr-azul-escuro)'
const CREME = '#FFFCF4'
const SOMBRA = 'rgb(27 26 69 / .2)'
const LUZ = 'rgb(255 255 255 / .45)'
const traco = { stroke: CONTORNO, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
const fino = { ...traco, strokeWidth: 2.5 }
const linha = (cor: string, largura: number) => ({ fill: 'none', stroke: cor, strokeWidth: largura, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const })

/** Contorno do corpo, usado como máscara para a roupa acompanhar o formato. */
export const CAMINHO_CORPO =
  'M100 50 C146 50 162 86 160 124 C158 160 132 178 100 178 C68 178 42 160 40 124 C38 86 54 50 100 50Z'

interface CamadaProps {
  id: string
  cor: string
  /** id do clipPath do corpo (único por instância). */
  recorte: string
  /** id do filtro de pincel do corpo, para a roupa ter a mesma textura. */
  pincel?: string
}

const filtro = (pincel?: string) => (pincel ? `url(#${pincel})` : undefined)

/** Roupa: fica por cima do corpo e por baixo do rosto. */
export function Roupa({ id, cor, recorte, pincel }: CamadaProps) {
  switch (id) {
    case 'camiseta':
      return (
        <g className="bicho__roupa" data-item="camiseta" filter={filtro(pincel)}>
          <g clipPath={`url(#${recorte})`}>
            <path d="M20 150 Q100 136 180 150 L180 200 L20 200Z" fill={cor} {...traco} />
            <path d="M20 172 Q100 160 180 172 L180 200 L20 200Z" fill={SOMBRA} />
            <path d="M50 158 Q58 153 68 154" {...linha(LUZ, 4)} />
          </g>
          {/* Gola redonda canelada */}
          <path d="M78 144 Q100 164 122 144 Q100 155 78 144Z" fill={CREME} {...fino} />
          {/* Estampa: um brotinho */}
          <circle cx="100" cy="166" r="7.5" fill={CREME} {...fino} />
          <path d="M100 170 V162 M100 165 Q95 160 93 163 M100 164 Q105 159 107 162" {...linha(CONTORNO, 2)} />
        </g>
      )
    case 'moletom':
      return (
        <g className="bicho__roupa" data-item="moletom" filter={filtro(pincel)}>
          <g clipPath={`url(#${recorte})`}>
            <path d="M20 148 Q100 134 180 148 L180 200 L20 200Z" fill={cor} {...traco} />
            <path d="M20 176 Q100 166 180 176 L180 200 L20 200Z" fill={SOMBRA} />
            {/* Bolso canguru */}
            <path d="M68 174 Q100 166 132 174 L138 200 L62 200Z" fill={cor} {...fino} />
            <path d="M70 178 Q100 171 130 178" {...linha(SOMBRA, 3)} />
          </g>
          {/* Capuz dobrado em volta do pescoço */}
          <path d="M54 152 Q100 140 146 152 Q140 166 100 166 Q60 166 54 152Z" fill={cor} {...traco} />
          <path d="M60 158 Q100 150 140 158" {...linha(SOMBRA, 3)} />
          <path d="M62 153 Q68 149 76 148" {...linha(LUZ, 3)} />
          {/* Cordões */}
          <path d="M92 162 L90 176 M108 162 L110 176" {...linha(CONTORNO, 5)} />
          <path d="M92 162 L90 176 M108 162 L110 176" {...linha(CREME, 2.5)} />
          <circle cx="90" cy="178" r="3.5" fill={CREME} {...fino} strokeWidth={2} />
          <circle cx="110" cy="178" r="3.5" fill={CREME} {...fino} strokeWidth={2} />
        </g>
      )
    case 'jardineira':
      return (
        <g className="bicho__roupa" data-item="jardineira" filter={filtro(pincel)}>
          <g clipPath={`url(#${recorte})`}>
            <path d="M20 162 Q100 152 180 162 L180 200 L20 200Z" fill={cor} {...traco} />
            <path d="M20 180 Q100 172 180 180 L180 200 L20 200Z" fill={SOMBRA} />
            <path d="M28 168 Q100 158 172 168" {...linha(CREME, 2)} strokeDasharray="4 5" />
          </g>
          {/* Alças */}
          <path d="M80 152 Q72 146 62 144 M120 152 Q128 146 138 144" {...linha(CONTORNO, 10)} />
          <path d="M80 152 Q72 146 62 144 M120 152 Q128 146 138 144" {...linha(cor, 5)} />
          {/* Peitilho com bolsinho costurado */}
          <path d="M76 150 Q100 146 124 150 L126 168 L74 168Z" fill={cor} {...traco} />
          <path d="M90 155 H110 V162 Q100 166 90 162Z" {...linha(CREME, 2)} strokeDasharray="3 3" />
          <circle cx="80" cy="154" r="4" fill="var(--rqr-amarelo)" {...fino} strokeWidth={2} />
          <circle cx="120" cy="154" r="4" fill="var(--rqr-amarelo)" {...fino} strokeWidth={2} />
        </g>
      )
    case 'cachecol': {
      const faixa = `${recorte}-cachecol`
      const caminhoFaixa = 'M40 138 C74 158 126 158 160 138 L162 155 C126 176 74 176 38 155Z'
      return (
        <g className="bicho__roupa" data-item="cachecol" filter={filtro(pincel)}>
          <defs>
            <clipPath id={faixa}><path d={caminhoFaixa} /></clipPath>
          </defs>
          {/* Faixa enrolada no pescoço, com listras e canelado de tricô */}
          <path d={caminhoFaixa} fill={cor} />
          <g clipPath={`url(#${faixa})`}>
            <path d="M38 146 C74 166 126 166 162 146" {...linha(CREME, 5)} />
            {Array.from({ length: 11 }, (_, i) => 46 + i * 11).map((x) => (
              <path key={x} d={`M${x} 136 L${x - 2} 178`} {...linha(SOMBRA, 2)} />
            ))}
            <path d="M38 162 C74 182 126 182 162 162 L162 190 L38 190Z" fill={SOMBRA} />
          </g>
          <path d={caminhoFaixa} fill="none" {...traco} />
          {/* Ponta caindo, com listra e franja */}
          <path d="M100 160 C98 172 100 184 98 194 L116 192 C114 182 116 170 114 160Z" fill={cor} {...traco} />
          <path d="M99 180 L115 178" {...linha(CREME, 4)} />
          <path d="M102 195 v7 M106 195 v7 M110 194 v7 M114 193 v7" {...linha(CONTORNO, 2.5)} />
          {/* Nó */}
          <ellipse cx="107" cy="160" rx="11" ry="8" fill={cor} {...traco} />
          <path d="M100 158 Q104 155 108 156" {...linha(LUZ, 2.5)} />
        </g>
      )
    }
    default:
      return null
  }
}

/** Acessório de cabeça. A flor do marco de 30 dias fica no broto. O broto sempre aparece por cima. */
export function Cabeca({ id, cor, pincel }: Omit<CamadaProps, 'recorte'>) {
  switch (id) {
    case 'bone':
      return (
        <g className="bicho__cabeca" data-item="bone" filter={filtro(pincel)}>
          <path d="M54 76 C52 40 148 40 146 76 Q100 66 54 76Z" fill={cor} {...traco} />
          <path d="M56 74 C55 58 62 50 74 46 C67 56 65 64 66 73Z" fill={SOMBRA} />
          <path d="M100 49 Q86 58 82 71 M100 49 Q114 58 118 71" {...linha(SOMBRA, 2.5)} />
          {/* Aba */}
          <path d="M116 72 Q154 60 182 76 Q158 90 118 81Z" fill={cor} {...traco} />
          <path d="M120 80 Q156 88 178 78 Q160 92 120 84Z" fill={SOMBRA} />
          {/* Botão do topo e escudinho de folha */}
          <circle cx="100" cy="49" r="4.5" fill={cor} {...fino} />
          <circle cx="82" cy="62" r="7" fill={CREME} {...fino} />
          <path d="M79 65 Q80 58 86 58 Q85 64 79 65Z" fill="var(--rqr-verde-agro)" stroke={CONTORNO} strokeWidth={1.5} strokeLinejoin="round" />
        </g>
      )
    case 'gorro':
      return (
        <g className="bicho__cabeca" data-item="gorro" filter={filtro(pincel)}>
          <path d="M54 80 C52 46 148 46 146 80Z" fill={cor} {...traco} />
          {/* Pontos de tricô */}
          {[[70, 60], [86, 56], [102, 55], [118, 57], [132, 62], [78, 70], [94, 67], [110, 67], [126, 70]].map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x - 4} ${y - 3} L${x} ${y + 2} L${x + 4} ${y - 3}`} {...linha(SOMBRA, 2)} />
          ))}
          {/* Barra canelada */}
          <rect x="47" y="72" width="106" height="18" rx="9" fill={cor} {...traco} />
          {Array.from({ length: 12 }, (_, i) => 56 + i * 8).map((x) => (
            <path key={x} d={`M${x} 76 V86`} {...linha(SOMBRA, 2.5)} />
          ))}
          <path d="M54 76 Q60 74 66 74" {...linha(LUZ, 2.5)} />
          {/* Pompom de lado, para o broto continuar à mostra */}
          <path d="M144 42 q6 -2 8 4 q6 0 5 7 q5 4 0 9 q1 7 -6 7 q-3 5 -9 2 q-6 2 -7 -4 q-6 -3 -2 -9 q-2 -6 4 -9 q2 -6 7 -7Z"
            fill={CREME} {...fino} />
          <path d="M141 58 q4 3 9 1" {...linha(SOMBRA, 2)} />
        </g>
      )
    case 'laco':
      return (
        <g className="bicho__cabeca" data-item="laco" filter={filtro(pincel)}>
          <path d="M131 64 C116 46 100 56 108 68 C102 80 120 82 131 68Z" fill={cor} {...traco} />
          <path d="M141 64 C156 46 172 56 164 68 C170 80 152 82 141 68Z" fill={cor} {...traco} />
          <path d="M127 64 Q117 60 112 64 M145 64 Q155 60 160 64" {...linha(SOMBRA, 2.5)} />
          <path d="M131 70 L125 88 L131 85 L134 91 L137 71Z" fill={cor} {...fino} />
          <rect x="129" y="58" width="14" height="13" rx="5" fill={cor} {...traco} />
          <path d="M132 61 Q135 59 138 60" {...linha(LUZ, 2)} />
        </g>
      )
    case 'fones':
      return (
        <g className="bicho__cabeca" data-item="fones" filter={filtro(pincel)}>
          <path d="M40 108 C34 36 166 36 160 108" {...linha(CONTORNO, 11)} />
          <path d="M40 108 C34 36 166 36 160 108" {...linha(cor, 6)} />
          <path d="M58 64 C70 50 84 46 96 45" {...linha(LUZ, 2.5)} />
          {/* Conchas com almofada */}
          <rect x="24" y="92" width="24" height="38" rx="11" fill={cor} {...traco} />
          <rect x="42" y="97" width="9" height="28" rx="4.5" fill={CREME} {...fino} />
          <rect x="152" y="92" width="24" height="38" rx="11" fill={cor} {...traco} />
          <rect x="149" y="97" width="9" height="28" rx="4.5" fill={CREME} {...fino} />
          <path d="M30 100 V112 M170 100 V112" {...linha(LUZ, 2.5)} />
        </g>
      )
    case 'flor':
      return (
        <g className="bicho__cabeca" data-item="flor" filter={filtro(pincel)}>
          {[0, 72, 144, 216, 288].map((graus) => (
            <ellipse key={graus} cx="100" cy="11" rx="6.5" ry="9.5" transform={`rotate(${graus} 100 22)`}
              fill="var(--rqr-rosa-claro)" {...traco} strokeWidth={3} />
          ))}
          <circle cx="100" cy="22" r="6" fill="var(--rqr-amarelo)" {...traco} strokeWidth={3} />
          <circle cx="98" cy="20" r="1.8" fill={LUZ} />
        </g>
      )
    default:
      return null
  }
}

/** Acessório de rosto. As lentes são translúcidas para os olhos (e o humor) continuarem visíveis. */
export function Rosto({ id }: { id: string }) {
  if (id !== 'oculos' && id !== 'oculos-sol') return null
  const escuro = id === 'oculos-sol'
  const lente = escuro ? { fill: 'var(--rqr-azul-escuro)', fillOpacity: 0.5 } : { fill: CREME, fillOpacity: 0.22 }
  return (
    <g className="bicho__rosto-item" data-item={id}>
      <circle cx="78" cy="108" r="15" {...lente} {...traco} />
      <circle cx="122" cy="108" r="15" {...lente} {...traco} />
      <path d="M93 106 Q100 100 107 106 M63 104 L48 98 M137 104 L152 98" fill="none" {...traco} />
      {/* Reflexo da luz nas lentes */}
      <path d="M69 102 Q72 97 78 96 M113 102 Q116 97 122 96" {...linha(escuro ? 'rgb(255 255 255 / .6)' : 'rgb(255 255 255 / .85)', 2.5)} />
    </g>
  )
}

/** Peito: broche livre ou a estrela do marco de 90 dias. */
export function Peito({ id }: { id: string }) {
  switch (id) {
    case 'coracao':
      return (
        <g className="bicho__peito" data-item="coracao">
          <path
            d="M128 156 C128 149 137 147 139 154 C141 147 150 149 150 156 C150 163 141 167 139 172 C137 167 128 163 128 156Z"
            fill="var(--rqr-rosa-escuro)" {...traco} strokeWidth={3}
          />
          <path d="M132 155 Q133 152 136 152" {...linha(LUZ, 2)} />
        </g>
      )
    case 'estrela':
      return (
        <g className="bicho__peito" data-item="estrela">
          <path
            d="M100 149 L104.5 158.5 L115 159.5 L107 166.5 L109.5 177 L100 171.5 L90.5 177 L93 166.5 L85 159.5 L95.5 158.5Z"
            fill="var(--rqr-amarelo)" {...traco} strokeWidth={3}
          />
          <path d="M96 161 L99 156" {...linha(LUZ, 2)} />
        </g>
      )
    default:
      return null
  }
}
