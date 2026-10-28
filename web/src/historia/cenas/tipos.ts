import type { ComponentType } from "react";

/** Em que ponto da conversa a pessoa está. A cena do capítulo desenha esse momento. */
export type Momento = {
  etapa: "abertura" | "perguntas" | "broto" | "oferta" | "licao";
  /** Índice da última pergunta que a pessoa ouviu (etapa "perguntas"). */
  pergunta: number | null;
  /** Momento nomeado pelo roteiro (`Passo.cena`), como "vila" ou "musica". Cada cena define os seus. */
  cena?: string;
};

/** Arte de fundo de um capítulo. Fica atrás do diálogo, decorativa: o texto vai no `aria-label`. */
export type PropsCena = { momento: Momento; reduzir: boolean };
export type Cena = ComponentType<PropsCena>;
