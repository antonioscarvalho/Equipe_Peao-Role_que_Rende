import { describe, expect, it } from 'vitest'
import { dataLocal, inicioDoMes } from './datas'
import { dinheiroPreservado, emMetas, progressoDoMes, type RegistroDoDia } from './progresso'

const nao = (data: string): RegistroDoDia => ({ data, apostou: false })
const sim = (data: string): RegistroDoDia => ({ data, apostou: true })

describe('progressoDoMes', () => {
  it('mês sem registro: zero dias sem apostar e todos os dias sem registro', () => {
    expect(progressoDoMes('2026-10-27', [], null)).toEqual({
      diasSemApostar: 0,
      diasComAposta: 0,
      diasSemRegistro: 27,
      dinheiroPreservado: null,
    })
  })

  it('CA-4: um lapso no meio do mês não zera o total', () => {
    const registros = [nao('2026-10-01'), nao('2026-10-02'), nao('2026-10-03'), sim('2026-10-04'), nao('2026-10-05')]
    const p = progressoDoMes('2026-10-05', registros, null)
    expect(p.diasSemApostar).toBe(4)
    expect(p.diasComAposta).toBe(1)
  })

  it('só conta o que foi registrado: dia em branco não vira dia sem apostar', () => {
    const p = progressoDoMes('2026-10-10', [nao('2026-10-01'), nao('2026-10-08')], null)
    expect(p.diasSemApostar).toBe(2)
    expect(p.diasSemRegistro).toBe(8)
  })

  it('na virada do mês o contador recomeça, sem levar o mês anterior', () => {
    const p = progressoDoMes('2026-11-01', [nao('2026-10-30'), nao('2026-10-31'), nao('2026-11-01')], null)
    expect(p.diasSemApostar).toBe(1)
  })

  it('dois registros no mesmo dia valem como um, e o último prevalece', () => {
    const p = progressoDoMes('2026-10-02', [nao('2026-10-02'), sim('2026-10-02')], null)
    expect(p).toMatchObject({ diasSemApostar: 0, diasComAposta: 1 })
  })

  it('ignora registro com data futura', () => {
    expect(progressoDoMes('2026-10-02', [nao('2026-10-03')], null).diasSemApostar).toBe(0)
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
})
