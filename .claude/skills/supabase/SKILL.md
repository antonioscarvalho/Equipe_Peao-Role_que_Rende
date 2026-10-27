---
name: supabase
description: Como usar o Supabase neste projeto: cliente único, autenticação, consulta via repositório com retry, Storage, Edge Functions, tipos gerados, ambiente local com a CLI e as chaves. Use ao ler ou gravar dado, mexer em login, subir arquivo, criar Edge Function, configurar o projeto Supabase ou gerar os tipos.
---

# Supabase

Backend inicial do projeto. Motivação em `docs/04-tecnico/stack-e-motivacao.md`. Tabela, migração e política de acesso ficam na skill `postgresql`.

## Onde cada coisa mora

```
supabase/
├── config.toml           # gerado por `supabase init`
├── migrations/           # SQL versionado (skill postgresql)
├── seed.sql              # dado SINTÉTICO para dev e demo
└── functions/<nome>/     # Edge Functions (Deno + TypeScript)
shared/
├── types/database.ts     # gerado: npx supabase gen types typescript --local
├── repositories/         # um repositório por recurso, sobre o supabase-js
└── retry.ts              # comRetry(): espera exponencial com jitter
web/src/lib/supabase.ts e mobile/src/lib/supabase.ts   # cliente único de cada app
```

## Passos

1. **Ambiente local primeiro.** `npx supabase start` sobe Postgres, Auth, API e painel no Docker (painel em http://localhost:54323). `npx supabase db reset` recria do zero com migrações e seed.
2. **Acesso a dado só por repositório.** A tela chama o hook, o hook chama `metasRepository.listar()`, e só o repositório conhece o `supabase-js`. Trocar a fonte (Supabase, armazenamento local, backend próprio) é trocar o repositório.
3. **Toda chamada de rede passa por `comRetry()`**, repetindo só falha de rede e 5xx. Erro de permissão (RLS) ou de validação não se repete: mostra a mensagem.
4. **Sempre trate o `error`.** O `supabase-js` não lança exceção: devolve `{ data, error }`. Um repositório que ignora `error` devolve lista vazia quando, na verdade, a permissão falhou.
5. Depois de mudar o banco, gere os tipos de novo e faça o commit junto da migração.
6. Edge Function só quando precisar de segredo ou de chamar serviço externo. Antes, veja se uma política ou função SQL resolve.

## Chaves

| Chave | Onde pode ficar |
|---|---|
| URL do projeto e `anon key` | No cliente (`VITE_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_URL`…). É pública por desenho: quem protege o dado é o RLS. |
| `service_role key` | **Só** em Edge Function ou backend. Ela ignora o RLS. No cliente, ela dá acesso ao banco inteiro para qualquer um. |

Valores reais só em `.env` (fora do Git) e nas variáveis da Vercel. `.env.example` leva só o nome.

## Regras

- Projeto na região São Paulo (`sa-east-1`).
- Dado de demo é **sintético**, no `seed.sql`. Nunca dado real de pessoa.
- Só sobe para o Supabase o que precisa sair do aparelho (`docs/07-conformidade/dados-e-privacidade.md`). Antes de criar tabela com dado pessoal, registre no inventário de dados.
- O plano gratuito **pausa o projeto depois de uma semana sem uso**. Abra o painel na manhã da demo, e tenha o `supabase start` local como plano B.
- Login: link mágico ou e-mail e senha. Nada de login com dado do Banco do Brasil (Seção 8.5).
