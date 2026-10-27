# Animações e movimento — Rolê que Rende

## O que existe no site oficial
- Transições de **0,3s** em `background`, `border`, `border-radius`, `box-shadow`, `opacity` (padrão Elementor).
- **Carrossel (Swiper)** no banner hero com bullets e setas em amarelo `#FCFC30`.
- Nenhum `@keyframes` próprio, nenhuma animação de entrada.

## Sistema proposto (derivado da identidade)
> Proposta da Equipe Peão, não está no manual. Traduz em movimento o que a marca já mostra parada: pinceladas à mão, moeda dourada, energia jovem e a ideia de estar "ON".

### Princípios
1. **Elástico e leve** — tudo "quica" um pouco ao chegar (overshoot), como adesivo colado.
2. **Feito à mão** — linhas se desenham como pincelada; nada desliza perfeitamente reto.
3. **Curto** — UI entre 150ms e 600ms. Loops decorativos lentos (3–8s) e sutis.
4. **Com propósito** — anima para dar feedback (acerto, progresso, conquista), não para enfeitar o texto.
5. **Respeitar `prefers-reduced-motion`** — desliga loops e troca entradas por fade simples.

### Tokens de movimento
```css
--rqr-dur-rapida: 150ms;   /* hover, press */
--rqr-dur-base: 300ms;     /* padrão do site */
--rqr-dur-media: 450ms;    /* entrada de cards, modais */
--rqr-dur-lenta: 600ms;    /* pincelada se desenhando, celebração */
--rqr-ease-padrao: cubic-bezier(.2, .8, .2, 1);         /* saída suave */
--rqr-ease-pop: cubic-bezier(.34, 1.56, .64, 1);        /* overshoot "adesivo" */
--rqr-ease-entrada: cubic-bezier(.4, 0, 1, 1);
```

### Catálogo
| Nome | Quando usar | Como |
|---|---|---|
| `rqr-pop` | Entrada de cards, ícones em círculo, conquistas | scale .6 → 1.08 → 1, rotate −6° → 0, 450ms `--rqr-ease-pop` |
| `rqr-pincelada` | Sublinhado de título, setas, separadores | SVG `stroke-dashoffset` do comprimento → 0, 600ms |
| `rqr-marca-texto` | Destacar palavra-chave | fundo amarelo cresce da esquerda (`background-size 0→100%`), 450ms |
| `rqr-flutuar` | Grafismos decorativos parados | translateY ±6px + rotate ±3°, 4–6s infinito, alternate |
| `rqr-moeda` | Recompensa, economia, progresso financeiro | rotateY 0→360° com leve pulo, 800ms |
| `rqr-tremida` | Erro / tentativa errada (sem punir) | translateX ±4px, 3 ciclos, 300ms |
| `rqr-botao` | Botão de jogo | hover: translateY(−2px) + sombra maior; active: translateY(2px) + sombra 0 |
| `rqr-on` | Estado ativo/conectado ("estar ON") | pulso de anel azul-claro ao redor, 1,6s |
| `rqr-entrada-escalonada` | Listas, grids de cards | cada item com `animation-delay` +60ms |

Implementação pronta em [../assets/tokens.css](../assets/tokens.css) e demonstração em [../assets/exemplo.html](../assets/exemplo.html).

### Reduzir movimento
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
```
Ofereça também um **interruptor "Reduzir animações"** nas configurações do jogo (conta para o bônus de acessibilidade).

### Cuidados com o tema do projeto (apostas)
- **Não use** animações que lembrem cassino/aposta: roleta girando, caça-níquel, chuva de moedas aleatória, contagem regressiva de "última chance", piscadas rápidas vermelho/dourado.
- Celebrações devem reforçar **escolha consciente e progresso**, não sorte. A `rqr-moeda` é para economia conquistada, nunca para prêmio aleatório.
- Nada piscando mais de 3 vezes por segundo (WCAG 2.3.1).
