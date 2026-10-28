import { describe, expect, it } from 'vitest'
import { formatarTelefone, linkSms, linkWhatsApp, normalizarTelefone } from './mensagem'

const MENSAGEM = 'Tô com vontade de apostar, pode falar comigo?'

describe('normalizarTelefone', () => {
  it.each(['(61) 90000-0000', '61900000000', '+55 61 90000-0000', '061 90000-0000', '55 (61) 90000-0000'])(
    '%s vira 5561900000000',
    (entrada) => expect(normalizarTelefone(entrada)).toBe('5561900000000'),
  )

  it('aceita fixo com 10 dígitos', () => {
    expect(normalizarTelefone('(61) 3000-0000')).toBe('556130000000')
  })

  it.each(['', '188', '9000-0000', '61 9000-000', '(61) 90000-00001', 'abc'])('recusa "%s"', (entrada) => {
    expect(normalizarTelefone(entrada)).toBeNull()
  })
})

describe('links de mensagem', () => {
  it('CA-5: WhatsApp com o texto codificado na URL', () => {
    expect(linkWhatsApp('5561900000000', MENSAGEM)).toBe(
      'https://wa.me/5561900000000?text=T%C3%B4%20com%20vontade%20de%20apostar%2C%20pode%20falar%20comigo%3F',
    )
  })

  it('CA-5: SMS com o texto codificado', () => {
    expect(linkSms('5561900000000', 'Hoje tá difícil, me liga quando puder?')).toBe(
      'sms:+5561900000000?body=Hoje%20t%C3%A1%20dif%C3%ADcil%2C%20me%20liga%20quando%20puder%3F',
    )
  })

  it('formata o telefone para exibir', () => {
    expect(formatarTelefone('5561900000000')).toBe('(61) 90000-0000')
    expect(formatarTelefone('556130000000')).toBe('(61) 3000-0000')
  })
})
