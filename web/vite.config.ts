import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
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
  plugins: [
    react(),
    // App instalável (ícone na tela inicial, abre em tela cheia) e que abre sem internet.
    // O nome e a descrição são neutros de propósito: aparecem na tela inicial e na lista de apps
    // (skill design-etico-saude-digital, "modo discreto"; nada de "aposta" fora do app).
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      // Os ícones já entram pelo globPatterns; sem isto, cada um apareceria duas vezes no precache.
      includeManifestIcons: false,
      manifest: {
        name: "Meu amigo Broto!",
        short_name: "Broto",
        description: "Um passo de cada vez, com alguém do seu lado.",
        lang: "pt-BR",
        id: "/",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "any", // WCAG 1.3.4: funciona deitado também (quem usa o celular preso em suporte)
        background_color: "#F9DC6E",
        theme_color: "#FCFC30",
        icons: [
          { src: "/icones/icone-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icones/icone-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icones/icone-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // O app em si (código, estilos, fontes, ícones) fica guardado na instalação: a tela de
        // ajuda (CVV 188, SAMU 192) e o "Deu vontade" abrem sem internet.
        globPatterns: ["**/*.{js,css,html,svg,png,woff,woff2,ttf}", "marca/*.webp"], // logo da abertura também offline
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: "/index.html",
        // Cenários (13 MB) e sons ficam guardados só depois da primeira vez que aparecem.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && /^\/(cenarios|sons)\//.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "broto-midia",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],
  server: { host: true, port: https ? 5443 : 5180, strictPort: true, https, fs: { allow: [".", guia] } },
  preview: { host: true, port: 4180, strictPort: true },
});
