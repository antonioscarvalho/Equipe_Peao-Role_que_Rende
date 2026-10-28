# Tarefas 004 — Check-in diário, contador de dias e dinheiro preservado

- **Spec:** [spec.md](spec.md) · **Plano:** [plano.md](plano.md)

Legenda: ⬜ a fazer · 🟨 em andamento · ✅ pronto · ❌ cortado · `[P]` pode ser feita em paralelo

> Plano aprovado em 2026-10-27. Pendências que ficaram fora: ver `docs/revisoes/checkin-e-dinheiro.md`.

| ID | Tarefa | CA | Arquivos | Depende de | [P] | Responsável | Estado |
|---|---|---|---|---|---|---|---|
| T001 | Datas locais e cálculo do progresso do mês (dias sem apostar, dinheiro preservado) | CA-4, CA-5 | `web/src/domain/datas.ts`, `progresso.ts` + testes | — | [P] | Danillo (IA) | ✅ |
| T002 | Banco versão 2 e repositórios de check-in e de configuração | CA-1, CA-7 | `web/src/lib/db.ts`, `checkins.ts`, `configuracao.ts` + testes | — | [P] | Danillo (IA) | ✅ |
| T003 | Conteúdo do F4 e gatilhos em JSON, com teste de vocabulário proibido | CA-2, CA-3, CA-4 | `web/src/content/checkin.json`, `conteudo.test.ts` | — | [P] | Danillo (IA) | ✅ |
| T004 | Componentes genéricos `Chips` e `Cartao`, no catálogo | CA-1, CA-3 | `web/src/components/` | — | [P] | Danillo (IA) | ✅ |
| T005 | `useProgresso` e card do check-in com contador na tela inicial | CA-1, CA-2, CA-4 | `hooks/useProgresso.ts`, `app/inicio/` | T001, T002, T003, T004 | | Danillo (IA) | ✅ |
| T006 | Fluxo pós-lapso em `/checkin`, com saída para a crise | CA-3, CA-4 | `app/checkin/`, `hooks/useRota.ts`, `App.tsx` | T005 | | Danillo (IA) | ✅ |
| T007 | Tela do dinheiro preservado: estimativa de gasto e troca reais ⇄ metas | CA-5, CA-7 | `app/dinheiro/`, `content/metas.json` | T005 | | Danillo (IA) | ✅ |
| T008 | Simulação de Open Finance: extrato sintético, domínio e painel | CA-6 | `domain/openFinance.ts`, `content/open-finance-demo.json`, `app/dinheiro/` | T007 | | Danillo (IA) | ❌ saiu para a spec 007; código guardado em `feat/007-open-finance-demo` |
| T009 | Acessibilidade: leitura completa do contador e do valor, foco, `role="status"`, conferência nos tokens | todos | telas da 004 | T006, T007, T008 | | Danillo (IA) | 🟨 por teste; falta conferir à mão com leitor de tela |
| T011 | Ajuste à revisão de 27/10: total desde o início como número principal, mês e sequência em texto pequeno, dinheiro sobre o total, convite e meta da pessoa | CA-4, CA-5, CA-6 | `domain/progresso.ts`, `datas.ts`, `components/Contador.tsx`, `app/inicio/`, `app/dinheiro/`, `lib/configuracao.ts` + testes | T005, T007 | | Danillo (IA) | ✅ |
| T012 | Humor opcional depois do registro (um só, 5 níveis, texto do protótipo do Maykon) e teste de guarda do CA-7 | CA-1, CA-7 | `content/checkin.json`, `lib/checkins.ts`, `hooks/useProgresso.ts`, `app/inicio/`, `app/dinheiro/sem-notificacao.test.ts` | T011 | | Danillo (IA) | ✅ |
| T010 | Conformidade: checklists de segurança e design ético, fontes das metas, registros de IA e assets | todos | `docs/07-conformidade/*`, `docs/revisoes/` | todas | | Danillo | 🟨 falta conferir os valores das metas na fonte |

## Critério de pronto por tarefa

- **T001:** testes cobrem mês sem registro, lapso no meio do mês (o total não zera), virada de mês, check-in às 23h no fuso local e gasto não informado (devolve `null`, sem chutar).
- **T002:** teste sobe o banco da versão 1 para a 2 com um episódio do SOS gravado, e ele continua lá; dois check-ins no mesmo dia guardam só o último.
- **T003:** o teste de vocabulário reprova "perdeu a sequência", "dia zero", "zerou", "fracasso" e afins nos JSON novos.
- **T004:** cada componente tem uma linha no `web/src/components/README.md`; `Chips` é operável só pelo teclado.
- **T005:** teste de tela: tocar em "Não apostei" mostra "Anotado." e o contador passa de n para n + 1.
- **T006:** teste do fluxo completo e da saída "Tô mal com isso" para `/ajuda`.
- **T007:** sem estimativa, a tela pede o valor; com estimativa, mostra a estimativa e a troca reais ⇄ metas funciona; valor inválido mostra erro em texto.
- **T008:** o painel diz "Simulação" e "dados de exemplo"; nenhum nome de marca real no JSON; o modo manual não depende do painel.
- **T009:** navegação completa só por teclado e com leitor de tela nas três telas.
- **T011:** testes cobrem a virada do mês sem mudar o total, a sequência (até ontem, dia em branco, "Apostei" hoje), o dinheiro sobre o total, o convite sem gasto, a meta opcional e editável e a leitura do registro gravado antes da meta.
- **T012:** o humor só aparece depois do registro, guarda um nível só, sobrevive a registrar de novo no mesmo dia e pode ser desmarcado; o teste do CA-7 reprova qualquer uso da API de notificação no app e no service worker.
- **T010:** checklists preenchidos em `docs/revisoes/004-*.md`; declaração de uso de IA atualizada.

## Divisão sugerida

T001 a T004 não tocam nos mesmos arquivos e podem andar em paralelo. Se alguém da equipe pegar uma delas, T003 (conteúdo) combina com o perfil de Narrativa e Conteúdo (Vanessa).
