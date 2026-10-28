import { openDB } from 'idb'
import { beforeEach, describe, expect, it } from 'vitest'
import { abrirBanco, apagarBanco, NOME_BANCO, VERSAO_BANCO } from './db'

describe('banco guardiao (versão 4)', () => {
  beforeEach(() => apagarBanco())

  it('banco novo nasce com todas as stores', async () => {
    const db = await abrirBanco()
    expect(db.version).toBe(VERSAO_BANCO)
    expect([...db.objectStoreNames].sort()).toEqual(
      ['checkins', 'circulo', 'configuracao', 'episodiosSos', 'perfil', 'planos', 'prevencao'].sort(),
    )
  })

  it('quem vem da versão 2 (spec 004) não perde nada e ganha as stores da 005', async () => {
    const v2 = await openDB(NOME_BANCO, 2, {
      upgrade(db) {
        db.createObjectStore('episodiosSos', { keyPath: 'id' }).createIndex('porInicio', 'inicio')
        db.createObjectStore('checkins', { keyPath: 'data' })
        db.createObjectStore('configuracao')
      },
    })
    await v2.put('episodiosSos', { id: 'e1', inicio: '2026-10-01T10:00:00Z', vontadeAntes: 7, foiParaCrise: false })
    await v2.put('checkins', { data: '2026-10-01', apostou: false, registradoEm: '2026-10-01T22:00:00Z' })
    v2.close()

    const db = await abrirBanco()
    expect(await db.get('episodiosSos', 'e1')).toMatchObject({ vontadeAntes: 7 })
    expect(await db.get('checkins', '2026-10-01')).toMatchObject({ apostou: false })
    expect(db.objectStoreNames.contains('planos')).toBe(true)
    expect(db.objectStoreNames.contains('circulo')).toBe(true)
    expect(db.objectStoreNames.contains('prevencao')).toBe(true)
  })

  it('quem vem da versão 1 (só SOS) ganha as stores da 004 e da 005', async () => {
    const v1 = await openDB(NOME_BANCO, 1, {
      upgrade(db) {
        db.createObjectStore('episodiosSos', { keyPath: 'id' }).createIndex('porInicio', 'inicio')
      },
    })
    await v1.put('episodiosSos', { id: 'e1', inicio: '2026-10-01T10:00:00Z', vontadeAntes: 4, foiParaCrise: false })
    v1.close()

    const db = await abrirBanco()
    expect(await db.get('episodiosSos', 'e1')).toBeTruthy()
    expect(db.objectStoreNames.contains('checkins')).toBe(true)
    expect(db.objectStoreNames.contains('configuracao')).toBe(true)
    expect(db.objectStoreNames.contains('planos')).toBe(true)
  })

  it('quem vem da versão 3 (spec 005) não perde a aparência nem o plano e ganha a store do perfil', async () => {
    const v3 = await openDB(NOME_BANCO, 3, {
      upgrade(db) {
        db.createObjectStore('episodiosSos', { keyPath: 'id' }).createIndex('porInicio', 'inicio')
        db.createObjectStore('checkins', { keyPath: 'data' })
        db.createObjectStore('configuracao')
        db.createObjectStore('prevencao')
        db.createObjectStore('planos', { keyPath: 'id' }).createIndex('porCriacao', 'criadoEm')
        db.createObjectStore('circulo', { keyPath: 'id' }).createIndex('porCriacao', 'criadoEm')
      },
    })
    await v3.put('configuracao', { cor: 'menta' }, 'aparencia')
    await v3.put('planos', { id: 'p1', se: 'tédio', entao: 'caminhar', criadoEm: 'x', atualizadoEm: 'x' })
    v3.close()

    const db = await abrirBanco()
    expect(await db.get('configuracao', 'aparencia')).toEqual({ cor: 'menta' })
    expect(await db.get('planos', 'p1')).toMatchObject({ entao: 'caminhar' })
    expect(db.objectStoreNames.contains('perfil')).toBe(true)
  })
})
