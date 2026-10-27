import { render, screen, within } from '@testing-library/react'
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

  it('CA-5 e CA-7: sem estimativa, pergunta o valor em vez de chutar, e calcula depois', async () => {
    for (const dia of [20, 21, 22, 23, 24, 25, 26]) await checkins.registrar(false, undefined, new Date(2026, 9, dia, 21))
    renderizar()

    const campo = await screen.findByLabelText('Quanto você costumava gastar com apostas por semana?')
    await userEvent.type(campo, '70')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText('Estimativa de dinheiro preservado em outubro')).toBeInTheDocument()
    expect(screen.getByText(reais('R$ 70'))).toBeInTheDocument()
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: 70 })
  })

  it('valor inválido mostra o erro em texto e não salva', async () => {
    renderizar()
    const campo = await screen.findByLabelText('Quanto você costumava gastar com apostas por semana?')
    await userEvent.type(campo, 'abc')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText(/Digite um valor em reais maior que zero/)).toBeInTheDocument()
    expect(campo).toHaveAttribute('aria-invalid', 'true')
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: null })
  })

  it('aceita vírgula como separador decimal', async () => {
    renderizar()
    await userEvent.type(await screen.findByRole('textbox'), '120,50')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(await configuracao.lerFinancas()).toEqual({ gastoSemanalEstimado: 120.5 })
  })

  it('sem meta conferida na fonte, não oferece a visão em coisas do dia a dia', async () => {
    await configuracao.salvarFinancas({ gastoSemanalEstimado: 70 })
    renderizar()
    await screen.findByText('Estimativa de dinheiro preservado em outubro')
    expect(screen.queryByRole('button', { name: 'Em coisas do dia a dia' })).not.toBeInTheDocument()
  })

  it('CA-6: a simulação de Open Finance avisa que são dados de exemplo', async () => {
    renderizar()
    const simulacao = screen.getByRole('region', { name: 'Simulação de Open Finance' })
    expect(within(simulacao).getByText(/Simulação com dados de exemplo/)).toBeInTheDocument()

    await userEvent.click(within(simulacao).getByRole('button', { name: 'Ver a simulação' }))
    expect(within(simulacao).getByText(/Pix para intermediadoras de apostas em setembro/)).toBeInTheDocument()
    expect(within(simulacao).getByText(/a menos que no mês anterior/)).toBeInTheDocument()
  })
})
