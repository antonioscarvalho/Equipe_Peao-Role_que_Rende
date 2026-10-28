import canaisJson from './canais-de-ajuda.json'
import prevencaoJson from './prevencao.json'
import sosJson from './sos.json'
import checkinJson from './checkin.json'
import metasJson from './metas.json'

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

export const conteudoCheckin = checkinJson

interface MetaJson {
  id: string
  nome: string
  plural: string
  valorReferencia: number | null
  status: 'confirmado' | 'conferir'
  verificado_em: string | null
  fonte: string
  link: string
}

export interface Meta extends MetaJson {
  valorReferencia: number
}

/** Igual aos canais de ajuda: meta só chega à tela com valor de referência conferido na fonte. */
export const metasConfirmadas: Meta[] = (metasJson.metas as MetaJson[]).filter(
  (m): m is Meta => m.status === 'confirmado' && typeof m.valorReferencia === 'number' && m.valorReferencia > 0,
)
/** Textos do plano Se/Então (F5) e do Círculo de Confiança (F8). */
export const conteudoPrevencao = prevencaoJson

/** Troca {chave} pelos valores. Ex.: preencher('Se {se}', { se: 'tédio' }). */
export function preencher(modelo: string, valores: Record<string, string>): string {
  return modelo.replace(/\{(\w+)\}/g, (trecho, chave: string) => valores[chave] ?? trecho)
}
