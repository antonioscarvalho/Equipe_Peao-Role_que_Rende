import { describe, expect, it } from 'vitest'
import canaisJson from './canais-de-ajuda.json'
import prevencaoJson from './prevencao.json'
import sosJson from './sos.json'
import checkinJson from './checkin.json'
import metasJson from './metas.json'
import { canaisDeAjuda, canal, conteudoPrevencao, metasConfirmadas, preencher } from './conteudo'

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
  it.each(textos([canaisJson, sosJson, checkinJson, metasJson, prevencaoJson]))('não usa vocabulário vedado: %s', (texto) => {
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

  it('prevencao.json segue o microcopy F5 e F8', () => {
    expect(conteudoPrevencao.plano.titulo).toBe('Seu plano pros momentos difíceis')
    expect(conteudoPrevencao.plano.perguntaGatilhos).toBe('O que costuma trazer a vontade?')
    expect(conteudoPrevencao.circulo.titulo).toBe('Seu Círculo de Confiança')
    expect(conteudoPrevencao.circulo.whatsapp).toBe('Enviar pelo meu WhatsApp')
    expect(conteudoPrevencao.circulo.nota).toBe('A gente nunca manda mensagem sozinho.')
    expect(conteudoPrevencao.circulo.mensagens).toEqual([
      'Tô com vontade de apostar, pode falar comigo?',
      'Hoje tá difícil, me liga quando puder?',
    ])
  })

  it('CA-1 e CA-2: tem os gatilhos da spec, exemplos de ação e os limites', () => {
    for (const g of ['dia do pagamento', 'solidão', 'briga', 'tédio', 'bebida', 'jogo na TV']) {
      expect(conteudoPrevencao.gatilhos).toContain(g)
    }
    expect(conteudoPrevencao.gatilhos).toContain(conteudoPrevencao.gatilhoOutro)
    expect(conteudoPrevencao.plano.exemplos).toHaveLength(3)
    expect(conteudoPrevencao.limitePlanos).toBe(5)
    expect(conteudoPrevencao.limiteContatos).toBe(3)
  })

  it('dado de demo é sintético', () => {
    expect(conteudoPrevencao.demo.contato.nome).toMatch(/\(exemplo\)/)
    expect(conteudoPrevencao.demo.contato.telefone).toBe('(61) 90000-0000')
  })

  it('preencher troca as chaves do modelo', () => {
    expect(preencher(conteudoPrevencao.plano.modelo, { se: 'bater o tédio', entao: 'caminhar' })).toBe(
      'Se bater o tédio, então eu vou caminhar.',
    )
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
