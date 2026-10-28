import { useId, type ReactNode } from 'react'

interface CartaoProps {
  titulo: string
  children: ReactNode
  /** Nível do título, para manter a hierarquia da tela em que o cartão entra. */
  nivel?: 2 | 3
}

export function Cartao({ titulo, children, nivel = 2 }: CartaoProps) {
  const id = useId()
  const Titulo = nivel === 2 ? 'h2' : 'h3'
  return (
    <section className="cartao" aria-labelledby={id}>
      <Titulo id={id} className="cartao__titulo">
        {titulo}
      </Titulo>
      {children}
    </section>
  )
}
