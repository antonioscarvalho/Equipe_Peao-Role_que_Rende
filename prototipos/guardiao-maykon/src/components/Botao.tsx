import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type VarianteBotao = 'primario' | 'secundario' | 'sos' | 'discreto'

interface BotaoProps {
  children: ReactNode
  variante?: VarianteBotao
  /** Se tiver `para`, vira link interno. Se tiver `href`, link externo (tel:, https:). */
  para?: string
  href?: string
  onClick?: () => void
  tipo?: 'button' | 'submit'
  desabilitado?: boolean
  larguraTotal?: boolean
  rotuloAcessivel?: string
}

export function Botao({
  children,
  variante = 'primario',
  para,
  href,
  onClick,
  tipo = 'button',
  desabilitado,
  larguraTotal,
  rotuloAcessivel,
}: BotaoProps) {
  const classe = `botao botao--${variante}${larguraTotal ? ' botao--total' : ''}`
  if (para) {
    return (
      <Link className={classe} to={para} aria-label={rotuloAcessivel} onClick={onClick}>
        {children}
      </Link>
    )
  }
  if (href) {
    const externo = href.startsWith('http')
    return (
      <a
        className={classe}
        href={href}
        aria-label={rotuloAcessivel}
        onClick={onClick}
        {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <button className={classe} type={tipo} onClick={onClick} disabled={desabilitado} aria-label={rotuloAcessivel}>
      {children}
    </button>
  )
}
