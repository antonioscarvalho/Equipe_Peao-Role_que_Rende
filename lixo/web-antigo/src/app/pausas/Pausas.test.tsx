import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { conteudoPausas } from '@/content/conteudo'
import { ArrumaOMes, Aterramento, Pausas, PensamentoOuFato } from './Pausas'

const clicar = (nome: string | RegExp) => userEvent.click(screen.getByRole('button', { name: nome }))

describe('Pausas', () => {
  it('o menu lista os três minijogos e volta pro início', async () => {
    const aoVoltar = vi.fn()
    render(<Pausas aoVoltar={aoVoltar} />)
    expect(screen.getAllByRole('button', { name: 'Começar' })).toHaveLength(3)
    await clicar('Voltar pro início')
    expect(aoVoltar).toHaveBeenCalled()
  })

  it('5 sentidos: percorre 5+4+3+2+1 toques e termina com mensagem calma', async () => {
    const aoTerminar = vi.fn()
    render(<Aterramento aoTerminar={aoTerminar} />)
    for (let i = 0; i < 15; i++) await clicar(/^Notei/)
    expect(screen.getByRole('status')).toHaveTextContent('Você trouxe a cabeça pro presente')
    await clicar('Voltar pras pausas')
    expect(aoTerminar).toHaveBeenCalled()
  })

  it('Pensamento ou fato?: qualquer escolha mostra a leitura realista e a explicação', async () => {
    render(<PensamentoOuFato aoTerminar={vi.fn()} />)
    const [primeira] = conteudoPausas.pensamentos.cartas
    const errada = primeira.opcoes[1 - primeira.realista]
    await clicar(errada)
    expect(screen.getByRole('status')).toHaveTextContent(primeira.opcoes[primeira.realista])
    expect(screen.getByRole('status')).toHaveTextContent(primeira.explicacao)
    expect(screen.queryByText(/pontos|acertou \d/i)).not.toBeInTheDocument()
    await clicar('Próxima')
    expect(screen.getByText('Frase 2 de 5')).toBeInTheDocument()
  })

  it('Arruma o mês: classifica todos os itens e mostra a sobra do orçamento sintético', async () => {
    render(<ArrumaOMes aoTerminar={vi.fn()} />)
    const { itens, categorias } = conteudoPausas.contas
    for (const item of itens) {
      const cat = categorias.find((c) => c.id === item.sugerida)!
      await clicar(new RegExp(`^${cat.nome}`))
    }
    await clicar('Ver como ficou')
    // 2500 - (800+550+180+220) - (400+150) = 200
    expect(screen.getByText(/sobram/)).toHaveTextContent('200')
    expect(screen.queryByText(/Muita gente colocaria/)).not.toBeInTheDocument()
  })
})
