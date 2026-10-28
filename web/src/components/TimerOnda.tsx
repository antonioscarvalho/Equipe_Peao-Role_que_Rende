import { useEffect, useState } from 'react'
import { Bichinho } from '@/components/Bichinho'

interface TimerOndaProps {
  segundos: number
  frases: string[]
  aoTerminar: () => void
}

const TROCA_FRASE_S = 20

const fases446 = [
  { nome: 'Inspire', seg: 4, classe: 'inspira' },
  { nome: 'Segure', seg: 4, classe: 'segura' },
  { nome: 'Solte devagar', seg: 6, classe: 'expira' },
] as const

const DURACAO_CICLO = 14 // 4 + 4 + 6

function formatar(segundos: number): string {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Timer da onda (urge surfing) com ciclo de respiração 4-4-6 guiada.
 * O tempo restante não é anunciado a cada segundo: o leitor de tela ouve só a troca de frase.
 */
export function TimerOnda({ segundos, frases, aoTerminar }: TimerOndaProps) {
  const [restante, setRestante] = useState(segundos)
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMontado(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (restante <= 0) {
      aoTerminar()
      return
    }
    const id = window.setTimeout(() => setRestante((r) => r - 1), 1000)
    return () => window.clearTimeout(id)
  }, [restante, aoTerminar])

  const passados = segundos - restante
  const posNoCiclo = passados % DURACAO_CICLO
  const faseAtual =
    posNoCiclo < 4
      ? { ...fases446[0], restaFase: 4 - posNoCiclo }
      : posNoCiclo < 8
        ? { ...fases446[1], restaFase: 8 - posNoCiclo }
        : { ...fases446[2], restaFase: 14 - posNoCiclo }

  const frase = frases[Math.floor(passados / TROCA_FRASE_S) % frases.length]

  return (
    <div className="onda-container">
      <div
        className={`onda onda--${montado ? faseAtual.classe : 'expira'}`}
        style={{ ['--dur' as string]: `${faseAtual.seg}s` }}
        aria-label="Exercício de respiração e urge surfing"
      >
        <span className="onda__anel onda__anel--1" aria-hidden="true" />
        <span className="onda__anel onda__anel--2" aria-hidden="true" />
        <div className="onda__centro" aria-hidden="true">
          <Bichinho humor="apoio" nivel={1} tamanho={140} />
        </div>
      </div>
      <p className="onda__fase-446" aria-hidden="true">
        {faseAtual.nome} <b>{faseAtual.restaFase}</b>
      </p>
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
