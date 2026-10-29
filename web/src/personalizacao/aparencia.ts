/**
 * Personalização do bichinho (cor, roupa, acessórios).
 *
 * Regras éticas (skills design-etico-saude-digital e criar-personagem, spec 002):
 * - Quase tudo é livre desde o primeiro dia. Não há loja, moeda, pontos nem sorteio.
 * - Os únicos itens com condição são os de marco (7, 30 e 90 dias sem apostar), anunciados
 *   antes com quantos dias faltam. Nada é surpresa nem aleatório (CA-9).
 * - O total de dias sem apostar nunca diminui (spec 004), então um lapso não tira item nenhum (CA-10).
 */

export interface OpcaoCor {
  id: string
  nome: string
  /** Cor do corpo. Só tons claros da paleta, para o contorno azul-escuro manter contraste ≥ 3:1. */
  valor: string
}

export interface OpcaoItem {
  id: string
  nome: string
  /** Dias sem apostar para liberar. Ausente = livre desde o início. */
  marco?: number
}

export const CORES: OpcaoCor[] = [
  { id: 'azul', nome: 'Azul-céu', valor: '#79D3EE' },
  { id: 'rosa', nome: 'Rosa', valor: '#F7BED0' },
  { id: 'menta', nome: 'Menta', valor: '#A4DFCF' },
  { id: 'lilas', nome: 'Lilás', valor: '#C9BEF0' },
  { id: 'baunilha', nome: 'Baunilha', valor: '#FFF2C6' },
  { id: 'verde', nome: 'Verde-água', valor: '#86D3B2' },
]

/** Cor das roupas e acessórios de tecido. Tons dos cenários (estilo livro ilustrado). */
export const CORES_ROUPA: OpcaoCor[] = [
  { id: 'rosa', nome: 'Rosa', valor: '#EE8AA6' },
  { id: 'azul', nome: 'Azul', valor: '#6F86E3' },
  { id: 'roxo', nome: 'Lavanda', valor: '#9A88D8' },
  { id: 'amarelo', nome: 'Amarelo', valor: '#F9DC6E' },
  { id: 'verde', nome: 'Verde-sálvia', valor: '#9CCB86' },
  { id: 'terracota', nome: 'Terracota', valor: '#E59A7A' },
  { id: 'branco', nome: 'Creme', valor: '#FFFCF4' },
]

export const ROUPAS: OpcaoItem[] = [
  { id: 'nenhuma', nome: 'Sem roupa' },
  { id: 'camiseta', nome: 'Camiseta' },
  { id: 'moletom', nome: 'Moletom' },
  { id: 'jardineira', nome: 'Jardineira' },
  { id: 'cachecol', nome: 'Cachecol', marco: 7 },
]

export const CABECA: OpcaoItem[] = [
  { id: 'nenhum', nome: 'Nada' },
  { id: 'bone', nome: 'Boné' },
  { id: 'gorro', nome: 'Gorro' },
  { id: 'laco', nome: 'Laço' },
  { id: 'fones', nome: 'Fones' },
  { id: 'flor', nome: 'Flor no broto', marco: 30 },
]

export const ROSTO: OpcaoItem[] = [
  { id: 'nenhum', nome: 'Nada' },
  { id: 'oculos', nome: 'Óculos redondos' },
  { id: 'oculos-sol', nome: 'Óculos escuros' },
]

export const PEITO: OpcaoItem[] = [
  { id: 'nenhum', nome: 'Nada' },
  { id: 'coracao', nome: 'Broche de coração' },
  { id: 'estrela', nome: 'Estrela dos 90 dias', marco: 90 },
]

export interface Aparencia {
  cor: string
  corRoupa: string
  roupa: string
  cabeca: string
  rosto: string
  peito: string
}

export const APARENCIA_PADRAO: Aparencia = {
  cor: 'azul',
  corRoupa: 'rosa',
  roupa: 'nenhuma',
  cabeca: 'nenhum',
  rosto: 'nenhum',
  peito: 'nenhum',
}

export type Categoria = 'roupa' | 'cabeca' | 'rosto' | 'peito'

export const CATALOGO: Record<Categoria, OpcaoItem[]> = { roupa: ROUPAS, cabeca: CABECA, rosto: ROSTO, peito: PEITO }

export function liberado(item: OpcaoItem, diasSemApostar: number): boolean {
  return item.marco === undefined || diasSemApostar >= item.marco
}

export function diasQueFaltam(item: OpcaoItem, diasSemApostar: number): number {
  return item.marco === undefined ? 0 : Math.max(0, item.marco - diasSemApostar)
}

/** O próximo marco ainda não alcançado, para anunciar antes (CA-9). null quando já passou dos 90. */
export function proximoMarco(diasSemApostar: number): { item: OpcaoItem; faltam: number } | null {
  const comMarco = [...ROUPAS, ...CABECA, ...ROSTO, ...PEITO]
    .filter((i) => i.marco !== undefined && diasSemApostar < i.marco)
    .sort((a, b) => (a.marco ?? 0) - (b.marco ?? 0))
  const item = comMarco[0]
  return item ? { item, faltam: diasQueFaltam(item, diasSemApostar) } : null
}

const idValido = (lista: { id: string }[], id: unknown, padrao: string): string =>
  typeof id === 'string' && lista.some((o) => o.id === id) ? id : padrao

/**
 * Aceita qualquer coisa vinda do banco (versão antiga, dado corrompido) e devolve uma aparência válida.
 * Itens de marco continuam valendo mesmo que, por algum motivo, o total ainda não esteja carregado:
 * quem decide se mostra é `aparenciaVisivel`.
 */
export function sanear(bruto: unknown): Aparencia {
  const a = (bruto && typeof bruto === 'object' ? bruto : {}) as Partial<Record<keyof Aparencia, unknown>>
  return {
    cor: idValido(CORES, a.cor, APARENCIA_PADRAO.cor),
    corRoupa: idValido(CORES_ROUPA, a.corRoupa, APARENCIA_PADRAO.corRoupa),
    roupa: idValido(ROUPAS, a.roupa, APARENCIA_PADRAO.roupa),
    cabeca: idValido(CABECA, a.cabeca, APARENCIA_PADRAO.cabeca),
    rosto: idValido(ROSTO, a.rosto, APARENCIA_PADRAO.rosto),
    peito: idValido(PEITO, a.peito, APARENCIA_PADRAO.peito),
  }
}

/** Troca por "nada" um item de marco que ainda não foi alcançado. Nunca altera o que está salvo. */
export function aparenciaVisivel(aparencia: Aparencia, diasSemApostar: number): Aparencia {
  const ajustar = (categoria: Categoria, padrao: string) => {
    const item = CATALOGO[categoria].find((i) => i.id === aparencia[categoria])
    return item && liberado(item, diasSemApostar) ? item.id : padrao
  }
  return {
    ...aparencia,
    roupa: ajustar('roupa', APARENCIA_PADRAO.roupa),
    cabeca: ajustar('cabeca', APARENCIA_PADRAO.cabeca),
    rosto: ajustar('rosto', APARENCIA_PADRAO.rosto),
    peito: ajustar('peito', APARENCIA_PADRAO.peito),
  }
}

export const corDe = (lista: OpcaoCor[], id: string): string => (lista.find((c) => c.id === id) ?? lista[0]).valor

const nomeDe = (lista: { id: string; nome: string }[], id: string) => lista.find((o) => o.id === id)?.nome ?? ''

/** Texto para leitor de tela: "corpo rosa, de moletom roxo, com boné". Vazio quando não há nada a dizer além da cor. */
export function descreverAparencia(a: Aparencia): string {
  const partes = [`corpo ${nomeDe(CORES, a.cor).toLowerCase()}`]
  const corRoupa = nomeDe(CORES_ROUPA, a.corRoupa).toLowerCase()
  if (a.roupa !== 'nenhuma') partes.push(`de ${nomeDe(ROUPAS, a.roupa).toLowerCase()} ${corRoupa}`)
  for (const [lista, id] of [
    [CABECA, a.cabeca],
    [ROSTO, a.rosto],
    [PEITO, a.peito],
  ] as const) {
    if (id !== 'nenhum') partes.push(`com ${nomeDe(lista, id).toLowerCase()}`)
  }
  return partes.join(', ')
}
