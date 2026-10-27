import canaisJson from './canais-de-ajuda.json'
import sosJson from './sos.json'

export interface CanalDeAjuda {
  id: string
  nome: string
  rotulo: string
  telefone?: string
  descricao: string
  url?: string
  status: 'confirmado' | 'conferir'
  verificado_em: string | null
  fonte: string
}

export interface CardExame {
  id: string
  titulo: string
  pensamento: string
  perguntas: string[]
}

/** Só canais confirmados chegam à tela. Os marcados "conferir" esperam alguém validar a fonte. */
export const canaisDeAjuda: CanalDeAjuda[] = (canaisJson.canais as CanalDeAjuda[]).filter(
  (canal) => canal.status === 'confirmado',
)

export function canal(id: string): CanalDeAjuda {
  const encontrado = canaisDeAjuda.find((c) => c.id === id)
  if (!encontrado) throw new Error(`Canal de ajuda "${id}" não está confirmado no conteúdo`)
  return encontrado
}

export const conteudoSos = sosJson as {
  revisaoClinica: string
  duracaoOndaSegundos: number
  frasesOnda: string[]
  validacaoCard: string
  cards: CardExame[]
  acoes: string[]
}
