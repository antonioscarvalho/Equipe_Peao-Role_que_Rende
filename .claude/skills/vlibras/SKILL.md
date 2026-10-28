---
name: vlibras
description: Deixa o que for implementado no web legível pelo VLibras Widget (a bolha do governo que traduz para Libras o texto que a pessoa toca), no celular e no computador. Diz o que o widget 7.x lê de fato (e o que a documentação antiga ensina errado), as regras para tela, botão, ícone, jogo, imagem e formulário, o script que reprova o PR e como testar com o avatar. Use SEMPRE ao criar ou alterar tela, componente, botão, ícone, texto de interface, jogo ou modal no web; ao mexer em web/src/vlibras.ts ou em main.tsx; e quando falarem em Libras, VLibras, surdo ou língua de sinais.
---

# VLibras: o que o widget lê, e como deixar a tela legível para ele

A bolha fica no canto direito, na metade da altura. A pessoa toca nela, o avatar abre, e daí em diante **cada toque num texto vira tradução para Libras** em vez de clique. Quem é surdo e tem Libras como primeira língua lê português como segunda língua; num momento de crise, o texto curto e o avatar fazem a diferença.

O carregador está em [`web/src/vlibras.ts`](../../../web/src/vlibras.ts) e é chamado em `main.tsx`. Esta skill não é para ligar o widget de novo: é para que **o que você escrever** continue legível por ele.

## O que o widget 7.12.2 faz de verdade

Conferido no código servido por `vlibras.gov.br/app` em 28/10/2026. Muita coisa difere do que se acha na internet:

| Se você leu que...                                       | Na 7.x é assim                                                                                                                          |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| precisa colar `<div vw class="enabled">…` no HTML        | **Não.** O carregador desenha a bolha sozinho, num shadow DOM (`#vlibras-access-wrapper`). O `<div vw>` é ignorado.                     |
| configura com `new VLibras.Widget(url)` depois do script | Ele lê `window.VLibrasWidget` **uma vez**, ao iniciar. Configuração vai **antes** do script (`{ path, position: "L" \| "R", avatar }`). |
| dá para pôr a bolha em cima ou embaixo                   | Só esquerda ou direita, sempre na metade da altura (`top: calc(50vh - 20px)`), 40 × 40 px.                                              |
| `.vlibras-ignore` impede a tradução                      | Só muda o cursor e o sublinhado. **O toque traduz assim mesmo.**                                                                        |
| ele lê `aria-label`                                      | **Não lê.** Nem `title`, nem `.sr-only` (o `.sr-only` não é tocável).                                                                   |
| funciona em qualquer navegador                           | O avatar é Unity e **precisa de WebGL**. Sem WebGL, fica no "carregando" para sempre.                                                   |

O que ele traduz, nesta ordem, **do elemento exato que recebeu o toque** (não do botão em volta):

1. `data-vlibras-gloss` (glosa de Libras, em MAIÚSCULAS, vai direto para o avatar sem passar pelo tradutor);
2. `alt`, se for `<img>`;
3. `value`, se for `<input type="submit">`;
4. a opção escolhida, se for `<select>`;
5. o `innerText`.

E só aceita o toque se o elemento **tem texto direto** (um nó de texto filho), ou está dentro de `<a>`/`<button>`, ou é `<img alt>`, `<select>` ou `submit`. Um `<span>` vazio dentro de um `<label>` não traduz nada.

Com o widget aberto, um toque em botão ou link **não executa a ação**: traduz e mostra um botão para executar. É do widget e é o esperado.

## As regras

### 1. Todo controle tem texto visível, ou glosa

Botão ou link só com ícone (`×`, paleta, lua) traduz nada ou traduz o símbolo. Escolha, nesta ordem:

- **texto visível** no botão (melhor para todo mundo, inclusive quem não é surdo);
- se o desenho exige só ícone, `data-vlibras-gloss="FECHAR"` no próprio `<button>`/`<a>`, junto do `aria-label` (que continua para o leitor de tela).

```tsx
<button
  className="crise__fechar"
  onClick={fechar}
  aria-label="Fechar"
  data-vlibras-gloss="FECHAR"
>
  ×
</button>
```

Glosa é palavra de Libras em maiúsculas, curta, na ordem da Libras: `FECHAR JOGO`, `MUDAR TEMA`, `PERSONALIZAR BICHINHO`. Palavra que o dicionário não tem vira datilologia (soletrada), então prefira palavras comuns.

### 2. O toque cai no controle inteiro, não no ícone

O CSS global já faz isso e **não pode sair** de `styles.css`:

```css
:where(button, a, [role="button"]) * {
  pointer-events: none;
}
```

Sem ele, tocar no ícone de um botão traduz o `<span>` do ícone (vazio), e tocar num `<svg>` faz o widget dar erro. Se um filho de botão precisar mesmo de evento próprio, ele não devia estar dentro de um botão.

### 3. A informação que importa está escrita na tela

O que só existe em `aria-label`, `title`, `.sr-only`, cor, barra ou desenho não chega ao avatar. Se a pessoa precisa saber ("2 de 4 missões", "ciclo 3 de 5", o nome de uma cor), mostre em texto. Isso também é WCAG (1.4.1, 1.3.3): não é só pelo VLibras.

### 4. Frase inteira num elemento só

O toque traduz o elemento tocado. `<p>Você tem <b>12</b> dias</p>`: tocar no `12` traduz só "12". Para frase que precisa sair inteira, escreva sem quebrar em elementos, ou deixe o realce sem toque com `pointer-events: none` no filho.

### 5. Texto curto, direto, sem gíria nova

O tradutor é automático (português → glosa). Frase longa, ironia, gíria e emoji traduzem mal. Siga `docs/03-design/conteudo-e-tom-de-voz.md` e a skill `acessibilidade-wcag` (linguagem simples): o que é bom para leitura fácil é bom para o tradutor. Emoji não carrega sentido sozinho.

### 6. Imagem tem `alt`

O `alt` é o que ele traduz. Decorativa leva `alt=""`.

### 7. Jogo em tempo real esconde a bolha durante a partida

Na partida a bolha fica em cima do controle (no Pulo, a metade direita da tela é comando), e o widget aberto transforma toque em tradução. Chame no componente do jogo:

```tsx
const [estado, setEstado] = useState<Estado>("inicio");
useEsconderVLibras(estado === "jogando");
```

Só durante a partida: as instruções e o resultado continuam com a bolha, porque é ali que a pessoa surda precisa dela. Texto que só existe desenhado no `<canvas>` não é lido; se importa, repita em DOM.

### 8. Nada fixo embaixo da bolha

A bolha ocupa a faixa de 40 px à direita, na metade da altura, e no celular o avatar aberto cobre quase metade da tela (abaixo de 640 px ele trava a rolagem do `body` no modo expandido). Não ponha controle fixo nessa faixa. O "Preciso de ajuda agora" fica no topo à esquerda, de propósito.

### 9. Offline e privacidade

- Sem internet a bolha **não aparece** e nada quebra. O caminho de crise nunca depende do VLibras.
- O texto tocado vai para `traducao2.vlibras.gov.br`. Tela que mostra dado da pessoa (apelido, valores, plano) manda esse texto se ela tocar nele com o widget aberto.
- O widget carrega o PostHog e manda `widget_initialized` (domínio e caminho, sem o `#`) em 7% das aberturas, sem consentimento; o resto, só depois do aceite dentro dele. Está registrado em `docs/04-tecnico/privacidade-e-dados-locais.md`. **Não ponha dado da pessoa no caminho da URL.**

## Compatibilidade

| Onde                                                                                             | Situação                                                                 |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Chrome, Edge, Firefox, Safari atuais (computador)                                                | Funciona.                                                                |
| Chrome Android, Safari iOS                                                                       | Funciona; no modo expandido o avatar ocupa a tela e trava a rolagem.     |
| Navegador sem WebGL (alguns aparelhos antigos, navegador corporativo travado, Chromium sem tela) | A bolha aparece, o avatar não carrega. Não há o que fazer do nosso lado. |
| Navegador antigo sem CSS aninhado (Safari < 16.5, Chrome < 112)                                  | A bolha aparece, mas não abre o rótulo ao passar o mouse.                |
| Sem internet                                                                                     | Sem bolha.                                                               |

O carregador espera a primeira pintura e o navegador ocioso para baixar o script: a bolha nunca atrasa a tela inicial nem o botão de ajuda.

## O script

```bash
node .claude/skills/vlibras/scripts/auditar.mjs          # web/src
node .claude/skills/vlibras/scripts/auditar.mjs web/src/App.tsx --json
```

Precisa de Node 22 (usa `Map.groupBy`), sem dependência. Sai com código **1** quando há bloqueio.

| Bloqueia                                                      | Avisa                                                     |
| ------------------------------------------------------------- | --------------------------------------------------------- |
| `<button>`/`<a>` sem texto visível e sem `data-vlibras-gloss` | `aria-label` sem texto visível em algo que não é controle |
| `<img>` sem `alt`                                             | `<label>` com o nome só em `.sr-only` ou `title`          |
| ninguém chama `carregarVLibras()`                             | texto desenhado no `<canvas>`                             |
| falta a regra de `pointer-events` dos controles               | jogo em tempo real sem `useEsconderVLibras`               |
|                                                               | glosa em minúsculas; uso de `.vlibras-ignore`             |

Script verde não prova nada sozinho: ele lê o código, não toca na tela.

## Como testar

Em aparelho ou navegador **com WebGL** (o Chromium sem tela do Playwright não tem: o avatar não abre ali).

1. Abra o app, espere a bolha à direita. Toque nela; o avatar abre.
2. Toque em cada texto novo, em cada botão novo (também no ícone dele) e em cada imagem. O avatar deve sinalizar o que está escrito, ou a glosa.
3. Toque num botão: deve traduzir e mostrar o botão de executar, não executar direto.
4. Num jogo: a bolha some ao começar a partida e volta no resultado.
5. No celular (ou 360 px de largura): o avatar aberto não esconde o "Preciso de ajuda agora".
6. Modo avião: o app abre e funciona; só a bolha não aparece.

No PR, uma linha: "VLibras: script ok; toquei em <telas> com o avatar em <aparelho/navegador>".

## Com as outras skills

- `acessibilidade-wcag` continua decidindo contraste, foco, teclado e leitor de tela; esta só garante que o mesmo conteúdo chegue ao avatar. `aria-label` continua obrigatório onde ela pede: a glosa é **a mais**, não no lugar.
- `ui-ux-designer` e `guia-estilo-role-que-rende`: botão só de ícone precisa de glosa; prefira texto visível.
- `seguranca-e-crise`: nada do caminho de crise pode depender do VLibras (ele precisa de internet).
- `design-etico-saude-digital` e `conformidade-legal-br`: o VLibras é a única peça que manda dado para fora e tem telemetria própria; qualquer ampliação disso passa por elas.
