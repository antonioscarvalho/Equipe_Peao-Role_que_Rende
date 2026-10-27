import { beforeEach, describe, expect, it } from 'vitest'
import { apagarBanco } from './db'
import { episodiosSos } from './episodiosSos'

describe('episodiosSos (IndexedDB local)', () => {
  beforeEach(() => apagarBanco())

  it('guarda a vontade antes e depois do SOS', async () => {
    const episodio = await episodiosSos.iniciar(8)
    await episodiosSos.atualizar(episodio.id, { vontadeDepois: 3 })

    const [salvo] = await episodiosSos.listar()
    expect(salvo).toMatchObject({ vontadeAntes: 8, vontadeDepois: 3, foiParaCrise: false })
  })

  it('marca quando o SOS levou para a crise', async () => {
    const episodio = await episodiosSos.iniciar(10)
    await episodiosSos.atualizar(episodio.id, { foiParaCrise: true })

    const [salvo] = await episodiosSos.listar()
    expect(salvo.foiParaCrise).toBe(true)
  })

  it('apagar o banco remove tudo', async () => {
    await episodiosSos.iniciar(5)
    await apagarBanco()
    expect(await episodiosSos.listar()).toEqual([])
  })
})
