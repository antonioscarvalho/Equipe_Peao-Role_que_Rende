import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'
import { DadosProvider } from '@/hooks/DadosContext'
import { criarRepositorioLocal } from '@/lib/armazenamento'
import { estadoInicial, type Estado } from '@/domain/tipos'
import { hojeISO } from '@/domain/datas'

function comOnboarding(): Estado {
  return {
    ...estadoInicial(),
    onboarding: {
      concluidoEm: '2026-10-27T12:00:00Z',
      inicio: hojeISO(),
      motivos: ['Minha família'],
      motivoTexto: '',
      importancia: 8,
      confianca: 5,
      gastoSemanal: 70,
      metaConcreta: 'a conta de luz',
    },
  }
}

function renderizar(rota: string, estado?: Estado) {
  const repo = criarRepositorioLocal(localStorage)
  if (estado) repo.salvar(estado)
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <DadosProvider repositorio={repo}>
        <App />
      </DadosProvider>
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('sem onboarding, leva para as boas-vindas', () => {
    renderizar('/')
    expect(screen.getByRole('heading', { level: 1, name: /este espaço é seu/i })).toBeInTheDocument()
  })

  it('a crise abre mesmo antes do onboarding e mostra o CVV 188 sem internet', () => {
    renderizar('/crise')
    expect(screen.getByRole('link', { name: /CVV.*188/i })).toHaveAttribute('href', 'tel:188')
    expect(screen.getByRole('link', { name: /SAMU.*192/i })).toHaveAttribute('href', 'tel:192')
  })

  it.each(['/', '/sos', '/registro', '/plano', '/bloqueio', '/apoio', '/configuracoes'])(
    'em %s, a ajuda está a 1 toque',
    (rota) => {
      renderizar(rota, comOnboarding())
      expect(screen.getByRole('link', { name: 'Preciso de ajuda agora' })).toHaveAttribute('href', '/crise')
    },
  )

  it('conclui o onboarding e mostra o motivo e o SOS na tela inicial', async () => {
    const u = userEvent.setup()
    renderizar('/')
    await u.click(screen.getByRole('checkbox'))
    await u.click(screen.getByRole('button', { name: 'Começar' }))
    await u.click(screen.getByRole('button', { name: /dormir melhor/i }))
    await u.click(screen.getByRole('button', { name: 'Continuar' }))
    await u.click(screen.getByRole('button', { name: 'Continuar' }))
    await u.click(screen.getByRole('button', { name: 'Concluir' }))
    expect(screen.getByRole('link', { name: /bateu a vontade/i })).toHaveAttribute('href', '/sos')
    expect(screen.getByText('Dormir melhor')).toBeInTheDocument()
    expect(screen.getByText(/1 dia sem apostar/i)).toBeInTheDocument()
  })

  it('registrar uma aposta acolhe e não zera os dias', async () => {
    const u = userEvent.setup()
    renderizar('/registro', comOnboarding())
    await u.click(screen.getByRole('button', { name: 'Apostei' }))
    await u.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByRole('heading', { name: 'Obrigado por registrar' })).toBeInTheDocument()
    expect(screen.getByText(/não apaga o que você já conquistou/i)).toBeInTheDocument()
  })

  it('texto com sinal de risco no pós-lapso oferece ajuda, sem bloquear', async () => {
    const u = userEvent.setup()
    renderizar('/registro', comOnboarding())
    await u.click(screen.getByRole('button', { name: 'Apostei' }))
    await u.type(screen.getByLabelText(/o que aconteceu antes/i), 'não aguento mais')
    await u.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByRole('link', { name: /ver opções de ajuda/i })).toHaveAttribute('href', '/crise')
  })

  it('SOS: mede a vontade, segura a onda e termina com a pergunta opcional de risco', async () => {
    const u = userEvent.setup()
    renderizar('/sos', comOnboarding())
    await u.click(screen.getAllByRole('radio', { name: '8' })[0])
    await u.click(screen.getByRole('button', { name: '10 minutos' }))
    expect(screen.getByText(/tempo restante/i)).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /já estou melhor/i }))
    expect(screen.getByRole('heading', { name: /pare e examine/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Continuar' }))
    await u.click(screen.getByRole('button', { name: 'Continuar' }))
    await u.click(screen.getAllByRole('radio', { name: '3' })[0])
    await u.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByText(/a vontade foi de 8 para 3/i)).toBeInTheDocument()
    expect(screen.getByText(/pensa em se machucar/i)).toBeInTheDocument()
  })
})
