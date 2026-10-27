import { useEffect, useState } from 'react'

/**
 * Respiração guiada lenta (urge surfing). Ciclo de 10 s: 4 s inspirando, 6 s soltando.
 * Com movimento reduzido, o círculo fica parado e só o texto muda.
 * Skill prevencao-recaida; nunca substitui as opções de ajuda humana.
 */
const INSPIRA_MS = 4000
const SOLTA_MS = 6000

export function Respiracao({ ativa = true }: { ativa?: boolean }) {
  const [fase, setFase] = useState<'inspire' | 'solte'>('inspire')

  useEffect(() => {
    if (!ativa) return
    const t = setTimeout(() => setFase((f) => (f === 'inspire' ? 'solte' : 'inspire')), fase === 'inspire' ? INSPIRA_MS : SOLTA_MS)
    return () => clearTimeout(t)
  }, [fase, ativa])

  return (
    <div className="respiracao">
      <div className={`respiracao__circulo respiracao__circulo--${fase}`} aria-hidden="true" />
      <p className="respiracao__texto" aria-live="polite">
        {fase === 'inspire' ? 'Inspire devagar…' : 'Solte o ar devagar…'}
      </p>
    </div>
  )
}
