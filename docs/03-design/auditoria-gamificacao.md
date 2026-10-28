# Auditoria de gamificação — 28/10/2026

> Feita com a skill [`gamificacao-etica`](../../.claude/skills/gamificacao-etica/SKILL.md) (Werbach, Chou, Kim, Schell, Adams, McGonigal, Burke), usando o [checklist de auditoria](../../.claude/skills/gamificacao-etica/references/auditoria.md).
> Escopo: app oficial na `development` (commit `cec0e6a`), PR #20 (spec 007 + Guardião), `prototipos/prova-visual`, specs 001–008 e as skills `criar-personagem` e `animar-componente`.
> Classificação: 🔴 bloqueia (fere o edital ou o design ético) · 🟡 ajustar · 🟢 de acordo.

## Resumo

O **app oficial está de acordo** na essência: progresso que um lapso não apaga, pós-lapso sem punição, sem pontos, moedas, ranking ou prazo. Os problemas estão na **prova visual** e em **duas skills** que mandam usar a moeda girando, além de ajustes menores no SOS e no PR #20.

| # | Onde | Achado | Princípio | Classe | Sugestão |
|---|---|---|---|---|---|
| 1 | `prototipos/prova-visual/src/App.tsx` | Cada missão vale **"+R$ 20", "+R$ 50"…** e soma em "dinheiro protegido" | Catálogo: valor em dinheiro atribuído a ações (edital 8.4; Adams, economia interna) | 🔴 | Tirar os valores; dinheiro só como estimativa do gasto evitado (spec 004) |
| 2 | `prototipos/prova-visual` | Concluir missão faz a **moeda girar** e um **brilho** (Lottie) aparecer | Sinais de cassino; modo calmo do guia | 🔴 | Retorno em texto, sem moeda nem brilho |
| 3 | `prototipos/prova-visual` | **"Missões do dia"** com barra de progresso diária e "nível" = missões feitas | Chou 6 e 8 (prazo, medo de perder o dia) | 🔴 | Convites sem prazo, escolhidos pela pessoa; sem "nível" por tarefa |
| 4 | Skill `animar-componente` (linha 20) | Manda usar **`rqr-moeda`** em "Dinheiro protegido / meta" | Conflita com o modo calmo do guia e com o catálogo | 🔴 | Trocar por realce discreto em texto; `rqr-moeda` só em peça de divulgação |
| 5 | Skill `criar-personagem` (linha 28) | Estado **"orgulhoso"** com **brilho** e **`rqr-moeda`** ao lado | Idem | 🔴 | Orgulho calmo (expressão), sem moeda nem brilho |
| 6 | `web/src/app/sos/Sos.tsx` (`sortearCard`) | O card "Pare e examine" é **sorteado** (`Math.random`) | Chou 7; spec 003 CA-4 pede ordem fixa | 🟡 | Ordem fixa (o próximo SOS mostra o card seguinte) |
| 7 | PR #20 `Inicio.tsx` | Guardião cresce em 7/30/90 dias, mas o **próximo marco não é anunciado** | Recompensa previsível (Schell, lente da recompensa); spec 002 CA-9 | 🟡 | Mostrar "Próximo marco: 30 dias (faltam N)" |
| 8 | PR #20 `Dinheiro.tsx` | Demo de Open Finance diz **"Sem novas saídas desse tipo há N dias"** para "empresas de pagamento" | Vigilância implícita; spec 007 CA-4 (só estimativa) | 🟡 | Mostrar só a estimativa preservada e a sugestão de registrar o dia |
| 9 | `web/src/components/Contador.tsx` | "N dias deste mês ainda sem registro" pode soar como cobrança | Chou 8; participação voluntária (McGonigal) | 🟡 | Frase de convite: "Se quiser, dá pra registrar os dias que ficaram." |
| 10 | Skill `animar-componente` × app | Respiração **4-4-6** na skill e **4-6** no app e no guia | Coerência | 🟡 | Escolher um padrão (com revisão clínica) e alinhar |
| 11 | `docs/03-design/game-design.md` | Documento de game design ainda **vazio** | Werbach 6D (falta objetivo, comportamento e laço escritos) | 🟡 | Preencher com os 6D da skill |
| 12 | `Contador.tsx` | Sequência **some quando é zero**; número principal é o total | Chou 8 evitado; Schell (lente da punição) | 🟢 | — |
| 13 | `Checkin.tsx` + `checkin.json` | Lapso agradecido, sem punição; palavra de risco só **oferece** ajuda | Schell; prevenção de recaída; `seguranca-e-crise` | 🟢 | — |
| 14 | `Sos.tsx` | Régua antes/depois: "a vontade foi de 8 para 3" | Kim (laço curto); McGonigal (orgulho de conseguir) | 🟢 | — |
| 15 | `metas.json` | Metas tangíveis (botijão, compras) com **fonte e data** | Chou 1 e 4 em chave de chapéu branco; Burke | 🟢 | — |
| 16 | `TimerOnda.tsx` | Contagem calma, sem anúncio a cada segundo, respiração para com movimento reduzido | Spec 003 CA-3 | 🟢 | — |
| 17 | Specs 002, 004, 005, 007, 008 | Marcos anunciados, total desde o início, sem pontos ou ranking, Open Finance sem detecção | Catálogo | 🟢 | — |

## Laço principal do Guardião (Werbach 6D, Adams)

```
vontade de apostar ──► SOS (1 toque) ──► respirar 10–15 min ──► motivo + card ──► plano / alguém do Círculo
        ▲                                                                             │
        │                                                                             ▼
  (laço negativo: estabiliza)  ◄── "a vontade foi de 8 para 3" ◄── régua de novo ◄────┘

fim do dia ──► "Como foi hoje?" ──► Não apostei: "Anotado." ──► total de dias +1 ──► marco anunciado (7/30/90)
                                 └► Apostei: agradece ─► gatilho ─► ajusta o plano ─► total **não** cai
```

## Próximos passos
- [ ] Corrigir 1–5 antes de qualquer reaproveitamento da prova visual ou das skills no app (Atyrson)
- [ ] Corrigir 6 e 9 no app (responsáveis das specs 003 e 004)
- [ ] Ajustar 7 e 8 no PR #20 antes do merge (Ian)
- [ ] Preencher o game design com os 6D (Atyrson, Game Design)
