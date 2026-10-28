import { openDB } from 'idb'
import { beforeEach, describe, expect, it } from 'vitest'
import { checkins } from './checkins'
import { configuracao } from './configuracao'
import { abrirBanco, apagarBanco } from './db'
import { episodiosSos } from './episodiosSos'

describe('check-in e configuração (IndexedDB local)', () => {
  beforeEach(() => apagarBanco())

  it('dois check-ins no mesmo dia guardam só o último', async () => {
    await checkins.registrar(false, undefined, new Date(2026, 9, 27, 9))
    await checkins.registrar(true, { gatilhos: ['tédio'] }, new Date(2026, 9, 27, 22))
    expect(await checkins.listar()).toEqual([
      expect.objectContaining({ data: '2026-10-27', apostou: true, gatilhos: ['tédio'] }),
    ])
  })

  it('o humor fica no registro do dia, sobrevive a registrar de novo e pode ser tirado', async () => {
    const dia = new Date(2026, 9, 27, 21)
    await checkins.registrarHumor(4, dia)
    expect(await checkins.listar()).toEqual([])

    await checkins.registrar(false, undefined, dia)
    await checkins.registrarHumor(4, dia)
    await checkins.registrar(true, { gatilhos: ['tédio'] }, dia)
    expect((await checkins.listar())[0]).toMatchObject({ apostou: true, humor: 4 })

    await checkins.registrarHumor(null, dia)
    expect((await checkins.listar())[0]).not.toHaveProperty('humor')
  })

  it('não guarda gatilho quando a pessoa não apostou', async () => {
    const salvo = await checkins.registrar(false, { gatilhos: ['tédio'], relato: 'nada' })
    expect(salvo.gatilhos).toBeUndefined()
    expect(salvo.relato).toBeUndefined()
  })

  it('guarda o relato do lapso sem espaços nas pontas, e não guarda relato em branco', async () => {
    const dia = new Date(2026, 9, 27, 21)
    expect((await checkins.registrar(true, { relato: '  recebi o salário  ' }, dia)).relato).toBe('recebi o salário')
    expect(await checkins.registrar(true, { relato: '   ' }, dia)).not.toHaveProperty('relato')
  })

  it('a estimativa de gasto e a meta começam vazias e são guardadas', async () => {
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: null, meta: null })
    await configuracao.salvarFinancas({ gastoSemanalEstimado: 150, meta: 'conta de luz' })
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: 150, meta: 'conta de luz' })
  })

  it('o que foi gravado antes da meta existir continua valendo', async () => {
    const db = await abrirBanco()
    await db.put('configuracao', { gastoSemanalEstimado: 150 } as never, 'financas')
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: 150, meta: null })
  })

  it('subir o banco da versão 1 para a 2 não apaga os episódios do SOS', async () => {
    const v1 = await openDB('guardiao', 1, {
      upgrade(db) {
        db.createObjectStore('episodiosSos', { keyPath: 'id' }).createIndex('porInicio', 'inicio')
      },
    })
    await v1.put('episodiosSos', { id: 'a', inicio: '2026-10-01T10:00:00.000Z', vontadeAntes: 7, foiParaCrise: false })
    v1.close()

    const db = await abrirBanco()
    expect(db.version).toBeGreaterThanOrEqual(2) // a 005 sobe para a 3
    expect(await episodiosSos.listar()).toHaveLength(1)
    await checkins.registrar(false)
    expect(await checkins.listar()).toHaveLength(1)
  })
})
