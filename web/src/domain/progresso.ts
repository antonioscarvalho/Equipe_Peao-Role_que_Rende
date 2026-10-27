import { diasDecorridosNoMes, mesmoMes, type DataLocal } from './datas'

export interface RegistroDoDia {
  data: DataLocal
  apostou: boolean
}

export interface ProgressoDoMes {
  /** Dias do mês registrados como "Não apostei". Um lapso nunca apaga os outros. */
  diasSemApostar: number
  diasComAposta: number
  diasSemRegistro: number
  /** Estimativa em reais; null quando a pessoa ainda não informou quanto gastava. */
  dinheiroPreservado: number | null
}

/**
 * Conta só o que a pessoa afirmou (decisão 1 do plano 004): dia sem registro não vira
 * "dia sem apostar". Dois registros no mesmo dia valem como um, e o último prevalece.
 */
export function progressoDoMes(
  hoje: DataLocal,
  registros: RegistroDoDia[],
  gastoSemanalEstimado: number | null,
): ProgressoDoMes {
  const porDia = new Map<DataLocal, boolean>()
  for (const r of registros) {
    if (mesmoMes(r.data, hoje) && r.data <= hoje) porDia.set(r.data, r.apostou)
  }

  const diasComAposta = [...porDia.values()].filter(Boolean).length
  const diasSemApostar = porDia.size - diasComAposta

  return {
    diasSemApostar,
    diasComAposta,
    diasSemRegistro: diasDecorridosNoMes(hoje) - porDia.size,
    dinheiroPreservado: dinheiroPreservado(gastoSemanalEstimado, diasSemApostar),
  }
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
