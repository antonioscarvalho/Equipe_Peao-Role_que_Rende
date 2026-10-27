# Escopo e backlog do MVP

> O tempo é curto: de 27/10 às 15h30 até 29/10 às 11h. Priorize o que aparece na demo.

> Priorização copiada da [matriz conceito → funcionalidade](../../../docs/02-produto/matriz-conceito-funcionalidade.md#3-priorização-moscow) em 27/10/2026. **Proposta aguardando aprovação de Produto e Gestão**; o MVP já está implementado em `web/` ([spec 001](../spec/spec.md)).

## Priorização (MoSCoW)

### Must have — sem isso não há demo
- [x] #1 Onboarding "Seu motivo"
- [x] #2 Botão SOS de fissura
- [x] #4 Plano de prevenção de recaída (gatilhos + Se/Então)
- [x] #5 Registro diário + fluxo pós-lapso
- [x] #6 Contador de dias e dinheiro preservado
- [x] #8 Guia de bloqueio e autoexclusão
- [x] #9 Protocolo de crise
- [x] #11 Hub de apoio

### Should have — importante, mas a demo sobrevive sem
- [x] #3 Cards "Pare e examine" (dentro do SOS)
- [x] #7 Guardião (camada visual sobre o contador)
- [x] #10 Círculo de Confiança

### Could have — se sobrar tempo
- [ ] #12 Saldo real
- [ ] #13 Micro-lições sobre probabilidade (simulação só educativa, Seção 8.4)
- [ ] #14 Organizador de dívidas (Desenrola 3.0 a partir de fev/2027)
- [ ] #16 Open Finance só com dados sintéticos
- [ ] #18 Exercícios de mindfulness avulsos

### Won't have (agora) — fica para o "próximos passos" do pitch
- #15 Agenda de alto risco com notificações (exige push e teste de tom)
- #17 Autoavaliação PGSI (licença e validação brasileira pendentes)
- Login, sincronização entre aparelhos e app Expo
- Criptografia local com PIN (próxima etapa de privacidade)

## Backlog

| # | Item | Responsável (proposta) | Prioridade | Status |
|---|---|---|---|---|
| 1 | Base do `web/` (PWA offline, testes, build) | Maykon Júnio | Must | ✅ pronto |
| 2 | Onboarding, SOS, registro, plano, contador | Maykon Júnio | Must | ✅ pronto |
| 3 | Protocolo de crise e hub de apoio | Maykon Júnio | Must | ✅ pronto |
| 4 | Guia de bloqueio, Círculo de Confiança, Guardião | Maykon Júnio | Should | ✅ pronto |
| 5 | Revisão clínica dos textos em `web/src/content/` | Vanessa Ramos + mentor(a) de psicologia | Must | ⬜ a fazer |
| 6 | Deploy na Vercel (Root Directory `web`) | Danillo Meira | Must | ⬜ a fazer |
| 7 | Teste com leitor de tela e em 2 notebooks | Ian Costa Guimarães | Must | ⬜ a fazer |
| 8 | Vídeo da demo (plano B) | Maykon Júnio | Must | ⬜ a fazer |
| 9 | Pitch deck final e ensaios | Antonio Carvalho | Must | 🟨 em andamento (rascunho em `docs/06-entrega/`) |
| 10 | Revisão das regras de conteúdo por 2 integrantes | Atyrson Souto + Vanessa Ramos | Must | ⬜ a fazer |
| 11 | Micro-lições sobre probabilidade | Atyrson Souto | Could | ⬜ a fazer |
| 12 | Organizador de dívidas | Ian Costa Guimarães | Could | ⬜ a fazer |

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
