/**
 * Links para a própria pessoa enviar uma mensagem do Círculo de Confiança (spec 005, CA-5).
 * O app só monta o link: quem abre a conversa e decide enviar é a pessoa. Nada passa pelo nosso servidor.
 */

/**
 * Aceita telefone brasileiro com máscara, DDD, 0 de longa distância ou +55.
 * Devolve só dígitos com o 55 na frente (ex.: '5561900000000') ou null se não tiver 10 ou 11 dígitos nacionais.
 */
export function normalizarTelefone(entrada: string): string | null {
  let digitos = entrada.replace(/\D/g, '')
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith('55')) digitos = digitos.slice(2)
  else if ((digitos.length === 11 || digitos.length === 12) && digitos.startsWith('0')) digitos = digitos.slice(1)
  if (digitos.length !== 10 && digitos.length !== 11) return null
  if (digitos.startsWith('0')) return null
  return `55${digitos}`
}

/** '5561900000000' → '(61) 90000-0000'. */
export function formatarTelefone(telefone55: string): string {
  const nacional = telefone55.replace(/^55/, '')
  const ddd = nacional.slice(0, 2)
  const numero = nacional.slice(2)
  const corte = numero.length - 4
  return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`
}

/** Abre a conversa no WhatsApp da pessoa com o texto pronto. */
export function linkWhatsApp(telefone55: string, texto: string): string {
  return `https://wa.me/${telefone55}?text=${encodeURIComponent(texto)}`
}

/** Abre o app de SMS do aparelho com o texto pronto (RFC 5724). */
export function linkSms(telefone55: string, texto: string): string {
  return `sms:+${telefone55}?body=${encodeURIComponent(texto)}`
}
