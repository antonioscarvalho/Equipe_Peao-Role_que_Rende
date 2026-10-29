# Cores — Rolê que Rende

> "A paleta de cores adotada pelo Rolê que Rende é do brandzone do Banco do Brasil." — Manual IDV 2025

## 1. Paleta oficial (Manual IDV 2025)

| Token | Nome | HEX | RGB | CMYK | Pantone |
|---|---|---|---|---|---|
| `--rqr-amarelo` | Amarelo | `#FCFC30` | 252 252 48 | 0 0 100 0 | 3945 C |
| `--rqr-azul-escuro` | Azul-escuro | `#3333BD` | 51 51 189 | 90 95 0 0 | 2736 C |
| `--rqr-azul` | Azul | `#465EFF` | 70 94 255 | 90 40 0 0 | 2369 C |
| `--rqr-azul-claro` | Azul-claro | `#54DCFC` | 84 220 252 | 50 0 0 0 | 292 C |
| `--rqr-roxo` | Roxo-escuro | `#735CC6` | 115 92 198 | 65 70 0 0 | 2089 C |
| `--rqr-rosa-escuro` | Rosa-escuro | `#FF6E91` | 255 110 145 | 0 80 20 0 | 190 C |
| `--rqr-rosa-claro` | Rosa-claro | `#FFA7D3` | 255 167 211 | 0 40 0 0 | 210 C |
| `--rqr-branco` | Branco | `#FFFFFF` | 255 255 255 | 0 0 0 0 | — |

### Versões do programa
- **Versão Agro**: verde predominante `#00EBD0` (Pantone 3265 C, CMYK 70 0 40 0, RGB 0 235 208). O manual chama de "verde-escuro".
- **Versão Pro**: azul `#465EFF` predominante.
- Nas versões Agro e Pro a tagline fica **alinhada à esquerda** do logo (na principal, centralizada).

## 2. Cores usadas no site (bb.com.br/site/role-que-rende)

| Uso | HEX |
|---|---|
| Header (barra de navegação) | `#3D5AFF` |
| Fundo do banner hero | `#1653FD` |
| Título H1 do banner / bullets do carrossel | `#FCFC30` |
| Títulos de seção sobre branco | `#465EFF` |
| Títulos de seção sobre escuro | `#FCFC30` |
| Título com borda (lista de formatos) | `#7358C8` |
| Cor de marcação/realce de palavras ("markup") | `#FCFC30` e `#FFEC86` |
| Descrição sobre branco | `#767A86` / `#54595F` |
| Descrição sobre escuro | `#FFFFFF` |
| Subtítulos | `#3333BD`, `#3D5AFF`, `#FCFC30` |
| Links | `#3354FD` |
| Botão primário | fundo `#FCFC30`, texto `#FF6E91` (banner: `#465EFF`) |
| Botão padrão do DLS (não usado no Rolê) | fundo `#FFEFDA`, texto `#FA33D6` |
| Fundos de seção | `#FFFFFF`, `#3333BD`, `#735CC6` |

### Cores globais do kit Elementor da página (brandzone BB)
Vibrantes: `#FCFC30` `#FFF7B5` `#465EFF` `#3333BD` `#54DCFC` `#735CC6` `#BDB6FF` `#00EBD0` `#83FFEA` `#FF6E91` `#FFA7D3` `#525DFF` `#5357ED`
Neutros: `#111214` `#4E5155` `#686C73` `#F0F2F4` `#FFFFFF`
Neutros quentes: `#D6D3D0` `#777574` `#E8E7E4` `#F4F3F2` `#99948F`
Verdes escuros (agro): `#093F3A` `#11302B`

Pares claro/escuro úteis (tints oficiais):
| Base | Tint claro |
|---|---|
| Amarelo `#FCFC30` | `#FFF7B5` |
| Roxo `#735CC6` | `#BDB6FF` |
| Verde `#00EBD0` | `#83FFEA` |
| Rosa `#FF6E91` | `#FFA7D3` |

## 3. Cores do logo (medidas nos vetores do manual)
- Letras: azul-claro (`#54DCFC` / `#00DFFF`) com contorno e extrusão 3D em azul-escuro `#3333BD` e azul `#3F5FFF`.
- Moeda e "n" dourados: `#F2C50B` (luz), `#E49702` / `#F7BB04` (meio), `#D47D12` (sombra). Use só para elementos de moeda/recompensa.
- Fundos claros do manual: `#FDF3AA`.

## 4. Contraste (WCAG) — combinações testadas

Razão de contraste (texto sobre fundo). ✅ ≥ 4,5 (qualquer texto) · 🟡 3–4,5 (só título grande/bold) · ❌ < 3

| Fundo ↓ / Texto → | Azul-escuro | Azul | Roxo | Rosa-escuro | Branco | Amarelo | Preto `#111214` |
|---|---|---|---|---|---|---|---|
| **Amarelo** | ✅ 8,1 | 🟡 4,4 | ✅ 4,7 | ❌ 2,4 | ❌ 1,1 | — | ✅ 17,1 |
| **Branco** | ✅ 8,9 | ✅ 4,9 | ✅ 5,2 | ❌ 2,7 | — | ❌ 1,1 | ✅ 18,7 |
| **Azul-escuro** | — | ❌ 1,8 | ❌ 1,7 | 🟡 3,4 | ✅ 8,9 | ✅ 8,1 | ❌ 2,1 |
| **Azul** | ❌ 1,8 | — | ❌ 1,1 | ❌ 1,8 | ✅ 4,9 | 🟡 4,4 | 🟡 3,8 |
| **Roxo** | ❌ 1,7 | ❌ 1,1 | — | ❌ 1,9 | ✅ 5,2 | ✅ 4,7 | 🟡 3,6 |
| **Azul-claro** | ✅ 5,5 | 🟡 3,0 | 🟡 3,2 | ❌ 1,6 | ❌ 1,6 | ❌ 1,5 | ✅ 11,6 |
| **Rosa-claro** | ✅ 5,0 | ❌ 2,7 | ❌ 2,9 | ❌ 1,5 | ❌ 1,8 | ❌ 1,6 | ✅ 10,5 |
| **Header `#3D5AFF`** | — | — | — | — | ✅ 5,1 | ✅ 4,7 | — |
| **Banner `#1653FD`** | — | — | — | — | ✅ 5,7 | ✅ 5,2 | — |

**Combinações recomendadas**
- Amarelo + texto azul-escuro → combinação principal (manual: "O feed tá on, só falta você!").
- Azul-escuro ou roxo + títulos amarelos e corpo branco → seções escuras.
- Branco + títulos azul `#465EFF` (≥ 24px) e corpo azul-escuro ou `#4E5155`.
- Rosa-escuro, rosa-claro e azul-claro → **decoração** (grafismos, ícones, preenchimentos), não texto.

**Daltonismo**: rosa × roxo × azul ficam próximos em protanopia/deuteranopia. Nunca use só a cor para diferenciar estados (certo/errado, ganho/perda) — some ícone, forma ou texto.

## 5. Proporção sugerida em uma tela
- 50–60% amarelo **ou** branco (base)
- 20–30% azuis/roxo (blocos, texto)
- 10–15% acentos (rosa, azul-claro) em grafismos
- dourado só em moeda/recompensa
