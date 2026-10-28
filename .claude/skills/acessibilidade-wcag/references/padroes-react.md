# Padrões de código acessível (React + Vite, e Expo)

A primeira regra do ARIA vale antes de todas: **se existe elemento HTML que já faz isso, use o elemento**. `<button>` já traz foco, Enter, Espaço, papel e nome; `<div role="button">` exige refazer tudo à mão, e sempre falta algo.

Cada padrão diz o critério que ele resolve e o teste que prova. Teste de acessibilidade usa **papel e nome** (`getByRole('button', { name: '…' })`), nunca classe ou `data-testid`: se o teste acha pelo papel, o leitor de tela também acha.

---

## Tela nova (rota)

```tsx
export function Plano({ aoVoltar }: PlanoProps) {
  const titulo = useRef<HTMLHeadingElement>(null)
  useTituloDaPagina('Seu plano')                       // 2.4.2
  useEffect(() => titulo.current?.focus(), [])         // 2.4.3: o leitor anuncia a tela nova

  return (
    <section className="tela" aria-labelledby="plano-titulo">
      <h1 id="plano-titulo" ref={titulo} tabIndex={-1}>Seu plano pros momentos difíceis</h1>
      …
    </section>
  )
}
```

```ts
// hooks/useTituloDaPagina.ts
export function useTituloDaPagina(nome: string, discreto = false) {
  useEffect(() => {
    document.title = discreto ? 'Organizador' : `${nome} · Guardião`  // modo discreto (spec 008): título neutro
  }, [nome, discreto])
}
```

- Um `<h1>` por tela. Passo dentro da tela troca o texto do `<h1>` e devolve o foco a ele (o padrão do `Checkin.tsx`).
- `h1:focus { outline: none }` só é aceito porque o `<h1>` não é controle e recebe foco **programático**; nenhum outro seletor zera o outline.
- Teste: `expect(screen.getByRole('heading', { level: 1, name: '…' })).toHaveFocus()` e `expect(document.title).toBe('Seu plano · Guardião')`.

## Shell: pular para o conteúdo, marcos e barra fixa

```tsx
<a href="#conteudo" className="pular">Pular para o conteúdo</a>   {/* 2.4.1: primeiro foco da página */}
<header className="topo">…<button>Preciso de ajuda agora</button></header>
<main id="conteudo" tabIndex={-1}>…</main>
<nav aria-label="Principal" className="tabbar">
  <a href="/" aria-current={rota === '/' ? 'page' : undefined}>Início</a>  {/* 2.4.8, 4.1.2 */}
</nav>
```

```css
.pular { position: absolute; left: -9999px; }
.pular:focus { left: 16px; top: 16px; z-index: 100; }
/* 2.4.11/2.4.12: o foco rolado para a vista não fica atrás do cabeçalho nem da barra de abas */
html { scroll-padding-top: calc(var(--altura-topo) + 8px); scroll-padding-bottom: calc(var(--altura-tabbar) + 8px); }
```

- "Preciso de ajuda agora" vem **antes** do conteúdo no DOM (1.3.2, 3.2.6) e não passa pelo PIN.
- Barra de abas com `<a href>` e `aria-current="page"` é navegação. `role="tablist"` é só para abas que trocam conteúdo **dentro** da tela, com setas entre elas (APG Tabs).

## Botão, link e ação

| Faz o quê | Elemento |
|---|---|
| Ação na tela (salvar, abrir SOS, marcar) | `<button type="button">` |
| Vai para outro endereço | `<a href>` |
| Liga, abre WhatsApp, SMS | `<a href="tel:188">` com texto completo |

```tsx
<a className="botao" href="tel:188">
  Ligar para o CVV, 188 <span className="sr-only">(Centro de Valorização da Vida, 24 horas, grátis)</span>
</a>
<a href={linkWhatsApp(telefone, mensagem)} target="_blank" rel="noreferrer">
  Mandar mensagem no WhatsApp <span className="sr-only">(abre o WhatsApp)</span>   {/* 3.2.5 */}
</a>
```

- Botão só com ícone: `<button aria-label="Fechar">` e ícone com `aria-hidden="true"`.
- **2.5.3**: o `aria-label` começa pelo texto visível. Melhor: não ponha `aria-label` em botão que já tem texto.
- Ação dispara no `onClick` (soltar), nunca em `onPointerDown`/`onTouchStart` (2.5.2).

## Botão de alternar e grupo de chips

```tsx
<fieldset className="chips">
  <legend>{legenda}</legend>
  <p id={`${id}-dica`} className="nota">{dica}</p>
  {opcoes.map((op) => (
    <button key={op} type="button" aria-pressed={selecionados.includes(op)} aria-describedby={`${id}-dica`}
      onClick={() => alternar(op)}>
      {selecionados.includes(op) && <span aria-hidden="true">✓ </span>}{op}   {/* 1.4.1: não só a cor */}
    </button>
  ))}
</fieldset>
```

- Teste: `getByRole('button', { name: 'tédio', pressed: true })`.
- Escolha única (humor): `role="radiogroup"` com `<input type="radio">` estilizado é o certo; botões `aria-pressed` exclusivos são tolerados se o rótulo do grupo disser "escolha um".

## Interruptor (configurações)

```tsx
<label className="interruptor">
  <input type="checkbox" role="switch" checked={reduzir} onChange={(e) => setReduzir(e.target.checked)} />
  <span className="interruptor__trilho" aria-hidden="true" />
  Reduzir animações
</label>
```

- O `<input>` continua no DOM e focável (escondido visualmente com `opacity: 0` sobre o trilho, **nunca** `display: none`).
- Trilho desligado e ligado: ≥ 3:1 contra o fundo **e** diferença por posição do botão (1.4.11, 1.4.1).

## Régua de vontade (0 a 10)

```tsx
<label htmlFor="vontade">Quanto está a vontade agora?</label>
<input id="vontade" type="range" min={0} max={10} step={1} value={v}
  onChange={(e) => setV(Number(e.target.value))}
  aria-valuetext={`${v}, ${rotuloVontade(v)}`} />          {/* 4.1.2: o leitor diz "7, forte", não só "7" */}
<div className="linha" aria-hidden="true"><span>0 nenhuma</span><span>10 muito forte</span></div>
<div className="linha">
  <button type="button" onClick={() => setV((x) => Math.max(0, x - 1))} aria-label="Diminuir">−</button>  {/* 2.5.7 */}
  <button type="button" onClick={() => setV((x) => Math.min(10, x + 1))} aria-label="Aumentar">+</button>
</div>
```

`<input type="range">` já dá setas, Home/End e PageUp/PageDown (2.1.1, 2.1.3). Botões − e + cobrem quem não consegue arrastar.

## Formulário: rótulo, dica, erro

```tsx
<label htmlFor="gasto">Quanto você gastava por semana, mais ou menos?</label>
<p id="gasto-dica" className="nota">Só números, em reais. Exemplo: 150</p>
<input id="gasto" inputMode="decimal" value={texto} onChange={…}
  aria-describedby={erro ? 'gasto-dica gasto-erro' : 'gasto-dica'}
  aria-invalid={erro ? true : undefined} />
{erro && <p id="gasto-erro" className="campo__erro">{erro}</p>}   {/* 3.3.1, 3.3.3 */}
```

- No envio com erro: foco no **primeiro** campo inválido (`ref.current?.focus()`); com mais de um erro, resumo no topo com `role="alert"` e links para cada campo.
- Erro diz como corrigir e não culpa. Ícone de erro + texto + borda: nunca só a borda vermelha.
- `maxLength` em campo de texto: mostre o contador ("120 de 500") ligado por `aria-describedby`, senão a digitação para em silêncio.
- PIN: `inputMode="numeric"`, `autoComplete="current-password"` (ou `one-time-code`), **sem** bloquear colar, botão "Mostrar números", sem prazo (3.3.8, 3.3.9).

## Mensagem de status

```tsx
// A região existe desde a montagem, vazia. Só o TEXTO muda.
<p role="status" className="checkin__resposta">{anotado ? 'Anotado. Bom dia sem apostar.' : ''}</p>
```

- Montar `{anotado && <p role="status">…</p>}` **não é anunciado** em vários leitores: a região tem que existir antes.
- Não some sozinha (2.2.1). Some quando a pessoa faz a próxima coisa.
- `role="alert"` (assertivo) só para risco: frase do relato que sugere perigo, falha ao salvar algo importante.
- Esqueleto de carregamento: `role="status"` + `aria-label="Carregando seus registros"` (padrão já usado).

## Diálogo (modal)

```tsx
const ref = useRef<HTMLDialogElement>(null)
useEffect(() => { aberto ? ref.current?.showModal() : ref.current?.close() }, [aberto])

<dialog ref={ref} aria-labelledby="crise-titulo" onClose={aoFechar}>   {/* Esc fecha sozinho com showModal */}
  <h2 id="crise-titulo">…</h2>
  …
  <button type="button" onClick={aoFechar}>Fechar</button>
</dialog>
```

- `showModal()` dá foco preso, Esc, fundo inerte e papel de diálogo de graça. Não reimplemente com `div` + `position: fixed`.
- Ao fechar, o foco volta para o botão que abriu (guarde `document.activeElement` antes de abrir).
- Confirmação destrutiva ("Apagar tudo"): o foco inicial vai no botão **seguro** (Cancelar), e o destrutivo diz o que apaga (3.3.4, 3.3.6).

## Timer (urge surfing, respiração)

```tsx
<p className="timer" aria-hidden="true">{formatar(restante)}</p>               {/* visual, a cada segundo */}
<p role="status" className="sr-only">{fraseAtual}</p>                          {/* leitor: só a troca de frase */}
<div className="linha">
  <button type="button" onClick={() => setPausado((p) => !p)}>{pausado ? 'Continuar' : 'Pausar'}</button>   {/* 2.2.1, 2.2.2 */}
  <button type="button" onClick={() => setRestante((r) => r + 300)}>Mais 5 minutos</button>
  <button type="button" onClick={encerrar}>Parar</button>
</div>
```

- Nunca anunciar o tempo a cada segundo: inunda o leitor. Anuncie fase e marcos (metade, último minuto).
- **Fim do timer não navega sozinho** (3.2.5): mostra "A onda passou. Como está a vontade agora?" na mesma tela.
- Com "reduzir animações", o círculo não cresce/encolhe: texto "Inspire… Segure… Solte" com a contagem.

## Movimento: o sistema decide primeiro

```ts
// hooks/useReduzirAnimacoes.ts: começa no que o aparelho pede; a escolha da pessoa no app vence depois.
const consulta = '(prefers-reduced-motion: reduce)'
export function useReduzirAnimacoes() {
  const [reduzir, setReduzir] = useState(() =>
    lerPreferencia() ?? (typeof matchMedia === 'function' && matchMedia(consulta).matches))
  useEffect(() => { document.documentElement.classList.toggle('reduzir-animacoes', reduzir) }, [reduzir])
  return [reduzir, (v: boolean) => { salvarPreferencia(v); setReduzir(v) }] as const
}
```

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
.reduzir-animacoes *, .reduzir-animacoes *::before, .reduzir-animacoes *::after {
  animation: none !important; transition: none !important;
}
```

- As duas coisas: o `@media` cobre o primeiro quadro (antes do React montar) e quem nunca abriu as configurações; a classe cobre a escolha feita no app.
- Lottie: `autoplay={!reduzir}` e quadro parado que **mostre** o desenho (o padrão do `Animacao.tsx`).
- Confete e "pop" de conquista: nada com reduzir ligado; sem flash (2.3.1); curto (< 2 s); `aria-hidden`.
- Animação infinita (bichinho respirando, piscando): com reduzir ligado, parada. Sem reduzir, só se for discreta e não competir com o texto (2.2.2).

## Imagem, ilustração, SVG, ícone

```tsx
<svg aria-hidden="true" focusable="false">…</svg>                         {/* decorativo */}
<div role="img" aria-label="Seu broto tem 3 folhas: 3 semanas sem apostar">   {/* informa */}
  <Bichinho … />
</div>
<i className="icone" aria-hidden="true" />                                  {/* ícone ao lado de texto */}
```

- O nome diz **o que a imagem comunica**, no contexto. "Ilustração do Guardião" quase nunca é o certo: se ela não informa nada, é decorativa.
- Gráfico (dinheiro preservado, dias): o número também em texto ao lado, ou tabela escondida visualmente.

## Contraste, alto contraste e cores forçadas

- Cor só de token (`var(--cor-texto)`). Mudou token ou par: `node .claude/skills/acessibilidade-wcag/scripts/contraste.mjs`.
- O tema `html[data-contraste="alto"]` precisa ser **ligado** por um controle nas configurações e respeitar `prefers-contrast: more` na primeira abertura, como o reduzir animações.
- Cores forçadas (alto contraste do Windows):
  ```css
  @media (forced-colors: active) {
    .botao, .campo, .chip { border: 2px solid ButtonText; }   /* fundo some; borda segura o controle */
    :focus-visible { outline: 3px solid Highlight; }
    .icone, svg { forced-color-adjust: auto; }
  }
  ```
  Controle desenhado só com `background` desaparece nesse modo.

## Tamanho do texto e refluxo

- `font-size` em `rem`; os três níveis da spec 008 mudam o `font-size` do `html` (100%, 118,75%, 137,5%), e o resto acompanha.
- Nada de `height` fixa em caixa com texto; `min-height` sim. Nada de `white-space: nowrap` em texto que importa.
- Corpo de texto com `max-width: 65ch` (1.4.8).
- Teste em 320 px, zoom de 200% e de 400%, e com o bookmarklet de espaçamento (`teste-manual.md`).

## Alvo de toque

- `min-height` e `min-width: var(--alvo-toque)` (48 px) em todo controle, inclusive o X de fechar e o ícone da barra de abas.
- Alvo pequeno por desenho (ícone de 24 px): aumente a área clicável com `padding`, não o desenho.
- Espaço de pelo menos 8 px entre dois alvos vizinhos.

---

## Expo / React Native (se o app móvel voltar)

| Web | React Native |
|---|---|
| `<button>` | `<Pressable accessibilityRole="button" accessibilityLabel="…">` |
| `aria-pressed` | `accessibilityState={{ selected }}` (ou `checked` em switch) |
| `aria-hidden` | `accessibilityElementsHidden` (iOS) + `importantForAccessibility="no-hide-descendants"` (Android) |
| `role="status"` | `AccessibilityInfo.announceForAccessibility(texto)` ou `accessibilityLiveRegion="polite"` (Android) |
| `aria-describedby` | `accessibilityHint` |
| `prefers-reduced-motion` | `AccessibilityInfo.isReduceMotionEnabled()` + evento `reduceMotionChanged` |
| `rem` | `allowFontScaling` (padrão `true`; nunca desligue) e `maxFontSizeMultiplier` só se quebrar o layout |
| alvo 48 px | `minHeight: 48` ou `hitSlop` |
| foco em título | `AccessibilityInfo.setAccessibilityFocus(findNodeHandle(ref.current))` |

Teste com TalkBack (Android) e VoiceOver (iOS), não só no simulador web do Expo.
