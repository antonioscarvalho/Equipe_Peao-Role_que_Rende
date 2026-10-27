import { useId } from 'react'

interface Escala0a10Props {
  pergunta: string
  valor: number | null
  aoMudar: (v: number) => void
  rotuloMin?: string
  rotuloMax?: string
}

/** Régua de 0 a 10 como grupo de opções, navegável por teclado e leitor de tela. */
export function Escala0a10({ pergunta, valor, aoMudar, rotuloMin = 'nada', rotuloMax = 'muito' }: Escala0a10Props) {
  const id = useId()
  return (
    <fieldset className="escala">
      <legend className="escala__pergunta" id={id}>
        {pergunta}
      </legend>
      <div className="escala__opcoes">
        {Array.from({ length: 11 }, (_, n) => (
          <label key={n} className={`escala__opcao${valor === n ? ' escala__opcao--marcada' : ''}`}>
            <input type="radio" name={id} value={n} checked={valor === n} onChange={() => aoMudar(n)} />
            <span>{n}</span>
          </label>
        ))}
      </div>
      <div className="escala__rotulos" aria-hidden="true">
        <span>0 = {rotuloMin}</span>
        <span>10 = {rotuloMax}</span>
      </div>
    </fieldset>
  )
}
