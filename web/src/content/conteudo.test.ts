import { describe, expect, it } from 'vitest'
import canaisJson from './canais-de-ajuda.json'
import sosJson from './sos.json'
import checkinJson from './checkin.json'
import metasJson from './metas.json'
import openFinanceJson from './open-finance-demo.json'
import { canaisDeAjuda, canal, metasConfirmadas } from './conteudo'

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
  // Spec 004: o lapso nunca é apresentado como recomeço do zero.
  /perdeu a sequ[eê]ncia/i,
  /\bdia zero\b/i,
  /\bzer(ou|ar|ado)\b/i,
  /\bestaca zero\b/i,
  /voltou (ao|pro|para o) (dia|come[cç]o)/i,
]

function textos(valor: unknown): string[] {
  if (typeof valor === 'string') return [valor]
  if (Array.isArray(valor)) return valor.flatMap(textos)
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(textos)
  return []
}

describe('conteúdo do app', () => {
  it.each(textos([canaisJson, sosJson, checkinJson, metasJson, openFinanceJson]))('não usa vocabulário vedado: %s', (texto) => {
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

describe('metas do dinheiro preservado', () => {
  it('só mostra meta confirmada, com valor, fonte e data de verificação', () => {
    for (const m of metasConfirmadas) {
      expect(m.valorReferencia).toBeGreaterThan(0)
      expect(m.verificado_em).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(m.fonte).toBeTruthy()
    }
    const naoConferidas = metasJson.metas.filter((m) => m.status !== 'confirmado').map((m) => m.id)
    expect(metasConfirmadas.some((m) => naoConferidas.includes(m.id))).toBe(false)
  })
})
