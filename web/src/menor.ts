/**
 * Resposta "não tenho 18 anos" (tela de idade da história). O app é só para maiores:
 * a partir daí ele abre direto na tela de ajuda e não libera o resto.
 * Fica só no aparelho (localStorage); não é dado pessoal enviado a lugar nenhum.
 */
import { gravarGuardado, lerGuardado } from "./guardado";

const CHAVE = "rqr:menor-de-idade";

export function ehMenorDeIdade(): boolean {
  return lerGuardado(CHAVE) === "1";
}

export function marcarMenorDeIdade() {
  gravarGuardado(CHAVE, "1");
}
