import { beforeEach, describe, expect, it } from 'vitest'
import { APARENCIA_PADRAO } from '@/domain/aparencia'
import { aparencia } from './aparencia'
import { abrirBanco, apagarBanco } from './db'
import { configuracao } from './configuracao'

describe('repositório da aparência', () => {
  beforeEach(() => apagarBanco())

  it('começa com o visual original e guarda a escolha no aparelho', async () => {
    expect(await aparencia.ler()).toEqual(APARENCIA_PADRAO)
    await aparencia.salvar({ ...APARENCIA_PADRAO, cor: 'menta', cabeca: 'gorro' })
    expect(await aparencia.ler()).toMatchObject({ cor: 'menta', cabeca: 'gorro' })
  })

  it('não mistura com as finanças na mesma store', async () => {
    await configuracao.salvarFinancas({ gastoSemanalEstimado: 100, meta: 'luz' })
    await aparencia.salvar({ ...APARENCIA_PADRAO, cor: 'rosa' })
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: 100, meta: 'luz' })
  })

  it('ignora dado inválido gravado por outra versão', async () => {
    const db = await abrirBanco()
    await db.put('configuracao', { cor: 'dourado', roupa: 'camiseta' }, 'aparencia')
    expect(await aparencia.ler()).toEqual({ ...APARENCIA_PADRAO, roupa: 'camiseta' })
  })
})
