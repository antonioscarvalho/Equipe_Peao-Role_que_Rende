import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

// Fontes do guia de estilo ficam fora de web/; no `npm run dev` o Vite precisa poder servi-las.
const guia = fileURLToPath(new URL("../.claude/skills/guia-estilo-role-que-rende/assets", import.meta.url));

// `npm run dev:https` usa o certificado local de ./certs (gerado por `npm run certs`).
// O giroscópio do celular só funciona em HTTPS.
const https = process.env.HTTPS === "1" && existsSync("certs/cert.pem")
  ? { key: readFileSync("certs/key.pem"), cert: readFileSync("certs/cert.pem") }
  : undefined;

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: https ? 5443 : 5180, strictPort: true, https, fs: { allow: [".", guia] } },
  preview: { host: true, port: 4180, strictPort: true },
});
