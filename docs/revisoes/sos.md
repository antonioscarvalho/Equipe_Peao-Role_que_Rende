# Revisão — Módulo SOS "Bateu a vontade?" (spec 001)

- **Data:** 27/10/2026 · **Revisor:** Claude Code (Opus 5.5), para revisão humana de Antonio Carvalho
- **Arquivos:** `web/src/app/sos/Sos.tsx`, `web/src/content/sos.json`, `web/src/components/{ReguaVontade,TimerOnda}.tsx`, `web/src/lib/episodiosSos.ts`
- **Veredito:** ⚠️ aprovado com ressalvas (revisão clínica pendente)

## Checklist `seguranca-e-crise`
| Item | Resultado | Evidência |
|---|---|---|
| Este fluxo pode encontrar alguém em crise? Há saída para o protocolo a ≤ 2 toques? | ✅ | "Preciso de ajuda agora" no topo (1 toque); "Não tô aguentando" no passo 1; CVV e "Ver mais formas de ajuda" quando a vontade não cai ou fica ≥ 9 — testes `CA-2` e `CA-4` |
| O protocolo funciona offline (telefones visíveis sem internet)? | ✅ | Telefones vêm do JSON do build; links `tel:`; service worker em `web/public/sw.js` |
| Nenhum texto minimiza sofrimento ou culpa a pessoa? | ✅ | Textos de `microcopy.md`; teste automatizado de vocabulário vedado (`conteudo.test.ts`) |
| Nenhum dado de crise vai para analytics ou servidor sem consentimento? | ✅ | Não há analytics; `foiParaCrise` fica só no IndexedDB |
| Conteúdo clínico marcado para revisão profissional? | ⚠️ | `sos.json` tem `"revisaoClinica": "pendente"` e o cabeçalho do módulo diz REVISÃO CLÍNICA PENDENTE. **Falta a revisão de fato.** |

## Checklist `design-etico-saude-digital`
| Item | Resultado | Evidência |
|---|---|---|
| Alguma mecânica lembra jogo de azar? | ✅ não | O card é sorteado, mas não há recompensa, pontuação nem som; é só variação de conteúdo |
| Notificações são opt-in, discretas e sem culpa? | ➖ | Módulo não envia notificações |
| Coleta só o essencial, local e criptografado? | ⚠️ | Só vontade antes/depois, data e se foi para a crise, no IndexedDB. **Ainda sem criptografia** (vem com o PIN, módulo futuro) |
| Texto simples, sem julgamento, acessível? | ✅ | Régua com botões de 48 px e `aria-pressed`; foco visível; respiração desligada com `prefers-reduced-motion`; leitor de tela ouve só a troca de frase |
| A métrica de sucesso do módulo é de desfecho, não de retenção? | ✅ | Queda da vontade antes/depois (autoeficácia), salva localmente |

## Checklists específicos
- **`prevencao-recaida`:** SOS a 1 toque e offline ✅; mostra que a fissura passa (antes/depois) ✅; conecta com ajuda humana ✅; plano Se/Então e Círculo ainda não existem — o passo 5 usa ações genéricas até lá.
- **`tcc-reestruturacao-cognitiva`:** valida a emoção antes de questionar ✅; perguntas, não sermão ✅; fonte no cabeçalho do módulo ✅.

## Pendências
1. Revisão clínica dos textos de `sos.json` (cards, frases da onda, mensagens de resultado).
2. Criptografia local com PIN.
3. Ligar o passo 5 ao plano Se/Então e ao Círculo de Confiança quando existirem.
