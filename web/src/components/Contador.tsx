interface ContadorProps {
  dias: number
  mes: string
  diasSemRegistro: number
}

/** O número vem sempre com a frase inteira, para o leitor de tela não ler só "12". */
export function Contador({ dias, mes, diasSemRegistro }: ContadorProps) {
  const frase = `${dias} ${dias === 1 ? 'dia' : 'dias'} sem apostar em ${mes}`
  return (
    <div className="contador">
      <p className="contador__numero" aria-hidden="true">
        {dias}
      </p>
      <p className="contador__frase">
        <span className="sr-only">{frase}</span>
        <span aria-hidden="true">{dias === 1 ? 'dia' : 'dias'} sem apostar em {mes}</span>
      </p>
      {diasSemRegistro > 0 && (
        <p className="nota">
          {diasSemRegistro} {diasSemRegistro === 1 ? 'dia' : 'dias'} deste mês ainda sem registro.
        </p>
      )}
    </div>
  )
}
