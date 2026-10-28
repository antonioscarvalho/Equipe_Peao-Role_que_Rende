import { describe, expect, it } from 'vitest'
import demo from '@/content/open-finance-demo.json'
import { analisarExtrato, type Transacao } from './openFinance'

const pix = (data: string, valor: number, categoria = 'intermediadora-apostas'): Transacao => ({
  data,
  tipo: 'pix',
  destinatario: 'Exemplo (fictício)',
  categoria,
  valor,
})

describe('analisarExtrato', () => {
  it('CA-6: separa só os pagamentos para intermediadora de aposta', () => {
    const extrato = [pix('2026-09-02', 50), pix('2026-09-05', 130, 'mercado'), pix('2026-10-03', 35)]
    const a = analisarExtrato(extrato, '2026-10-28')
    expect(a.mesAnterior).toEqual({ mes: '2026-09', quantidade: 1, total: 50 })
    expect(a.mesAtual).toEqual({ mes: '2026-10', quantidade: 1, total: 35 })
    expect(a.aMenosQueMesAnterior).toBe(15)
    expect(a.diasSemPix).toBe(25)
  })

  it('não mostra valor negativo quando o mês atual foi pior', () => {
    expect(analisarExtrato([pix('2026-10-01', 80)], '2026-10-10').aMenosQueMesAnterior).toBe(0)
  })

  it('vira o ano: o mês anterior a janeiro é dezembro', () => {
    expect(analisarExtrato([pix('2025-12-20', 40)], '2026-01-05').mesAnterior.total).toBe(40)
  })

  it('o extrato de exemplo conta a história da demo: bem menos neste mês', () => {
    const a = analisarExtrato(demo.transacoes, demo.dataReferencia)
    expect(a.mesAnterior.quantidade).toBeGreaterThan(a.mesAtual.quantidade)
    expect(a.aMenosQueMesAnterior).toBeGreaterThan(0)
  })

  it('o extrato de exemplo não usa nenhum destinatário real', () => {
    for (const t of demo.transacoes) expect(t.destinatario).toMatch(/\(fictíci[oa]\)$/)
  })
})
