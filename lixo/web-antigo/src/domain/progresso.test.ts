import { describe, expect, it } from 'vitest'
import { dataLocal, dataPorExtenso, inicioDoMes, somarDias } from './datas'
import { dinheiroPreservado, emMetas, progresso, type RegistroDoDia } from './progresso'

const nao = (data: string): RegistroDoDia => ({ data, apostou: false })
const sim = (data: string): RegistroDoDia => ({ data, apostou: true })

describe('progresso', () => {
  it('sem registro: zero dias, sem data de início e todos os dias do mês sem registro', () => {
    expect(progresso('2026-10-27', [], null)).toEqual({
      totalSemApostar: 0,
      inicio: null,
      diasSemApostarNoMes: 0,
      diasSemRegistroNoMes: 27,
      sequenciaAtual: 0,
      dinheiroPreservado: null,
    })
  })

  it('CA-4: um lapso não zera o total', () => {
    const registros = [nao('2026-10-01'), nao('2026-10-02'), nao('2026-10-03'), sim('2026-10-04'), nao('2026-10-05')]
    const p = progresso('2026-10-05', registros, null)
    expect(p.totalSemApostar).toBe(4)
    expect(p.inicio).toBe('2026-10-01')
  })

  it('CA-4: a virada do mês não muda o número principal', () => {
    const p = progresso('2026-11-01', [nao('2026-10-30'), nao('2026-10-31'), nao('2026-11-01')], null)
    expect(p.totalSemApostar).toBe(3)
    expect(p.diasSemApostarNoMes).toBe(1)
    expect(p.inicio).toBe('2026-10-30')
  })

  it('só conta o que foi registrado: dia em branco não vira dia sem apostar', () => {
    const p = progresso('2026-10-10', [nao('2026-10-01'), nao('2026-10-08')], null)
    expect(p.totalSemApostar).toBe(2)
    expect(p.diasSemRegistroNoMes).toBe(8)
  })

  it('dois registros no mesmo dia valem como um, e o último prevalece', () => {
    expect(progresso('2026-10-02', [nao('2026-10-02'), sim('2026-10-02')], null).totalSemApostar).toBe(0)
  })

  it('ignora registro com data futura', () => {
    expect(progresso('2026-10-02', [nao('2026-10-03')], null)).toMatchObject({ totalSemApostar: 0, inicio: null })
  })

  describe('sequência atual', () => {
    it('conta os dias seguidos até hoje', () => {
      expect(progresso('2026-10-03', [nao('2026-10-01'), nao('2026-10-02'), nao('2026-10-03')], null).sequenciaAtual).toBe(3)
    })

    it('não cai antes do check-in de hoje', () => {
      expect(progresso('2026-10-03', [nao('2026-10-01'), nao('2026-10-02')], null).sequenciaAtual).toBe(2)
    })

    it('um dia em branco no meio interrompe', () => {
      expect(progresso('2026-10-04', [nao('2026-10-01'), nao('2026-10-03'), nao('2026-10-04')], null).sequenciaAtual).toBe(2)
    })

    it('"Apostei" hoje deixa a sequência em zero, mas o total fica', () => {
      const p = progresso('2026-10-03', [nao('2026-10-01'), nao('2026-10-02'), sim('2026-10-03')], null)
      expect(p).toMatchObject({ sequenciaAtual: 0, totalSemApostar: 2 })
    })

    it('atravessa a virada do mês', () => {
      expect(progresso('2026-11-01', [nao('2026-10-31'), nao('2026-11-01')], null).sequenciaAtual).toBe(2)
    })
  })

  it('CA-5: o dinheiro é calculado sobre o total, não sobre o mês', () => {
    const p = progresso('2026-11-01', [nao('2026-10-30'), nao('2026-10-31'), nao('2026-11-01')], 70)
    expect(p.dinheiroPreservado).toBe(30)
  })
})

describe('dinheiroPreservado', () => {
  it('CA-5: gasto semanal ÷ 7 × dias sem apostar, arredondado para baixo', () => {
    expect(dinheiroPreservado(100, 10)).toBe(142)
  })

  it('sem gasto informado devolve null em vez de chutar', () => {
    expect(dinheiroPreservado(null, 10)).toBeNull()
    expect(dinheiroPreservado(0, 10)).toBeNull()
    expect(dinheiroPreservado(Number.NaN, 10)).toBeNull()
  })
})

describe('emMetas', () => {
  const metas = [
    { id: 'botijao', nome: 'botijão de gás', valorReferencia: 110 },
    { id: 'compras', nome: 'compras da semana', valorReferencia: 400 },
  ]

  it('converte o valor em quantas metas ele paga', () => {
    expect(emMetas(250, metas)).toEqual([{ meta: metas[0], quantidade: 2 }])
  })
})

describe('datas', () => {
  it('usa a data local, não a de UTC', () => {
    // 23h30 do dia 27 no horário local continua sendo dia 27.
    expect(dataLocal(new Date(2026, 9, 27, 23, 30))).toBe('2026-10-27')
  })

  it('início do mês', () => {
    expect(inicioDoMes('2026-10-27')).toBe('2026-10-01')
  })

  it('soma dias atravessando mês e ano', () => {
    expect(somarDias('2026-11-01', -1)).toBe('2026-10-31')
    expect(somarDias('2026-12-31', 1)).toBe('2027-01-01')
  })

  it('data por extenso, com o ano só quando é outro', () => {
    expect(dataPorExtenso('2026-10-27', '2026-11-03')).toBe('27 de outubro')
    expect(dataPorExtenso('2025-12-30', '2026-01-02')).toBe('30 de dezembro de 2025')
  })
})
