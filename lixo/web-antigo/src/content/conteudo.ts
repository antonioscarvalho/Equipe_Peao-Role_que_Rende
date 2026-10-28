import canaisJson from './canais-de-ajuda.json'
import prevencaoJson from './prevencao.json'
import sosJson from './sos.json'
import checkinJson from './checkin.json'
import metasJson from './metas.json'
import dinheiroJson from './dinheiro.json'
import demoOpenFinanceJson from './open-finance-demo.json'
import pausasJson from './pausas.json'

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

export interface MetaJson {
  id: string
  nome: string
  plural: string
  valorReferencia: number | null
  status: 'confirmado' | 'conferir'
  verificado_em: string | null
  fonte: string
  /** Versão curta da fonte, mostrada na tela junto do valor. */
  rotuloFonte?: string
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

export const conteudoDinheiro = dinheiroJson

/** Dados e textos da demonstração de Open Finance (Spec 007). */
export const conteudoOpenFinanceDemo = demoOpenFinanceJson

/** Troca cada {chave} do texto pelo valor; chave sem valor fica como está, para o erro aparecer no teste. */
export function preencher(texto: string, valores: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (inteiro, chave: string) => (chave in valores ? String(valores[chave]) : inteiro))
}

/** Textos das pausas (minijogos calmos, sem pontuação, sem sorte). */
export const conteudoPausas = pausasJson
