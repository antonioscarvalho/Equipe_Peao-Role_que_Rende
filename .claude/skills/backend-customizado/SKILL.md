---
name: backend-customizado
description: Quando e como criar um backend próprio (backend/) em Fastify ou Go, além do Supabase: critério de entrada, escolha entre os dois, Repository e Retry pattern, segredo e deploy. Use quando alguém propuser um servidor, API ou serviço próprio, ou quando uma regra de negócio parecer não caber no Supabase.
---

# Backend customizado: Fastify ou Go

O Supabase cobre o MVP. Backend próprio é um deploy a mais e um ponto a mais para falhar na demo, então ele só nasce com motivo. Motivação completa em `docs/04-tecnico/stack-e-motivacao.md`.

## 1. Precisa mesmo?

Responda na ordem e pare no primeiro sim:

1. Uma **política RLS** ou uma **função SQL** resolve? (regra de acesso, cálculo sobre o próprio dado)
2. Uma **Edge Function** do Supabase resolve? (segredo, chamada a API externa, webhook)
3. O cálculo pode rodar no aparelho, em `shared/`?

Só com três "não" o backend entra. Registre a decisão em "Decisões técnicas" de `docs/04-tecnico/arquitetura.md`.

## 2. Fastify ou Go

| Use Fastify quando | Use Go quando |
|---|---|
| a regra precisa dos mesmos tipos de `shared/` | o motivo é desempenho, concorrência ou lote pesado |
| quem vai manter é a equipe de front | o serviço precisa ser um binário pequeno e frio rápido |
| é integração com API externa | há muitas conexões simultâneas (fila, tempo real) |

Na dúvida, Fastify: mesma linguagem, sem contexto novo para ninguém. O esqueleto pronto está na branch `feat/backend` (Fastify + TypeScript, publicado como função na Vercel).

## 3. Como estruturar

- **Repository pattern:** rota e serviço dependem de uma interface (`Repository<T>`), nunca da implementação. O repositório que fala com o Postgres do Supabase é uma implementação; a de memória serve ao teste.
- **Retry pattern:** toda chamada para fora do processo passa por `comRetry()` (espera exponencial com jitter), repetindo só falha de rede e 5xx.
- Camadas: rota (só HTTP, valida a entrada) → serviço (regra) → repositório (dado).
- Em Go, o mesmo desenho: `handler` → `service` → `repository` (interface), `context.Context` em toda chamada, e o retry com `time.Sleep` e limite de tentativas.

## Regras

- O backend fala com o Supabase com a `service_role`, guardada só nas variáveis do projeto na Vercel. Como ela ignora o RLS, **a checagem de quem pode o quê passa a ser do backend**: confira o JWT do usuário (`Authorization: Bearer`) antes de qualquer leitura.
- Função na Vercel não guarda estado entre chamadas: nada de dado do usuário em memória.
- Biblioteca nova vai para `docs/07-conformidade/licencas-e-assets.md`; API externa, para `docs/04-tecnico/integracoes-externas.md`.
