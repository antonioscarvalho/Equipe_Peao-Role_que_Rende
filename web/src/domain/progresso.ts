import { diasDecorridosNoMes, mesmoMes, somarDias, type DataLocal } from './datas'

export interface RegistroDoDia {
  data: DataLocal
  apostou: boolean
}

export interface Progresso {
  /** Dias registrados como "Não apostei" desde o primeiro registro. Um lapso e a virada do mês nunca apagam (CA-4). */
  totalSemApostar: number
  /** Data do primeiro registro; null enquanto não há nenhum. */
  inicio: DataLocal | null
  diasSemApostarNoMes: number
  diasSemRegistroNoMes: number
  /** Dias seguidos de "Não apostei" terminando hoje ou ontem, para não cair antes do check-in de hoje. */
  sequenciaAtual: number
  /** Estimativa em reais; null quando a pessoa ainda não informou quanto gastava. */
  dinheiroPreservado: number | null
}

/**
 * Conta só o que a pessoa afirmou (decisão 1 do plano 004): dia sem registro não vira
 * "dia sem apostar". Dois registros no mesmo dia valem como um, e o último prevalece.
 */
export function progresso(hoje: DataLocal, registros: RegistroDoDia[], gastoSemanalEstimado: number | null): Progresso {
  const porDia = new Map<DataLocal, boolean>()
  for (const r of registros) {
    if (r.data <= hoje) porDia.set(r.data, r.apostou)
  }

  const dias = [...porDia.keys()].sort()
  const semApostar = dias.filter((d) => !porDia.get(d))
  const doMes = dias.filter((d) => mesmoMes(d, hoje))

  return {
    totalSemApostar: semApostar.length,
    inicio: dias[0] ?? null,
    diasSemApostarNoMes: doMes.filter((d) => !porDia.get(d)).length,
    diasSemRegistroNoMes: diasDecorridosNoMes(hoje) - doMes.length,
    sequenciaAtual: sequencia(hoje, porDia),
    dinheiroPreservado: dinheiroPreservado(gastoSemanalEstimado, semApostar.length),
  }
}

function sequencia(hoje: DataLocal, porDia: Map<DataLocal, boolean>): number {
  if (porDia.get(hoje) === true) return 0
  let dia = porDia.has(hoje) ? hoje : somarDias(hoje, -1)
  let n = 0
  while (porDia.get(dia) === false) {
    n++
    dia = somarDias(dia, -1)
  }
  return n
}

export function dinheiroPreservado(gastoSemanalEstimado: number | null, diasSemApostar: number): number | null {
  if (gastoSemanalEstimado === null || !(gastoSemanalEstimado > 0)) return null
  return Math.floor((gastoSemanalEstimado / 7) * diasSemApostar)
}

export interface MetaTangivel {
  id: string
  nome: string
  valorReferencia: number
}

/** Quantas vezes cada meta cabe no valor; metas que ainda não cabem nenhuma vez ficam de fora. */
export function emMetas<T extends MetaTangivel>(valor: number, metas: T[]): { meta: T; quantidade: number }[] {
  return metas
    .map((meta) => ({ meta, quantidade: Math.floor(valor / meta.valorReferencia) }))
    .filter((m) => m.quantidade > 0)
}

export function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}
