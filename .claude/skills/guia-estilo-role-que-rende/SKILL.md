---
name: guia-estilo-role-que-rende
description: Guia de estilo visual e de linguagem do programa "Rolê que Rende BB" (Banco do Brasil), extraído do site oficial bb.com.br/site/role-que-rende e do Manual de Identidade Visual (2025). Use SEMPRE que for criar ou revisar qualquer interface, tela de jogo, HUD, página web, componente, card, botão, ilustração, animação, slide, peça gráfica ou texto de UI do projeto da Equipe Peão — ou quando alguém pedir "no estilo do Rolê que Rende", "cores do Rolê", "identidade visual", "paleta", "fonte", "tipografia", "grafismos", "animação", "tom de voz" ou "design system" do projeto.
---

# Guia de estilo — Rolê que Rende BB

Fontes da extração (outubro/2026):
- Site oficial: https://www.bb.com.br/site/role-que-rende/ (WordPress + Elementor + web components do design system do BB, "DLS")
- Manual de Aplicação de Marca / Identidade Visual 2025 (PDF oficial, 23 páginas): https://www.bb.com.br/docs/portal/direc/BB-ROLE-QUE-RENDE-MANUAL-IDV.pdf
- Canais: Instagram `@rolequerende`, quiz em https://rolequerende.bb.com.br/, jogo no Roblox ("Rolê Que Rende BB")

## A identidade em uma frase

**Amarelo vibrante + azuis do BB + rosa e roxo, pinceladas à mão, ícones dentro de círculos e um texto que fala como gente jovem: leve, direto, sem "financês".**

## Regras de ouro (aplicar sempre)

1. **Use só a paleta oficial** (8 cores do brandzone do BB). Tokens prontos em [assets/tokens.css](assets/tokens.css) e [assets/tokens.json](assets/tokens.json).
2. **Amarelo `#FCFC30` é a cor de fundo-assinatura** das peças. Azul-escuro `#3333BD` e roxo `#735CC6` são os fundos escuros de seção.
3. **Contraste primeiro.** Texto sobre amarelo = azul-escuro `#3333BD` (8,1:1). Texto sobre azuis/roxo = branco ou amarelo. Nunca branco sobre amarelo, azul-claro ou rosa-claro. Tabela completa em [references/cores.md](references/cores.md).
4. **Tipografia da família BancoDoBrasil**: *Títulos* para chamadas, *Textos* para corpo. Destaque com **bold itálico** em palavras-chave ("tá **on**", "**você!**"). Detalhes em [references/tipografia.md](references/tipografia.md).
5. **Grafismos de pincel seco** (setas curvas, arcos, bolinhas, triângulos, asteriscos) espalhados nas bordas, nunca por cima do texto. Ícones sempre **dentro de um shape circular** com textura de pincel. Ver [references/grafismos-e-icones.md](references/grafismos-e-icones.md).
6. **Logo é imagem, nunca recriada em texto.** Respeitar a área de proteção (altura da moeda), não distorcer, não adicionar/remover elementos, não aplicar sem contraste. Ver [references/marca-e-logo.md](references/marca-e-logo.md).
7. **Tom de voz**: "papo reto", informal, 2ª pessoa, gírias leves ("grana", "rolê", "tá on"), frases curtas, sem jargão financeiro. Ver [references/voz-e-tom.md](references/voz-e-tom.md).
8. **Movimento com energia, mas acessível**: animações curtas e elásticas ("pop", pincelada que se desenha, moeda que gira) e sempre respeitar `prefers-reduced-motion`. Ver [references/animacoes.md](references/animacoes.md).

## Paleta oficial (resumo)

| Nome (manual) | HEX | RGB | CMYK | Pantone | Papel principal |
|---|---|---|---|---|---|
| Amarelo | `#FCFC30` | 252 252 48 | 0 0 100 0 | 3945 C | Fundo-assinatura, botões, títulos sobre escuro |
| Azul-escuro | `#3333BD` | 51 51 189 | 90 95 0 0 | 2736 C | Texto sobre claro, fundos de seção, contorno do logo |
| Azul | `#465EFF` | 70 94 255 | 90 40 0 0 | 2369 C | Títulos sobre branco, links, versão "Pro" |
| Azul-claro | `#54DCFC` | 84 220 252 | 50 0 0 0 | 292 C | Letras do logo, grafismos, destaques |
| Roxo-escuro | `#735CC6` | 115 92 198 | 65 70 0 0 | 2089 C | Fundos de seção, grafismos, ícones |
| Rosa-escuro | `#FF6E91` | 255 110 145 | 0 80 20 0 | 190 C | Texto de botão, grafismos, ícones |
| Rosa-claro | `#FFA7D3` | 255 167 211 | 0 40 0 0 | 210 C | Pinceladas suaves, fundos de card |
| Branco | `#FFFFFF` | 255 255 255 | 0 0 0 0 | — | Fundos de conteúdo, texto sobre escuro |
| Verde "Agro" | `#00EBD0` | 0 235 208 | 70 0 40 0 | 3265 C | Só na versão Agro do programa |

## Componentes do site (como o BB aplica na web)

Resumo — detalhes, medidas e o mapa de seções em [references/componentes-web.md](references/componentes-web.md):

- **Header**: fundo `#3D5AFF`.
- **Banner hero**: imagem ilustrada com fundo `#1653FD`; H1 bold em amarelo `#FCFC30`, **80px desktop / 40px mobile**; descrição branca 24px / 18px; bullets do carrossel em amarelo.
- **Botão primário do Rolê**: fundo amarelo `#FCFC30`, texto bold rosa-escuro `#FF6E91` (no banner: texto azul `#465EFF`). ⚠️ Rosa sobre amarelo tem contraste 2,4:1; para acessibilidade prefira texto `#3333BD`.
- **Seções** alternam: branco → faixa azul → azul-escuro `#3333BD` → separador em curva → branco → roxo `#735CC6` → branco.
- **Cards**: fundo branco, imagem no topo (vertical), título `#465EFF`, botão amarelo.
- **Container** 1140px; breakpoints 1024px e 767px; espaçamentos verticais 10/20/30/40/50px; gap entre widgets 20px.
- **Transições** do site: `background, border, border-radius, box-shadow 0.3s`.

## Como usar este skill

- Para **CSS/HTML/React/web game**: importe [assets/tokens.css](assets/tokens.css) e use as variáveis `--rqr-*`. Há um exemplo completo e animado em [assets/exemplo.html](assets/exemplo.html) (abra no navegador).
- Para **engines (Godot, Unity, Phaser, Roblox)**: use [assets/tokens.json](assets/tokens.json) (cores em HEX e RGB 0–1).
- Para conferir o visual real da marca, veja os mockups do manual em [assets/referencias/](assets/referencias/) (banner rollup, balcão, wind banner, ecobag, jaqueta).
- Antes de entregar uma tela, rode o checklist abaixo.

## Checklist de revisão

- [ ] Só cores da paleta (ou variações de opacidade delas)?
- [ ] Todo texto com contraste ≥ 4,5:1 (≥ 3:1 para títulos ≥ 24px bold)?
- [ ] Títulos em fonte de título, corpo em fonte de texto, destaques em bold/itálico?
- [ ] Grafismos nas bordas, sem cobrir conteúdo, com textura de pincel?
- [ ] Ícones dentro de círculos?
- [ ] Logo como imagem, com área de proteção, sem distorção?
- [ ] Texto curto, informal, sem "financês" e **sem estigmatizar** pessoas afetadas por apostas?
- [ ] Animações ≤ 600ms na UI e desligáveis com `prefers-reduced-motion`?
- [ ] Uso das marcas BB / Rolê que Rende apenas no que a organização do hackathon autorizou (regra 8.4 do edital — ver README)?

## Limitações da extração

- As fontes **BancoDoBrasil Títulos/Textos são proprietárias** (aparecem embutidas no manual). Se não tiver os arquivos, use os fallbacks indicados em [references/tipografia.md](references/tipografia.md).
- O site oficial **não tem animações próprias** além de transições de 0,3s e do carrossel do banner. O sistema de animação em [references/animacoes.md](references/animacoes.md) é uma **proposta derivada da identidade** (pinceladas, moeda, "estar ON"), marcada como tal.
- Partes do texto do manual são desenhadas como vetor e não puderam ser lidas na íntegra (ex.: descrição completa dos grafismos e da versão reduzida). O resumo aqui vem do texto legível + análise visual dos mockups.
