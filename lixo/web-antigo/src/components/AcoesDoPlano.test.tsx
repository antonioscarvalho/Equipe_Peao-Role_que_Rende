import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { circulo } from '@/lib/circulo'
import { apagarBanco } from '@/lib/db'
import { prevencao } from '@/lib/prevencao'
import { AcoesDoPlano } from './AcoesDoPlano'

const ACOES = ['Sair de perto do celular por 10 minutos']

describe('AcoesDoPlano', () => {
  beforeEach(() => apagarBanco())

  it('CA-3: mostra os planos salvos como "Se…, então…" e o Círculo com links de envio', async () => {
    await prevencao.salvarPlano({ se: 'for dia do pagamento', entao: 'pagar as contas antes de abrir o celular' })
    await circulo.salvar({ nome: 'Irmão (exemplo)', telefone: '(61) 90000-0000' })
    render(<AcoesDoPlano acoes={ACOES} />)

    expect(
      await screen.findByText('Se for dia do pagamento, então eu vou pagar as contas antes de abrir o celular.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Enviar pelo meu WhatsApp para Irmão (exemplo)' }).getAttribute('href')).toMatch(
      /^https:\/\/wa\.me\/5561900000000\?text=T%C3%B4%20com%20vontade/,
    )
    expect(screen.getByText('A gente nunca manda mensagem sozinho.')).toBeInTheDocument()
    expect(screen.getByText(ACOES[0])).toBeInTheDocument()
    expect(screen.queryByText(/Quer montar seu plano depois\?/)).not.toBeInTheDocument()
  })

  it('CA-7: sem planos e sem contatos, convida a montar depois e mostra o CVV 188', async () => {
    render(<AcoesDoPlano acoes={ACOES} />)
    expect(screen.getByText(ACOES[0])).toBeInTheDocument()
    expect(await screen.findByText(/Quer montar seu plano depois\?/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /CVV · 188/ })).toHaveAttribute('href', 'tel:188')
  })

  it('só com contato, não mostra o convite', async () => {
    await circulo.salvar({ nome: 'Irmão (exemplo)', telefone: '(61) 90000-0000' })
    render(<AcoesDoPlano acoes={ACOES} />)
    expect(await screen.findByText('Irmão (exemplo)')).toBeInTheDocument()
    expect(screen.queryByText(/Quer montar seu plano depois\?/)).not.toBeInTheDocument()
  })
})
