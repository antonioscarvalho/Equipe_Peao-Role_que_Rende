import type { ComponentType } from "react";
import type { Capitulo, IdCapitulo, PropsJogo } from "../tipos";

/**
 * Capítulos prontos. UMA LINHA por capítulo (e um import), para não dar conflito de merge.
 * Ex.: `cap2: { capitulo: cap2, jogo: DesviaDosCometas, nomeJogo: "Desvia dos Cometas" },`
 * Capítulo sem jogo vai direto para a conversa. Os que faltam aparecem como "em breve".
 */
export type EntradaCapitulo = { capitulo: Capitulo; jogo?: ComponentType<PropsJogo>; nomeJogo?: string };

export const capitulos: Partial<Record<IdCapitulo, EntradaCapitulo>> = {
};

/** Títulos do mapa para quem ainda não chegou (narrativa-broto.md, "Mapa"). */
export const TITULOS: Record<IdCapitulo, string> = {
  cap1: "1. A Queda",
  cap2: "2. O Cometa da Sorte",
  cap3: "3. As Luzes da Casa",
  cap4: "4. O Segredo",
  cap5: "5. O Sinal",
  cap6: "6. Dia Nublado",
  epilogo: "Epílogo: A Festa da Praça",
};
