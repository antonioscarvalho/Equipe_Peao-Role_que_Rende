import { describe, expect, it } from 'vitest'
import { fissuraPedeApoio, textoSugereRisco } from './risco'
import apoio from '@/content/apoio.json'

describe('textoSugereRisco', () => {
  it('reconhece sinais mesmo sem acento e com maiúsculas', () => {
    expect(textoSugereRisco('NAO AGUENTO MAIS isso', apoio.palavrasRisco)).toBe(true)
    expect(textoSugereRisco('pensei em me matar', apoio.palavrasRisco)).toBe(true)
  })
  it('não dispara em texto comum ou vazio', () => {
    expect(textoSugereRisco('vi o jogo com meu irmão', apoio.palavrasRisco)).toBe(false)
    expect(textoSugereRisco('   ', apoio.palavrasRisco)).toBe(false)
  })
})

describe('fissuraPedeApoio', () => {
  it('oferece apoio humano quando a fissura continua 9 ou 10', () => {
    expect(fissuraPedeApoio(9)).toBe(true)
    expect(fissuraPedeApoio(8)).toBe(false)
    expect(fissuraPedeApoio(null)).toBe(false)
  })
})
