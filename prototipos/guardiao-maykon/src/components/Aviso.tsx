import type { ReactNode } from 'react'

interface AvisoProps {
  children: ReactNode
  tipo?: 'info' | 'atencao'
}

/** Caixa de informação. A cor nunca é a única pista: o rótulo diz o tipo. */
export function Aviso({ children, tipo = 'info' }: AvisoProps) {
  return (
    <div className={`aviso aviso--${tipo}`} role={tipo === 'atencao' ? 'note' : undefined}>
      <strong className="aviso__rotulo">{tipo === 'atencao' ? 'Atenção:' : 'Saiba:'}</strong> {children}
    </div>
  )
}
