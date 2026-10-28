import type { DataLocal } from './datas'

export interface Transacao {
  data: DataLocal
  tipo: string
  destinatario: string
  categoria: string
  valor: number
}

export interface ResumoMes {
  mes: string
  quantidade: number
  total: number
}

export interface AnaliseExtrato {
  mesAtual: ResumoMes
  mesAnterior: ResumoMes
  /** Quanto a menos foi gasto neste mês do que no anterior (estimativa de valor preservado). Nunca negativo. */
  aMenosQueMesAnterior: number
  /** Dias desde a última movimentação da categoria, até a data de referência; null se não houve nenhuma. */
  diasSemTransacao: number | null
}

const CATEGORIA_MONITORADA = 'gastos-monitorados'

function anteriorDe(mes: string): string {
  const [ano, m] = mes.split('-').map(Number)
  return m === 1 ? `${ano - 1}-12` : `${ano}-${String(m - 1).padStart(2, '0')}`
}

function resumo(transacoes: Transacao[], mes: string): ResumoMes {
  const doMes = transacoes.filter((t) => t.categoria === CATEGORIA_MONITORADA && t.data.startsWith(mes))
  return { mes, quantidade: doMes.length, total: doMes.reduce((soma, t) => soma + t.valor, 0) }
}

function diasEntre(de: DataLocal, ate: DataLocal): number {
  const [a, b] = [de, ate].map((d) => {
    const [ano, mes, dia] = d.split('-').map(Number)
    return Date.UTC(ano, mes - 1, dia)
  })
  return Math.round((b - a) / 86_400_000)
}

/**
 * Lê o extrato sintético da demonstração de Open Finance (Spec 007, CA-4).
 * Apenas calcula a estimativa de valor preservado entre meses; nunca acusa recaída ou aposta.
 */
export function analisarExtrato(transacoes: Transacao[], dataReferencia: DataLocal): AnaliseExtrato {
  const mesAtual = resumo(transacoes, dataReferencia.slice(0, 7))
  const mesAnterior = resumo(transacoes, anteriorDe(mesAtual.mes))
  const ultima = transacoes
    .filter((t) => t.categoria === CATEGORIA_MONITORADA && t.data <= dataReferencia)
    .map((t) => t.data)
    .sort()
    .at(-1)

  return {
    mesAtual,
    mesAnterior,
    aMenosQueMesAnterior: Math.max(0, mesAnterior.total - mesAtual.total),
    diasSemTransacao: ultima ? diasEntre(ultima, dataReferencia) : null,
  }
}
