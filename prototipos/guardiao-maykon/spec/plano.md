# Plano técnico 001 — MVP do Guardião

- **Estado:** 📝 rascunho (implementado; aguarda aprovação humana)
- **Spec:** [spec.md](spec.md)

## Decisões

| Decisão | Alternativas | Motivo |
|---|---|---|
| PWA em React 19 + Vite 8 + TypeScript strict, em `web/` | Next.js; Expo primeiro | Stack já decidida em [stack e motivação](../../../docs/04-tecnico/stack-e-motivacao.md); build estático roda offline |
| **Offline-first, sem cadastro e sem servidor**: estado em `localStorage` por um repositório (`web/src/lib/armazenamento.ts`) | Supabase desde já | A pesquisa e as skills `design-etico-saude-digital` e `seguranca-e-crise` pedem uso sem cadastro e dados só no aparelho; o projeto Supabase ainda não existe. O repositório isola a troca futura |
| Conteúdo clínico em `web/src/content/*.json` | Texto no componente | Revisão por psicólogo sem mexer em código; data de verificação para regras que mudam (MP 1.394/2026) |
| Regras em funções puras (`web/src/domain/`) | Lógica dentro das telas | Testáveis; o contador e o risco são os pontos mais sensíveis |
| Tokens do `guia-estilo-role-que-rende` importados por alias `@guia`, no modo calmo | Copiar valores | Uma fonte de verdade para web e mobile (skill `ui-ux-designer`) |
| Service worker com `vite-plugin-pwa` (precache de tudo) | Sem PWA | SOS e crise precisam abrir sem internet |
| Modo demonstração `?demo` com dados sintéticos | Preencher na hora | Demo de 60 s previsível; edital 8.5 exige dados sintéticos |

## Estrutura

```
web/src/
├── app/          telas: Onboarding, Inicio, Sos, Registro, Plano, Bloqueio, Apoio, Crise, Configuracoes
├── components/   Botao, Cartao, Aviso, Escala0a10, Chips, CampoTexto, Guardiao, Respiracao, Pagina, BarraCrise
├── content/      motivos, distorcoes, gatilhos, bloqueio, apoio (JSON com fontes e data)
├── domain/       tipos, datas, contador, risco (+ testes)
├── hooks/        DadosContext (estado + persistência + preferências de acessibilidade)
├── lib/          armazenamento (repositório local), demo (dados sintéticos)
└── theme/        app.css
```

## Riscos

| Risco | Mitigação |
|---|---|
| `localStorage` sem criptografia: outra pessoa da casa pode ver os dados | Coleta mínima; "Apagar tudo"; próxima etapa: PIN + criptografia (Web Crypto) |
| Textos clínicos sem revisão | Marcados como pendentes; revisão antes de qualquer lançamento |
| Links e telefones desatualizados | Data de verificação em cada arquivo de conteúdo |
| Chrome remove dados de PWA não usado | Exportar dados em JSON nas configurações |

## Verificação

`cd web && npm run check` (typecheck + 26 testes + build). Capturas de tela conferidas em 500 px de largura.
