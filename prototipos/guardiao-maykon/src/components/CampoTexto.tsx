import { useId } from 'react'

interface CampoTextoProps {
  rotulo: string
  valor: string
  aoMudar: (v: string) => void
  dica?: string
  multilinha?: boolean
  tipo?: 'text' | 'tel' | 'number'
  modoTeclado?: 'text' | 'tel' | 'numeric' | 'decimal'
}

export function CampoTexto({ rotulo, valor, aoMudar, dica, multilinha, tipo = 'text', modoTeclado }: CampoTextoProps) {
  const id = useId()
  const idDica = `${id}-dica`
  return (
    <div className="campo">
      <label htmlFor={id} className="campo__rotulo">
        {rotulo}
      </label>
      {dica && (
        <p id={idDica} className="campo__dica">
          {dica}
        </p>
      )}
      {multilinha ? (
        <textarea
          id={id}
          className="campo__entrada"
          rows={3}
          value={valor}
          aria-describedby={dica ? idDica : undefined}
          onChange={(e) => aoMudar(e.target.value)}
        />
      ) : (
        <input
          id={id}
          className="campo__entrada"
          type={tipo}
          inputMode={modoTeclado}
          value={valor}
          aria-describedby={dica ? idDica : undefined}
          onChange={(e) => aoMudar(e.target.value)}
        />
      )}
    </div>
  )
}
