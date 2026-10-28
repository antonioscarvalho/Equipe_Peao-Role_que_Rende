import { beforeEach, describe, expect, it } from 'vitest'
import { dataLocal } from '@/domain/datas'
import { progresso } from '@/domain/progresso'
import { checkins } from './checkins'
import { configuracao } from './configuracao'
import { apagarBanco } from './db'
import { carregarDemo } from './demo'
import { episodiosSos } from './episodiosSos'

describe('modo demo (?demo)', () => {
  beforeEach(() => apagarBanco())

  it('no dia 1 do mês a Banca não vê o contador em 0', async () => {
    const hoje = new Date(2026, 10, 1, 10)
    await carregarDemo(hoje)
    const p = progresso(dataLocal(hoje), await checkins.listar(), 150)

    expect(p.totalSemApostar).toBe(41)
    expect(p.inicio).toBe('2026-09-17')
    expect(p.sequenciaAtual).toBe(8)
    expect(p.dinheiroPreservado).toBe(878)
  })

  it('mostra um lapso que não apagou nada e guarda a estimativa e a meta', async () => {
    await carregarDemo(new Date(2026, 9, 27, 10))
    const lapsos = (await checkins.listar()).filter((c) => c.apostou)
    expect(lapsos).toEqual([expect.objectContaining({ data: '2026-10-18', gatilhos: ['dia do pagamento'] })])
    expect(await configuracao.lerFinancas()).toMatchObject({ gastoSemanalEstimado: 150 })
  })

  it('troca os check-ins do aparelho, mas não mexe nos episódios do SOS', async () => {
    await checkins.registrar(false, undefined, new Date(2020, 0, 1, 21))
    const episodio = await episodiosSos.iniciar(7)
    await carregarDemo(new Date(2026, 9, 27, 10))

    expect((await checkins.listar()).some((c) => c.data === '2020-01-01')).toBe(false)
    expect(await episodiosSos.listar()).toEqual([expect.objectContaining({ id: episodio.id })])
  })
})
