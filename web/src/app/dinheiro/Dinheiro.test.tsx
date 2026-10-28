import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkins } from '@/lib/checkins'
import { configuracao } from '@/lib/configuracao'
import { apagarBanco } from '@/lib/db'
import { Dinheiro } from './Dinheiro'

function renderizar() {
  const aoVoltar = vi.fn()
  render(<Dinheiro aoVoltar={aoVoltar} hoje="2026-10-27" />)
  return { aoVoltar }
}

// O toLocaleString põe um espaço não separável entre "R$" e o número.
const reais = (texto: string) => new RegExp(`^${texto.replace('R$ ', 'R\\$\\s')}$`)

describe('Dinheiro preservado', () => {
  beforeEach(() => apagarBanco())

  it('CA-5 e CA-6: sem estimativa, convida e pergunta em vez de chutar, e calcula sobre o total', async () => {
    for (const dia of [28, 29, 30]) await checkins.registrar(false, undefined, new Date(2026, 8, dia, 21))
    for (const dia of [20, 21, 22, 23]) await checkins.registrar(false, undefined, new Date(2026, 9, dia, 21))
    renderizar()

    expect(await screen.findByText('Quer ver quanto você preservou?')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Quanto você costumava gastar com apostas por semana?'), '70')
    await userEvent.type(screen.getByLabelText('Pra onde você quer levar esse dinheiro?'), ' conta de luz ')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText('Estimativa de dinheiro preservado desde 28 de setembro')).toBeInTheDocument()
    expect(screen.getByText(reais('≈ R$ 70'))).toBeInTheDocument()
    expect(screen.getByText('Sua meta: conta de luz')).toBeInTheDocument()
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: 70, meta: 'conta de luz' })
  })

  it('CA-6: a meta é opcional e dá para mudar depois', async () => {
    await configuracao.salvarFinancas({ gastoSemanalEstimado: 70, meta: null })
    renderizar()
    await userEvent.click(await screen.findByRole('button', { name: 'Mudar o valor ou a meta' }))
    expect(screen.queryByText('Quer ver quanto você preservou?')).not.toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Pra onde você quer levar esse dinheiro?'), 'botijão')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: 70, meta: 'botijão' })
  })

  it('valor inválido mostra o erro em texto e não salva', async () => {
    renderizar()
    const campo = await screen.findByLabelText('Quanto você costumava gastar com apostas por semana?')
    await userEvent.type(campo, 'abc')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText(/Digite um valor em reais maior que zero/)).toBeInTheDocument()
    expect(campo).toHaveAttribute('aria-invalid', 'true')
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: null, meta: null })
  })

  it('aceita vírgula como separador decimal', async () => {
    renderizar()
    await userEvent.type(await screen.findByLabelText('Quanto você costumava gastar com apostas por semana?'), '120,50')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: 120.5, meta: null })
  })

  it('sem meta conferida na fonte, não oferece a visão em coisas do dia a dia', async () => {
    await configuracao.salvarFinancas({ gastoSemanalEstimado: 70, meta: null })
    renderizar()
    await screen.findByText('Estimativa de dinheiro preservado')
    expect(screen.queryByRole('button', { name: 'Em coisas do dia a dia' })).not.toBeInTheDocument()
  })
})
