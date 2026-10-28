/**
 * Regras comuns dos mini jogos (Pulo do Bichinho e Rolê de Carrinho).
 *
 * - Cada partida dura no máximo 3 minutos e termina com uma saída gentil, para o jogo
 *   não virar outra compulsão. 3 minutos é o tempo usado nos estudos com Tetris e fissura
 *   (Skorka-Brown et al., 2015). O tempo não aparece na tela, para não criar pressa.
 * - As folhas aparecem em lugares previsíveis, nunca por sorteio: recompensa vem do esforço,
 *   não da sorte (Zendle e Cairns, 2018; skill design-etico-saude-digital).
 */

export const DURACAO_PARTIDA_MS = 3 * 60 * 1000;

/** Pulo: uma folha em cima de cada 5ª plataforma. */
export const FOLHA_A_CADA_PLATAFORMAS = 5;

/** Carrinho: uma folha a cada 300 px de estrada; uma em cada 3 fica no alto, para pegar no pulo. */
export const FOLHA_A_CADA_PX = 300;
export const FOLHA_ALTA_A_CADA = 3;

/** Tempo de um quadro que conta para a partida. Limita travadas (aba escondida já zera o relógio). */
export const quadroMs = (agora: number, ultimo: number) => Math.min(100, agora - ultimo);
