import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface PaginaProps {
  titulo: string
  children: ReactNode
  voltarPara?: string
  /** Telas de crise e SOS ficam sem decoração, só o essencial. */
  calma?: boolean
}

/** Moldura de toda tela: título único (h1), foco no título ao trocar de tela, link de voltar. */
export function Pagina({ titulo, children, voltarPara, calma }: PaginaProps) {
  const h1 = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    document.title = `${titulo} · Guardião`
    h1.current?.focus()
  }, [titulo])
  return (
    <main id="conteudo" className={`pagina${calma ? ' pagina--calma' : ''}`}>
      {voltarPara && (
        <Link className="pagina__voltar" to={voltarPara}>
          <span aria-hidden="true">←</span> Voltar
        </Link>
      )}
      <h1 ref={h1} tabIndex={-1} className="pagina__titulo">
        {titulo}
      </h1>
      {children}
    </main>
  )
}
