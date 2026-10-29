/**
 * Resposta "não tenho 18 anos" (tela de idade da história). O app é só para maiores:
 * a partir daí ele abre direto na tela de ajuda e não libera o resto.
 * Fica só no aparelho (localStorage); não é dado pessoal enviado a lugar nenhum.
 */
const CHAVE = "rqr:menor-de-idade";

export function ehMenorDeIdade(): boolean {
  try { return localStorage.getItem(CHAVE) === "1"; } catch { return false; }
}

export function marcarMenorDeIdade() {
  try { localStorage.setItem(CHAVE, "1"); } catch { /* modo privado: vale só nesta visita */ }
}
