---
name: estilo-livro-ilustrado
description: Estilo visual obrigatório do app web (web/) — "livro ilustrado" tirado dos cenários em assets/cenarios, com botões no estilo Kahoot (bloco de cor com degrau de tinta que afunda ao tocar). Papel com textura, contorno de tinta azul-noite, cores pastel do entardecer e as ilustrações como fundo. Use SEMPRE ao criar ou alterar tela, componente, botão, cartão, modal, cena da história, item do bichinho ou qualquer CSS do web; ao revisar PR com mudança visível; e quando pedirem "deixar no estilo do app", "estilo dos cenários", "botão estilo Kahoot" ou "mesma cara".
---

# Estilo livro ilustrado

**Alvo:** $ARGUMENTS

O app inteiro tem **uma cara só**: parece um livro infantil ilustrado, igual aos cenários de
`assets/cenarios/` (praça ao entardecer, banco sob o poste, casas na chuva). Toda tela nova
segue este guia. Se algo destoar (cor neon chapada, retângulo liso, fundo de cor única), está errado.

Fonte da verdade no código: [web/src/tema-livro.css](../../../web/src/tema-livro.css)
(carregado por último em `web/src/main.tsx`). Use os tokens e classes de lá; não invente cores.

## Docs que vêm antes deste

- `guia-estilo-role-que-rende`: marca, tom de voz e regras do edital. Este skill **suaviza** a paleta
  da marca para combinar com as ilustrações; a família de cores é a mesma.
- `design-etico-saude-digital` e `seguranca-e-crise`: nada de mecânica de aposta; o caminho de
  ajuda (CVV 188, SAMU 192) nunca some.
- `acessibilidade-wcag`: contraste, foco visível, alvo de toque, reduzir movimento.
- `docs/03-design/prompts-cenarios-capitulos.md`: como gerar cenários novos no mesmo estilo.

## As 6 regras

1. **Papel, não tela.** Fundo creme `--livro-papel` com o grão `--livro-grao`. Cartões em
   `--livro-cartao` com grão. Nunca branco puro chapado nem cor única de fundo.
2. **Contorno de tinta.** Todo bloco tem borda `2.5px solid var(--livro-tinta)` e sombra sólida
   embaixo (`0 4–6px 0 var(--livro-tinta)`), sem desfoque. Cantos levemente tortos:
   `border-radius: var(--livro-raio)` (cartões) ou `var(--livro-raio-p)` (botões, chips).
3. **Pastel do entardecer.** Preenchimentos: `--livro-sol`, `--livro-salvia`, `--livro-ceu`,
   `--livro-lavanda`, `--livro-rosa`, `--livro-menta`, `--livro-terracota`. **Texto sempre em
   `--livro-tinta`** sobre eles (contraste acima de 7:1). Nada de neon (`#FCFC30`, `#00EBD0`,
   `#465EFF`) em superfície grande.
4. **Ilustração de fundo.** Cena com espaço próprio usa um cenário: a praça (`cap1`) na tela
   inicial, na abertura, na história e na personalização; o banco à noite (`cap4`) na respiração,
   no painel de crise e no tema escuro. Por cima, um véu em gradiente (`rgb(27 26 69 / .25–.8)`)
   quando houver texto. **Nunca use o `cap2` (Cometa da Sorte)** fora do capítulo 2: ele
   representa a aposta na história.
5. **Botão Kahoot.** Ação = bloco de cor que afunda ao tocar e volta com um quique curto (detalhe
   abaixo). Vale para botão, opção de história, item de personalização, chip e aba.
6. **Tela sem rolagem.** As telas principais cabem na altura do aparelho (testar 375×667 até
   412×915). A parte elástica (cena do bichinho) encolhe; listas longas rolam só dentro do painel.

## Tipografia

- **Fredoka** (`var(--rqr-font-titulo)`): títulos, botões, abas, etiquetas, números grandes. Peso 600
  nos botões e 700 nos títulos (ela vai até 700).
- **Nunito** (`var(--rqr-font-texto)`): texto corrido, falas do Broto, descrições e legendas.
- As duas vêm dos pacotes `@fontsource-variable/*` importados em `main.tsx` (offline, OFL).
  Não use a Nunito Sans/Roboto do guia da marca nas telas do app.

## Tema escuro: "noite sob o poste"

Paleta do cenário `cap4`. Ação principal em luz âmbar (`--livro-sol`, texto em tinta). Os outros
blocos em tons de noite com texto creme: `--noite-azul`, `--noite-roxo`, `--noite-rosa`,
`--noite-verde`, `--noite-menta` (todos ≥ 4,5:1 com `--noite-creme`). Cartões em `--noite-cartao`
com borda `--noite-linha` (lavanda) e degrau `--noite-funda`. Toda regra nova de cor precisa da
versão `:root[data-tema="escuro"]`.

## Botão Kahoot

Use a classe `kb` + uma cor. Já traz borda, degrau, brilho de cima, hover, toque e foco.

```tsx
<button className="kb kb--verde">Feito!</button>
<button className="kb kb--azul atalho">
  <span className="atalho__icone"><Icone nome="listChecks" /></span>
  <span className="atalho__texto">Missões<small>0 de 4 feitas</small></span>
</button>
```

Cores: `kb--amarelo` (ação principal), `kb--verde` (concluir), `kb--azul`, `kb--roxo`,
`kb--rosa`, `kb--menta`, `kb--escuro` (tinta com texto amarelo). O `rqr-botao` antigo já vira um
`kb--amarelo` pelo tema.

A física (não mude sem motivo):

| Momento | Movimento | Tempo |
|---|---|---|
| Parado | degrau de 6px embaixo | — |
| Hover (só com mouse) | sobe 2px, degrau 8px | 220ms |
| Tocar (`:active`) | afunda até o chão, degrau 0 | 60ms linear |
| Soltar | volta com quique `cubic-bezier(.3, 1.6, .5, 1)` | 220ms |

Para um componente que não pode usar `kb` (ex.: `<label>` de rádio), copie o padrão:
borda + `box-shadow: 0 Npx 0 var(--livro-tinta)` + `:active { transform: translateY(Npx);
box-shadow: 0 0 0 ...; transition-duration: 60ms }`. Exemplos prontos: `.opcao-item`,
`.historia-opcao`, `.amostra`, `.botao-topo__icone`.

## Ilustrar (desenhos SVG do app)

Itens do bichinho, ícones grandes e cenas seguem o traço dos cenários:

- Contorno `var(--rqr-azul-escuro)` (que o tema troca pela tinta) com 4px, pontas e juntas redondas.
- **Volume:** uma faixa de sombra `rgb(27 26 69 / .2)` no lado de baixo e um risco de luz
  `rgb(255 255 255 / .45)` no alto. Sem gradiente brilhante.
- **Detalhe de pano:** costura tracejada creme, canelado de tricô, listras, franja.
- **Textura:** aplique o filtro de pincel do corpo (`pincel={idPincel}`) no grupo do desenho.
- Referência: [web/src/personalizacao/ItensBichinho.tsx](../../../web/src/personalizacao/ItensBichinho.tsx).

## Telas por cima e história

- Topo da história: só dois botões redondos (Libras e ajustes). O menu de ajustes guarda o título
  do capítulo, "Preciso de ajuda agora", "Parar por agora" e o aviso "O Broto é um apoio…".
- Respostas da conversa: grade de blocos coloridos, 2 por linha, logo acima da caixa de fala.
- O Broto fica no centro do gramado, acima das respostas. Nada aparece em dobro: se um painel
  cobre o Broto, ele tem a própria prévia e o da cena some.
- Elementos de SVG por cima da ilustração (lua, Vila) só aparecem no momento da conversa que fala deles.

## Movimento

- **Troca de tela:** sempre o pop do livro (skill `transicao-pop`).

- Entradas com quique curto (`kb-entra`, `kb-salto`, `abertura-pop`), até 600ms.
- Ambiente lento: câmera que se afasta, luzes que acendem, poeira de luz. Nada piscando rápido.
- **Sem** moeda girando, roleta, contagem regressiva ou brilho de prêmio.
- Tudo desliga com `prefers-reduced-motion` e com a classe `.reduzir-animacoes` (já global).

## Cenário novo

1. Gere pelo prompt de `docs/03-design/prompts-cenarios-capitulos.md` (9:16, sem texto).
2. Salve o original em `assets/cenarios/` e registre com `/registrar-uso-ia` e `/registrar-asset`.
3. Gere a versão web em `web/public/cenarios/<nome>.webp` (720 px de largura, qualidade ~74):
   `python3 -c "from PIL import Image; im=Image.open('assets/cenarios/X.jpeg').convert('RGB'); im.thumbnail((720,1290)); im.save('web/public/cenarios/X.webp','WEBP',quality=74,method=6)"`
4. Use como `background: url("/cenarios/X.webp") center bottom / cover no-repeat` com véu.

## Checklist antes do PR

- [ ] Fundo de papel com grão; nenhum fundo de cor chapada neon?
- [ ] Toda ação é um bloco com contorno de tinta e degrau que afunda ao tocar?
- [ ] Texto em tinta sobre pastel; texto claro só sobre véu escuro (≥ 4,5:1)?
- [ ] Cena com ilustração usa `cap1`/`cap4` (nunca `cap2` fora do capítulo 2)?
- [ ] Tela cabe sem rolagem em 375×667 e 390×844?
- [ ] Testado no tema claro e no escuro, e com "Reduzir animações" ligado?
- [ ] Rodou `acessibilidade-wcag` (contraste e auditoria)?
