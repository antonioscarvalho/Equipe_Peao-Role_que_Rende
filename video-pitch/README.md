# Vídeo em loop "Meu amigo Broto!"

Vídeo de 45 s, 1280×720, feito para rodar em loop (o último quadro emenda no primeiro). Montado em [Remotion](https://www.remotion.dev).

- 0 a 18 s: logo do Rolê que Rende, logo da Açaí Valley e a logo animada do app (como na abertura do app).
- 18,29 s (entrada da batida) a 38,9 s: seis cenas no compasso, pontos fortes à esquerda e o app à direita.
- 38,9 a 45 s: o QR code cresce no centro pedindo para acessar e volta ao canto antes do loop.
- O QR code fica sempre no canto superior esquerdo.

## Trocar o link ou o QR code

1. Abra `src/config.ts` e troque `APP_URL`. O QR é gerado desse link no render, e o link escrito na tela muda junto.
2. Se preferir um QR pronto (ex.: QR dinâmico), coloque a imagem em `public/` e aponte `QR_IMAGEM` para ela.
3. Rode `npm run render`.

## Comandos

```sh
npm install
npm run studio     # pré-visualizar e ajustar no navegador
npm run capturar   # regrava as telas do app no ar (public/telas/); APP_URL=<link> muda o endereço
npm run render     # gera ../assets/meu-amigo-broto-loop-45s-720p.mp4 e a versão de 3 min (4 voltas)
```

Os tempos das cenas estão em `src/tempo.ts` (grade da música, ~139,5 BPM) e os textos em `CENAS`, no `src/Video.tsx`.
A audiodescrição/legenda do vídeo fica em `../assets/meu-amigo-broto-loop-45s.vtt`; atualize se mudar algum texto.
