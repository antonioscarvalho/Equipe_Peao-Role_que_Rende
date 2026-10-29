import QRCode from "qrcode";
import { Img, staticFile } from "remotion";
import { APP_URL, QR_IMAGEM } from "./config";

// Gerado uma vez, a partir do link em config.ts. Correção "Q" aguenta bem a compressão do vídeo.
const qr = QRCode.create(APP_URL, { errorCorrectionLevel: "Q" });
const N = qr.modules.size;
let caminho = "";
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (qr.modules.get(y, x)) caminho += `M${x} ${y}h1v1h-1z`;

/** O QR code do app, em preto sobre branco com a margem de silêncio de 2 módulos. */
export function Qr({ tamanho }: { tamanho: number }) {
  if (QR_IMAGEM) return <Img src={staticFile(QR_IMAGEM)} style={{ width: tamanho, height: tamanho, display: "block" }} />;
  return (
    <svg width={tamanho} height={tamanho} viewBox={`-2 -2 ${N + 4} ${N + 4}`} shapeRendering="crispEdges" style={{ display: "block" }}>
      <rect x={-2} y={-2} width={N + 4} height={N + 4} fill="#FFFFFF" />
      <path d={caminho} fill="#000000" />
    </svg>
  );
}
