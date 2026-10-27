interface LinkTelefoneProps {
  telefone: string
  rotulo: string
  descricao?: string
  destaque?: boolean
}

/** Link tel: com cara de botão. Funciona sem internet: quem liga é o próprio telefone. */
export function LinkTelefone({ telefone, rotulo, descricao, destaque = false }: LinkTelefoneProps) {
  return (
    <a className={`telefone ${destaque ? 'telefone--destaque' : ''}`} href={`tel:${telefone}`}>
      <span className="telefone__rotulo">{rotulo}</span>
      {descricao && <span className="telefone__descricao">{descricao}</span>}
    </a>
  )
}
