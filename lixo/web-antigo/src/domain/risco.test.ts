import { describe, expect, it } from 'vitest'
import { conteudoCheckin } from '@/content/conteudo'
import { textoSugereRisco } from './risco'

const sinais = conteudoCheckin.sinaisDeRisco

describe('textoSugereRisco', () => {
  it('reconhece o sinal sem depender de acento nem de maiúscula', () => {
    expect(textoSugereRisco('Não aguento mais essa dívida', sinais)).toBe(true)
    expect(textoSugereRisco('NAO AGUENTO MAIS', sinais)).toBe(true)
    expect(textoSugereRisco('o agiota ligou de novo', sinais)).toBe(true)
  })

  it('texto comum ou vazio não oferece nada', () => {
    expect(textoSugereRisco('recebi o salário e fiquei sozinho em casa', sinais)).toBe(false)
    expect(textoSugereRisco('   ', sinais)).toBe(false)
  })
})
