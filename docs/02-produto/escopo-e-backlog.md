# Escopo e backlog do MVP

> O tempo é curto: de 27/10 às 15h30 até 29/10 às 11h. Priorize o que aparece na demo.

> A priorização proposta, com base na pesquisa, está em [matriz conceito → funcionalidade](matriz-conceito-funcionalidade.md#3-priorização-moscow). Copie aqui o que a equipe aprovar.

## Priorização (MoSCoW)

### Must have — sem isso não há demo
- [x] **Spec 002:** Onboarding "Seu Motivo" (≤ 5 telas) e Companheiro Guardião
- [x] **Spec 003:** Botão SOS "Bateu a vontade" com timer de urge surfing (10-15 min) e cards socráticos
- [x] **Spec 004:** Check-in diário de 1 toque, total de dias sem apostar desde o início e dinheiro preservado (estimativa)
- [x] **Spec 006:** Protocolo de Crise (offline, 1 toque: CVV 188 / SAMU 192), Hub de Apoio e Guia de Bloqueio
- [x] **Spec 007:** Demonstração de Open Finance com dados sintéticos — diferencial do produto (sem marca BB até autorização, sem "detectar aposta")
- [x] **Spec 008:** Configurações, privacidade e acessibilidade (PIN, apagar/exportar, fonte, contraste, reduzir animações — bônus de 5%)

### Should have — importante, mas a demo sobrevive sem
- [x] **Spec 005:** Plano de prevenção de recaída (mapa de gatilhos + Se/Então) e Círculo de Confiança

### Could have — se sobrar tempo
- [ ] Simulação visual educativa de probabilidade da casa (1.000 apostas)

### Won't have (agora) — fica para o "próximos passos" do pitch
- Agenda com push notifications (alto risco de virar gatilho involuntário)
- Rastreamento por geolocalização e conexão bancária obrigatória de dinheiro real

## Backlog

> Revisão de 27/10/2026: specs 002–006 alteradas e aguardando reaprovação; 007 e 008 criadas (ver [índice das specs](../../specs/README.md)).

| # | Item / Spec | Responsável | Prioridade | Issue | Status |
|---|---|---|---|---|---|
| 0 | [Spec 001 — Base do app, SOS e crise](../../specs/001-base-sos-crise/spec.md) | Antonio Carvalho | Must | — | 🔍 implementada, revisão clínica pendente |
| 1 | [Spec 002 — Onboarding e Guardião](../../specs/002-onboarding-e-guardiao/spec.md) | Ian Costa Guimarães | Must | [#4](https://github.com/antonioscarvalho/equipepeao/issues/4) | 🔄 spec revisada, reaprovar |
| 2 | [Spec 003 — Botão SOS e Urge Surfing](../../specs/003-sos-fissura/spec.md) | Ian Costa Guimarães | Must | [#5](https://github.com/antonioscarvalho/equipepeao/issues/5) | 🔄 spec revisada, reaprovar |
| 3 | [Spec 004 — Contador e Dinheiro Preservado](../../specs/004-contador-e-dinheiro/spec.md) | Danillo Meira | Must | [#7](https://github.com/antonioscarvalho/equipepeao/issues/7) | 🔄 spec revisada, reaprovar |
| 4 | [Spec 005 — Prevenção e Círculo de Confiança](../../specs/005-prevencao-e-circulo/spec.md) | Atyrson Souto | Should | [#8](https://github.com/antonioscarvalho/equipepeao/issues/8) | 🔄 spec revisada, reaprovar |
| 5 | [Spec 006 — Protocolo de Crise e Hub de Apoio](../../specs/006-protocolo-crise-e-hub/spec.md) | Vanessa Ramos | Must | [#9](https://github.com/antonioscarvalho/equipepeao/issues/9) | 🔄 spec revisada, reaprovar |
| 6 | [Spec 007 — Open Finance (demo sintética)](../../specs/007-open-finance-demo/spec.md) | _a definir_ | Must | [#15](https://github.com/antonioscarvalho/equipepeao/issues/15) | 📝 rascunho |
| 7 | [Spec 008 — Configurações, privacidade e acessibilidade](../../specs/008-configuracoes-privacidade-acessibilidade/spec.md) | Maykon Júnio | Must | [#16](https://github.com/antonioscarvalho/equipepeao/issues/16) | 📝 rascunho |

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
