# Tarefas 001 — Base do app, SOS de fissura e protocolo de crise

- **Spec:** [spec.md](spec.md) · **Plano:** [plano.md](plano.md)

Legenda: ⬜ a fazer · 🟨 em andamento · ✅ pronto · ❌ cortado · `[P]` pode ser feita em paralelo

| ID | Tarefa | CA | Arquivos | Depende de | [P] | Responsável | Estado |
|---|---|---|---|---|---|---|---|
| T001 | Configurar Vitest, jsdom e Testing Library | — | `web/vite.config.ts`, `web/src/test/` | — | | Antonio (IA) | ✅ |
| T002 | Conteúdo em JSON (canais de ajuda com data, frases do SOS, cards) + teste de vocabulário proibido | CA-5 | `web/src/content/` | T001 | [P] | Antonio (IA) | ✅ |
| T003 | Repositório local de episódios do SOS (IndexedDB) | CA-6 | `web/src/lib/` | T001 | [P] | Antonio (IA) | ✅ |
| T004 | Componentes base: Botao, ReguaVontade, TimerOnda, LinkTelefone | CA-3, CA-5 | `web/src/components/` | T001 | [P] | Antonio (IA) | ✅ |
| T005 | Casca do app, navegação e "Preciso de ajuda agora" | CA-1, CA-2 | `App.tsx`, `hooks/useRota.ts` | T004 | | Antonio (IA) | ✅ |
| T006 | Tela de crise | CA-5 | `app/crise/` | T004 | | Antonio (IA) | ✅ |
| T007 | Fluxo do SOS | CA-3, CA-4, CA-6 | `app/sos/` | T003, T004 | | Antonio (IA) | ✅ |
| T008 | Service worker e manifest | CA-7 | `web/public/` | T005 | | Antonio (IA) | ✅ |
| T009 | Conformidade: checklists de segurança e design ético em `docs/revisoes/`, registros de IA e assets | todos | `docs/` | todas | | Antonio (IA) | ✅ |
