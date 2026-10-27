# Arquitetura

## Stack

Motivação detalhada de cada escolha, com os dados de mercado, em [stack e motivação](stack-e-motivacao.md).

| Camada | Tecnologia | Licença | Por que escolhemos |
|---|---|---|---|
| Linguagem | TypeScript | Apache 2.0 | Uma linguagem do banco à tela; o tipo segura o agente de IA |
| Frontend web | React + Vite | MIT | PWA leve para Android de entrada, build estático que roda offline |
| Mobile | React Native com Expo | MIT | Mesmo React no celular; roda no aparelho pelo Expo Go |
| Backend inicial | Supabase | Apache 2.0 | Auth, API, Storage e Edge Functions prontos; roda local |
| Banco de dados | PostgreSQL | PostgreSQL License | O mais usado do mundo; permissão por linha (RLS) |
| Hospedagem / build | Vercel | serviço (Hobby) | Deploy por push e URL de pré-visualização por PR |
| Backend customizado (futuro) | Fastify ou Go | MIT / BSD-3 | Só se a regra não couber no Supabase (candidato: Open Finance) |

> O edital prefere engines open source (ex.: Godot, Phaser, Bevy). Toda dependência entra em [licenças e assets](../07-conformidade/licencas-e-assets.md).

## Visão geral

```
[Pessoa] → web/ (React + Vite, PWA)  ─┐
         → mobile/ (Expo)            ─┤ shared/ (tipos, repositórios, retry)
                                      ↓
                          Supabase (Auth · API · RLS · Storage)
                                      ↓
                          PostgreSQL ── Edge Function ──► Pluggy (Open Finance, sandbox)
                                      ↓ (só se precisar)
                          backend/ (Fastify ou Go)
```

## Módulos

| Módulo | Responsabilidade | Responsável |
|---|---|---|
| `web/` | App web (PWA), o entregável principal. MVP pronto, offline-first ([spec 001](../../specs/001-mvp-guardiao/spec.md)) | Maykon Júnio (proposta) |
| `mobile/` | App Expo, em segundo plano no Game Jam (ainda não criado; o PWA instala no Android) | Ian Costa Guimarães (proposta) |
| `shared/` | Tipos gerados do banco, repositórios, validação e retry, usados pelos dois apps. Hoje as regras do MVP moram em `web/src/domain/` e sobem para cá quando o mobile existir | Ian Costa Guimarães (proposta) |
| `supabase/` | Migrações, políticas RLS, seed sintético e Edge Functions (ainda não criado; o MVP não precisa) | Danillo Meira (proposta) |
| `backend/` | Backend customizado (Fastify), só quando a regra exigir. Esqueleto pronto, fora do caminho da demo | Danillo Meira |

## Dados

- Que dados o protótipo guarda? Motivo, réguas de importância e confiança, gasto semanal estimado e meta, registros diários (apostou ou não, humor, pós-lapso), plano Se/Então, até 3 contatos, passos de bloqueio feitos, plano de segurança, episódios do SOS (vontade antes e depois) e preferências de acessibilidade. Inventário completo em [dados e privacidade](../07-conformidade/dados-e-privacidade.md).
- Onde ficam? **Só no aparelho**, no `localStorage` do navegador (chave `guardiao:v1`), por meio do repositório `web/src/lib/armazenamento.ts`. Nenhum dado vai para servidor.
- Todos os dados de exemplo são **sintéticos**. Veja [dados e privacidade](../07-conformidade/dados-e-privacidade.md).

## Decisões técnicas (ADRs curtas)

| Data | Decisão | Alternativas consideradas | Motivo |
|---|---|---|---|
| 2026-10-27 | Web em React + Vite + TypeScript, como PWA | Next.js; Flutter; engine de jogo (Godot, Phaser) | PWA para Android de entrada; build estático para a demo offline; React é o mais usado do mercado |
| 2026-10-27 | Mobile em React Native com Expo | Flutter; React Native sem framework | Mesmo React e TypeScript do web; framework recomendado pela documentação do React Native |
| 2026-10-27 | Backend inicial no Supabase (PostgreSQL) | Firebase; Fastify desde o início | Auth, API e RLS prontos; open source e roda local; PostgreSQL portável |
| 2026-10-27 | Deploy web na Vercel | Netlify; Cloudflare Pages | Deploy por push e pré-visualização por PR; trocável porque o build é estático |
| 2026-10-27 | Backend customizado (Fastify ou Go) só sob demanda | Backend próprio no MVP | Um deploy a mais é um risco a mais na demo; o Supabase cobre o MVP |
| 2026-10-27 | **MVP offline-first, sem cadastro e sem Supabase**: dados só no aparelho, atrás de um repositório | Supabase com login anônimo | A pesquisa e as skills de ética e crise pedem uso sem cadastro e dados locais; SOS e crise precisam abrir sem internet; o repositório deixa trocar por Supabase depois sem mexer nas telas |
| 2026-10-27 | Conteúdo clínico em `web/src/content/*.json`, com fonte e data | Texto no código | Revisão por psicólogo sem mexer em código; regulação muda (MP 1.394/2026) |
