import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { apagarBanco } from './lib/db'

describe('App', () => {
  beforeEach(async () => {
    window.history.replaceState(null, '', '/')
    await apagarBanco()
  })

  it('CA-1: o SOS está a 1 toque da tela inicial', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Bateu a vontade?' }))
    expect(screen.getByRole('heading', { name: 'Quanto tá a vontade agora?' })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/sos')
  })

  it('CA-2: "Preciso de ajuda agora" leva à crise de qualquer tela', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Bateu a vontade?' }))
    await userEvent.click(screen.getByRole('button', { name: 'Preciso de ajuda agora' }))
    expect(screen.getByRole('heading', { name: /momento muito difícil/ })).toBeInTheDocument()
  })

  it('CA-5: a crise mostra CVV 188 e SAMU 192 como ligação direta, antes de qualquer exercício', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Preciso de ajuda agora' }))

    const cvv = screen.getByRole('link', { name: /Ligar pro CVV · 188/ })
    const samu = screen.getByRole('link', { name: /SAMU · 192/ })
    expect(cvv).toHaveAttribute('href', 'tel:188')
    expect(samu).toHaveAttribute('href', 'tel:192')

    const respirar = screen.getByRole('button', { name: /respirar um pouco/ })
    expect(cvv.compareDocumentPosition(respirar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('abre direto numa rota conhecida e cai no início numa desconhecida', () => {
    window.history.replaceState(null, '', '/ajuda')
    const { unmount } = render(<App />)
    expect(screen.getByRole('heading', { name: /momento muito difícil/ })).toBeInTheDocument()
    unmount()

    window.history.replaceState(null, '', '/qualquer-coisa')
    render(<App />)
    expect(screen.getByRole('button', { name: 'Bateu a vontade?' })).toBeInTheDocument()
  })

  it('spec 004: "Apostei" no início leva ao pós-lapso, e de lá à crise', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Apostei' }))
    expect(window.location.pathname).toBe('/checkin')
    expect(screen.getByRole('heading', { name: 'Obrigado por registrar.' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Tô mal com isso' }))
    expect(screen.getByRole('heading', { name: /momento muito difícil/ })).toBeInTheDocument()
  })

  it('spec 004: o dinheiro preservado abre a partir do início', async () => {
    render(<App />)
    await userEvent.click(await screen.findByRole('button', { name: 'Quer ver quanto você preservou?' }))
    expect(window.location.pathname).toBe('/dinheiro')
    expect(screen.getByRole('heading', { name: 'Dinheiro preservado' })).toBeInTheDocument()
  })
})
