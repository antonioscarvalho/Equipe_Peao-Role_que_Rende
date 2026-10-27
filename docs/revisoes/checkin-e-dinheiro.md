# Revisão — Check-in diário, contador e dinheiro preservado (spec 004)

- **Data:** 27/10/2026 · **Revisor:** Claude Code (Opus 5.5), para revisão humana de Danillo Meira
- **Arquivos:** `web/src/app/inicio/`, `web/src/app/checkin/`, `web/src/app/dinheiro/`, `web/src/domain/{datas,progresso,openFinance}.ts`, `web/src/lib/{db,checkins,configuracao}.ts`, `web/src/content/{checkin,metas,open-finance-demo}.json`, `web/src/components/{Chips,Cartao,Contador}.tsx`
- **Veredito:** ⚠️ aprovado com ressalvas (revisão clínica pendente; metas sem valor conferido)

## Checklist `seguranca-e-crise`
| Item | Resultado | Evidência |
|---|---|---|
| Saída para o protocolo a ≤ 2 toques de qualquer tela? | ✅ | "Preciso de ajuda agora" continua no topo; o pós-lapso tem "Tô mal com isso" em todos os passos — teste do `Checkin` e do `App` |
| O lapso é tratado sem culpa? | ✅ | "Obrigado por registrar. Isso não apaga o que você já construiu." (microcopy F4); o teste de vocabulário reprova "perdeu a sequência", "dia zero", "zerou", "estaca zero" |
| Nenhum dado de lapso sai do aparelho? | ✅ | Check-in e gatilhos só no IndexedDB (`checkins`); nenhuma chamada de rede |
| Conteúdo clínico marcado para revisão profissional? | ⚠️ | `checkin.json` e o cabeçalho do `Checkin.tsx` marcam REVISÃO CLÍNICA PENDENTE. **Falta a revisão de fato.** |

## Checklist `design-etico-saude-digital`
| Item | Resultado |
|---|---|
| Mecânica que lembre jogo de azar? | ✅ nenhuma: sem confete, sem som, sem sequência que zera, sem prêmio |
| Reforço ligado ao valor da pessoa, não à sorte | ✅ o contador soma dias registrados; o dinheiro é convertido em contas do dia a dia, não em pontos |
| O número é honesto | ✅ só conta dia que a pessoa registrou (decisão 1 do plano); mostra sem cobrança quantos dias ficaram sem registro |
| Dinheiro como estimativa | ✅ "Estimativa de dinheiro preservado" e a conta aparece embaixo ("R$ x por semana, em n dias"); sem valor informado, a tela pergunta em vez de chutar |
| Coleta mínima e local | ✅ só a resposta do dia, os gatilhos marcados (opcionais) e o gasto semanal estimado |
| Open Finance só como simulação | ✅ extrato sintético com destinatários "(fictício)", aviso "Simulação com dados de exemplo"; teste garante os dois; nenhuma API chamada |
| Texto simples e acessível | ✅ contador lido como frase inteira; "Anotado." em `role="status"`; foco no título a cada passo; erro do campo em texto e `aria-invalid`; alvos ≥ 48 px |

## Edital (Seção 8.4 e 8.5)
| Item | Resultado |
|---|---|
| Não promove nem simula aposta | ✅ |
| Sem dinheiro real, cripto ou item de valor | ✅ o valor é estimativa do que a pessoa deixou de gastar |
| Sem marca proibida | ✅ nenhum nome real no extrato da simulação |
| Só dados sintéticos | ✅ |

## Pendências
1. Revisão clínica dos textos do pós-lapso (`web/src/content/checkin.json`).
2. Conferir na fonte os valores das metas (ANP, ANEEL, DIEESE) e marcar `status: "confirmado"` em `web/src/content/metas.json`. Até lá a tela mostra só a visão em reais (decisão 3).
3. "Editar meu plano" no passo 3 do pós-lapso, quando a spec 005 existir (decisão 4). Os gatilhos já ficam gravados no check-in para ela usar.
4. Check-ins sintéticos para o modo demo, para a Banca não ver o contador em 0.
