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
    await checkins.registrar(true, ['tédio'], new Date(2026, 9, 27, 22))
    expect(await checkins.listar()).toEqual([
      expect.objectContaining({ data: '2026-10-27', apostou: true, gatilhos: ['tédio'] }),
    ])
  })

  it('não guarda gatilho quando a pessoa não apostou', async () => {
    const salvo = await checkins.registrar(false, ['tédio'])
    expect(salvo.gatilhos).toBeUndefined()
  })

  it('a estimativa de gasto começa vazia e é guardada', async () => {
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: null })
    await configuracao.salvarFinancas({ gastoSemanalEstimado: 150 })
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: 150 })
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
    expect(db.version).toBe(2)
    expect(await episodiosSos.listar()).toHaveLength(1)
    await checkins.registrar(false)
    expect(await checkins.listar()).toHaveLength(1)
  })
})
