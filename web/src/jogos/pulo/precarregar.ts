import { precarregarTrilhas } from "../../sons";

/**
 * Assets do Pulo do Bichinho (jogo do capítulo 1), baixados enquanto a abertura do app aparece.
 * Assim o jogo abre fluido, pela história ou pela aba Jogos. Os sons de pulo e folha são
 * sintetizados (sons.ts), então só a ilustração e a trilha vêm da rede.
 */
export const CENARIO_PULO = "/cenarios/cap1-nave-pousada.webp";
export const TRILHA_PULO = "/sons/trilha-pulo.opus";

let imagem: HTMLImageElement | null = null;

/** A mesma imagem, já baixada e decodificada, para o canvas do jogo não esperar nada. */
export function imagemCenarioPulo(): HTMLImageElement {
  if (!imagem) {
    imagem = new Image();
    imagem.decoding = "async";
    imagem.src = CENARIO_PULO;
    imagem.decode?.().catch(() => { /* o canvas tenta de novo a cada quadro */ });
  }
  return imagem;
}

let feito = false;
export function precarregarPulo() {
  if (feito || typeof window === "undefined") return;
  feito = true;
  imagemCenarioPulo();
  precarregarTrilhas([TRILHA_PULO]);
}
