interface ChipsProps {
  legenda: string
  opcoes: string[]
  selecionados: string[]
  aoMudar: (selecionados: string[]) => void
  dica?: string
}

/** Seleção múltipla com botões grandes; o estado de cada um vai em aria-pressed. */
export function Chips({ legenda, opcoes, selecionados, aoMudar, dica }: ChipsProps) {
  const alternar = (opcao: string) =>
    aoMudar(selecionados.includes(opcao) ? selecionados.filter((s) => s !== opcao) : [...selecionados, opcao])

  return (
    <fieldset className="chips">
      <legend className="chips__legenda">{legenda}</legend>
      {dica && <p className="chips__dica">{dica}</p>}
      <div className="chips__lista">
        {opcoes.map((opcao) => (
          <button
            key={opcao}
            type="button"
            className="chip"
            aria-pressed={selecionados.includes(opcao)}
            onClick={() => alternar(opcao)}
          >
            {opcao}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
