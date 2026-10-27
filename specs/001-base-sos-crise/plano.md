# Plano 001 — Base do app, SOS de fissura e protocolo de crise

- **Spec:** [spec.md](spec.md)
- **Estado:** ✅ aprovado junto com a spec

## 1. Abordagem
Em cima da base `web/` do Danillo (React + Vite + TS): navegação simples por estado sincronizada com a URL (sem biblioteca de rotas), conteúdo em JSON dentro do build, registros no IndexedDB por um repositório local e um service worker escrito à mão para abrir offline.

## 2. Componentes afetados
| Arquivo | Mudança |
|---|---|
| `web/src/App.tsx` | Casca do app: cabeçalho com "Preciso de ajuda agora" e troca de telas |
| `web/src/hooks/useRota.ts` | Navegação (`/`, `/sos`, `/ajuda`) com History API |
| `web/src/app/inicio/Inicio.tsx` | Tela inicial com botão SOS |
| `web/src/app/sos/Sos.tsx` | Fluxo F2 em passos |
| `web/src/app/crise/Crise.tsx` | Fluxo F3 |
| `web/src/components/` | `Botao`, `ReguaVontade`, `TimerOnda`, `LinkTelefone` |
| `web/src/content/*.json` | Canais de ajuda, frases do SOS, cards "Pare e examine" |
| `web/src/lib/db.ts`, `web/src/lib/episodiosSos.ts` | IndexedDB (`idb`) e repositório local |
| `web/public/sw.js`, `manifest.webmanifest` | Offline e instalação |

## 3. Modelo de dados (local)
`EpisodioSos { id: string; inicio: string (ISO); vontadeAntes: 0–10; vontadeDepois?: 0–10; foiParaCrise: boolean }` — store `episodiosSos` no banco `guardiao`.

## 4. Dependências novas
| Item | Tipo | Licença |
|---|---|---|
| idb | runtime | ISC |
| vitest, jsdom, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, fake-indexeddb | dev | MIT / Apache-2.0 |

## 5. Riscos e plano B
| Risco | Mitigação |
|---|---|
| Service worker com cache velho na demo | Versão no nome do cache; `skipWaiting` + `clients.claim` |
| IndexedDB indisponível (modo anônimo de alguns navegadores) | O SOS funciona mesmo se salvar falhar; erro só é registrado em memória |
| Timer longo na demo | Botão "Ir pro próximo passo" |

## 6. Como verificar
Testes com Vitest + Testing Library para CA-1 a CA-6; CA-7 conferido manualmente com `npm run build && npm run preview` e DevTools offline.
