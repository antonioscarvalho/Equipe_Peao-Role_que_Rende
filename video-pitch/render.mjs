// Renderiza o vídeo de 45 s (720p) e a versão de 3 min (o mesmo vídeo 4 vezes, emendado sem recodificar).
// Uso: npm run render   (o link e o QR vêm de src/config.ts)
import { execSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";

const saida = "../assets/meu-amigo-broto-loop-45s-720p.mp4";
const saida3min = "../assets/meu-amigo-broto-loop-3min-720p.mp4";
const rodar = (cmd) => execSync(cmd, { stdio: "inherit" });

rodar(`npx remotion render PitchLoop ${saida} --codec=h264 --crf=18 --audio-bitrate=192k`);
writeFileSync("lista.txt", Array(4).fill(`file '${saida}'`).join("\n"));
rodar(`npx remotion ffmpeg -y -f concat -safe 0 -i lista.txt -c copy -movflags +faststart ${saida3min}`);
rmSync("lista.txt");
