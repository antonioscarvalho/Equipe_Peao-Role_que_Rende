import { useEffect, useState } from 'react'

interface TimerOndaProps {
  segundos: number
  frases: string[]
  aoTerminar: () => void
}

const TROCA_FRASE_S = 20

function formatar(segundos: number): string {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Timer da onda (urge surfing). A respiração é só visual e para com prefers-reduced-motion (CSS).
 * O tempo restante não é anunciado a cada segundo: o leitor de tela ouve só a troca de frase.
 */
export function TimerOnda({ segundos, frases, aoTerminar }: TimerOndaProps) {
  const [restante, setRestante] = useState(segundos)

  useEffect(() => {
    if (restante <= 0) {
      aoTerminar()
      return
    }
    const id = window.setTimeout(() => setRestante((r) => r - 1), 1000)
    return () => window.clearTimeout(id)
  }, [restante, aoTerminar])

  const passados = segundos - restante
  const frase = frases[Math.floor(passados / TROCA_FRASE_S) % frases.length]

  return (
    <div className="onda">
      <div className="onda__circulo" aria-hidden="true" />
      <p className="onda__frase" aria-live="polite">
        {frase}
      </p>
      <p className="onda__tempo">
        <span className="sr-only">Tempo restante: </span>
        {formatar(restante)}
      </p>
    </div>
  )
}
