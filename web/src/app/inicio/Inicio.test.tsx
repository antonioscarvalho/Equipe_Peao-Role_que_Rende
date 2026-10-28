import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkins } from '@/lib/checkins'
import { configuracao } from '@/lib/configuracao'
import { apagarBanco } from '@/lib/db'
import { type AbaInicio, Inicio } from './Inicio'

const HOJE = '2026-10-27'

function renderizar(abaAtiva: AbaInicio = 'diario') {
  const props = {
    aoAbrirSos: vi.fn(),
    aoApostar: vi.fn(),
    aoAbrirDinheiro: vi.fn(),
    aoAbrirPlano: vi.fn(),
    aoAbrirCirculo: vi.fn(),
    abaAtiva,
  }
  render(<Inicio {...props} hoje={HOJE} />)
  return props
}

describe('Início · check-in diário e rolê', () => {
  beforeEach(() => apagarBanco())

  it('CA-1 e CA-2: "Não apostei" grava com 1 toque e responde só "Anotado."', async () => {
    renderizar('diario')
    expect(await screen.findByText('0 dias sem apostar')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Não apostei' }))

    expect(screen.getByText('Anotado.')).toBeInTheDocument()
    expect(screen.getByText('1 dia sem apostar desde 27 de outubro')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Não apostei' })).toHaveAttribute('aria-pressed', 'true')
    await waitFor(async () => expect(await checkins.listar()).toHaveLength(1))
  })

  it('CA-1 e CA-3: "Apostei" grava o dia e abre o pós-lapso', async () => {
    const { aoApostar } = renderizar('diario')
    await userEvent.click(screen.getByRole('button', { name: 'Apostei' }))
    expect(aoApostar).toHaveBeenCalled()
    await waitFor(async () => expect((await checkins.listar())[0]).toMatchObject({ apostou: true }))
  })

  it('CA-4: o total desde o início é o número principal, e o lapso não o apaga', async () => {
    await checkins.registrar(false, undefined, new Date(2026, 8, 29, 21))
    await checkins.registrar(false, undefined, new Date(2026, 8, 30, 21))
    await checkins.registrar(false, undefined, new Date(2026, 9, 20, 21))
    await checkins.registrar(true, undefined, new Date(2026, 9, 21, 21))
    await checkins.registrar(false, undefined, new Date(2026, 9, 25, 21))
    await checkins.registrar(false, undefined, new Date(2026, 9, 26, 21))
    renderizar('diario')
    expect(await screen.findByText('5 dias sem apostar desde 29 de setembro')).toBeInTheDocument()
    expect(screen.getByText('3 neste mês · sequência atual: 2 dias')).toBeInTheDocument()
    expect(screen.getByText('23 dias deste mês ainda sem registro.')).toBeInTheDocument()
  })

  it('CA-4: com "Apostei" hoje a sequência some, e o total fica', async () => {
    await checkins.registrar(false, undefined, new Date(2026, 9, 26, 21))
    renderizar('diario')
    await userEvent.click(await screen.findByRole('button', { name: 'Apostei' }))
    expect(screen.getByText('1 dia sem apostar desde 26 de outubro')).toBeInTheDocument()
    expect(screen.getByText('1 neste mês')).toBeInTheDocument()
  })

  it('CA-6: sem gasto informado, convida em vez de mostrar valor', async () => {
    const { aoAbrirDinheiro } = renderizar('diario')
    await userEvent.click(await screen.findByRole('button', { name: 'Quer ver quanto você preservou?' }))
    expect(aoAbrirDinheiro).toHaveBeenCalled()
    expect(screen.queryByText(/Grana preservada/)).not.toBeInTheDocument()
  })

  it('CA-5: com gasto e meta, mostra a estimativa ligada à meta', async () => {
    for (const dia of [20, 21, 22, 23, 24, 25, 26]) await checkins.registrar(false, undefined, new Date(2026, 9, dia, 21))
    await configuracao.salvarFinancas({ gastoSemanalEstimado: 70, meta: 'conta de luz' })
    renderizar('diario')
    const linha = await screen.findByText(/Grana preservada \(estimativa\)/)
    expect(linha).toHaveTextContent(/≈ cerca de R\$\s70 — conta de luz/)
    expect(screen.getByRole('button', { name: 'Ver dinheiro preservado' })).toBeInTheDocument()
  })

  it('CA-1: o humor é opcional, aparece depois do registro e guarda um só', async () => {
    renderizar('diario')
    await screen.findByText('0 dias sem apostar')
    expect(screen.queryByRole('group', { name: 'Como você está se sentindo?' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Não apostei' }))
    await userEvent.click(screen.getByRole('button', { name: 'Mal' }))
    await userEvent.click(screen.getByRole('button', { name: 'Bem' }))
    expect(screen.getByRole('button', { name: 'Bem' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Mal' })).toHaveAttribute('aria-pressed', 'false')
    await waitFor(async () => expect((await checkins.listar())[0]).toMatchObject({ humor: 4 }))

    await userEvent.click(screen.getByRole('button', { name: 'Bem' }))
    await waitFor(async () => expect((await checkins.listar())[0]).not.toHaveProperty('humor'))
  })

  it('na aba rolê exibe apenas a prova visual limpa (Bichinho, Bairro e Missões do dia)', async () => {
    renderizar('role')
    expect(screen.getByRole('heading', { name: /Seu rolê de hoje/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Missões do dia' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Como foi hoje?' })).not.toBeInTheDocument()
  })
})
