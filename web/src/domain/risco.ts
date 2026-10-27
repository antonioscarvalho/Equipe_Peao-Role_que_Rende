/**
 * Sinais de risco (skill seguranca-e-crise).
 * Regra: perguntas diretas e opcionais valem mais que adivinhar por texto.
 * Palavra-chave em texto livre só OFERECE ajuda; nunca bloqueia, nunca rotula,
 * nunca vai para servidor ou analytics.
 */
export function normalizar(texto: string): string {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function textoSugereRisco(texto: string, palavras: readonly string[]): boolean {
  const t = normalizar(texto)
  if (!t.trim()) return false
  return palavras.some((p) => t.includes(normalizar(p)))
}

/** Fissura máxima depois do SOS: oferecer ajuda humana além do plano. */
export function fissuraPedeApoio(depois: number | null): boolean {
  return depois !== null && depois >= 9
}
