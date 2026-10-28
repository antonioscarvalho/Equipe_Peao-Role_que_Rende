/**
 * Camadas de roupa e acessórios do bichinho, desenhadas no mesmo viewBox 0 0 200 200 do Bichinho.
 * Arte original da Equipe Peão (sem asset de terceiros). Contorno azul-escuro, cores chapadas do guia.
 *
 * Referências do corpo: topo em y=50, laterais x 40–160, base y=178; olhos em (78,108) e (122,108);
 * boca entre y 130 e 146; broto saindo de (100,52).
 */

const CONTORNO = 'var(--rqr-azul-escuro)'
const traco = { stroke: CONTORNO, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

/** Contorno do corpo, usado como máscara para a roupa acompanhar o formato. */
export const CAMINHO_CORPO =
  'M100 50 C146 50 162 86 160 124 C158 160 132 178 100 178 C68 178 42 160 40 124 C38 86 54 50 100 50Z'

interface CamadaProps {
  id: string
  cor: string
  /** id do clipPath do corpo (único por instância). */
  recorte: string
}

/** Roupa: fica por cima do corpo e por baixo do rosto. */
export function Roupa({ id, cor, recorte }: CamadaProps) {
  switch (id) {
    case 'camiseta':
      return (
        <g className="bicho__roupa" data-item="camiseta">
          <g clipPath={`url(#${recorte})`}>
            <path d="M30 150 Q100 140 170 150 L170 200 L30 200Z" fill={cor} {...traco} />
          </g>
          <path d="M84 147 Q100 158 116 147" fill="none" {...traco} />
        </g>
      )
    case 'moletom':
      return (
        <g className="bicho__roupa" data-item="moletom">
          <g clipPath={`url(#${recorte})`}>
            <path d="M30 146 Q100 136 170 146 L170 200 L30 200Z" fill={cor} {...traco} />
            <path d="M76 168 Q100 160 124 168 L128 200 L72 200Z" fill={cor} {...traco} />
          </g>
          <path d="M92 146 L90 162 M108 146 L110 162" fill="none" {...traco} strokeWidth={3} />
          <circle cx="90" cy="164" r="2.5" fill={CONTORNO} />
          <circle cx="110" cy="164" r="2.5" fill={CONTORNO} />
        </g>
      )
    case 'jardineira':
      return (
        <g className="bicho__roupa" data-item="jardineira">
          <g clipPath={`url(#${recorte})`}>
            <path d="M30 160 Q100 152 170 160 L170 200 L30 200Z" fill={cor} {...traco} />
          </g>
          <path d="M80 148 L120 148 L122 162 L78 162Z" fill={cor} {...traco} />
          <path d="M80 150 L70 140 M120 150 L130 140" fill="none" {...traco} strokeWidth={5} stroke={cor} />
          <path d="M80 150 L70 140 M120 150 L130 140" fill="none" {...traco} strokeWidth={1.5} />
          <circle cx="84" cy="153" r="3" fill="var(--rqr-amarelo)" {...traco} strokeWidth={2} />
          <circle cx="116" cy="153" r="3" fill="var(--rqr-amarelo)" {...traco} strokeWidth={2} />
        </g>
      )
    case 'cachecol':
      return (
        <g className="bicho__roupa" data-item="cachecol">
          <path d="M50 144 C80 156 120 156 150 144 L148 158 C120 168 80 168 52 158Z" fill={cor} {...traco} />
          <path d="M126 158 L132 184 L118 182 L114 161" fill={cor} {...traco} />
          <path d="M120 170 L128 169 M118 176 L129 175" fill="none" {...traco} strokeWidth={2} />
        </g>
      )
    default:
      return null
  }
}

/** Acessório de cabeça. A flor do marco de 30 dias fica no broto. */
export function Cabeca({ id, cor }: Omit<CamadaProps, 'recorte'>) {
  switch (id) {
    case 'bone':
      return (
        <g className="bicho__cabeca" data-item="bone">
          <path d="M56 76 C56 44 144 44 144 76 Q100 68 56 76Z" fill={cor} {...traco} />
          <path d="M118 72 Q156 64 176 78 Q150 86 120 78Z" fill={cor} {...traco} />
          <circle cx="100" cy="50" r="4" fill={cor} {...traco} strokeWidth={3} />
        </g>
      )
    case 'gorro':
      return (
        <g className="bicho__cabeca" data-item="gorro">
          <path d="M54 80 C50 36 150 36 146 80Z" fill={cor} {...traco} />
          <rect x="48" y="72" width="104" height="16" rx="8" fill="var(--rqr-branco)" {...traco} />
          <path d="M76 52 L74 70 M100 46 L100 70 M124 52 L126 70" fill="none" {...traco} strokeWidth={2} opacity={0.5} />
        </g>
      )
    case 'laco':
      return (
        <g className="bicho__cabeca" data-item="laco">
          <path d="M136 64 L118 50 L120 76Z" fill={cor} {...traco} />
          <path d="M136 64 L154 50 L152 76Z" fill={cor} {...traco} />
          <circle cx="136" cy="64" r="6" fill={cor} {...traco} />
        </g>
      )
    case 'fones':
      return (
        <g className="bicho__cabeca" data-item="fones">
          <path d="M42 104 C38 40 162 40 158 104" fill="none" {...traco} strokeWidth={8} />
          <path d="M42 104 C38 40 162 40 158 104" fill="none" stroke={cor} strokeWidth={4} strokeLinecap="round" />
          <rect x="30" y="94" width="20" height="30" rx="9" fill={cor} {...traco} />
          <rect x="150" y="94" width="20" height="30" rx="9" fill={cor} {...traco} />
        </g>
      )
    case 'flor':
      return (
        <g className="bicho__cabeca" data-item="flor">
          {[0, 72, 144, 216, 288].map((graus) => (
            <ellipse
              key={graus}
              cx="100"
              cy="12"
              rx="6"
              ry="9"
              transform={`rotate(${graus} 100 22)`}
              fill="var(--rqr-rosa-claro)"
              {...traco}
              strokeWidth={3}
            />
          ))}
          <circle cx="100" cy="22" r="6" fill="var(--rqr-amarelo)" {...traco} strokeWidth={3} />
        </g>
      )
    default:
      return null
  }
}

/** Acessório de rosto. As lentes são translúcidas para os olhos (e o humor) continuarem visíveis. */
export function Rosto({ id }: { id: string }) {
  if (id !== 'oculos' && id !== 'oculos-sol') return null
  const lente = id === 'oculos-sol' ? { fill: 'var(--rqr-azul-escuro)', fillOpacity: 0.45 } : { fill: 'var(--rqr-branco)', fillOpacity: 0.25 }
  return (
    <g className="bicho__rosto-item" data-item={id}>
      <circle cx="78" cy="108" r="15" {...lente} {...traco} />
      <circle cx="122" cy="108" r="15" {...lente} {...traco} />
      <path d="M93 106 Q100 100 107 106 M63 104 L48 98 M137 104 L152 98" fill="none" {...traco} />
    </g>
  )
}

/** Peito: broche livre ou a estrela do marco de 90 dias. */
export function Peito({ id }: { id: string }) {
  switch (id) {
    case 'coracao':
      return (
        <path
          className="bicho__peito"
          data-item="coracao"
          d="M128 156 C128 150 136 148 138 154 C140 148 148 150 148 156 C148 162 140 166 138 170 C136 166 128 162 128 156Z"
          fill="var(--rqr-rosa-escuro)"
          {...traco}
          strokeWidth={3}
        />
      )
    case 'estrela':
      return (
        <path
          className="bicho__peito"
          data-item="estrela"
          d="M100 150 L104 159 L114 160 L106 166 L109 176 L100 170 L91 176 L94 166 L86 160 L96 159Z"
          fill="var(--rqr-amarelo)"
          {...traco}
          strokeWidth={3}
        />
      )
    default:
      return null
  }
}
