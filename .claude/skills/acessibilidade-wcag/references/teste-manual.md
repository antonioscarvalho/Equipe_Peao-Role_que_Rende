# Protocolo de teste manual

Os scripts pegam talvez um terço dos problemas. O resto só aparece usando o app como a pessoa usa. Cada etapa diz o que fazer, o que observar e o critério que ela prova. **Etapa não feita é dita como não feita no relatório**, nunca omitida.

Rode tudo no build de produção (`npm run build && npm run preview`), que é o que vai para a Banca: o service worker e o CSS final só existem ali.

## 0. Os scripts e os testes

```bash
node .claude/skills/acessibilidade-wcag/scripts/auditar.mjs
node .claude/skills/acessibilidade-wcag/scripts/contraste.mjs
cd web && npm test
```

Bloqueio em qualquer um dos três: pare e corrija antes do manual.

## 1. Só teclado (10 min) · 2.1.1, 2.1.2, 2.1.3, 2.4.1, 2.4.3, 2.4.7, 2.4.11–13

Mouse longe. Recarregue a página e use só Tab, Shift+Tab, Enter, Espaço, setas e Esc.

- [ ] O primeiro Tab mostra "Pular para o conteúdo".
- [ ] Chego em "Preciso de ajuda agora" em até 3 Tabs (crise C2).
- [ ] Todo controle recebe foco, na ordem da leitura, e o foco está **sempre** visível e nunca escondido atrás do cabeçalho ou da barra de abas.
- [ ] Chips: Espaço marca e desmarca. Interruptor: Espaço liga e desliga. Régua: setas, Home e End.
- [ ] Modal: o foco entra nele, não sai dele com Tab, Esc fecha, e o foco volta para quem abriu.
- [ ] Ao trocar de tela, o foco vai para o título.
- [ ] Timer: consigo pausar, ganhar mais tempo e parar.
- [ ] Nenhum lugar onde o Tab some (foco em elemento invisível) ou trava.

## 2. Leitor de tela (15 min por fluxo) · 1.1.1, 1.3.1, 2.4.2, 2.4.6, 3.3.1, 4.1.2, 4.1.3

| Plataforma | Leitor | Navegador | Atalhos básicos |
|---|---|---|---|
| Windows | NVDA (grátis) | Firefox ou Chrome | Insert+↓ ler tudo · H próximo título · Tab · D próximo marco · Insert+F7 lista de elementos |
| Android | TalkBack | Chrome | deslizar →/← próximo/anterior · toque duplo ativa |
| iOS/macOS | VoiceOver | Safari | VO = Ctrl+Option · VO+→ próximo · VO+U rotor |

Fluxos obrigatórios: **crise**, **SOS do começo ao fim**, **check-in com lapso**, e o fluxo que o PR tocou.

- [ ] Cada tela é anunciada pelo título (o `document.title` e o `<h1>`).
- [ ] Todo botão diz o que faz; nenhum "botão" mudo, nenhum "imagem" sem nome, nenhum nome de arquivo lido.
- [ ] Estado é anunciado: "tédio, botão, pressionado"; "Reduzir animações, chave, ligado".
- [ ] Campo é anunciado com rótulo, dica e erro.
- [ ] "Anotado", "Plano salvo" e as fases da respiração são falados **sem** mover o foco.
- [ ] Ilustração decorativa é pulada; a que informa diz o que informa.
- [ ] O tempo do timer **não** é lido a cada segundo.

## 3. Zoom, tamanho de texto e refluxo (5 min) · 1.4.4, 1.4.10, 1.4.12

- [ ] Chrome em 200%: nada cortado nem sobreposto.
- [ ] DevTools → modo dispositivo → 320 px de largura (= 400%): sem rolagem horizontal.
- [ ] Configurações do navegador → tamanho da fonte "Muito grande": o texto cresce (prova de `rem`).
- [ ] Os três níveis de "Tamanho do texto" do app, em 360 px.
- [ ] Bookmarklet de espaçamento (cole no console):
  ```js
  document.head.insertAdjacentHTML('beforeend','<style>*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}</style>')
  ```
  Nada cortado, nada sobrepondo.

## 4. Movimento (3 min) · 2.2.2, 2.3.1, 2.3.3

- [ ] DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" → recarregar **sem** mexer nas configurações do app: nada se move, a respiração é só texto, confete não aparece, Lottie parado mostrando o desenho.
- [ ] Desligando a emulação e ligando "Reduzir animações" no app: o mesmo.
- [ ] Sem redução: nenhum flash acima de 3 por segundo (grave a tela e passe quadro a quadro se houver dúvida); nenhuma animação infinita competindo com instrução.

## 5. Cor e contraste (5 min) · 1.4.1, 1.4.3, 1.4.6, 1.4.11

- [ ] DevTools → Rendering → "Emulate vision deficiencies": protanopia, deuteranopia, tritanopia e acromatopsia. Todo estado (chip marcado, aba ativa, erro, dia com aposta) continua distinguível.
- [ ] Ligar o alto contraste do app: tudo legível, nada some.
- [ ] Windows → Configurações → Acessibilidade → Temas de contraste (ou DevTools → Rendering → "Emulate forced-colors: active"): bordas, foco e ícones visíveis.
- [ ] Texto sobre gradiente, imagem ou fundo translúcido (o "fora da conta" do `contraste.mjs`): medir no pior ponto com o conta-gotas do DevTools.

## 6. Toque (5 min, no celular de verdade) · 2.5.1, 2.5.2, 2.5.5, 2.5.7, 1.3.4

- [ ] Todo alvo ≥ 48 px (DevTools → inspecionar a caixa) e afastado do vizinho.
- [ ] Começar a tocar num botão e arrastar o dedo para fora cancela.
- [ ] Nada exige deslizar, pinçar ou arrastar sem alternativa.
- [ ] Girar o celular: funciona em paisagem.

## 7. Cognitivo e crise (10 min)

A lista C1–C9 de `cognitivo-e-crise.md`, inteira, e a checagem de texto do fim daquele arquivo.

## 8. Complementos automáticos (não substituem nada acima)

- Lighthouse → Acessibilidade. Nota 100 não quer dizer acessível; nota menor que 100 quer dizer que há defeito.
- axe DevTools (extensão) em cada rota, nos dois temas.

---

## Roteiro para demonstrar no pitch (bônus de até 5%)

O edital só dá o bônus a recurso **implementado e demonstrado**. Ensaie os quatro passos abaixo cronometrados; cabem em 40 segundos.

1. **Teclado** (10 s): mouse de lado, Tab até "Preciso de ajuda agora", Enter, Tab até "Ligar para o CVV".
2. **Leitor de tela** (10 s): NVDA ou TalkBack lendo o título da crise e o botão do CVV com o nome por extenso.
3. **Alto contraste + texto maior** (10 s): ligar nas configurações, mostrar a tela inicial mudando na hora.
4. **Reduzir animações** (10 s): o bichinho para e a respiração vira texto.

Frase para a Banca, sem jargão: "Quem não enxerga, quem não usa as mãos ou quem está em pânico consegue pedir ajuda em dois toques. Seguimos a WCAG 2.2, a referência internacional, no nível AA, com critérios do nível mais alto onde a pessoa está mais vulnerável."

## Modelo de relatório

Salve em `docs/revisoes/acessibilidade-<aaaa-mm-dd>.md`:

```markdown
# Acessibilidade · <escopo> · <data>

**Veredito:** ✅ aprovado | ❌ reprovado (N bloqueios)
**Quem testou:** <nome> · **Build:** <commit> · **Onde:** <navegador, leitor, aparelho>

## Scripts
- auditar.mjs: N bloqueios, N avisos
- contraste.mjs: N reprovados, N fora da conta (conferidos à mão: sim/não)
- npm test: N passaram, N falharam

## Teste manual
| Etapa | Feita? | Resultado | Critérios |
|---|---|---|---|
| 1. Teclado | sim | 2 falhas (abaixo) | 2.1.1, 2.4.7 |
| 2. Leitor de tela (NVDA) | sim | ok | … |
| 3. Zoom e refluxo | **não** | não testado | 1.4.4, 1.4.10 |

## Falhas
| # | Critério | Onde | O que acontece | Correção | Estado |
|---|---|---|---|---|---|

## O que não foi testado e por quê
```
