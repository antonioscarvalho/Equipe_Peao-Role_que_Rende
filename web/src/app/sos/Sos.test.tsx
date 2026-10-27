import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apagarBanco } from '@/lib/db'
import { episodiosSos } from '@/lib/episodiosSos'
import { Sos } from './Sos'

function renderizar(props: Partial<Parameters<typeof Sos>[0]> = {}) {
  const aoPedirAjuda = vi.fn()
  const aoTerminar = vi.fn()
  render(<Sos aoPedirAjuda={aoPedirAjuda} aoTerminar={aoTerminar} {...props} />)
  return { aoPedirAjuda, aoTerminar }
}

async function marcar(nivel: number) {
  await userEvent.click(screen.getByRole('button', { name: `${nivel} de 10` }))
}

async function irAteOFim() {
  await userEvent.click(screen.getByRole('button', { name: 'Ir pro próximo passo' }))
  await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
  await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
}

describe('SOS', () => {
  beforeEach(() => apagarBanco())

  it('CA-3 e CA-6: percorre os passos e salva a vontade antes e depois só no aparelho', async () => {
    const { aoTerminar } = renderizar({ motivo: 'Voltar a dormir bem' })

    await marcar(8)
    expect(screen.getByRole('heading', { name: /Respira/ })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Ir pro próximo passo' }))
    expect(screen.getByText('“Voltar a dormir bem”')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    expect(screen.getByRole('heading', { name: 'Pare e examine' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    await userEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    expect(screen.getByRole('heading', { name: 'E agora, quanto tá a vontade?' })).toBeInTheDocument()

    await marcar(3)
    expect(screen.getByRole('status')).toHaveTextContent('Começou em 8, agora tá em 3.')

    await waitFor(async () => {
      const [episodio] = await episodiosSos.listar()
      expect(episodio).toMatchObject({ vontadeAntes: 8, vontadeDepois: 3 })
    })

    await userEvent.click(screen.getByRole('button', { name: 'Voltar pro início' }))
    expect(aoTerminar).toHaveBeenCalled()
  })

  it('pula o passo do motivo quando a pessoa ainda não tem um', async () => {
    renderizar()
    await marcar(5)
    await userEvent.click(screen.getByRole('button', { name: 'Ir pro próximo passo' }))
    expect(screen.getByRole('heading', { name: 'Pare e examine' })).toBeInTheDocument()
  })

  it('o timer da onda avança sozinho quando termina', async () => {
    renderizar({ duracaoOnda: 1 })
    await marcar(6)
    expect(await screen.findByRole('heading', { name: 'Pare e examine' }, { timeout: 3000 })).toBeInTheDocument()
  })

  it('CA-4: "Não tô aguentando" leva à crise', async () => {
    const { aoPedirAjuda } = renderizar()
    await userEvent.click(screen.getByRole('button', { name: 'Não tô aguentando' }))
    expect(aoPedirAjuda).toHaveBeenCalled()
  })

  it('CA-4: terminar com vontade ≥ 9 oferece CVV e mais ajuda', async () => {
    const { aoPedirAjuda } = renderizar()
    await marcar(9)
    await irAteOFim()
    await marcar(9)

    expect(screen.getByRole('link', { name: /CVV · 188/ })).toHaveAttribute('href', 'tel:188')
    await userEvent.click(screen.getByRole('button', { name: 'Ver mais formas de ajuda' }))
    expect(aoPedirAjuda).toHaveBeenCalled()
    await waitFor(async () => {
      const [episodio] = await episodiosSos.listar()
      expect(episodio.foiParaCrise).toBe(true)
    })
  })

  it('quando a vontade não cai, acolhe e oferece conversa', async () => {
    renderizar()
    await marcar(4)
    await irAteOFim()
    await marcar(5)
    expect(screen.getByRole('status')).toHaveTextContent('Tá difícil hoje. Quer falar com alguém agora?')
  })
})
