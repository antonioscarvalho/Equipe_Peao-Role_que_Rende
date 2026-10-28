/** Erro de regra: a pessoa já tem o máximo de itens (5 planos, 3 contatos). */
export class LimiteAtingido extends Error {
  readonly limite: number

  constructor(limite: number) {
    super(`Limite de ${limite} itens atingido`)
    this.name = 'LimiteAtingido'
    this.limite = limite
  }
}
