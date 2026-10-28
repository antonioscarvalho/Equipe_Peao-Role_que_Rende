import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { APARENCIA_PADRAO } from '@/domain/aparencia'
import { PERFIL_PADRAO } from '@/domain/perfil'
import { usePerfil } from '@/hooks/usePerfil'
import { aparencia } from './aparencia'
import { abrirBanco, apagarBanco } from './db'
import { prepararFoto } from './foto'
import { perfil } from './perfil'

const fotoDeTeste = () => ({ tipo: 'image/webp', bytes: new Uint8Array([82, 73, 70, 70]).buffer, lado: 256 })

describe('repositório do perfil', () => {
  beforeEach(() => apagarBanco())

  it('começa sem nome e no bairro, e guarda a escolha no aparelho', async () => {
    expect(await perfil.ler()).toEqual(PERFIL_PADRAO)
    await perfil.salvar({ nome: '  Bia ', cenario: 'bairro' })
    expect(await perfil.ler()).toEqual({ nome: 'Bia', cenario: 'bairro' })
  })

  it('ignora dado inválido gravado por outra versão', async () => {
    const db = await abrirBanco()
    await db.put('perfil', { nome: 'x@y.com', cenario: 'cassino' }, 'dados')
    expect(await perfil.ler()).toEqual(PERFIL_PADRAO)
  })

  it('guarda, lê e apaga a foto em bytes', async () => {
    expect(await perfil.lerFoto()).toBeNull()
    await perfil.salvarFoto(fotoDeTeste())
    const lida = await perfil.lerFoto()
    expect(lida?.tipo).toBe('image/webp')
    expect(new Uint8Array(lida!.bytes)).toEqual(new Uint8Array([82, 73, 70, 70]))
    await perfil.apagarFoto()
    expect(await perfil.lerFoto()).toBeNull()
  })

  it('"Apagar tudo" leva o perfil junto', async () => {
    await perfil.salvar({ nome: 'Bia', cenario: 'bairro' })
    await perfil.salvarFoto(fotoDeTeste())
    await apagarBanco()
    expect(await perfil.ler()).toEqual(PERFIL_PADRAO)
    expect(await perfil.lerFoto()).toBeNull()
  })
})

describe('prepararFoto', () => {
  it('recusa tipo e tamanho antes de abrir o arquivo', async () => {
    await expect(prepararFoto(new File(['x'], 'a.gif', { type: 'image/gif' }))).rejects.toMatchObject({ motivo: 'tipo' })
    const grande = new File(['x'], 'a.jpg', { type: 'image/jpeg' })
    Object.defineProperty(grande, 'size', { value: 16 * 1024 * 1024 })
    await expect(prepararFoto(grande)).rejects.toMatchObject({ motivo: 'tamanho' })
  })
})

describe('usePerfil', () => {
  beforeEach(() => apagarBanco())

  it('junta o perfil e a aparência que já estavam salvos', async () => {
    await perfil.salvar({ nome: 'Bia', cenario: 'bairro' })
    await aparencia.salvar({ ...APARENCIA_PADRAO, cor: 'menta' })
    const { result } = renderHook(() => usePerfil())
    await waitFor(() => expect(result.current.estado).toBe('pronto'))
    expect(result.current.perfil.nome).toBe('Bia')
    expect(result.current.aparencia.cor).toBe('menta')
    expect(result.current.temFoto).toBe(false)
  })

  it('grava nome válido e devolve o erro do inválido sem gravar', async () => {
    const { result } = renderHook(() => usePerfil())
    await waitFor(() => expect(result.current.estado).toBe('pronto'))

    let erro: string | null = 'nao-chamado'
    act(() => {
      erro = result.current.mudarNome(' Zé ')
    })
    expect(erro).toBeNull()
    expect(result.current.perfil.nome).toBe('Zé')
    await waitFor(async () => expect((await perfil.ler()).nome).toBe('Zé'))

    act(() => {
      erro = result.current.mudarNome('zé@email.com')
    })
    expect(erro).toBe('caracteres')
    expect(result.current.perfil.nome).toBe('Zé')
  })

  it('apagar o nome volta para "sem nome"', async () => {
    await perfil.salvar({ nome: 'Bia', cenario: 'bairro' })
    const { result } = renderHook(() => usePerfil())
    await waitFor(() => expect(result.current.perfil.nome).toBe('Bia'))
    act(() => {
      result.current.mudarNome('   ')
    })
    await waitFor(async () => expect((await perfil.ler()).nome).toBeNull())
  })

  it('foto recusada devolve o motivo e não apaga a anterior', async () => {
    await perfil.salvarFoto(fotoDeTeste())
    const { result } = renderHook(() => usePerfil())
    await waitFor(() => expect(result.current.temFoto).toBe(true))

    let motivo: string | null = null
    await act(async () => {
      motivo = await result.current.trocarFoto(new File(['x'], 'a.pdf', { type: 'application/pdf' }))
    })
    expect(motivo).toBe('tipo')
    expect(result.current.temFoto).toBe(true)
    expect(await perfil.lerFoto()).not.toBeNull()
  })

  it('tirar a foto apaga do aparelho', async () => {
    await perfil.salvarFoto(fotoDeTeste())
    const { result } = renderHook(() => usePerfil())
    await waitFor(() => expect(result.current.temFoto).toBe(true))
    expect(result.current.fotoUrl).toBe('data:image/webp;base64,UklGRg==')
    act(() => result.current.tirarFoto())
    expect(result.current.temFoto).toBe(false)
    expect(result.current.fotoUrl).toBeNull()
    await waitFor(async () => expect(await perfil.lerFoto()).toBeNull())
  })
})
