# Componentes web — como o site oficial é montado

Página: https://www.bb.com.br/site/role-que-rende/ — WordPress + Elementor, com web components Angular do design system do BB ("DLS", prefixo `bb-`).

## Estrutura da página (de cima para baixo)

| # | Seção | Componente | Fundo | Título | Texto |
|---|---|---|---|---|---|
| 1 | Header | `bb-header` | `#3D5AFF` | — | branco |
| 2 | Banner hero (carrossel) | `bb-receptive-banner-full-new-wc` | imagem ilustrada + `#1653FD` | H1 bold 80/40px `#FCFC30` | 24/18px branco |
| 3 | Breadcrumb | `bb-breadcrumb-portal-new-wc` | branco | — | — |
| 4 | "Falar de grana pode ser leve, sim." | `bb-receptive-content-image` (texto + imagem) | branco | `#465EFF` **Regular**, realce `#FCFC30` | `#767A86` |
| 5 | "Que rolê é esse?" | `bb-receptive-advantages` (3 colunas com ilustração) | branco | H3 | — |
| 6 | Faixa | imagem `barra-azul.png` | — | — | — |
| 7 | "Como o Rolê acontece:" | content-image | `#3333BD` | `#FCFC30` bold | branco |
| 8 | Lista de formatos | content-image com título com borda | `#3333BD` | `#7358C8` | branco |
| 9 | Separador | imagem `filet-curva` (onda) | — | — | — |
| 10 | Jogos Educativos / Quiz e desafio | content-image + botão | branco | `#465EFF` bold | `#54595F` |
| 11 | Rodas de conversa / Parcerias / Conteúdo livre | content-image + botão | `#735CC6` | `#FCFC30` bold | branco |
| 12 | Cards de materiais (3) | `bb-card-image-wc` vertical | branco | `#465EFF` | — |
| 13 | Conteúdos digitais / Materiais de apoio | content-image + 2 botões | branco | `#465EFF` | `#767A86` |
| 14 | Blog BB | `bb-blog-group-wc` | branco | — | — |
| 15 | Footer + cookies + speed bump | `bb-footer`, `bb-cookies-wc`, `bb-speed-bump-wc` | — | — | — |

## Botões
| Variante | Fundo | Texto | Peso | Onde |
|---|---|---|---|---|
| Primário Rolê | `#FCFC30` | `#FF6E91` | Bold | "Jogar", "Seguir", "Quero ser parceiro", "Baixe" |
| Primário banner | `#FCFC30` | `#465EFF` | Bold | Banner hero |
| Link | — | `#3354FD` | Regular | Links de texto |

⚠️ `#FF6E91` sobre `#FCFC30` = 2,4:1 (falha WCAG). **No projeto, use texto `#3333BD`** no botão amarelo (8,1:1) e reserve o rosa para borda/sombra/hover.

Botão sugerido (fiel ao estilo + acessível): pílula (border-radius total), fundo amarelo, texto azul-escuro bold, sombra sólida deslocada azul-escuro `0 4px 0 #3333BD` ("botão de jogo"), hover sobe 2px, active desce.

## Cards (`bb-card-image-wc`)
- Tipo vertical, tamanho "display": imagem no topo, título `#465EFF`, botão amarelo com texto rosa, fundo branco.
- Imagens dos cards são ilustrações/capas coloridas no estilo da marca.

## "Vantagens" (`bb-receptive-advantages`)
- 3 itens em linha, cada um com ilustração (estrela/CD, placa/luz, cachorro com a língua de fora — ilustrações divertidas) e uma frase curta:
  - "É um circuito itinerante do Banco do Brasil que acontece de Norte a Sul com foco no Público Jovem"
  - "É um programa de Educação Financeira voltado para a nova geração de clientes do BB"
  - "É um movimento que fortalece a conexão com os clientes e impulsiona os resultados do negócio"

## Layout e espaçamento
- Container: **1140px** (≤1024px: 1024; ≤767px: 767 com margens laterais).
- Breakpoints: **1024px** (tablet) e **767px** (mobile).
- Espaçadores verticais entre blocos: **10, 20, 30, 40, 50px** (no mobile, 40 → 20).
- Gap padrão entre widgets: **20px**. Padding de coluna custom: 17px.
- Imagem + texto lado a lado no desktop; empilha no mobile.
- Tabelas: rolagem horizontal, `min-width: 640px`, scrollbar fina 8px.

## Acessibilidade presente no site
- Link "Ir para o conteúdo principal" (skip link): `position:absolute; left:-999px`, aparece em `:focus` com fundo preto e texto branco, padding 8px.
- Menu lateral com "Ignorar menu lateral".
- Aviso ("speed bump") antes de links externos: "Este link vai direcionar você para um site externo ao Portal".
- Banner de cookies com 3 categorias.

## Transições
```css
transition: background .3s, border .3s, border-radius .3s, box-shadow .3s;
/* overlay */
transition: background .3s, border-radius .3s, opacity .3s;
```
