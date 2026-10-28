/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // Libera, no `npm run dev`, os tokens e as fontes do guia de estilo, que ficam fora de web/
    // (.claude/skills/guia-estilo-role-que-rende/assets). No build eles já entram no pacote.
    fs: {
      allow: ['.', fileURLToPath(new URL('../.claude/skills/guia-estilo-role-que-rende/assets', import.meta.url))],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
