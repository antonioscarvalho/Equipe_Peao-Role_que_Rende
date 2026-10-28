interface ContadorProps {
  dias: number
  /** Já por extenso ("27 de outubro"); sem ele a frase não diz desde quando. */
  desde: string | null
  noMes: number
  sequencia: number
  diasSemRegistro: number
}

const dias = (n: number) => `${n} ${n === 1 ? 'dia' : 'dias'}`

/** O número vem sempre com a frase inteira, para o leitor de tela não ler só "12". */
export function Contador({ dias: total, desde, noMes, sequencia, diasSemRegistro }: ContadorProps) {
  const complemento = desde ? ` desde ${desde}` : ''
  // Sequência zerada não aparece: depois de um lapso, "sequência atual: 0" soa como placar perdido.
  const detalhe = [`${noMes} neste mês`, sequencia > 0 && `sequência atual: ${dias(sequencia)}`].filter(Boolean).join(' · ')
  return (
    <div className="contador">
      <p className="contador__numero" aria-hidden="true">
        {total}
      </p>
      <p className="contador__frase">
        <span className="sr-only">{`${dias(total)} sem apostar${complemento}`}</span>
        <span aria-hidden="true">
          {total === 1 ? 'dia' : 'dias'} sem apostar{complemento}
        </span>
      </p>
      <p className="contador__detalhe">{detalhe}</p>
      {diasSemRegistro > 0 && (
        <p className="nota">
          {dias(diasSemRegistro)} deste mês ainda sem registro.
        </p>
      )}
    </div>
  )
}
