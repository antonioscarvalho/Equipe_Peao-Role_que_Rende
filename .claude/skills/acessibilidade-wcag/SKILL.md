---
name: acessibilidade-wcag
description: Acessibilidade rigorosa pela WCAG 2.2 neste app de apoio a quem quer parar de apostar. Nível AA inteiro mais os critérios AAA promovidos para o público em crise, com acessibilidade cognitiva (COGA) e o caminho de crise que nunca pode falhar. Traz dois scripts que reprovam o PR (auditoria estática do código e contraste medido nos tokens, em todos os temas), o protocolo de teste manual e o roteiro para demonstrar o bônus de 5% no pitch. Use SEMPRE ao criar ou alterar tela, componente, CSS, cor, texto de interface, animação, formulário ou modal; antes de todo PR com mudança visível; ao revisar uma spec; e quando pedirem auditoria ou revisão de acessibilidade.
---

# Acessibilidade (WCAG 2.2, com rigor)

Quem abre o Guardião pode não enxergar, não usar as mãos, ler com dificuldade, estar alcoolizado ou estar em pânico na hora da fissura. **Uma barreira de acessibilidade aqui não é incômodo: é a pessoa que não consegue pedir ajuda.** Por isso esta skill é rigorosa de propósito, e mais exigente que a WCAG AA onde o público pede.

O edital também paga: até **5% de bônus** para recurso implementado **e demonstrado** (`docs/03-design/acessibilidade.md`).

## O nível exigido

| Camada | O quê | Se falhar |
|---|---|---|
| WCAG 2.2 **A e AA** | os 55 critérios, todos | **bloqueia** |
| WCAG 2.2 **AAA promovidos** (⬆️) | 20 critérios onde o público está mais vulnerável: contraste 7:1 na crise e no alto contraste, sem prazo, sem interrupção, sem flash, reduzir movimento, foco nunca encoberto, alvo de 44 px, siglas por extenso, linguagem simples, nada muda de tela sozinho, autenticação sem memória | **bloqueia** |
| AAA restantes | os outros 11 | meta: o relatório diz se passou |
| Cognitivo e crise | COGA e a lista C1–C9 do caminho de crise | **bloqueia** |

A tabela inteira, critério a critério, com o que cada um exige **neste** app e como testar: [`references/criterios-wcag-22.md`](references/criterios-wcag-22.md).

## Regras de rigor

1. **Nada sai com bloqueio.** Nem "depois eu arrumo", nem "é só o protótipo", nem "o prazo do hackathon". Se não dá tempo de fazer acessível, a funcionalidade fica de fora da demo.
2. **Script verde não é aprovação.** Os scripts pegam uma parte; o resto é o teste manual. O Lighthouse com nota 100 também não prova nada.
3. **Não medido não é aprovado.** O que o `contraste.mjs` põe em "fora da conta" e toda etapa manual não feita entram no relatório como **não testado**, nunca somem.
4. **"Não se aplica" exige motivo e gatilho**: "não há vídeo hoje; quando houver, 1.2.2 vira obrigatório". Sem os dois, é falha.
5. **HTML nativo antes de ARIA.** `<button>`, `<a href>`, `<input>`, `<dialog>`, `<fieldset>`. ARIA só para o que o HTML não diz, e ARIA errado é pior que nenhum.
6. **Toda correção de acessibilidade testável ganha teste** que procura por papel e nome (`getByRole('button', { name: … })`), não por classe.
7. **Falso positivo não se apaga: se anota.** `/* contraste-fundo: … */` ou `/* contraste: ignorar <motivo> */` no CSS, com o motivo escrito. Anotação sem motivo é falha.
8. **Proibido overlay ou widget "de acessibilidade"** (barra mágica, script de terceiro que promete corrigir sozinho). Não corrige, atrapalha o leitor de tela e quebra o offline.
9. **Mudou token, cor, fonte ou espaçamento global: mede tudo de novo**, nos dois temas. CSS não quebra o build; fica errado em silêncio.
10. **O caminho de crise é testado à mão com teclado e leitor de tela** em toda mudança no shell, no SOS, na crise ou no PIN ([`cognitivo-e-crise.md`](references/cognitivo-e-crise.md), C1–C9).

## Os scripts

```bash
node .claude/skills/acessibilidade-wcag/scripts/auditar.mjs      # código: TSX, HTML, CSS
node .claude/skills/acessibilidade-wcag/scripts/contraste.mjs    # cor: todos os temas, tokens resolvidos
```

Os dois saem com código **1** quando há reprovação, e servem para CI ou para um teste do Vitest. Precisam de Node 22, sem dependência.

| Script | O que pega | Opções |
|---|---|---|
| `auditar.mjs` | clique em `div`, campo sem rótulo, botão mudo, `img` sem `alt`, `tabIndex` positivo, `aria-hidden` em focável, link sem `href`, hover sem foco, colar bloqueado no PIN, vídeo sem legenda, som automático, tela sem `<h1>`, título pulando nível, `outline: none` no foco, `lang` e zoom no `index.html`, rota sem `document.title`, ninguém lendo `prefers-reduced-motion`, animação infinita, barra fixa sem `scroll-padding`, fonte em px, falta de `forced-colors` | `[caminhos]`, `--so-bloqueios`, `--json` |
| `contraste.mjs` | texto (4,5:1 / 3:1 grande; 7:1 no alto contraste), contorno de controle (3:1, inclusive borda herdada de `.botao` para `.botao--x`), anel de foco sobre a página e sobre cada fundo do app | `--par <a> <b>` (mede um par avulso), `--minimo 7` (tela de crise), `--json` |

Par "presumido" é o que o script montou com o fundo da página porque a regra não diz o fundo. Ou ele é real (corrija), ou o fundo é outro (anote com `contraste-fundo` e rode de novo).

## Quando e como usar

### Ao escrever código
Antes de escrever a peça, abra o padrão dela em [`references/padroes-react.md`](references/padroes-react.md): tela nova (título, foco, `document.title`), botão × link, chips, interruptor, régua de vontade, formulário com erro, mensagem de status, diálogo, timer, movimento, imagem, contraste, tamanho de texto, alvo de toque, e o equivalente no Expo. Texto de interface: [`cognitivo-e-crise.md`](references/cognitivo-e-crise.md) e `docs/03-design/conteudo-e-tom-de-voz.md`.

### Antes de abrir PR (mínimo, sempre)
1. `auditar.mjs` e `contraste.mjs` sem bloqueio, e `npm test` verde.
2. Do [`teste-manual.md`](references/teste-manual.md): etapa 1 (teclado), etapa 3 (zoom e 320 px) e etapa 4 (movimento) no que o PR tocou.
3. Mexeu no shell, no SOS, na crise ou no PIN: etapa 2 (leitor de tela) e a lista C1–C9.
4. No PR, uma linha: "Acessibilidade: scripts ok; teclado, zoom e movimento testados em <telas>; leitor de tela <sim/não>".

### Revisão de spec (`/sdd-revisar`) ou auditoria completa
Percorra [`criterios-wcag-22.md`](references/criterios-wcag-22.md) tela por tela, rode o protocolo manual inteiro e salve o relatório com o modelo do fim de [`teste-manual.md`](references/teste-manual.md) em `docs/revisoes/acessibilidade-<data>.md`. Atualize a tabela de recursos de `docs/03-design/acessibilidade.md`.

### Para o pitch
O roteiro de 40 segundos, ensaiável, está em [`teste-manual.md`](references/teste-manual.md#roteiro-para-demonstrar-no-pitch-bônus-de-até-5).

## Como responder

- O veredito vem primeiro: **aprovado** ou **reprovado com N bloqueios**.
- Cada falha com **critério (número e nome), arquivo e linha, o que a pessoa sente** ("o leitor de tela anuncia só 'botão'") e a correção.
- O que não foi testado vai escrito, com o motivo.
- Não diga "acessível" nem "conforme a WCAG" sem o protocolo inteiro feito. Diga o que foi verificado.

## Com as outras skills

- `guia-estilo-role-que-rende` decide a paleta; **esta pode vetar um par** que não passa, e a cor muda, não a regra.
- `ui-ux-designer` decide reuso e estados de tela; o alvo de toque, o foco e o contraste seguem esta.
- `design-etico-saude-digital` e `seguranca-e-crise` decidem o que o app faz na crise; esta garante que todo mundo consegue fazer.
- `vlibras` garante que o conteúdo chegue ao avatar de Libras (texto visível ou glosa em todo controle, nada só em `aria-label`); rode o script dela junto com os desta.
- `conformidade-legal-br` cobre a LBI (Lei 13.146/2015) e a ABNT NBR 17225:2025; esta é o como técnico.
- Em conflito, vale a regra **mais exigente** para quem usa.
