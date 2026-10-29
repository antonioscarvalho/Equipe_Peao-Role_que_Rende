import { FPS } from "./config";

/**
 * Grade da música (trilha.mp3, ~139,5 BPM). A pancada do drop cai em 20,01 s;
 * contando um compasso para trás, a grade começa em 18,29 s, e é aí que entra a demonstração.
 */
export const BATIDA_S = 60 / 139.5;
export const COMPASSO_S = BATIDA_S * 4;
export const DROP_S = 20.01;

export const f = (s: number) => Math.round(s * FPS);
/** Início do compasso n, contado a partir da pancada do drop (n = -1 é 18,29 s). */
export const compasso = (n: number) => DROP_S + n * COMPASSO_S;

export const T = {
  marcaFim: compasso(-9), // 4,53 s: sai o logo do Rolê que Rende
  parceiroFim: compasso(-6), // 9,69 s: sai o logo da Açaí Valley
  amarelo: compasso(-4), // 13,13 s: o amarelo toma a tela, o Broto ganha cor
  transicao: 18.0, // a demonstração começa a entrar
  demo: compasso(-1), // 18,29 s
  cta: compasso(11), // 38,94 s: QR grande
  volta: compasso(14), // 44,10 s: tudo volta ao azul do começo, para emendar o loop
};
