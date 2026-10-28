# Tipografia — Rolê que Rende

> "[A família] já usada em diversos canais do BB. Existem duas versões da fonte: uma para textos maiores ou frases muito longas, e outra apenas para títulos." — Manual IDV 2025

## Famílias oficiais

| Família | Uso | Pesos encontrados no manual |
|---|---|---|
| **BancoDoBrasil Títulos** | Títulos, chamadas, botões, números grandes | Light, Regular, Medium, Medium Italic, Bold, XBold |
| **BancoDoBrasil Textos** | Parágrafos, textos longos, legendas, UI | Light, Regular, Medium, Bold, XBold |

São fontes proprietárias do BB (sans-serif humanista, formas arredondadas, "a" de dois andares, itálico com bastante inclinação).

## Fontes livres incluídas no guia (use estas)

Baixadas em 28/10/2026 e guardadas em [`assets/fontes/`](../assets/fontes/), para funcionar **offline e sem CDN** (regra da skill `web-react-vite`):

| Família | Pesos | Uso | Licença |
|---|---|---|---|
| **Nunito Sans** | 400, 600, 700, 800 (normal e itálico) | Títulos (`--rqr-font-titulo`) | SIL OFL 1.1 ([OFL-NunitoSans.txt](../assets/fontes/OFL-NunitoSans.txt)) |
| **Roboto** | 400, 500, 700 (normal e itálico) | Textos (`--rqr-font-texto`) | SIL OFL 1.1 ([OFL-Roboto.txt](../assets/fontes/OFL-Roboto.txt)) |

Subconjunto *latin* (cobre os acentos do português). Origem: Fontsource 5.3.0 (`@fontsource/nunito-sans`, `@fontsource/roboto`).

**Como usar:**
- **Web (Vite):** importe o `tokens.css` (ele já faz `@import './fontes/fontes.css'`). No `npm run dev`, a pasta `assets` do guia precisa estar liberada em `server.fs.allow` (o `web/vite.config.ts` já faz isso).
- **HTML solto:** `<link rel="stylesheet" href="…/assets/tokens.css">`.
- **Mobile (Expo) e engines:** os arquivos `.woff2` estão listados em `assets/tokens.json` (`tipografia.arquivos`); para Expo, converta para `.ttf` ou use o pacote `@expo-google-fonts/nunito-sans` e `@expo-google-fonts/roboto`.

## Fallbacks (quando não houver os arquivos da fonte)

```css
--rqr-font-titulo: "BancoDoBrasil Titulos", "Nunito Sans", "Roboto", system-ui, sans-serif;
--rqr-font-texto:  "BancoDoBrasil Textos", "Roboto", "Nunito Sans", system-ui, sans-serif;
```
- **Roboto** é a fonte que o próprio site carrega via Google Fonts (300/400/500/700) e é a fonte "text/primary" do kit Elementor da página (pesos 400/500/600).
- **Nunito Sans** (Google Fonts) é a alternativa livre mais próxima do desenho arredondado dos títulos BB — sugestão, não oficial.
- O lettering do logo ("Rolê que Rende BB", letras infladas 3D) **não é uma fonte**: use sempre o arquivo do logo.

## Escala tipográfica

Do site (banner hero):
| Elemento | Desktop | Mobile | Peso | Cor |
|---|---|---|---|---|
| H1 banner | 80px | 40px | Bold | `#FCFC30` |
| Descrição banner | 24px | 18px | Regular | `#FFFFFF` |

Escala sugerida para o projeto (múltiplos coerentes com o site):
| Token | Desktop | Mobile | Fonte / peso | Uso |
|---|---|---|---|---|
| `--rqr-fs-display` | 80px | 40px | Títulos XBold | Tela de título, hero |
| `--rqr-fs-h1` | 56px | 32px | Títulos Bold | Título de tela |
| `--rqr-fs-h2` | 40px | 28px | Títulos Bold | Título de seção |
| `--rqr-fs-h3` | 28px | 22px | Títulos Medium | Título de card |
| `--rqr-fs-lead` | 24px | 18px | Textos Regular | Subtítulo/introdução |
| `--rqr-fs-body` | 18px | 16px | Textos Regular | Corpo |
| `--rqr-fs-small` | 14px | 14px | Textos Medium | Legenda, rótulo |

- Altura de linha: 1.1 nos títulos display, 1.2 em H1–H3, 1.5 no corpo.
- Corpo nunca abaixo de 16px no mobile.

## Estilo de composição (dos mockups do manual)

- **Palavras-chave em Bold Itálico e maiores**, misturadas com o resto em Regular:
  "O feed / tá **_on_**, / só falta / **_você!_**"
- Linhas **escalonadas** (cada linha com recuo diferente), alinhamento à esquerda.
- Em blocos de oferta (balcão promocional), mistura de tamanhos dentro da mesma frase: "Sem / **COMPROVAÇÃO** / de **Renda**", "Somos a **MAIOR** do **mercado**". Palavras pequenas (preposições) em tamanho menor, palavras de impacto em CAIXA ALTA bold.
- Cores do texto alternam entre azul-escuro e branco/amarelo conforme o fundo, com uma palavra de destaque em outra cor da paleta (ex.: "Renda" em amarelo sobre azul-claro).
- Hashtag/tagline **#TodoRolêImporta** em Títulos Medium Italic, pequena, centralizada abaixo do logo.
- Realce de palavras no site: "marca-texto" amarelo (`markup-color` `#FCFC30` / `#FFEC86`) por trás da palavra.
