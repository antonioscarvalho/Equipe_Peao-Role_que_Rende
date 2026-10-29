# Grafismos e ícones — Rolê que Rende

Grafismos servem "para agregar personalidade e consistência às peças visuais, reforçando a identidade da marca em diferentes aplicações". — Manual IDV 2025

Veja os mockups em [../assets/referencias/](../assets/referencias/) para a referência real.

## Textura base: pincel seco
Todos os grafismos parecem pintados à mão com **pincel seco / rolo de tinta**: bordas irregulares, falhas de tinta, rastros paralelos de cerdas. Nada de vetor liso e perfeito.

## Repertório de grafismos
| Grafismo | Descrição | Cores usuais |
|---|---|---|
| Seta curva | Pincelada que faz uma curva/laço e termina em ponta de seta | azul `#465EFF`, azul-escuro, rosa |
| Seta com laço | Linha que dá uma volta (loop) antes da ponta | azul, roxo |
| Arco / sorriso | Meia-lua grossa de pincel | rosa-escuro, roxo, azul |
| Pincelada reta | Traço largo diagonal, curto | azul-claro, rosa-claro, azul |
| Bolinha | Círculo preenchido pequeno, com brilho | azul-claro, roxo |
| Anel | Círculo vazado ("donut") | azul-claro, roxo |
| Triângulo vazado | Triângulo de contorno grosso, levemente torto | azul, azul-escuro |
| Asterisco / flor | Flor de 6–8 pétalas em pincel | azul-claro, roxo |

## Ícones
- "Os ícones seguem uma linguagem simples e de fácil utilização."
- **Sempre dentro de um shape circular** (círculo com textura de pincel atrás do ícone).
- Criar novos ícones é livre, seguindo essa composição.
- Aplicar com contraste adequado entre ícone e fundo.
- Repertório visto: **coração** (círculo rosa), **joinha/curtir** (círculo rosa, mão azul), **cifrão $** (círculo azul-escuro), **cofrinho com moeda** (círculo roxo), **moeda BB** (dourada).
- Ícone: traço contornado azul-escuro, preenchimento branco/azul; círculo de fundo em cor de acento.

Sugestões de ícones novos para o projeto (no mesmo padrão): carteira, calendário/streak, escudo (proteção), mão estendida (rede de apoio), telefone (ajuda), meta/alvo, gráfico subindo, coração com mãos.

## Regras de composição
- Grafismos **ao redor** do conteúdo (bordas, cantos), deixando o centro limpo para logo/mensagem.
- Densidade alta em peças promocionais; em telas de app/jogo use 3–6 grafismos por tela.
- Varie rotação (−30° a 30°) e tamanho; não alinhe em grade.
- Nunca por trás de texto corrido.
- Separadores do site: faixa azul em imagem (`barra-azul.png`) e **filete em curva** (`filet-curva`, onda) entre seções.

## Como reproduzir no digital
- **Ideal**: pintar/escaner pinceladas reais ou usar brushes "dry brush" (Procreate, Krita, Photoshop) e exportar PNG/WebP com transparência.
- **SVG rápido**: traço `stroke-linecap: round` com filtro de ruído (`feTurbulence` + `feDisplacementMap`) para irregularidade — exemplo em [../assets/exemplo.html](../assets/exemplo.html).
- **Engines**: sprites PNG de pinceladas, com variações de cor via tint/modulate usando as cores da paleta.

## Mosaico de blocos (balcão promocional)
Peças de varejo usam uma **grade 3×3 de quadrados coloridos** (azul-claro, rosa, amarelo, azul-escuro), cada um com uma mensagem curta e um grafismo grande de pincel por trás. Bom modelo para telas de seleção / cartões de conquista.
