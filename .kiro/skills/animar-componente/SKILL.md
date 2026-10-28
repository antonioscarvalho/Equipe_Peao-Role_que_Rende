---
name: animar-componente
description: Adiciona animações e microinterações a um componente ou tela usando o catálogo rqr-* do Rolê que Rende (CSS ou Lottie), com reduzir-movimento e acessibilidade já incluídos. Use quando for animar botões, cards, conquistas, transições ou o bichinho.
---

# Animar componente

**Alvo:** $ARGUMENTS

## Antes de começar
1. Leia `.claude/skills/guia-estilo-role-que-rende/references/animacoes.md` e `assets/tokens.css`.
2. Leia o componente alvo e veja exemplos prontos em `web/src/`.

## Passos
1. **Escolha a animação pelo propósito**, nunca para enfeitar:
   | Propósito | Animação |
   |---|---|
   | Algo aparece (card, modal, conquista) | `rqr-pop` ou `rqr-entrada-escalonada` |
   | Destacar palavra ou título | `rqr-marca-texto`, `rqr-pincelada` |
   | Dinheiro protegido / meta | `rqr-moeda` + contador animado |
   | Erro sem punir | `rqr-tremida` (curta, 300ms) |
   | Estado ativo | `rqr-on` |
   | Decoração parada | `rqr-flutuar` (lento, 4–6s) |
   | Missão concluída (esforço) | Confete do tema (`Confete.tsx`): formas rqr do centro para as laterais, 1,5 s, nunca dourado nem moedas |
| Calma / crise | respiração 4s inspira, 4s segura, 6s expira (escala 0.85 ↔ 1.15) |
2. **Use os tokens**, não valores soltos: `--rqr-dur-*` e `--rqr-ease-*`. UI entre 150 e 600ms.
3. **Anime só `transform` e `opacity`** (fluido a 60fps, inclusive em Android antigo). Evite animar `width`, `height`, `top`, `box-shadow` em loop.
4. **Acessibilidade obrigatória:**
   - `@media (prefers-reduced-motion: reduce)` desliga loops e troca entradas por fade.
   - Classe global `.reduzir-animacoes` no `<html>` com o mesmo efeito, ligada a um interruptor visível nas configurações (conta para o bônus do edital).
   - Nada pisca mais de 3 vezes por segundo (WCAG 2.3.1).
   - Mudanças importantes também têm texto (ex.: `aria-live="polite"` em conquistas).
5. **Lottie (opcional):** use `lottie-react` com `autoplay={!reduzir}`. Busque animações com o MCP `lottiefiles` (pode estar bloqueado na rede corporativa) e registre a licença com `/registrar-asset`.
6. **Ícones:** busque no MCP `iconify` dando preferência a conjuntos MIT/CC0 (`lucide`, `ph`, `tabler`), coloque dentro de círculo de pincel conforme o guia e registre a licença.

## Proibido (tema apostas)
- Roleta, caça-níquel, chuva de moedas aleatória, contagem regressiva de "última chance", piscadas vermelho/dourado, confete de "você ganhou".
- Celebração sempre ligada a **escolha e esforço**, nunca a sorte.

## Checklist final
- [ ] Roda fluido (sem travadas) no celular.
- [ ] Desliga com reduzir-movimento do sistema **e** com o interruptor do app.
- [ ] Rodar `/conformidade-legal-br` no componente.
