---
name: transicao-pop
description: Transição padrão entre telas do app web (web/) — o "pop do livro", a mesma animação de abrir a História e o menu da engrenagem: a tela cresce de 70% para 100% com um quique curto, a partir do ponto de onde foi chamada. Use SEMPRE ao criar tela nova, modal, painel, overlay, aba ou passo de fluxo no web; ao mudar como uma tela abre ou fecha; e quando pedirem "transição", "animação entre telas", "abrir igual a história" ou "pop".
---

# Transição pop do livro

**Alvo:** $ARGUMENTS

Toda tela do app abre do mesmo jeito: **pop com quique**, igual ao botão "História" e à
engrenagem do modo história. Uma transição só, em todo lugar, deixa o app previsível
(bom para quem está ansioso) e com a cara dos botões Kahoot. Não invente outra.

Código: o fim de [web/src/tema-livro.css](../../../web/src/tema-livro.css), seção
"Transição padrão de TODAS as telas". Faz par com a skill `estilo-livro-ilustrado`.

## A animação

```css
@keyframes tela-pop {
  from { opacity: 0; transform: scale(.7) translateY(24px); }
  to   { opacity: 1; transform: none; }
}
animation: tela-pop 380ms cubic-bezier(.3, 1.6, .5, 1) both;
```

| Item | Valor | Por quê |
|---|---|---|
| Duração | 380ms (240ms em menu pequeno) | rápido o bastante para não atrasar ninguém |
| Curva | `cubic-bezier(.3, 1.6, .5, 1)` | o quique curto dos botões Kahoot |
| Escala inicial | `.7` + 24px abaixo | nasce pequena, perto de onde foi chamada |
| Origem | de onde veio o toque | a tela "sai" do botão |

## Como usar numa tela nova

1. Ponha a classe `tela-pop` no elemento raiz da tela (o `div` fixo, o `section` da aba).
2. Se a tela não abre pela barra de baixo, ajuste a origem para o botão que a chama:
   `style={{ transformOrigin: "100% 0" }}` (canto de cima à direita, como a engrenagem).
3. Peças de dentro (cartão, painel, caixa de fala) entram **depois**, com o mesmo pop e
   atraso de 100 a 150ms. Listas: uma depois da outra, 50 a 70ms entre itens.
4. Não use `clip-path`, slide lateral, fade sozinho ou zoom grande: é sempre o pop.

```tsx
<div className="minha-tela tela-pop" role="dialog" aria-modal="true">…</div>
```

## Onde já está aplicada

| Tela | Seletor | Origem |
|---|---|---|
| História (mapa, diálogo, queda) | `.historia`, `.historia-dialogo`, `.queda` | botão central da barra |
| Respiração e painel de ajuda | `.crise` | barra de baixo |
| Jogos (Pulo, Carrinho) | `.pulo` | barra de baixo |
| Personalizar | `.celular.personalizar` | barra de baixo |
| Abas Missões, Jogos, Ajustes | `.aba-*` | barra de baixo |
| Tela inicial | blocos `.cena`, `.cards`, `.proxima`, `.atalhos` em sequência | de baixo |
| Menu da engrenagem | `.historia-menu` (`historia-menu-abre`, 240ms) | canto de cima à direita |
| Painéis internos | `.pulo__painel`, `.historia__caixa`, `.especial` (+120ms) | centro |

## Cuidados

- **Reduzir animações:** a regra global (`prefers-reduced-motion` e `.reduzir-animacoes`) zera a
  duração; a tela aparece na hora. Não crie animação que escape disso (nada de JS com `setTimeout`
  para mostrar conteúdo).
- **`transform` e `position: fixed`:** durante o pop, um filho `fixed` fica preso ao pai. O `both`
  devolve `transform: none` no fim, então isso só vale nos 380ms. Se um filho fixo precisar ficar
  certo já na entrada, anime um invólucro interno em vez da raiz.
- **Foco:** a animação não atrasa o foco. Continue movendo o foco para o título ou o primeiro
  controle assim que a tela monta.
- **Telas de crise:** a respiração e o painel de ajuda também dão o pop, mas nunca mais longo que
  380ms e sem nada piscando. Ajuda humana tem que estar utilizável na hora.
- **Abertura do app:** tem animação própria (`abertura.css`); não troque por esta.

## Checklist

- [ ] A tela nova usa `tela-pop` (ou um seletor na lista acima)?
- [ ] A origem sai do botão que abre a tela?
- [ ] Peças internas entram depois, com o mesmo pop?
- [ ] Com "Reduzir animações" ligado, tudo aparece na hora?
- [ ] Testado no celular (390×844) e no tema escuro?
