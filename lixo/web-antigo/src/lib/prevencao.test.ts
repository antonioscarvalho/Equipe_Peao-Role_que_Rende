import { beforeEach, describe, expect, it } from 'vitest'
import { apagarBanco, type PlanoSeEntao } from './db'
import { LIMITE_PLANOS, LimiteAtingido, prevencao } from './prevencao'

describe('prevencao (IndexedDB local)', () => {
  beforeEach(() => apagarBanco())

  it('CA-1: gatilhos ficam salvos entre leituras, sem repetição e com o "outro" limpo', async () => {
    await prevencao.salvarGatilhos(['tédio', 'briga', 'tédio', 'outro'], '  sexta à noite ')
    expect(await prevencao.lerGatilhos()).toMatchObject({
      selecionados: ['tédio', 'briga', 'outro'],
      outro: 'sexta à noite',
    })
    await prevencao.salvarGatilhos(['bebida'], '   ')
    const salvo = await prevencao.lerGatilhos()
    expect(salvo?.selecionados).toEqual(['bebida'])
    expect(salvo).not.toHaveProperty('outro')
  })

  it('CA-2: cria, edita e apaga planos', async () => {
    const plano = await prevencao.salvarPlano({ se: ' for dia do pagamento ', entao: 'pagar as contas' })
    expect(plano).toMatchObject({ se: 'for dia do pagamento', entao: 'pagar as contas' })

    await prevencao.salvarPlano({ id: plano.id, se: plano.se, entao: 'caminhar 10 minutos' })
    const [editado] = await prevencao.listarPlanos()
    expect(editado).toMatchObject({ id: plano.id, entao: 'caminhar 10 minutos', criadoEm: plano.criadoEm })
    expect(await prevencao.listarPlanos()).toHaveLength(1)

    await prevencao.apagarPlano(plano.id)
    expect(await prevencao.listarPlanos()).toEqual([])
  })

  it('CA-2: recusa o 6º plano, mas deixa editar quando está no limite', async () => {
    const planos: PlanoSeEntao[] = []
    for (let i = 1; i <= LIMITE_PLANOS; i++) planos.push(await prevencao.salvarPlano({ se: `gatilho ${i}`, entao: 'caminhar' }))

    await expect(prevencao.salvarPlano({ se: 'mais um', entao: 'caminhar' })).rejects.toBeInstanceOf(LimiteAtingido)
    expect(await prevencao.listarPlanos()).toHaveLength(LIMITE_PLANOS)

    await prevencao.salvarPlano({ id: planos[0].id, se: 'gatilho 1', entao: 'ouvir música' })
    expect((await prevencao.listarPlanos()).find((p) => p.id === planos[0].id)?.entao).toBe('ouvir música')

    await prevencao.apagarPlano(planos[1].id)
    await expect(prevencao.salvarPlano({ se: 'agora cabe', entao: 'caminhar' })).resolves.toBeTruthy()
  })

  it('recusa plano com campo vazio', async () => {
    await expect(prevencao.salvarPlano({ se: '  ', entao: 'caminhar' })).rejects.toThrow()
    expect(await prevencao.listarPlanos()).toEqual([])
  })
})
