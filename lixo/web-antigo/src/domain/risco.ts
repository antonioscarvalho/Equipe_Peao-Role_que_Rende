/**
 * Sinal de risco em texto livre (skill seguranca-e-crise): só OFERECE ajuda.
 * Nunca bloqueia, nunca rotula e nunca sai do aparelho.
 */
function normalizar(texto: string): string {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function textoSugereRisco(texto: string, sinais: readonly string[]): boolean {
  const t = normalizar(texto)
  return t.trim() !== '' && sinais.some((s) => t.includes(normalizar(s)))
}
