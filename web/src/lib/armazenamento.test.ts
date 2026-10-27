import { describe, expect, it } from 'vitest'
import { CHAVE, criarRepositorioLocal } from './armazenamento'
import { estadoInicial } from '@/domain/tipos'

describe('repositório local', () => {
  it('salva, lê e apaga tudo', () => {
    const repo = criarRepositorioLocal(localStorage)
    const e = { ...estadoInicial(), contatos: [{ nome: 'Ana', telefone: '61999990000' }] }
    repo.salvar(e)
    expect(repo.ler().contatos).toHaveLength(1)
    repo.apagarTudo()
    expect(localStorage.getItem(CHAVE)).toBeNull()
    expect(repo.ler().contatos).toHaveLength(0)
  })

  it('volta ao estado inicial se o dado estiver corrompido', () => {
    localStorage.setItem(CHAVE, '{quebrado')
    expect(criarRepositorioLocal(localStorage).ler()).toEqual(estadoInicial())
  })

  it('funciona em memória quando não há storage', () => {
    const repo = criarRepositorioLocal(null)
    repo.salvar({ ...estadoInicial(), bloqueioFeitos: ['dns'] })
    expect(repo.ler().bloqueioFeitos).toEqual(['dns'])
  })
})
