import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkins } from '@/lib/checkins'
import { configuracao } from '@/lib/configuracao'
import { apagarBanco } from '@/lib/db'
import { Dinheiro } from './Dinheiro'

function renderizar() {
  const aoVoltar = vi.fn()
  const aoAbrirCheckin = vi.fn()
  render(<Dinheiro aoVoltar={aoVoltar} aoAbrirCheckin={aoAbrirCheckin} hoje="2026-10-27" />)
  return { aoVoltar, aoAbrirCheckin }
}

// O toLocaleString põe um espaço não separável entre "R$" e o número.
const reais = (texto: string) => new RegExp(texto.replace('R$ ', 'R\\$\\s'))

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
    // O "≈" é só visual; quem usa leitor de tela ouve "cerca de".
    expect(document.querySelector('.valor__numero')).toHaveTextContent(reais('≈ cerca de R$ 70'))
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

  it('CA-5: a visão em coisas do dia a dia diz "estimativa", mostra a fonte e só usa meta conferida', async () => {
    for (const dia of [20, 21, 22, 23, 24, 25, 26]) await checkins.registrar(false, undefined, new Date(2026, 9, dia, 21))
    await configuracao.salvarFinancas({ gastoSemanalEstimado: 700, meta: null })
    renderizar()
    await userEvent.click(await screen.findByRole('button', { name: 'Em coisas do dia a dia' }))

    expect(screen.getByText('Estimativa em coisas do dia a dia, desde 20 de outubro')).toBeInTheDocument()
    expect(screen.getByText('Dá pra pagar 6 botijões de gás')).toBeInTheDocument()
    expect(screen.getByText('Dá pra pagar 3 semanas de compras')).toBeInTheDocument()
    expect(screen.getByText(/Valores de referência: .*ANP.*DIEESE/)).toBeInTheDocument()
    // A conta de luz ainda não tem fonte oficial conferida.
    expect(screen.queryByText(/conta de luz|contas de luz/)).not.toBeInTheDocument()
  })

  it('uma meta só no singular quando cabe uma vez', async () => {
    for (const dia of [24, 25, 26]) await checkins.registrar(false, undefined, new Date(2026, 9, dia, 21))
    await configuracao.salvarFinancas({ gastoSemanalEstimado: 450, meta: null })
    renderizar()
    await userEvent.click(await screen.findByRole('button', { name: 'Em coisas do dia a dia' }))
    expect(screen.getByText('Dá pra pagar 1 semana de compras')).toBeInTheDocument()
  })
})

describe('Demonstração de Open Finance (Spec 007)', () => {
  beforeEach(() => apagarBanco())

  it('CA-1: modo manual é o padrão e convite da demonstração está visível', async () => {
    renderizar()
    expect(await screen.findByRole('button', { name: 'Ver demonstração com conta fictícia' })).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: /Modo de demonstração ativo/ })).not.toBeInTheDocument()
  })

  it('CA-2: toque em "Ver demonstração..." pede confirmação em até 3 linhas', async () => {
    renderizar()
    await userEvent.click(await screen.findByRole('button', { name: 'Ver demonstração com conta fictícia' }))

    expect(screen.getByText(/Isto é uma demonstração com dados fictícios/)).toBeInTheDocument()
    expect(screen.getByText(/Com o Open Finance e sua autorização/)).toBeInTheDocument()
    expect(screen.getByText(/Quer ver como ficaria esse acompanhamento/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar na demonstração' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Voltar ao modo manual' })).toBeInTheDocument()

    // Cancelar volta ao modo manual
    await userEvent.click(screen.getByRole('button', { name: 'Voltar ao modo manual' }))
    expect(screen.getByRole('button', { name: 'Ver demonstração com conta fictícia' })).toBeInTheDocument()
    expect(screen.queryByText(/Isto é uma demonstração com dados fictícios/)).not.toBeInTheDocument()
  })

  it('CA-3 e CA-4: demonstração ativa mostra selo, dados sintéticos e estimativa sem julgamento', async () => {
    const { aoAbrirCheckin } = renderizar()
    await userEvent.click(await screen.findByRole('button', { name: 'Ver demonstração com conta fictícia' }))
    await userEvent.click(screen.getByRole('button', { name: 'Entrar na demonstração' }))

    // CA-3: Selo presente na tela
    expect(screen.getByRole('status', { name: 'Modo de demonstração ativo' })).toHaveTextContent(
      'DEMONSTRAÇÃO — dados fictícios',
    )
    expect(screen.getByText('Conta fictícia conectada para demonstração')).toBeInTheDocument()

    // CA-4: Estimativa calculada sobre o extrato e mensagem acolhedora/neutra
    expect(screen.getByText(/Estimativa preservada na demonstração/)).toBeInTheDocument()
    expect(screen.getByText(/Sem novas saídas desse tipo há/)).toHaveTextContent(
      /Sem novas saídas desse tipo há 25 dias/,
    )
    expect(screen.getByText('Quer registrar como foi seu dia?')).toBeInTheDocument()

    // Botão de check-in funciona
    await userEvent.click(screen.getByRole('button', { name: 'Ir para o check-in' }))
    expect(aoAbrirCheckin).toHaveBeenCalled()
  })

  it('CA-5: "Sair da demonstração" fecha a demo e retorna ao modo manual', async () => {
    renderizar()
    await userEvent.click(await screen.findByRole('button', { name: 'Ver demonstração com conta fictícia' }))
    await userEvent.click(screen.getByRole('button', { name: 'Entrar na demonstração' }))

    expect(screen.getByRole('status', { name: 'Modo de demonstração ativo' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Sair da demonstração' }))
    expect(screen.queryByRole('status', { name: 'Modo de demonstração ativo' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver demonstração com conta fictícia' })).toBeInTheDocument()
  })
})
