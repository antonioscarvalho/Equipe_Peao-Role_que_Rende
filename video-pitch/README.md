# Vídeo de pitch: Meu amigo Broto!

Vídeo de venda do app, sem áudio (1920×1080, 30 fps, cerca de 1 min 52 s), feito com [Remotion](https://www.remotion.dev) a partir de gravações reais do app em `web/`.

## Como refazer

Rodar no WSL/Linux, com o app no ar (`cd web && npm run dev`, porta 5180).

```bash
cd video-pitch
npm install
(cd captura && npm install && npx playwright install chromium --no-shell)
node captura/capturar.mjs   # grava as telas do app em public/cenas/
npm run studio              # pré-visualiza e edita no navegador
npm run render              # gera out/pitch-broto.mp4 (sem áudio)
```

`node captura/capturar.mjs inicio pulo` grava só as cenas citadas.

## Como funciona

- `captura/capturar.mjs` abre o app como celular (390×844) no Chromium, coloca um estado de demonstração **sintético** no `localStorage` ("Marcos", dia 10 do plano, capítulo 1 concluído), executa a jornada e grava a tela com o screencast do Chromium. O ffmpeg que vem com o Remotion converte para MP4. No Pulo do Bichinho, um piloto automático guia o Broto até as plataformas, só para a gravação.
- `src/Pitch.tsx` monta as 13 cenas (gancho, dados, revelação, história, Deu vontade, jogo, ajuda, plano de 90 dias, gamificação ética, acessibilidade, privacidade, impacto e fechamento). `src/ui.tsx` tem o celular, os títulos animados e os blocos no estilo do tema "livro ilustrado" do app.
- Fontes: Fredoka e Nunito Sans (Google Fonts, OFL), as mesmas do app. Ícones: Lucide (ISC), copiados de `web/src/icones-data.ts`. Arte: ícone e cenários de `web/public/`.

## Dados citados

Só os marcados como verificados em [`docs/07-conformidade/fontes-e-referencias.md`](../docs/07-conformidade/fontes-e-referencias.md): Genial/Quaest (29%), Ministério da Fazenda/SPA (574 mil e 41%) e Legitimuz (77,5% Android, citado como dados do setor). O estudo de Skorka-Brown et al. (2015) aparece como "inspirado em evidências", como pede `docs/03-design/narrativa-broto.md`.

O vídeo não usa marca do Banco do Brasil nem do Rolê que Rende (Seção 8.4 do edital).
