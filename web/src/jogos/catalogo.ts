import type { IdCapitulo } from "../historia/tipos";
import type { NomeIcone } from "../icones-data";

/**
 * Lista de jogos da aba Jogos. Cada jogo é liberado por um capítulo da história
 * (concluir o capítulo libera o jogo dele). Os jogos que ainda não existem aparecem
 * como vagas ocultas: a pessoa sabe que vem mais coisa, sem nome nem promessa de data.
 * Para lançar um jogo novo: troque a vaga por { id, nome, descricao, icone, libera, abrir }.
 */
export type Jogo =
  | { tipo: "pronto"; id: "pulo" | "carrinho"; nome: string; descricao: string; icone: NomeIcone; libera: IdCapitulo }
  | { tipo: "oculto"; id: string; libera: IdCapitulo };

export const JOGOS: Jogo[] = [
  { tipo: "pronto", id: "pulo", nome: "Pulo do Bichinho", descricao: "Pule cada vez mais alto", icone: "sprout", libera: "cap1" },
  // Carrinho no Morro ainda não está completo: volta para cá quando estiver.
  // { tipo: "pronto", id: "carrinho", nome: "Carrinho no Morro", descricao: "Suba os morros e pegue folhas", icone: "gamepad", libera: "cap1" },
  { tipo: "oculto", id: "oculto-2", libera: "cap2" },
  { tipo: "oculto", id: "oculto-3", libera: "cap3" },
  { tipo: "oculto", id: "oculto-4", libera: "cap4" },
  { tipo: "oculto", id: "oculto-5", libera: "cap5" },
];

/** "cap1" -> "capítulo 1" */
export const nomeCapitulo = (id: IdCapitulo) => (id === "epilogo" ? "epílogo" : `capítulo ${id.slice(3)}`);
