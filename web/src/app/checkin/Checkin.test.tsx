import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkins } from '@/lib/checkins'
import { apagarBanco } from '@/lib/db'
import { Checkin } from './Checkin'

function renderizar() {
  const props = { aoPedirAjuda: vi.fn(), aoTerminar: vi.fn() }
  render(<Checkin {...props} hoje="2026-10-27" />)
  return props
}

describe('Pós-lapso', () => {
  beforeEach(() => apagarBanco())

  it('CA-3 e CA-4: agradece, pergunta o gatilho, o plano e mostra o total do mês', async () => {
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
      await screen.findByRole('heading', { name: 'Este mês você já tem 2 dias sem apostar. Bora retomar o caminho?' }),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Voltar pro início' }))
    expect(aoTerminar).toHaveBeenCalled()

    await waitFor(async () => {
      const deHoje = (await checkins.listar()).find((c) => c.data === '2026-10-27')
      expect(deHoje).toMatchObject({ apostou: true, gatilhos: ['tédio'] })
    })
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
