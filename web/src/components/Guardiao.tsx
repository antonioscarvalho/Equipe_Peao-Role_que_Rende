/**
 * Guardião: companheiro visual não punitivo (Spec 002).
 * Cresce em marcos anunciados (7, 30, 90 dias). Nunca adoece, nunca morre, nunca some.
 * Skill design-etico-saude-digital: sem recompensa aleatória, sem item colecionável.
 * Cores do guia-estilo-role-que-rende.
 */
interface GuardiaoProps {
  estagio: 0 | 1 | 2 | 3
  /** "acolhendo" aparece depois de um registro de aposta: braços abertos, nunca triste ou doente. */
  humor?: 'tranquilo' | 'acolhendo'
  tamanho?: number
}

const DESCRICAO = [
  'Guardião pequeno, começando a jornada com você.',
  'Guardião com um cachecol rosa: marco de 7 dias.',
  'Guardião com cachecol e um broto amarelo ao lado: marco de 30 dias.',
  'Guardião com cachecol, broto e uma estrela no peito: marco de 90 dias.',
]

export function Guardiao({ estagio, humor = 'tranquilo', tamanho = 140 }: GuardiaoProps) {
  const escala = 0.85 + estagio * 0.05
  const descricao = `${DESCRICAO[estagio]}${humor === 'acolhendo' ? ' Ele está de braços abertos, acolhendo você.' : ''}`

  return (
    <svg
      className="guardiao"
      width={tamanho}
      height={tamanho}
      viewBox="0 0 200 200"
      role="img"
      aria-label={descricao}
    >
      <ellipse cx="100" cy="186" rx="56" ry="8" fill="var(--rqr-cinza-100, #F0F2F4)" />
      {estagio >= 2 && (
        <g aria-hidden="true">
          <path d="M168 182 C 168 160, 170 150, 166 138" stroke="var(--rqr-azul-escuro)" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M166 150 C 152 146, 150 134, 160 130 C 168 136, 170 144, 166 150 Z" fill="var(--rqr-amarelo)" stroke="var(--rqr-azul-escuro)" strokeWidth="4" strokeLinejoin="round" />
          <path d="M167 140 C 178 132, 186 136, 184 146 C 176 150, 170 147, 167 140 Z" fill="var(--rqr-amarelo)" stroke="var(--rqr-azul-escuro)" strokeWidth="4" strokeLinejoin="round" />
        </g>
      )}
      <g transform={`translate(100 112) scale(${escala}) translate(-100 -112)`}>
        {humor === 'acolhendo' ? (
          <g aria-hidden="true" stroke="var(--rqr-azul-escuro)" strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M44 112 C 26 100, 22 84, 26 72" />
            <path d="M156 112 C 174 100, 178 84, 174 72" />
          </g>
        ) : (
          <g aria-hidden="true" stroke="var(--rqr-azul-escuro)" strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M46 120 C 34 128, 32 140, 38 148" />
            <path d="M154 120 C 166 128, 168 140, 162 148" />
          </g>
        )}
        <path
          d="M100 40 C 140 40, 158 72, 158 112 C 158 152, 134 176, 100 176 C 66 176, 42 152, 42 112 C 42 72, 60 40, 100 40 Z"
          fill="var(--rqr-azul-claro)"
          stroke="var(--rqr-azul-escuro)"
          strokeWidth="6"
        />
        <path d="M70 66 C 80 56, 96 52, 110 54" stroke="var(--rqr-branco)" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />
        <circle cx="80" cy="102" r="8" fill="var(--rqr-azul-escuro)" />
        <circle cx="120" cy="102" r="8" fill="var(--rqr-azul-escuro)" />
        <circle cx="83" cy="99" r="2.5" fill="var(--rqr-branco)" />
        <circle cx="123" cy="99" r="2.5" fill="var(--rqr-branco)" />
        <circle cx="68" cy="122" r="7" fill="var(--rqr-rosa-claro)" />
        <circle cx="132" cy="122" r="7" fill="var(--rqr-rosa-claro)" />
        <path d="M86 126 C 94 134, 106 134, 114 126" stroke="var(--rqr-azul-escuro)" strokeWidth="5" strokeLinecap="round" fill="none" />
        {estagio >= 1 && (
          <g aria-hidden="true">
            <path d="M52 144 C 80 156, 120 156, 148 144 L 146 158 C 120 168, 80 168, 54 158 Z" fill="var(--rqr-rosa-escuro)" stroke="var(--rqr-azul-escuro)" strokeWidth="4" strokeLinejoin="round" />
            <path d="M128 158 L 132 182 L 118 180 L 116 160" fill="var(--rqr-rosa-escuro)" stroke="var(--rqr-azul-escuro)" strokeWidth="4" strokeLinejoin="round" />
          </g>
        )}
        {estagio >= 3 && (
          <path
            aria-hidden="true"
            d="M100 134 L 104 143 L 114 144 L 106 150 L 109 160 L 100 154 L 91 160 L 94 150 L 86 144 L 96 143 Z"
            fill="var(--rqr-amarelo)"
            stroke="var(--rqr-azul-escuro)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        )}
      </g>
    </svg>
  )
}
