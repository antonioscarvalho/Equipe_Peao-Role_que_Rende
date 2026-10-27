---
name: postgresql
description: Como modelar e mudar o banco PostgreSQL do Supabase: migração versionada, nome de tabela e coluna, chave e restrição, Row Level Security em toda tabela, índice, função e seed sintético. Use ao criar ou alterar tabela, coluna, política de acesso, função SQL ou dado de exemplo.
---

# PostgreSQL

O banco do Supabase. Motivação em `docs/04-tecnico/stack-e-motivacao.md`.

## Passos

1. Crie a migração: `npx supabase migration new <o_que_muda>` (ex.: `cria_tabela_metas`). Nunca altere uma migração que já foi para `development`: escreva outra.
2. Escreva a tabela com chave, tipo e restrição explícitos:
   ```sql
   create table public.metas (
     id uuid primary key default gen_random_uuid(),
     usuario_id uuid not null references auth.users (id) on delete cascade,
     titulo text not null check (char_length(titulo) between 1 and 120),
     criado_em timestamptz not null default now()
   );
   ```
3. **Ligue o RLS na mesma migração** e escreva uma política por operação:
   ```sql
   alter table public.metas enable row level security;

   create policy "dono lê as próprias metas" on public.metas
     for select using ((select auth.uid()) = usuario_id);
   create policy "dono cria a própria meta" on public.metas
     for insert with check ((select auth.uid()) = usuario_id);
   ```
4. Índice em toda coluna usada em `where` de política ou de consulta frequente (`usuario_id`, quase sempre).
5. Dado de exemplo em `supabase/seed.sql`, sempre sintético.
6. Rode `npx supabase db reset`, confira no painel local e gere os tipos (skill `supabase`).
7. Se a tabela guarda dado pessoal, registre no inventário de `docs/07-conformidade/dados-e-privacidade.md`.

## Regras

- Tabela **sem RLS não existe**. Com RLS ligado e sem política, ninguém lê, e isso é o padrão seguro: o erro aparece logo, e não em produção.
- Nomes em português, `snake_case`, tabela no plural (`metas`, `contatos_apoio`), chave estrangeira `<tabela_no_singular>_id`.
- Data e hora sempre `timestamptz`. Dinheiro, se aparecer, é `numeric(12,2)` e **nunca** representa aposta, prêmio ou valor real em jogo (Seção 8.4).
- `jsonb` vale quando o formato ainda está mudando. Quando estabilizar, vira coluna.
- `auth.uid()` dentro de `(select …)` na política: o Postgres calcula uma vez por consulta, não uma vez por linha.
- Função com `security definer` só com motivo escrito em comentário, porque ela ignora o RLS de quem chama.
