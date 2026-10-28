import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { circulo, LIMITE_CONTATOS } from '@/lib/circulo'
import { apagarBanco } from '@/lib/db'
import { Circulo, type CirculoProps } from './Circulo'

function renderizar(props: Partial<CirculoProps> = {}) {
  const aoAbrirPlano = vi.fn()
  const aoVoltar = vi.fn()
  render(<Circulo aoAbrirPlano={aoAbrirPlano} aoVoltar={aoVoltar} {...props} />)
  return { aoAbrirPlano, aoVoltar }
}

const titulo = () => screen.getByRole('heading', { level: 1 })

describe('Seu Círculo de Confiança', () => {
  const fetchEspiao = vi.fn()

  beforeEach(async () => {
    await apagarBanco()
    vi.stubGlobal('fetch', fetchEspiao)
  })

  afterEach(() => {
    // CA-4/CA-5: nada vai para a rede.
    expect(fetchEspiao).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('CA-4: cadastra nome e telefone; mostra a explicação e a nota fixa', async () => {
    renderizar()
    expect(screen.getByText('A gente nunca manda mensagem sozinho.')).toBeInTheDocument()
    expect(screen.getByText(/Os contatos ficam só neste celular\./)).toBeInTheDocument()

    await userEvent.click(await screen.findByRole('button', { name: 'Adicionar pessoa' }))
    expect(titulo()).toHaveTextContent('Nova pessoa')
    expect(titulo()).toHaveFocus()
    const telefone = screen.getByLabelText('Telefone com DDD')
    expect(telefone).toHaveAttribute('type', 'tel')
    expect(telefone).toHaveAttribute('inputmode', 'tel')

    await userEvent.type(screen.getByLabelText('Nome ou apelido'), 'Irmão (exemplo)')
    await userEvent.type(telefone, '(61) 90000-0000')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar pessoa' }))

    expect(await screen.findByRole('heading', { level: 2, name: 'Irmão (exemplo)' })).toBeInTheDocument()
    expect(screen.getByText('(61) 90000-0000')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Pessoa salva.')
    expect(titulo()).toHaveFocus()
    expect(await circulo.listar()).toEqual([expect.objectContaining({ telefone: '5561900000000' })])
  })

  it('CA-5: os botões são links para WhatsApp e SMS com a mensagem pronta, nunca envio automático', async () => {
    await circulo.salvar({ nome: 'Irmão (exemplo)', telefone: '(61) 90000-0000' })
    renderizar()

    const whatsapp = await screen.findByRole('link', { name: 'Enviar pelo meu WhatsApp para Irmão (exemplo)' })
    expect(whatsapp.tagName).toBe('A')
    expect(whatsapp).toHaveTextContent('Enviar pelo meu WhatsApp')
    expect(whatsapp).toHaveAttribute(
      'href',
      'https://wa.me/5561900000000?text=T%C3%B4%20com%20vontade%20de%20apostar%2C%20pode%20falar%20comigo%3F',
    )
    expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer')
    const sms = screen.getByRole('link', { name: 'Enviar por SMS para Irmão (exemplo)' })
    expect(sms.getAttribute('href')).toMatch(/^sms:\+5561900000000\?body=T%C3%B4%20com/)

    await userEvent.click(screen.getByRole('radio', { name: 'Hoje tá difícil, me liga quando puder?' }))
    expect(whatsapp.getAttribute('href')).toContain('text=Hoje%20t%C3%A1%20dif%C3%ADcil')
    expect(screen.getByRole('radio', { name: /Tô com vontade/ })).not.toBeChecked()
  })

  it('erros ligados ao campo e foco no primeiro com erro', async () => {
    renderizar()
    await userEvent.click(await screen.findByRole('button', { name: 'Adicionar pessoa' }))
    await userEvent.type(screen.getByLabelText('Nome ou apelido'), 'Alguém')
    await userEvent.type(screen.getByLabelText('Telefone com DDD'), '9000')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar pessoa' }))

    const telefone = screen.getByLabelText('Telefone com DDD')
    expect(telefone).toHaveFocus()
    expect(telefone).toHaveAttribute('aria-invalid', 'true')
    expect(telefone).toHaveAccessibleDescription(/10 ou 11 dígitos/)
    expect(await circulo.listar()).toEqual([])
  })

  it('edita e apaga', async () => {
    await circulo.salvar({ nome: 'Irmão (exemplo)', telefone: '(61) 90000-0000' })
    renderizar()
    const item = (await screen.findByRole('heading', { level: 2, name: 'Irmão (exemplo)' })).closest('li')!

    await userEvent.click(within(item).getByRole('button', { name: 'Editar' }))
    expect(screen.getByLabelText('Telefone com DDD')).toHaveValue('(61) 90000-0000')
    const nome = screen.getByLabelText('Nome ou apelido')
    await userEvent.clear(nome)
    await userEvent.type(nome, 'Mãe (exemplo)')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar pessoa' }))
    const editado = (await screen.findByRole('heading', { level: 2, name: 'Mãe (exemplo)' })).closest('li')!

    await userEvent.click(within(editado).getByRole('button', { name: 'Apagar' }))
    expect(await screen.findByText(/Ainda não tem ninguém aqui/)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Pessoa apagada.')
  })

  it('CA-4: com 3 pessoas explica o limite e não oferece adicionar', async () => {
    for (let i = 1; i <= LIMITE_CONTATOS; i++) await circulo.salvar({ nome: `Pessoa ${i} (exemplo)`, telefone: `(61) 90000-000${i}` })
    renderizar()
    expect(await screen.findByText('Dá pra ter até 3 pessoas. Edite ou apague uma.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Adicionar pessoa' })).not.toBeInTheDocument()
  })

  it('em desenvolvimento, carrega o contato de exemplo com telefone fictício', async () => {
    renderizar()
    await userEvent.click(await screen.findByRole('button', { name: /Carregar exemplo/ }))
    await waitFor(() => expect(screen.getByRole('heading', { level: 2, name: 'Irmão (exemplo)' })).toBeInTheDocument())
    expect(screen.getByText('(61) 90000-0000')).toBeInTheDocument()
  })

  it('leva ao plano e volta pro início', async () => {
    const { aoAbrirPlano, aoVoltar } = renderizar()
    await userEvent.click(await screen.findByRole('button', { name: 'Ir pro seu plano' }))
    await userEvent.click(screen.getByRole('button', { name: 'Voltar pro início' }))
    expect(aoAbrirPlano).toHaveBeenCalled()
    expect(aoVoltar).toHaveBeenCalled()
  })

  it('acessibilidade: adiciona uma pessoa só pelo teclado e chega ao link de envio', async () => {
    renderizar()
    const adicionar = await screen.findByRole('button', { name: 'Adicionar pessoa' })
    adicionar.focus()
    await userEvent.keyboard('{Enter}')
    expect(titulo()).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByLabelText('Nome ou apelido')).toHaveFocus()
    await userEvent.keyboard('Irmão (exemplo)')
    await userEvent.tab()
    expect(screen.getByLabelText('Telefone com DDD')).toHaveFocus()
    await userEvent.keyboard('61900000000{Enter}')

    await screen.findByRole('heading', { level: 2, name: 'Irmão (exemplo)' })
    expect(titulo()).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('radio', { name: /Tô com vontade/ })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('link', { name: /WhatsApp para Irmão/ })).toHaveFocus()
  })
})
