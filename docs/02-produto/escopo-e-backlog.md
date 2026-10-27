# Escopo e backlog do MVP

> O tempo é curto: de 27/10 às 15h30 até 29/10 às 11h. Priorize o que aparece na demo.

> A priorização proposta, com base na pesquisa, está em [matriz conceito → funcionalidade](matriz-conceito-funcionalidade.md#3-priorização-moscow). Copie aqui o que a equipe aprovar.

## Priorização (MoSCoW)

### Must have — sem isso não há demo
- [x] **Spec 002:** Onboarding "Seu Motivo" (≤ 5 telas) e Companheiro Guardião
- [x] **Spec 003:** Botão SOS "Bateu a vontade" com timer de urge surfing (10-15 min) e cards socráticos
- [x] **Spec 004:** Check-in diário de 1 toque, contador acumulado de dias e dinheiro preservado
- [x] **Spec 006:** Protocolo de Crise (offline, ≤ 2 toques: CVV 188 / SAMU 192) e Hub de Apoio

### Should have — importante, mas a demo sobrevive sem
- [x] **Spec 005:** Plano de prevenção de recaída (mapa de gatilhos + Se/Então) e Círculo de Confiança

### Could have — se sobrar tempo
- [ ] Simulação visual educativa de probabilidade da casa (1.000 apostas)
- [ ] Demonstração avançada da API Pluggy Open Finance em sandbox

### Won't have (agora) — fica para o "próximos passos" do pitch
- Agenda com push notifications (alto risco de virar gatilho involuntário)
- Rastreamento por geolocalização e conexão bancária obrigatória de dinheiro real

## Backlog

| # | Item / Spec | Responsável | Prioridade | Issue | Status |
|---|---|---|---|---|---|
| 0 | [Spec 001 — Base do app, SOS e crise](../../specs/001-base-sos-crise/spec.md) | Antonio Carvalho | Must | — | 🔍 implementada, revisão clínica pendente |
| 1 | [Spec 002 — Onboarding e Guardião](../../specs/002-onboarding-e-guardiao/spec.md) | Ian Costa Guimarães | Must | [#4](https://github.com/antonioscarvalho/equipepeao/issues/4) | 📝 spec pronta |
| 2 | [Spec 003 — Botão SOS e Urge Surfing](../../specs/003-sos-fissura/spec.md) | Ian Costa Guimarães | Must | [#5](https://github.com/antonioscarvalho/equipepeao/issues/5) | 📝 spec pronta |
| 3 | [Spec 004 — Contador e Dinheiro Preservado](../../specs/004-contador-e-dinheiro/spec.md) | Danillo Meira | Must | [#7](https://github.com/antonioscarvalho/equipepeao/issues/7) | 📝 spec pronta |
| 4 | [Spec 005 — Prevenção e Círculo de Confiança](../../specs/005-prevencao-e-circulo/spec.md) | Atyrson Souto | Should | [#8](https://github.com/antonioscarvalho/equipepeao/issues/8) | 📝 spec pronta |
| 5 | [Spec 006 — Protocolo de Crise e Hub de Apoio](../../specs/006-protocolo-crise-e-hub/spec.md) | Vanessa Ramos | Must | [#9](https://github.com/antonioscarvalho/equipepeao/issues/9) | 📝 spec pronta |

Status: ⬜ a fazer · 🟨 em andamento · ✅ pronto · ❌ cortado

## Marcos internos

| Quando | Meta |
|---|---|
| 27/10 · 17h30 | Ideia, escopo e arquitetura definidos; repositório configurado |
| 28/10 · 12h | Fluxo principal funcionando de ponta a ponta (mesmo feio) |
| 28/10 · 18h | Funcionalidades Must prontas; arte e conteúdo integrados |
| 29/10 · 09h | **Congelamento de funcionalidades** — só correções e polimento |
| 29/10 · 10h30 | Build final, pitch deck em PDF e declarações prontos |
| 29/10 · 11h | Etapa eliminatória |
