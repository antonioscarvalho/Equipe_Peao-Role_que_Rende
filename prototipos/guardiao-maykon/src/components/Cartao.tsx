import type { ReactNode } from 'react'

interface CartaoProps {
  titulo?: string
  children: ReactNode
  destaque?: boolean
  nivelTitulo?: 2 | 3
}

export function Cartao({ titulo, children, destaque, nivelTitulo = 2 }: CartaoProps) {
  const Titulo = nivelTitulo === 2 ? 'h2' : 'h3'
  return (
    <section className={`cartao${destaque ? ' cartao--destaque' : ''}`}>
      {titulo && <Titulo className="cartao__titulo">{titulo}</Titulo>}
      {children}
    </section>
  )
}
