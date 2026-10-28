# Tarefas 005 — Prevenção de Recaída (Planos Se/Então) e Círculo de Confiança

- **Spec:** [spec.md](spec.md) · **Plano:** [plano.md](plano.md)
- **Estado:** 📋 valendo (plano aprovado em 2026-10-27)

Legenda: ⬜ a fazer · 🟨 em andamento · ✅ pronto · ❌ cortado · `[P]` pode ser feita em paralelo

| ID | Tarefa | CA | Arquivos | Depende de | [P] | Responsável | Estado |
|---|---|---|---|---|---|---|---|
| T001 | Banco versão 3: stores `prevencao`, `planos` e `circulo`, com upgrade incremental | CA-1, CA-2, CA-4 | `web/src/lib/db.ts` | — | | Atyrson | ✅ |
| T002 | Conteúdo do F5 e do F8 em JSON + tipos + vocabulário proibido cobrindo o arquivo | CA-2, CA-5, CA-7 | `web/src/content/prevencao.json`, `conteudo.ts`, `conteudo.test.ts` | — | [P] | Atyrson | ⬜ |
| T003 | Domínio de mensagem: `normalizarTelefone`, `linkWhatsApp`, `linkSms` + testes | CA-5 | `web/src/domain/mensagem.ts` (+ teste) | — | [P] | Atyrson | ⬜ |
| T004 | Repositório de gatilhos e planos (limite de 5) + testes com `fake-indexeddb` | CA-1, CA-2 | `web/src/lib/prevencao.ts` (+ teste) | T001 | [P] | Atyrson | ⬜ |
| T005 | Repositório do Círculo (limite de 3) + testes | CA-4 | `web/src/lib/circulo.ts` (+ teste) | T001 | [P] | Atyrson | ⬜ |
| T006 | Rotas `/plano` e `/circulo`, estado `gatilhosIniciais` no `App` e atalhos no Início | CA-1, CA-4, CA-6 | `useRota.ts`, `App.tsx`, `Inicio.tsx` | — | | Atyrson | ⬜ |
| T007 | Tela "Seu plano": chips de gatilhos + "Outro" e criador de planos com exemplos e limite | CA-1, CA-2 | `web/src/app/plano/Plano.tsx` (+ teste) | T002, T004, T006 | | Atyrson | ⬜ |
| T008 | Tela "Seu Círculo": cadastro, edição, remoção e botões WhatsApp/SMS com a nota fixa | CA-4, CA-5 | `web/src/app/circulo/Circulo.tsx` (+ teste) | T002, T003, T005, T006 | [P] | Atyrson | ⬜ |
| T009 | `AcoesDoPlano` no passo de ação do SOS, com estado vazio (convite + CVV 188) | CA-3, CA-7 | `web/src/components/AcoesDoPlano.tsx` (+ teste), `web/src/app/sos/Sos.tsx` | T004, T005, T003 | | Atyrson (combinar com Ian/Antonio) | ⬜ |
| T010 | "Editar meu plano" no pós-lapso abre `/plano` com o gatilho marcado | CA-6 | `web/src/app/checkin/Checkin.tsx`, `App.tsx` | T007 e **merge da 004 na `development`** | | Atyrson (combinar com Danillo) | ⬜ |
| T011 | Acessibilidade: rótulos, erros com `aria-describedby`, foco no título, alvos 44 px, teclado | todos | `Plano.tsx`, `Circulo.tsx`, `index.css` | T007, T008 | | Atyrson | ⬜ |
| T012 | Conformidade: checklist de `docs/07-conformidade/regras-de-conteudo.md`, `/conformidade-legal-br`, `/registrar-uso-ia` e `/registrar-asset` (link `wa.me`) | todos | `docs/07-conformidade/*`, `docs/revisoes/` | todas | | Atyrson | ⬜ |

## Critério de pronto por tarefa

- **T001:** `npm test` passa; abrir o app com um banco versão 2 (da 004) mantém `episodiosSos` e `checkins` e cria as três stores novas.
- **T002:** `conteudo.test.ts` roda sobre `prevencao.json` e passa; os textos batem com o microcopy F5 e F8.
- **T003:** `(61) 90000-0000`, `61900000000` e `+55 61 90000-0000` viram `5561900000000`; número com menos de 10 dígitos dá erro; o texto vai codificado na URL.
- **T004:** salvar o 6º plano retorna erro de limite; os gatilhos persistem; apagar e editar funcionam.
- **T005:** salvar o 4º contato retorna erro de limite; nenhum `fetch` é chamado nos testes.
- **T006:** `/plano` e `/circulo` abrem pelo Início; a URL nunca leva dado da pessoa; "Preciso de ajuda agora" continua no topo.
- **T007:** teste mostra chips com `aria-pressed`, dois campos e um botão salvar, exemplos que preenchem o "Então" e a mensagem ao atingir 5.
- **T008:** o botão de envio é um `<a href="https://wa.me/…">` (ou `sms:`), nunca um envio automático; a nota "A gente nunca manda mensagem sozinho." está visível.
- **T009:** com planos, o passo de ação lista "Se…, então…"; sem planos e sem contatos, mostra convite e CVV 188, e o "Próximo" do SOS funciona; os testes existentes do SOS seguem passando.
- **T010:** teste do fluxo pós-lapso com "tédio" chega a `/plano` com "tédio" marcado.
- **T011:** navegação completa só pelo teclado nas duas telas; nenhum alvo menor que 44×44 px; leitor de tela anuncia título e avisos.
- **T012:** checklist preenchido em `docs/revisoes/`, sem ❌; uso de IA e o link `wa.me` registrados.

## Divisão sugerida

A 005 é **Should** e tem um responsável. Se alguém puder ajudar, as tarefas `[P]` que não mexem nos mesmos arquivos são:
- **Atyrson:** T001 → T004 → T005 → T006 → T007.
- **Outra pessoa (opcional):** T002 e T003 em paralelo, depois T008.
- **T009 e T010** dependem de combinar com os donos do SOS (Ian/Antonio) e do check-in (Danillo).
