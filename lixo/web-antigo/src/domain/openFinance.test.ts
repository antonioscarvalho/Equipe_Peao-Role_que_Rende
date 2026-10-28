import { describe, expect, it } from 'vitest'
import demo from '@/content/open-finance-demo.json'
import { analisarExtrato, type Transacao } from './openFinance'

describe('Open Finance · análise do extrato sintético (Spec 007)', () => {
  it('calcula o total dos meses e a diferença a menos', () => {
    const analise = analisarExtrato(demo.transacoes, demo.dataReferencia)
    expect(analise.mesAnterior.total).toBe(235) // 50 + 40 + 60 + 30 + 55 em setembro
    expect(analise.mesAtual.total).toBe(35) // 35 em outubro
    expect(analise.aMenosQueMesAnterior).toBe(200) // 235 - 35
    expect(analise.diasSemTransacao).toBe(25) // de 03/10 a 28/10
  })

  it('quando o mês atual for maior, aMenosQueMesAnterior é zero (nunca negativo)', () => {
    const transacoes: Transacao[] = [
      { data: '2026-09-05', tipo: 'Pix', destinatario: 'A', categoria: 'gastos-monitorados', valor: 20 },
      { data: '2026-10-05', tipo: 'Pix', destinatario: 'A', categoria: 'gastos-monitorados', valor: 80 },
    ]
    const analise = analisarExtrato(transacoes, '2026-10-20')
    expect(analise.aMenosQueMesAnterior).toBe(0)
  })

  it('quando não houver transações na categoria, retorna zeros e dias nulos', () => {
    const transacoes: Transacao[] = [
      { data: '2026-10-05', tipo: 'Boleto', destinatario: 'Luz', categoria: 'contas', valor: 100 },
    ]
    const analise = analisarExtrato(transacoes, '2026-10-20')
    expect(analise.mesAtual.total).toBe(0)
    expect(analise.mesAnterior.total).toBe(0)
    expect(analise.aMenosQueMesAnterior).toBe(0)
    expect(analise.diasSemTransacao).toBeNull()
  })
})
