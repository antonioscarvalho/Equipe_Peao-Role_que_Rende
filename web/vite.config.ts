import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync } from "node:fs";

// `npm run dev:https` usa o certificado local de ./certs (gerado por `npm run certs`).
// O giroscópio do celular só funciona em HTTPS.
const https = process.env.HTTPS === "1" && existsSync("certs/cert.pem")
  ? { key: readFileSync("certs/key.pem"), cert: readFileSync("certs/cert.pem") }
  : undefined;

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: https ? 5443 : 5180, strictPort: true, https },
  preview: { host: true, port: 4180, strictPort: true },
});
