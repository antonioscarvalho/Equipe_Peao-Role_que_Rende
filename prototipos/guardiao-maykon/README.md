# Protótipo paralelo do Guardião (Maykon)

> **Não é o app oficial.** O app da equipe está em [`web/`](../../web/) (spec [001-base-sos-crise](../../specs/001-base-sos-crise/spec.md) e specs 002–006).
> Este protótipo foi feito em paralelo em 27/10/2026, antes de vermos o `web/` da equipe. Fica aqui para a equipe **comparar e aproveitar partes**, sem sobrescrever nada.

## O que tem aqui que pode ser aproveitado

| Parte | Onde | Spec da equipe relacionada |
|---|---|---|
| Onboarding "Seu motivo" (4 telas, Entrevista Motivacional) | `src/app/Onboarding.tsx`, `src/content/motivos.json` | 002 (Ian) |
| Guardião em SVG com estágios 7/30/90 dias e "acolhendo" | `src/components/Guardiao.tsx` | 002 (Ian) |
| SOS completo com card "Pare e examine" e pergunta opcional de risco | `src/app/Sos.tsx`, `src/content/distorcoes.json` | 003 (Ian) |
| Registro de 1 toque + pós-lapso, contador que não zera, dinheiro preservado | `src/app/Registro.tsx`, `src/domain/contador.ts` | 004 (Danillo) |
| Plano Se/Então, gatilhos, Círculo de Confiança | `src/app/Plano.tsx`, `src/app/Apoio.tsx` | 005 (Atyrson) |
| Crise com plano de segurança, hub de apoio, guia de bloqueio | `src/app/Crise.tsx`, `src/app/Bloqueio.tsx`, `src/content/apoio.json`, `src/content/bloqueio.json` | 006 (Vanessa) |
| Acessibilidade: 3 tamanhos de texto, alto contraste, reduzir animações | `src/app/Configuracoes.tsx`, `src/theme/app.css` | todas |
| Modo `?demo` com dados sintéticos para a Banca | `src/lib/demo.ts` | roteiro do pitch |

Spec, plano e tarefas deste protótipo: [`spec/`](spec/). Rascunhos de documentos (personas, jornada, game design, métricas, roteiro do pitch, papéis…) que a equipe pode copiar para `docs/`: [`docs-propostas/`](docs-propostas/).

> ⚠️ Textos clínicos em `src/content/` com **revisão clínica pendente**.

## Rodar

```bash
cd prototipos/guardiao-maykon
npm install
npm run dev      # http://localhost:5173  ·  demo: http://localhost:5173/?demo
npm run check    # typecheck + 26 testes + build
```

Stack: React 19 + Vite 8 + TypeScript + vite-plugin-pwa, dados só no `localStorage`, tokens do guia de estilo pelo alias `@guia`.
