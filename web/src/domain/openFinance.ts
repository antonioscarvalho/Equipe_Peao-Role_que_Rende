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
  /** Quanto menos foi para intermediadora de aposta neste mês do que no anterior. Nunca negativo. */
  aMenosQueMesAnterior: number
  /** Dias desde o último Pix para intermediadora, até a data de referência; null se não houve nenhum. */
  diasSemPix: number | null
}

const CATEGORIA = 'intermediadora-apostas'

function anteriorDe(mes: string): string {
  const [ano, m] = mes.split('-').map(Number)
  return m === 1 ? `${ano - 1}-12` : `${ano}-${String(m - 1).padStart(2, '0')}`
}

function resumo(transacoes: Transacao[], mes: string): ResumoMes {
  const doMes = transacoes.filter((t) => t.categoria === CATEGORIA && t.data.startsWith(mes))
  return { mes, quantidade: doMes.length, total: doMes.reduce((soma, t) => soma + t.valor, 0) }
}

function diasEntre(de: DataLocal, ate: DataLocal): number {
  const [a, b] = [de, ate].map((d) => {
    const [ano, mes, dia] = d.split('-').map(Number)
    return Date.UTC(ano, mes - 1, dia)
  })
  return Math.round((b - a) / 86_400_000)
}

/** Lê o extrato da simulação (CA-6): só Pix e pagamentos para intermediadora de aposta entram na conta. */
export function analisarExtrato(transacoes: Transacao[], dataReferencia: DataLocal): AnaliseExtrato {
  const mesAtual = resumo(transacoes, dataReferencia.slice(0, 7))
  const mesAnterior = resumo(transacoes, anteriorDe(mesAtual.mes))
  const ultima = transacoes
    .filter((t) => t.categoria === CATEGORIA && t.data <= dataReferencia)
    .map((t) => t.data)
    .sort()
    .at(-1)

  return {
    mesAtual,
    mesAnterior,
    aMenosQueMesAnterior: Math.max(0, mesAnterior.total - mesAtual.total),
    diasSemPix: ultima ? diasEntre(ultima, dataReferencia) : null,
  }
}
