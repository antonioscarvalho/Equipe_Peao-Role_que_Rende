import { FOTO_LADO, recorteQuadrado, validarArquivoFoto, type ErroFoto } from "./perfil";

export class FotoRecusada extends Error {
  readonly motivo: ErroFoto;

  constructor(motivo: ErroFoto) {
    super(`foto recusada: ${motivo}`);
    this.motivo = motivo;
  }
}

/**
 * Prepara a foto escolhida para guardar: recorte quadrado do meio, reduzida a FOTO_LADO px e
 * reencodada como `data:`. Reencodar também descarta os metadados do arquivo original (EXIF com
 * local e aparelho). Só roda no navegador: precisa de createImageBitmap e canvas.
 */
export async function prepararFoto(arquivo: File): Promise<string> {
  const recusa = validarArquivoFoto(arquivo);
  if (recusa) throw new FotoRecusada(recusa);
  if (typeof createImageBitmap !== "function") throw new FotoRecusada("leitura");

  let imagem: ImageBitmap;
  try {
    imagem = await createImageBitmap(arquivo);
  } catch {
    throw new FotoRecusada("leitura");
  }
  const { x, y, lado } = recorteQuadrado(imagem.width, imagem.height);
  const destino = Math.min(FOTO_LADO, lado);

  const canvas = document.createElement("canvas");
  canvas.width = destino;
  canvas.height = destino;
  const contexto = canvas.getContext("2d");
  if (!contexto) throw new FotoRecusada("leitura");
  contexto.drawImage(imagem, x, y, lado, lado, 0, 0, destino, destino);
  imagem.close();

  // O Safari antigo não gera WebP e devolve PNG; aí cai para JPEG, que é bem menor.
  let uri = canvas.toDataURL("image/webp", 0.85);
  if (!uri.startsWith("data:image/webp")) uri = canvas.toDataURL("image/jpeg", 0.85);
  return uri;
}
