interface ChipsProps {
  legenda: string
  opcoes: string[]
  selecionados: string[]
  aoMudar: (selecionados: string[]) => void
}

/** Seleção múltipla em chips. Cada chip é um botão com aria-pressed. */
export function Chips({ legenda, opcoes, selecionados, aoMudar }: ChipsProps) {
  function alternar(opcao: string) {
    aoMudar(selecionados.includes(opcao) ? selecionados.filter((s) => s !== opcao) : [...selecionados, opcao])
  }
  return (
    <fieldset className="chips">
      <legend className="chips__legenda">{legenda}</legend>
      <div className="chips__lista">
        {opcoes.map((o) => (
          <button
            key={o}
            type="button"
            className="chip"
            aria-pressed={selecionados.includes(o)}
            onClick={() => alternar(o)}
          >
            {selecionados.includes(o) && <span aria-hidden="true">✓ </span>}
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
