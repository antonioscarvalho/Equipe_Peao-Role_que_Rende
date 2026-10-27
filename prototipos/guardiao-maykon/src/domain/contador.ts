/**
 * Contador de dias e de dinheiro preservado (MVP #5) e marcos do Guardião (MVP #10).
 * Conceito: reforço previsível ligado aos valores da pessoa, nunca à sorte.
 * Skills: controle-estimulos-financas, design-etico-saude-digital, prevencao-recaida.
 * Regras: nada de streak que "zera" com destaque; o número principal é o TOTAL de dias
 * sem apostar no período; dinheiro é sempre mostrado como estimativa (CDC).
 */
import { diferencaEmDias } from './datas'
import type { DataISO, Registro } from './tipos'

export const MARCOS = [7, 30, 90] as const

export interface Progresso {
  diasNoPeriodo: number
  diasComAposta: number
  totalSemApostar: number
  sequenciaAtual: number
  dinheiroPreservado: number | null
  estagioGuardiao: 0 | 1 | 2 | 3
  proximoMarco: number | null
  faltamParaMarco: number | null
}

export function calcularProgresso(
  inicio: DataISO,
  hoje: DataISO,
  registros: Registro[],
  gastoSemanal: number | null,
): Progresso {
  const diasNoPeriodo = Math.max(1, diferencaEmDias(inicio, hoje) + 1)
  const datasComAposta = new Set(
    registros.filter((r) => r.apostou && r.data >= inicio && r.data <= hoje).map((r) => r.data),
  )
  const diasComAposta = datasComAposta.size
  const totalSemApostar = Math.max(0, diasNoPeriodo - diasComAposta)

  const ultimaAposta = [...datasComAposta].sort().at(-1)
  const sequenciaAtual = ultimaAposta ? Math.max(0, diferencaEmDias(ultimaAposta, hoje)) : diasNoPeriodo

  const dinheiroPreservado =
    gastoSemanal && gastoSemanal > 0 ? Math.floor((gastoSemanal / 7) * totalSemApostar) : null

  const estagioGuardiao = (MARCOS.filter((m) => totalSemApostar >= m).length as 0 | 1 | 2 | 3)
  const proximoMarco = MARCOS.find((m) => totalSemApostar < m) ?? null
  const faltamParaMarco = proximoMarco === null ? null : proximoMarco - totalSemApostar

  return {
    diasNoPeriodo,
    diasComAposta,
    totalSemApostar,
    sequenciaAtual,
    dinheiroPreservado,
    estagioGuardiao,
    proximoMarco,
    faltamParaMarco,
  }
}

export function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}
