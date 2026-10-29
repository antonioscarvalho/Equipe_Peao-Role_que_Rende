/**
 * Personalização do bichinho (cor, roupa, acessórios).
 *
 * Regras éticas (skills design-etico-saude-digital e criar-personagem, spec 002):
 * - O básico é livre desde o primeiro dia. Não há loja, moeda, pontos nem sorteio.
 * - Os outros itens têm uma META anunciada desde já (dias de plano, missões feitas ou capítulos
 *   da história), com quanto falta. Nada é surpresa nem aleatório (CA-9).
 * - Itens temáticos (Halloween, Natal, São João, Carnaval) também são por meta e ficam para sempre:
 *   nada é "só por tempo limitado" (skill gamificacao-etica: sem escassez).
 * - Dias, missões e capítulos só aumentam, então um lapso não tira item nenhum (CA-10).
 */

export interface OpcaoCor {
  id: string
  nome: string
  /** Cor do corpo. Só tons claros da paleta, para o contorno azul-escuro manter contraste ≥ 3:1. */
  valor: string
}

/** Meta para liberar um item: dias de plano, missões feitas ou capítulos concluídos. */
export interface Meta {
  tipo: 'dias' | 'missoes' | 'capitulos'
  valor: number
}

export interface OpcaoItem {
  id: string
  nome: string
  /** Ausente = livre desde o início. */
  meta?: Meta
  /** Tema da coleção, mostrado como etiqueta. */
  tema?: 'Halloween' | 'Natal' | 'São João' | 'Carnaval' | 'Marco'
}

/** Onde a pessoa está: o que conta para as metas. */
export interface Progresso {
  dias: number
  missoes: number
  capitulos: number
}

const dias = (valor: number): Meta => ({ tipo: 'dias', valor })
const missoes = (valor: number): Meta => ({ tipo: 'missoes', valor })
const capitulos = (valor: number): Meta => ({ tipo: 'capitulos', valor })

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
  { id: 'jardineira', nome: 'Jardineira', meta: missoes(2) },
  { id: 'cachecol', nome: 'Cachecol', meta: dias(7), tema: 'Marco' },
  { id: 'capa', nome: 'Capa de vampiro', meta: missoes(6), tema: 'Halloween' },
  { id: 'sueter', nome: 'Suéter de Natal', meta: missoes(16), tema: 'Natal' },
]

export const CABECA: OpcaoItem[] = [
  { id: 'nenhum', nome: 'Nada' },
  { id: 'bone', nome: 'Boné' },
  { id: 'gorro', nome: 'Gorro', meta: missoes(1) },
  { id: 'laco', nome: 'Laço' },
  { id: 'fones', nome: 'Fones', meta: missoes(4) },
  { id: 'bruxa', nome: 'Chapéu de bruxa', meta: capitulos(1), tema: 'Halloween' },
  { id: 'noel', nome: 'Gorro de Papai Noel', meta: missoes(12), tema: 'Natal' },
  { id: 'palha', nome: 'Chapéu de palha', meta: missoes(20), tema: 'São João' },
  { id: 'flor', nome: 'Flor no broto', meta: dias(30), tema: 'Marco' },
]

export const ROSTO: OpcaoItem[] = [
  { id: 'nenhum', nome: 'Nada' },
  { id: 'oculos', nome: 'Óculos redondos' },
  { id: 'oculos-sol', nome: 'Óculos escuros', meta: missoes(3) },
  { id: 'mascara', nome: 'Máscara de carnaval', meta: missoes(28), tema: 'Carnaval' },
]

export const PEITO: OpcaoItem[] = [
  { id: 'nenhum', nome: 'Nada' },
  { id: 'coracao', nome: 'Broche de coração' },
  { id: 'abobora', nome: 'Broche de abóbora', meta: missoes(8), tema: 'Halloween' },
  { id: 'estrela', nome: 'Estrela dos 90 dias', meta: dias(90), tema: 'Marco' },
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

const atual = (meta: Meta, p: Progresso) => (meta.tipo === 'dias' ? p.dias : meta.tipo === 'missoes' ? p.missoes : p.capitulos)

export function liberado(item: OpcaoItem, p: Progresso): boolean {
  return !item.meta || atual(item.meta, p) >= item.meta.valor
}

/** Quanto falta, na unidade da meta (0 = já liberado). */
export function quantoFalta(item: OpcaoItem, p: Progresso): number {
  return item.meta ? Math.max(0, item.meta.valor - atual(item.meta, p)) : 0
}

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`

/** Etiqueta curta para o cartão: "7 dias", "8 missões", "Cap. 1". */
export function metaCurta(meta: Meta): string {
  if (meta.tipo === 'dias') return plural(meta.valor, 'dia', 'dias')
  if (meta.tipo === 'missoes') return plural(meta.valor, 'missão', 'missões')
  return `Cap. ${meta.valor}`
}

/** Frase do que fazer para liberar, já com quanto falta. */
export function textoMeta(item: OpcaoItem, p: Progresso): string {
  if (!item.meta) return ''
  const falta = quantoFalta(item, p)
  if (item.meta.tipo === 'dias') return `Com ${plural(item.meta.valor, 'dia', 'dias')} de plano · faltam ${plural(falta, 'dia', 'dias')}`
  if (item.meta.tipo === 'missoes') return `Faça ${plural(item.meta.valor, 'missão', 'missões')} · faltam ${falta}`
  return `Conclua ${item.meta.valor === 1 ? 'o capítulo 1' : `${item.meta.valor} capítulos`} da história`
}

/** A meta mais perto de ser alcançada, para anunciar antes (CA-9). null quando tudo já foi liberado. */
export function proximoMarco(p: Progresso): { item: OpcaoItem; texto: string } | null {
  const travados = [...ROUPAS, ...CABECA, ...ROSTO, ...PEITO].filter((i) => i.meta && !liberado(i, p))
  travados.sort((a, b) => quantoFalta(a, p) / a.meta!.valor - quantoFalta(b, p) / b.meta!.valor)
  const item = travados[0]
  return item ? { item, texto: textoMeta(item, p) } : null
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
export function aparenciaVisivel(aparencia: Aparencia, p: Progresso): Aparencia {
  const ajustar = (categoria: Categoria, padrao: string) => {
    const item = CATALOGO[categoria].find((i) => i.id === aparencia[categoria])
    return item && liberado(item, p) ? item.id : padrao
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

/** Em que parte do bichinho o item vai (roupa, cabeça, rosto ou peito). */
export function categoriaDe(item: OpcaoItem): Categoria {
  return (Object.keys(CATALOGO) as Categoria[]).find((c) => CATALOGO[c].includes(item)) ?? 'roupa'
}
