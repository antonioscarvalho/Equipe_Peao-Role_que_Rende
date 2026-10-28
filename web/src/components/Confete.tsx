import { useEffect, useState } from 'react'

/**
 * Explosão de confetes do centro para as laterais, ao concluir uma missão (esforço, nunca sorte).
 * Formas do tema (anel, triângulo, folha, pincelada, flor) com as cores rqr-*; sem dourado nem moedas.
 * Com "reduzir animações" ligado, não renderiza nada.
 */

const cores = [
  'var(--rqr-azul)',
  'var(--rqr-rosa-escuro)',
  'var(--rqr-roxo)',
  'var(--rqr-verde-agro)',
  'var(--rqr-amarelo)',
  'var(--rqr-azul-claro)',
  'var(--rqr-rosa-claro)',
]

const formas = ['anel', 'tri', 'folha', 'risco', 'flor'] as const
type Forma = (typeof formas)[number]

function Peca({ forma, cor }: { forma: Forma; cor: string }) {
  const traco = {
    stroke: 'var(--rqr-azul-escuro)',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (forma) {
    case 'anel':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="none" {...traco} stroke={cor} strokeWidth={5} />
        </svg>
      )
    case 'tri':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 3 L22 20 L2 20Z" fill={cor} {...traco} />
        </svg>
      )
    case 'folha':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M4 20 C4 8 12 3 21 3 C21 12 16 20 4 20Z" fill={cor} {...traco} />
        </svg>
      )
    case 'risco':
      return (
        <svg viewBox="0 0 30 14">
          <path d="M3 10 C9 2 13 12 19 5 S27 6 27 6" fill="none" {...traco} stroke={cor} strokeWidth={4} />
        </svg>
      )
    case 'flor':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" fill="none" {...traco} stroke={cor} />
        </svg>
      )
  }
}

const QTD = 34

function pseudoRandom(semente: number): number {
  const x = Math.sin(semente * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export function Confete({ disparo, reduzir }: { disparo: number; reduzir: boolean }) {
  const [disparoAtivo, setDisparoAtivo] = useState(0)

  useEffect(() => {
    if (!disparo || reduzir) return
    const idInicio = window.setTimeout(() => setDisparoAtivo(disparo), 0)
    const idFim = window.setTimeout(() => setDisparoAtivo(0), 1700)
    return () => {
      window.clearTimeout(idInicio)
      window.clearTimeout(idFim)
    }
  }, [disparo, reduzir])

  if (!disparoAtivo || reduzir) return null

  const pecas = Array.from({ length: QTD }, (_, i) => {
    const s = disparoAtivo * 100 + i
    const lado = i % 2 === 0 ? 1 : -1
    const angulo = (pseudoRandom(s + 1) * 70 - 45) * (Math.PI / 180)
    const dist = 38 + pseudoRandom(s + 2) * 18
    return {
      forma: formas[i % formas.length],
      cor: cores[(i * 3) % cores.length],
      dx: `${Math.cos(angulo) * dist * lado}vw`,
      dy: `${Math.sin(angulo) * dist * 0.9}vh`,
      queda: `${10 + pseudoRandom(s + 3) * 14}vh`,
      giro: `${(pseudoRandom(s + 4) * 540 + 180) * lado}deg`,
      tamanho: 14 + Math.round(pseudoRandom(s + 5) * 12),
      atraso: `${Math.round(pseudoRandom(s + 6) * 90)}ms`,
    }
  })

  return (
    <div className="confete" aria-hidden="true" key={disparoAtivo}>
      {pecas.map((p, i) => (
        <span
          key={i}
          className="confete__peca"
          style={{
            width: p.tamanho,
            height: p.tamanho,
            ['--dx' as string]: p.dx,
            ['--dy' as string]: p.dy,
            ['--queda' as string]: p.queda,
            ['--giro' as string]: p.giro,
            animationDelay: p.atraso,
          }}
        >
          <Peca forma={p.forma} cor={p.cor} />
        </span>
      ))}
    </div>
  )
}
