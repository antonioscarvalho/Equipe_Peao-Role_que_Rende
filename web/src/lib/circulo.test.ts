import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { circulo, LIMITE_CONTATOS, LimiteAtingido, TelefoneInvalido } from './circulo'
import { apagarBanco } from './db'

describe('circulo (IndexedDB local)', () => {
  const fetchEspiao = vi.fn()

  beforeEach(async () => {
    await apagarBanco()
    vi.stubGlobal('fetch', fetchEspiao)
  })

  afterEach(() => {
    expect(fetchEspiao).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('CA-4: guarda nome e telefone normalizado só no aparelho', async () => {
    await circulo.salvar({ nome: ' Irmão (exemplo) ', telefone: '(61) 90000-0000' })
    expect(await circulo.listar()).toEqual([
      expect.objectContaining({ nome: 'Irmão (exemplo)', telefone: '5561900000000' }),
    ])
  })

  it('CA-4: recusa o 4º contato, mas deixa editar no limite', async () => {
    const salvos = []
    for (let i = 1; i <= LIMITE_CONTATOS; i++) {
      salvos.push(await circulo.salvar({ nome: `Pessoa ${i} (exemplo)`, telefone: `(61) 90000-000${i}` }))
    }
    await expect(circulo.salvar({ nome: 'Mais uma', telefone: '(61) 90000-0009' })).rejects.toBeInstanceOf(LimiteAtingido)
    expect(await circulo.listar()).toHaveLength(LIMITE_CONTATOS)

    await circulo.salvar({ id: salvos[0].id, nome: 'Mãe (exemplo)', telefone: salvos[0].telefone })
    expect((await circulo.listar()).find((c) => c.id === salvos[0].id)?.nome).toBe('Mãe (exemplo)')

    await circulo.apagar(salvos[2].id)
    expect(await circulo.listar()).toHaveLength(LIMITE_CONTATOS - 1)
  })

  it('recusa telefone inválido e nome vazio', async () => {
    await expect(circulo.salvar({ nome: 'Alguém', telefone: '9000' })).rejects.toBeInstanceOf(TelefoneInvalido)
    await expect(circulo.salvar({ nome: '  ', telefone: '(61) 90000-0000' })).rejects.toThrow()
    expect(await circulo.listar()).toEqual([])
  })

  it('apagar o banco remove os contatos', async () => {
    await circulo.salvar({ nome: 'Irmão (exemplo)', telefone: '(61) 90000-0000' })
    await apagarBanco()
    expect(await circulo.listar()).toEqual([])
  })
})
