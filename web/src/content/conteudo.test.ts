import { describe, expect, it } from 'vitest'
import canaisJson from './canais-de-ajuda.json'
import sosJson from './sos.json'
import { canaisDeAjuda, canal } from './conteudo'

// Vocabulário vedado pelo guia de tom de voz e pela Seção 8.4 do edital.
const PROIBIDAS = [
  /\bviciad[oa]s?\b/i,
  /\bapostador(es)? compulsiv/i,
  /\bfracass/i,
  /\brecaiu\b/i,
  /\bdia 0\b/i,
  /\bganhe\b/i,
  /\baposte\b/i,
  /\bjackpot\b/i,
  /\bsorte grande\b/i,
  /\bgiro gr[aá]tis\b/i,
  /\bpr[eê]mio\b/i,
  /\bdesbloquead/i,
]

function textos(valor: unknown): string[] {
  if (typeof valor === 'string') return [valor]
  if (Array.isArray(valor)) return valor.flatMap(textos)
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(textos)
  return []
}

describe('conteúdo do app', () => {
  it.each(textos([canaisJson, sosJson]))('não usa vocabulário vedado: %s', (texto) => {
    for (const padrao of PROIBIDAS) expect(texto).not.toMatch(padrao)
  })

  it('todo canal confirmado tem data de verificação e fonte', () => {
    expect(canaisDeAjuda.length).toBeGreaterThan(0)
    for (const c of canaisDeAjuda) {
      expect(c.verificado_em).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(c.fonte).toBeTruthy()
    }
  })

  it('esconde canais que ainda precisam ser conferidos', () => {
    expect(canaisDeAjuda.some((c) => c.status === 'conferir')).toBe(false)
    expect(() => canal('teleatendimento-sus')).toThrow()
  })

  it('tem CVV 188 e SAMU 192', () => {
    expect(canal('cvv').telefone).toBe('188')
    expect(canal('samu').telefone).toBe('192')
  })
})
