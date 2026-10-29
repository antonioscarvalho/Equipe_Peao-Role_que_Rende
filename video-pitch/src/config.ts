/**
 * Tudo o que muda com frequência no vídeo fica aqui.
 *
 * Mudou o link do app? Troque APP_URL (o QR code é gerado a partir dele na hora do render)
 * e rode `npm run render`. Se quiser usar um QR pronto (por exemplo um QR dinâmico do ME-QR),
 * coloque a imagem em public/ e aponte QR_IMAGEM para ela; aí o link de APP_URL só aparece
 * escrito embaixo do QR.
 */
export const APP_URL = "https://equipepeao-ci7r.vercel.app/";

/** O link como aparece escrito na tela (sem https:// e sem a barra do fim). */
export const APP_URL_TEXTO = APP_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** Imagem de QR pronta em public/ (ex.: "qr.png"), ou null para gerar a partir de APP_URL. */
export const QR_IMAGEM: string | null = null;

export const LARGURA = 1280;
export const ALTURA = 720;
export const FPS = 30;
export const DURACAO_S = 45;
