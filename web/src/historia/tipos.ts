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
  /** Opcional: conversa antes do jogo (apresentação, enredo). Sem ela, o capítulo começa pelo jogo. */
  antesDoJogo?: Passo[]
  /** Opcional: conversa depois da `falaAbertura` e antes das `perguntas`. */
  depoisDoJogo?: Passo[]
}

/**
 * Uma fala do Broto num roteiro. As opções voltam todas ao mesmo caminho (nada é salvo,
 * então nenhuma escolha muda o que vem depois). Inclua sempre uma opção para não responder
 * quando a pergunta for sobre a pessoa.
 * Na fala, `{nome}` vira o apelido da pessoa (", {nome}" some quando não há nome) e `{folhas}`
 * vira uma frase sobre as folhas do jogo.
 */
export interface Passo {
  fala: string
  /** Momento da arte de fundo (ver as cenas do capítulo). Fica valendo até outro passo mudar. */
  cena?: string
  humor?: 'calmo' | 'feliz' | 'cansado' | 'orgulhoso' | 'apoio'
  /** `som: "cantiga"` toca de novo a cantiga da Vó (ex.: resposta que cita "tum-tum, tá-rá"). */
  opcoes?: { rotulo: string; resposta?: string; abreCrise?: boolean; som?: 'cantiga' }[]
  /** Pergunta do app com tela própria (só a base implementa). */
  especial?: 'nome' | 'aparencia' | 'idade' | 'motivo' | 'meta' | 'guardar'
}

export interface PropsJogo {
  aoTerminar: (resultado: { folhas: number }) => void
  aoFechar: () => void
  reduzir: boolean
}
