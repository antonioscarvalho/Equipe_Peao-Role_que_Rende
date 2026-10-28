# Revisão — Check-in diário, contador e dinheiro preservado (spec 004)

- **Data:** 27/10/2026 · **Revisor:** Claude Code (Opus 5.5), para revisão humana de Danillo Meira
- **Arquivos:** `web/src/app/inicio/`, `web/src/app/checkin/`, `web/src/app/dinheiro/`, `web/src/domain/{datas,progresso,risco}.ts`, `web/src/lib/{db,checkins,configuracao,demo}.ts`, `web/src/content/{checkin,metas,dinheiro}.json`, `web/src/components/{Chips,Cartao,Contador,Aproximado}.tsx`
- **Veredito:** ⚠️ aprovado com ressalvas (revisão clínica pendente; spec revisada aguarda reaprovação da equipe)
- **Atualizada em 27/10/2026** depois da spec revisada: conferência critério por critério abaixo, conferida também no navegador (Chromium, 390 px, `?demo`).

## Conferência da spec, critério por critério

| Item da spec | Situação | Onde |
|---|---|---|
| CA-1 · card "Como foi hoje?" com 1 toque, humor opcional, registrar de novo substitui | ✅ | `Inicio.tsx`; o humor aparece depois do registro e sobrevive a registrar de novo |
| CA-2 · "Anotado." sem som, confete nem animação | ✅ | `role="status"`, só texto |
| CA-3 · (1) agradecimento | ✅ | `Checkin.tsx` |
| CA-3 · (2) chips de gatilho **+ texto livre opcional** | ✅ | o texto livre faltava e entrou; fica só no aparelho (`relato`). Se ele tiver sinal de risco, a tela **oferece** "Falar com alguém agora", sem bloquear (skill `seguranca-e-crise`) |
| CA-3 · (3) Editar meu plano · Agora não | 🟨 | só "Agora não": o editor é da spec 005, que liga o botão depois deste merge (plano da 005, CA-6). Os gatilhos já ficam gravados |
| CA-3 · (4) "Tô mal com isso" → crise | ✅ | em todos os passos |
| CA-4 · total desde o início como número principal; mês e sequência em texto menor; lapso e virada do mês não mudam o total | ✅ | `domain/progresso.ts`; a sequência some quando é zero, para não soar como placar perdido |
| CA-5 · (gasto ÷ 7) × total, sempre "estimativa", ligado à meta | ✅ | as duas visões dizem "estimativa" (a de metas não dizia); a meta da pessoa aparece junto. A microcopy usa "≈ R$ {valor} — {meta}", e o exemplo da spec ("— dá pra conta de luz") foi lido como ilustração |
| CA-6 · convite "Quer ver quanto você preservou?" e dois campos opcionais, editáveis | ✅ | o valor é obrigatório para calcular; a meta é opcional; "Mudar o valor ou a meta" reabre os dois |
| CA-7 · dinheiro nunca em notificação nem na tela de bloqueio | ✅ | o app não notifica; teste de guarda reprova a API de notificação |
| §4 · dinheiro como coisas concretas (botijão, compras, conta de luz) | 🟨 | botijão (ANP) e semana de compras (DIEESE) conferidos e na tela, com a fonte; a conta de luz fica fora até haver fonte oficial para a conta |
| §6 · leitor de tela lê frase completa | ✅ | contador como frase; "≈" lido como "cerca de" |
| §6 · alto contraste pelos tokens (spec 008) | ➖ | depende da 008 |
| §6 · alternar reais ⇄ metas | ✅ | par de botões com `aria-pressed` |
| §6 · estado com texto, nunca só com cor | ✅ | chip marcado ganhou um visto desenhado em CSS, além da cor e do negrito |
| §7 · textos da microcopy, sem "perdeu a sequência" | ✅ | textos em `content/*.json` e na microcopy; o teste de vocabulário cobre `dinheiro.json` |
| §8 · fora do escopo | ✅ | Open Finance saiu para `feat/007-open-finance-demo`; nada de Pix, conta real ou recompensa |
| §9 · edital | ✅ | ver abaixo |


## Checklist `seguranca-e-crise`
| Item | Resultado | Evidência |
|---|---|---|
| Saída para o protocolo a ≤ 2 toques de qualquer tela? | ✅ | "Preciso de ajuda agora" continua no topo; o pós-lapso tem "Tô mal com isso" em todos os passos — teste do `Checkin` e do `App` |
| O lapso é tratado sem culpa? | ✅ | "Obrigado por registrar. Isso não apaga o que você já construiu." (microcopy F4); o teste de vocabulário reprova "perdeu a sequência", "dia zero", "zerou", "estaca zero" |
| Nenhum dado de lapso sai do aparelho? | ✅ | Check-in e gatilhos só no IndexedDB (`checkins`); nenhuma chamada de rede |
| Conteúdo clínico marcado para revisão profissional? | ⚠️ | `checkin.json` e o cabeçalho do `Checkin.tsx` marcam REVISÃO CLÍNICA PENDENTE. **Falta a revisão de fato.** |
| Texto livre com sinal de risco | ✅ | só oferece ajuda; nada é marcado, enviado ou mostrado de novo. A lista de sinais (`sinaisDeRisco` em `checkin.json`) também entra na revisão clínica |

## Checklist `design-etico-saude-digital`
| Item | Resultado |
|---|---|
| Mecânica que lembre jogo de azar? | ✅ nenhuma: sem confete, sem som, sem sequência que zera, sem prêmio |
| Reforço ligado ao valor da pessoa, não à sorte | ✅ o contador soma dias registrados; o dinheiro é convertido em contas do dia a dia, não em pontos |
| O número é honesto | ✅ só conta dia que a pessoa registrou (decisão 1 do plano); mostra sem cobrança quantos dias ficaram sem registro |
| Dinheiro como estimativa | ✅ "Estimativa de dinheiro preservado" e a conta aparece embaixo ("R$ x por semana, em n dias"); sem valor informado, a tela pergunta em vez de chutar |
| Coleta mínima e local | ✅ só a resposta do dia, os gatilhos marcados (opcionais) e o gasto semanal estimado |
| Open Finance | ➖ fora desta entrega: virou a spec 007, e a simulação foi guardada em `feat/007-open-finance-demo` |
| Texto simples e acessível | ✅ contador lido como frase inteira; "Anotado." em `role="status"`; foco no título a cada passo; erro do campo em texto e `aria-invalid`; alvos ≥ 48 px |

## Edital (Seção 8.4 e 8.5)
| Item | Resultado |
|---|---|
| Não promove nem simula aposta | ✅ |
| Sem dinheiro real, cripto ou item de valor | ✅ o valor é estimativa do que a pessoa deixou de gastar |
| Sem marca proibida | ✅ |
| Só dados sintéticos | ✅ |

## Pendências
1. Revisão clínica dos textos do pós-lapso e da lista de sinais de risco (`web/src/content/checkin.json`).
2. Reaprovação da spec 004 revisada pela equipe.
3. "Editar meu plano" no passo 3 do pós-lapso: entra com a spec 005 (Atyrson), que já planejou isso.
4. Conta de luz como meta: falta fonte oficial para o valor de uma conta típica.
5. Atualizar os valores das metas antes do pitch (a ANP é semanal; o DIEESE, mensal).
6. Teste à mão com leitor de tela (TalkBack) no início, no pós-lapso e no dinheiro.

Resolvidas nesta rodada: valores das metas conferidos na fonte; check-ins sintéticos no modo demo (`?demo`, o contador não abre em 0 nem no dia 1 do mês); texto livre do pós-lapso; "estimativa" na visão em metas; "≈" lido como "cerca de"; textos do dinheiro tirados do código para `content/dinheiro.json`.
