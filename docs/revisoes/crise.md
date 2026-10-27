# Revisão — Módulo Protocolo de crise (spec 001)

- **Data:** 27/10/2026 · **Revisor:** Claude Code (Opus 5.5), para revisão humana de Antonio Carvalho
- **Arquivos:** `web/src/app/crise/Crise.tsx`, `web/src/content/canais-de-ajuda.json`, `web/src/components/LinkTelefone.tsx`, `web/src/App.tsx`
- **Veredito:** ⚠️ aprovado com ressalvas (revisão clínica pendente)

## Checklist `seguranca-e-crise`
| Item | Resultado | Evidência |
|---|---|---|
| Saída para o protocolo a ≤ 2 toques de qualquer tela? | ✅ | Botão "Preciso de ajuda agora" fixo no topo de todas as telas (1 toque) — teste `CA-2` |
| Ajuda humana **antes** da estabilização? | ✅ | CVV e SAMU aparecem antes do botão de respiração — teste `CA-5` verifica a ordem no DOM |
| Funciona offline? | ✅ | Telefones no build; `tel:` não depende de internet; rota `/ajuda` cai no `index.html` do cache |
| Tom calmo, sem alarmismo, sem culpa? | ✅ | Textos de `microcopy.md` F3; linguagem neutra de gênero ("Você não tá só nessa") |
| Deixa claros os limites do app? | ✅ | "Este app não é um serviço de emergência. Em perigo, ligue 192." |
| Nenhum dado de crise em analytics ou servidor? | ✅ | Nada é registrado ao abrir a crise; só o SOS marca `foiParaCrise`, localmente |
| Localização sem consentimento? | ✅ não | Não pedimos localização; CAPS é só orientação em texto |
| Telefones e links em arquivo de conteúdo com data? | ✅ | `canais-de-ajuda.json` com `verificado_em` e `fonte`; teste garante os dois; itens "conferir" (teleatendimento SUS) ficam escondidos |
| Conteúdo clínico marcado para revisão profissional? | ⚠️ | Cabeçalho do módulo marca REVISÃO CLÍNICA PENDENTE. **Falta a revisão de fato.** |

## Checklist `design-etico-saude-digital`
| Item | Resultado |
|---|---|
| Mecânica que lembre jogo de azar? | ✅ nenhuma |
| Notificações | ➖ não se aplica |
| Coleta mínima e local | ✅ a tela não coleta nada |
| Texto simples e acessível | ✅ título recebe foco ao abrir (leitor de tela anuncia); links `tel:` com rótulo completo; alvo ≥ 48 px |
| Métrica de desfecho | ➖ não se aplica (não medimos uso da crise) |

## Pendências
1. Revisão clínica dos textos da crise.
2. Plano de segurança editável (estilo Stanley-Brown), previsto no fluxo F3, passo 4 — módulo futuro.
3. Botão "Chamar alguém do meu Círculo" quando o Círculo de Confiança existir.
4. Link oficial para localizar CAPS: só depois de confirmar a fonte.
