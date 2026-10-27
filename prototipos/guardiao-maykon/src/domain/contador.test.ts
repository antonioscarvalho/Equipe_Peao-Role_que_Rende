import { describe, expect, it } from 'vitest'
import { calcularProgresso } from './contador'
import { diferencaEmDias, hojeISO } from './datas'

describe('calcularProgresso', () => {
  it('conta o primeiro dia como 1 dia sem apostar', () => {
    const p = calcularProgresso('2026-10-27', '2026-10-27', [], null)
    expect(p.totalSemApostar).toBe(1)
    expect(p.sequenciaAtual).toBe(1)
    expect(p.dinheiroPreservado).toBeNull()
  })

  it('um lapso NÃO zera o total do período (sem streak punitivo)', () => {
    const p = calcularProgresso('2026-10-01', '2026-10-10', [{ data: '2026-10-05', apostou: true }], null)
    expect(p.diasNoPeriodo).toBe(10)
    expect(p.totalSemApostar).toBe(9)
    expect(p.sequenciaAtual).toBe(5)
  })

  it('ignora registros duplicados e fora do período', () => {
    const p = calcularProgresso(
      '2026-10-01',
      '2026-10-10',
      [
        { data: '2026-10-05', apostou: true },
        { data: '2026-10-05', apostou: true },
        { data: '2026-09-30', apostou: true },
        { data: '2026-10-06', apostou: false },
      ],
      null,
    )
    expect(p.diasComAposta).toBe(1)
  })

  it('estima o dinheiro preservado a partir do gasto semanal', () => {
    const p = calcularProgresso('2026-10-01', '2026-10-14', [], 70)
    expect(p.totalSemApostar).toBe(14)
    expect(p.dinheiroPreservado).toBe(140)
  })

  it('o Guardião cresce em marcos anunciados de 7, 30 e 90 dias', () => {
    expect(calcularProgresso('2026-10-01', '2026-10-06', [], null).estagioGuardiao).toBe(0)
    const sete = calcularProgresso('2026-10-01', '2026-10-07', [], null)
    expect(sete.estagioGuardiao).toBe(1)
    expect(sete.proximoMarco).toBe(30)
    expect(sete.faltamParaMarco).toBe(23)
    const noventa = calcularProgresso('2026-01-01', '2026-04-01', [], null)
    expect(noventa.estagioGuardiao).toBe(3)
    expect(noventa.proximoMarco).toBeNull()
  })
})

describe('datas', () => {
  it('usa a data local do aparelho', () => {
    expect(hojeISO(new Date(2026, 9, 27, 23, 30))).toBe('2026-10-27')
  })
  it('calcula diferença em dias atravessando meses', () => {
    expect(diferencaEmDias('2026-09-30', '2026-10-02')).toBe(2)
  })
})
