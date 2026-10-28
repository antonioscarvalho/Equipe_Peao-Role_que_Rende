/**
 * Contrato da história do Broto (docs/05-processo/historia-divisao.md).
 * Quem mudar este arquivo avisa no grupo: todos os capítulos e jogos dependem dele.
 */
export type IdCapitulo = 'cap1' | 'cap2' | 'cap3' | 'cap4' | 'cap5' | 'cap6' | 'epilogo'

export interface Capitulo {
  id: IdCapitulo
  titulo: string
  falaAbertura: string
  perguntas: { pergunta: string; resposta: string }[]
  perguntaDoBroto: {
    texto: string
    opcoes: { rotulo: string; resposta: string; abreCrise?: boolean }[]
  }
  oferta?: { rotulo: string; acao: string }
  licao: string
}

export interface PropsJogo {
  aoTerminar: (resultado: { folhas: number }) => void
  aoFechar: () => void
  reduzir: boolean
}
