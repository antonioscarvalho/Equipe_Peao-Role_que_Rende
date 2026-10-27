# Acessibilidade

> Vale até **5% de bônus** na nota final, se o recurso for implementado **e demonstrado** no pitch.
> Atualizado em 27/10/2026 com o que está implementado em `web/`.

## Recursos planejados

| Recurso | Prioridade | Status | Como demonstrar |
|---|---|---|---|
| Contraste mínimo WCAG AA (4,5:1 em texto) | Must | ✅ pares do [guia de estilo](../../.claude/skills/guia-estilo-role-que-rende/references/cores.md): azul-escuro sobre branco 8,9:1, sobre amarelo 8,1:1, branco sobre azul-escuro 8,9:1 | Configurações → Alto contraste (preto e branco) |
| Navegação completa por teclado | Must | ✅ elementos nativos (`button`, `a`, `input`), foco visível em rosa, "Pular para o conteúdo", foco vai para o título ao trocar de tela | Navegar o SOS só com Tab e Espaço |
| Textos alternativos em imagens | Must | ✅ o Guardião tem descrição que muda com o estágio e o humor; grafismos decorativos com `aria-hidden` | Ler a tela inicial com leitor de tela |
| Compatibilidade com leitor de tela (NVDA / TalkBack / VoiceOver) | Should | 🟨 implementado (`h1` por tela, `fieldset`/`legend`, `aria-pressed`, `aria-live` na respiração e nos avisos); **falta testar** com NVDA ou TalkBack | Trecho do SOS com TalkBack |
| Legendas em áudio e vídeo | Should | ➖ não se aplica: o MVP não tem áudio nem vídeo | — |
| Modos para daltonismo (sem depender só de cor) | Should | ✅ estado marcado com ✓ e texto, avisos com rótulo "Atenção:"/"Saiba:", humor em palavras | Mostrar chips marcados com ✓ |
| Tamanho de fonte ajustável | Could | ✅ Normal, Grande e Maior (100%, 112,5%, 125%), e o layout acompanha | Configurações → Maior |
| Linguagem simples | Must | ✅ frases curtas, perguntas abertas, sem jargão ([tom de voz](conteudo-e-tom-de-voz.md)); revisão humana pendente | Ler o card "Mais uma e eu recupero" |
| Reduzir movimento / animações | Could | ✅ respeita `prefers-reduced-motion` e tem interruptor próprio; a respiração fica parada e só o texto muda | Configurações → Reduzir animações |

## Checklist de verificação

- [x] Todo elemento interativo tem rótulo acessível
- [x] Foco visível em todos os elementos
- [x] Informação nunca transmitida só por cor
- [x] Alvos de toque com pelo menos 44×44 px (mobile): botões de 48 px, chips e régua de 44 px
- [ ] Testado com leitor de tela em pelo menos um fluxo completo

## Ferramentas úteis

- WebAIM Contrast Checker — https://webaim.org/resources/contrastchecker/
- Lighthouse (Chrome DevTools) — auditoria de acessibilidade
- axe DevTools — extensão de navegador
