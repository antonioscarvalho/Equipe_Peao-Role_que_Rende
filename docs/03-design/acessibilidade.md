# Acessibilidade

> Vale até **5% de bônus** na nota final, se o recurso for implementado **e demonstrado** no pitch.
> Os recursos desta tabela são especificados na [spec 008](../../specs/008-configuracoes-privacidade-acessibilidade/spec.md) (responsável: Maykon Júnio).

## Recursos planejados

| Recurso | Prioridade | Status | Como demonstrar |
|---|---|---|---|
| Contraste mínimo WCAG AA (4,5:1 em texto) | Must | ⬜ | Mostrar a tela em alto contraste |
| Navegação completa por teclado | Must | ⬜ | Navegar sem mouse |
| Textos alternativos em imagens | Must | ⬜ | _a definir_ |
| Compatibilidade com leitor de tela (NVDA / TalkBack / VoiceOver) | Should | ⬜ | Trecho com leitor de tela |
| Legendas em áudio e vídeo | Should | ⬜ | _a definir_ |
| Modos para daltonismo (sem depender só de cor) | Should | ⬜ | Alternar modo |
| Tamanho de fonte ajustável | Could | ⬜ | _a definir_ |
| Linguagem simples | Must | ⬜ | Ver [tom de voz](conteudo-e-tom-de-voz.md) |
| Reduzir movimento / animações | Could | ⬜ | _a definir_ |

## Checklist de verificação

- [ ] Todo elemento interativo tem rótulo acessível
- [ ] Foco visível em todos os elementos
- [ ] Informação nunca transmitida só por cor
- [ ] Alvos de toque com pelo menos 44×44 px (mobile)
- [ ] Testado com leitor de tela em pelo menos um fluxo completo

## Ferramentas úteis

- WebAIM Contrast Checker — https://webaim.org/resources/contrastchecker/
- Lighthouse (Chrome DevTools) — auditoria de acessibilidade
- axe DevTools — extensão de navegador
