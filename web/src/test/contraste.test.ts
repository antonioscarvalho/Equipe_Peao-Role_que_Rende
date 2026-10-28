import { describe, expect, it } from 'vitest'
// Cores de .claude/skills/guia-estilo-role-que-rende/assets/tokens.css (o Vite não deixa ler fora de web/).
// Se a paleta mudar, atualize aqui e o teste confere de novo o contraste.
const TOKENS: Record<string, string> = {
  'azul-escuro': '#3333BD',
  branco: '#FFFFFF',
  amarelo: '#FCFC30',
  'cinza-900': '#4E5155',
}

function cor(nome: string): string {
  return TOKENS[nome]
}

function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contraste(a: string, b: string): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (escuro + 0.05)
}

describe('contraste (spec 005, botões de chamada ≥ 8:1)', () => {
  it('WhatsApp (.botao--principal): branco sobre azul-escuro', () => {
    expect(contraste(cor('branco'), cor('azul-escuro'))).toBeGreaterThanOrEqual(8)
  })

  it('SMS, chips e campos (.botao--secundario): azul-escuro sobre branco', () => {
    expect(contraste(cor('azul-escuro'), cor('branco'))).toBeGreaterThanOrEqual(8)
  })

  it('texto e erros sobre o fundo amarelo', () => {
    expect(contraste(cor('azul-escuro'), cor('amarelo'))).toBeGreaterThanOrEqual(8)
  })

  it('dicas (texto suave) passam de 4,5:1 sobre o fundo', () => {
    expect(contraste(cor('cinza-900'), cor('amarelo'))).toBeGreaterThanOrEqual(4.5)
  })
})
