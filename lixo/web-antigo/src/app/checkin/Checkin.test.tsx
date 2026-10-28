import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkins } from '@/lib/checkins'
import { apagarBanco } from '@/lib/db'
import { Checkin } from './Checkin'

function renderizar() {
  const props = { aoPedirAjuda: vi.fn(), aoTerminar: vi.fn() }
  render(<Checkin {...props} hoje="2026-10-27" />)
  return props
}

describe('Pós-lapso', () => {
  beforeEach(async () => {
    // O check-in grava com o relógio real; fixa só o Date em "hoje" para o teste não depender do dia em que roda.
    vi.useFakeTimers({ toFake: ['Date'], now: new Date(2026, 9, 27, 21) })
    await apagarBanco()
  })
  afterEach(() => vi.useRealTimers())

  it('CA-3 e CA-4: agradece, pergunta o gatilho, o plano e mostra o total desde o início', async () => {
    await checkins.registrar(false, undefined, new Date(2026, 9, 25, 21))
    await checkins.registrar(false, undefined, new Date(2026, 9, 26, 21))
    const { aoTerminar } = renderizar()

    expect(screen.getByRole('heading', { name: 'Obrigado por registrar.' })).toHaveFocus()
    expect(screen.getByText('Isso não apaga o que você já construiu.')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    expect(screen.getByRole('heading', { name: 'O que aconteceu antes?' })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: 'tédio' }))
    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))

    expect(screen.getByRole('heading', { name: 'O que dá pra ajustar no seu plano?' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Agora não' }))

    expect(
      await screen.findByRole('heading', { name: 'Você já tem 2 dias sem apostar. Bora retomar o caminho?' }),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Voltar pro início' }))
    expect(aoTerminar).toHaveBeenCalled()

    await waitFor(async () => {
      const deHoje = (await checkins.listar()).find((c) => c.data === '2026-10-27')
      expect(deHoje).toMatchObject({ apostou: true, gatilhos: ['tédio'] })
    })
  })

  it('CA-3: o relato livre é opcional e fica no registro do dia', async () => {
    renderizar()
    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    await userEvent.type(screen.getByLabelText('Quer contar com suas palavras?'), 'recebi o salário e fiquei sozinho')
    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    await waitFor(async () =>
      expect((await checkins.listar())[0]).toMatchObject({ apostou: true, relato: 'recebi o salário e fiquei sozinho' }),
    )
  })

  it('relato com sinal de risco oferece ajuda, sem impedir de seguir', async () => {
    const { aoPedirAjuda } = renderizar()
    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    expect(screen.queryByRole('button', { name: 'Falar com alguém agora' })).not.toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Quer contar com suas palavras?'), 'não aguento mais')
    expect(screen.getByRole('status')).toHaveTextContent('Você não precisa passar por isso sozinho(a).')
    await userEvent.click(screen.getByRole('button', { name: 'Falar com alguém agora' }))
    expect(aoPedirAjuda).toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    expect(screen.getByRole('heading', { name: 'O que dá pra ajustar no seu plano?' })).toBeInTheDocument()
  })

  it('pular o gatilho não grava gatilho nenhum', async () => {
    renderizar()
    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    expect(screen.getByRole('heading', { name: 'O que dá pra ajustar no seu plano?' })).toBeInTheDocument()
    expect(await checkins.listar()).toEqual([])
  })

  it('"Tô mal com isso" leva à crise em qualquer passo', async () => {
    const { aoPedirAjuda } = renderizar()
    await userEvent.click(screen.getByRole('button', { name: 'Tô mal com isso' }))
    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    await userEvent.click(screen.getByRole('button', { name: 'Tô mal com isso' }))
    expect(aoPedirAjuda).toHaveBeenCalledTimes(2)
  })
})
