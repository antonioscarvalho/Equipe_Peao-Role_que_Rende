interface ReguaVontadeProps {
  rotulo: string
  valor: number | null
  aoEscolher: (valor: number) => void
}

const NIVEIS = Array.from({ length: 11 }, (_, i) => i)

/** Régua 0–10 como botões grandes, mais fácil de tocar e de usar com leitor de tela que um slider. */
export function ReguaVontade({ rotulo, valor, aoEscolher }: ReguaVontadeProps) {
  return (
    <fieldset className="regua">
      <legend className="regua__rotulo">{rotulo}</legend>
      <div className="regua__niveis">
        {NIVEIS.map((nivel) => (
          <button
            key={nivel}
            type="button"
            className="regua__nivel"
            aria-pressed={valor === nivel}
            aria-label={`${nivel} de 10`}
            onClick={() => aoEscolher(nivel)}
          >
            {nivel}
          </button>
        ))}
      </div>
      <div className="regua__legenda" aria-hidden="true">
        <span>nada</span>
        <span>muita</span>
      </div>
    </fieldset>
  )
}
