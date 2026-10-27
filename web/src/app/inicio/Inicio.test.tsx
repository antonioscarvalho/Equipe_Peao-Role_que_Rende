import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkins } from '@/lib/checkins'
import { apagarBanco } from '@/lib/db'
import { Inicio } from './Inicio'

const HOJE = '2026-10-27'

function renderizar() {
  const props = { aoAbrirSos: vi.fn(), aoApostar: vi.fn(), aoAbrirDinheiro: vi.fn() }
  render(<Inicio {...props} hoje={HOJE} />)
  return props
}

describe('Início · check-in diário', () => {
  beforeEach(() => apagarBanco())

  it('CA-1 e CA-2: "Não apostei" grava com 1 toque e responde só "Anotado."', async () => {
    renderizar()
    expect(await screen.findByText('0 dias sem apostar em outubro')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Não apostei' }))

    expect(screen.getByText('Anotado.')).toBeInTheDocument()
    expect(screen.getByText('1 dia sem apostar em outubro')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Não apostei' })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(async () => expect(await checkins.listar()).toHaveLength(1))
  })

  it('CA-1 e CA-3: "Apostei" grava o dia e abre o pós-lapso', async () => {
    const { aoApostar } = renderizar()
    await userEvent.click(screen.getByRole('button', { name: 'Apostei' }))
    expect(aoApostar).toHaveBeenCalled()
    await waitFor(async () => expect((await checkins.listar())[0]).toMatchObject({ apostou: true }))
  })

  it('CA-4: mostra o total do mês com os dias de antes do lapso', async () => {
    await checkins.registrar(false, undefined, new Date(2026, 9, 20, 21))
    await checkins.registrar(false, undefined, new Date(2026, 9, 21, 21))
    await checkins.registrar(true, undefined, new Date(2026, 9, 22, 21))
    renderizar()
    expect(await screen.findByText('2 dias sem apostar em outubro')).toBeInTheDocument()
    expect(screen.getByText('24 dias deste mês ainda sem registro.')).toBeInTheDocument()
  })

  it('o SOS continua a 1 toque', async () => {
    const { aoAbrirSos } = renderizar()
    await userEvent.click(screen.getByRole('button', { name: 'Bateu a vontade?' }))
    expect(aoAbrirSos).toHaveBeenCalled()
  })
})
