import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apagarBanco } from '@/lib/db'
import { LIMITE_PLANOS, prevencao } from '@/lib/prevencao'
import { Plano, type PlanoProps } from './Plano'

function renderizar(props: Partial<PlanoProps> = {}) {
  const aoAbrirCirculo = vi.fn()
  const aoVoltar = vi.fn()
  render(<Plano aoAbrirCirculo={aoAbrirCirculo} aoVoltar={aoVoltar} {...props} />)
  return { aoAbrirCirculo, aoVoltar }
}

const titulo = () => screen.getByRole('heading', { level: 1 })

describe('Seu plano', () => {
  beforeEach(() => apagarBanco())

  it('CA-1: chips com aria-pressed, seleção múltipla e campo "Outro"; persiste ao reabrir', async () => {
    const { unmount } = render(<Plano aoAbrirCirculo={vi.fn()} aoVoltar={vi.fn()} />)
    const grupo = await screen.findByRole('group', { name: 'O que costuma trazer a vontade?' })
    for (const g of ['dia do pagamento', 'solidão', 'briga', 'tédio', 'bebida', 'jogo na TV']) {
      expect(within(grupo).getByRole('button', { name: g })).toHaveAttribute('aria-pressed', 'false')
    }

    await userEvent.click(within(grupo).getByRole('button', { name: 'tédio' }))
    await userEvent.click(within(grupo).getByRole('button', { name: 'briga' }))
    expect(within(grupo).getByRole('button', { name: 'tédio' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(grupo).getByRole('button', { name: 'briga' })).toHaveAttribute('aria-pressed', 'true')

    expect(screen.queryByLabelText('Qual outro momento?')).not.toBeInTheDocument()
    await userEvent.click(within(grupo).getByRole('button', { name: 'outro' }))
    await userEvent.type(screen.getByLabelText('Qual outro momento?'), 'sexta à noite')
    await userEvent.tab()

    await waitFor(async () =>
      expect(await prevencao.lerGatilhos()).toMatchObject({
        selecionados: ['tédio', 'briga', 'outro'],
        outro: 'sexta à noite',
      }),
    )
    unmount()

    renderizar()
    const reaberto = await screen.findByRole('group', { name: 'O que costuma trazer a vontade?' })
    await waitFor(() => expect(within(reaberto).getByRole('button', { name: 'tédio' })).toHaveAttribute('aria-pressed', 'true'))
    expect(screen.getByLabelText('Qual outro momento?')).toHaveValue('sexta à noite')
  })

  it('CA-6 (preparação): gatilhos iniciais chegam marcados', async () => {
    renderizar({ gatilhosIniciais: ['tédio'] })
    await waitFor(() => expect(screen.getByRole('button', { name: 'tédio' })).toHaveAttribute('aria-pressed', 'true'))
    await waitFor(async () => expect((await prevencao.lerGatilhos())?.selecionados).toContain('tédio'))
  })

  it('CA-2: dois campos, um botão salvar e exemplos que preenchem o "Então"', async () => {
    renderizar()
    expect(await screen.findByText(/Ainda sem plano/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Novo plano' }))
    expect(titulo()).toHaveTextContent('Novo plano')
    expect(titulo()).toHaveFocus()
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: /Salvar/ })).toHaveLength(1)

    await userEvent.type(screen.getByLabelText('Se…'), 'bater o tédio')
    await userEvent.click(screen.getByRole('button', { name: 'ouvir uma música que eu gosto' }))
    expect(screen.getByLabelText('Então eu vou…')).toHaveValue('ouvir uma música que eu gosto')

    await userEvent.click(screen.getByRole('button', { name: 'Salvar plano' }))
    expect(await screen.findByText('Se bater o tédio, então eu vou ouvir uma música que eu gosto.')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Plano salvo.')
    expect(titulo()).toHaveTextContent('Seu plano pros momentos difíceis')
    expect(titulo()).toHaveFocus()
  })

  it('erros ficam ligados ao campo e o foco vai pro primeiro com erro', async () => {
    renderizar()
    await userEvent.click(await screen.findByRole('button', { name: 'Novo plano' }))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar plano' }))

    const se = screen.getByLabelText('Se…')
    expect(se).toHaveFocus()
    expect(se).toHaveAttribute('aria-invalid', 'true')
    expect(se).toHaveAccessibleDescription(/Escreva o momento difícil\./)
    expect(screen.getByLabelText('Então eu vou…')).toHaveAccessibleDescription(/Escreva o que você vai fazer\./)
    expect(await prevencao.listarPlanos()).toEqual([])
  })

  it('edita e apaga um plano', async () => {
    await prevencao.salvarPlano({ se: 'for dia do pagamento', entao: 'pagar as contas' })
    renderizar()
    const item = (await screen.findByText(/Se for dia do pagamento/)).closest('li')!

    await userEvent.click(within(item).getByRole('button', { name: 'Editar' }))
    expect(titulo()).toHaveTextContent('Editar plano')
    const entao = screen.getByLabelText('Então eu vou…')
    await userEvent.clear(entao)
    await userEvent.type(entao, 'caminhar 10 minutos')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar plano' }))
    const editado = (await screen.findByText('Se for dia do pagamento, então eu vou caminhar 10 minutos.')).closest('li')!

    await userEvent.click(within(editado).getByRole('button', { name: 'Apagar' }))
    expect(await screen.findByText(/Ainda sem plano/)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Plano apagado.')
  })

  it('CA-2: ao chegar em 5 planos, explica que é preciso remover um', async () => {
    for (let i = 1; i <= LIMITE_PLANOS; i++) await prevencao.salvarPlano({ se: `gatilho ${i}`, entao: 'caminhar' })
    renderizar()
    expect(await screen.findByText('Dá pra ter até 5 planos. Edite ou apague um.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Novo plano' })).not.toBeInTheDocument()
  })

  it('em desenvolvimento, carrega o plano de exemplo', async () => {
    renderizar()
    await userEvent.click(await screen.findByRole('button', { name: /Carregar exemplo/ }))
    expect(
      await screen.findByText('Se for dia do pagamento, então eu vou pagar as contas antes de abrir o celular.'),
    ).toBeInTheDocument()
  })

  it('leva ao Círculo e volta pro início', async () => {
    const { aoAbrirCirculo, aoVoltar } = renderizar()
    await userEvent.click(await screen.findByRole('button', { name: 'Ir pro seu Círculo de Confiança' }))
    await userEvent.click(screen.getByRole('button', { name: 'Voltar pro início' }))
    expect(aoAbrirCirculo).toHaveBeenCalled()
    expect(aoVoltar).toHaveBeenCalled()
  })

  it('acessibilidade: cria um plano só pelo teclado', async () => {
    renderizar()
    await screen.findByRole('group', { name: 'O que costuma trazer a vontade?' })
    const novo = screen.getByRole('button', { name: 'Novo plano' })
    novo.focus()
    await userEvent.keyboard('{Enter}')
    expect(titulo()).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByLabelText('Se…')).toHaveFocus()
    await userEvent.keyboard('bater a solidão')
    await userEvent.tab()
    expect(screen.getByLabelText('Então eu vou…')).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'caminhar 10 minutos' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByLabelText('Então eu vou…')).toHaveFocus()
    await userEvent.keyboard('{Enter}')

    expect(await screen.findByText('Se bater a solidão, então eu vou caminhar 10 minutos.')).toBeInTheDocument()
    expect(titulo()).toHaveFocus()
  })
})
