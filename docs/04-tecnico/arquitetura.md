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
| `web/` | App web (PWA), o entregável principal | _a definir_ |
| `mobile/` | App Expo, em segundo plano no Game Jam | _a definir_ |
| `shared/` | Tipos gerados do banco, repositórios, validação e retry, usados pelos dois apps | _a definir_ |
| `supabase/` | Migrações, políticas RLS, seed sintético e Edge Functions | _a definir_ |
| `backend/` | Backend customizado (Fastify), só quando a regra exigir | _a definir_ |

## Dados

- **Dado sensível da pessoa (registros, SOS, plano, contatos, finanças) fica só no aparelho**, em IndexedDB, atrás de um repositório local. O Supabase serve conteúdo público e a demo sintética de Open Finance. Detalhes, tabela completa e regras em [privacidade e dados locais](privacidade-e-dados-locais.md).
- Uso sem cadastro e offline-first (service worker) no MVP.
- Todos os dados de exemplo são **sintéticos**. Veja [dados e privacidade](../07-conformidade/dados-e-privacidade.md).

## Decisões técnicas (ADRs curtas)

| Data | Decisão | Alternativas consideradas | Motivo |
|---|---|---|---|
| 2026-10-27 | Web em React + Vite + TypeScript, como PWA | Next.js; Flutter; engine de jogo (Godot, Phaser) | PWA para Android de entrada; build estático para a demo offline; React é o mais usado do mercado |
| 2026-10-27 | Mobile em React Native com Expo | Flutter; React Native sem framework | Mesmo React e TypeScript do web; framework recomendado pela documentação do React Native |
| 2026-10-27 | Backend inicial no Supabase (PostgreSQL) | Firebase; Fastify desde o início | Auth, API e RLS prontos; open source e roda local; PostgreSQL portável |
| 2026-10-27 | Deploy web na Vercel | Netlify; Cloudflare Pages | Deploy por push e pré-visualização por PR; trocável porque o build é estático |
| 2026-10-27 | Dados pessoais e de saúde só no aparelho (IndexedDB); Supabase só para conteúdo público e demo sintética; sem login no MVP | Guardar tudo no Supabase com RLS e login | Dado de saúde é sensível na LGPD; a pesquisa e as skills de segurança pedem offline-first e uso sem cadastro; menos risco na demo |
| 2026-10-27 | Backend customizado (Fastify ou Go) só sob demanda | Backend próprio no MVP | Um deploy a mais é um risco a mais na demo; o Supabase cobre o MVP |
