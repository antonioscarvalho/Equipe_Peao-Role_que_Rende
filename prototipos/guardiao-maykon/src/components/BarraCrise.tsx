import { Link, useLocation } from 'react-router-dom'

/**
 * Atalho fixo para o protocolo de crise, em TODAS as telas (1 toque).
 * Skill seguranca-e-crise: saída para ajuda humana a ≤ 2 toques de qualquer lugar.
 */
export function BarraCrise() {
  const { pathname } = useLocation()
  if (pathname === '/crise') return null
  return (
    <div className="barra-crise">
      <Link to="/crise" className="barra-crise__link">
        Preciso de ajuda agora
      </Link>
    </div>
  )
}
