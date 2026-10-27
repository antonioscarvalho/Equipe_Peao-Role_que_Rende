---
name: arquiteto-de-software
description: Decide e revisa a estrutura do backend (backend/): onde cada código mora, Repository pattern, Retry pattern, limites da função serverless na Vercel. Use ao criar rota, serviço, repositório ou integração externa no backend, e ao revisar PR que mexe nele.
---

# Arquiteto de software (backend)

Stack: Node 20, TypeScript strict, Fastify, publicado como função na Vercel. Leia `backend/README.md` antes de começar.

> **O backend inicial do projeto é o Supabase.** Este backend é o "customizado futuro" e só recebe código depois que a skill `backend-customizado` disser que a regra não cabe no Supabase. Motivação em `docs/04-tecnico/stack-e-motivacao.md`.

## Passos

1. Diga em uma frase qual recurso está sendo criado e de que tela do frontend ele vem. Recurso sem tela que o use não entra no MVP (ver `docs/02-produto/escopo-e-backlog.md`).
2. Coloque cada peça na sua camada:
   - `src/routes/<recurso>.ts`: só HTTP. Valida a entrada com `zod`, chama o serviço e devolve a resposta. Sem regra de negócio.
   - `src/services/<recurso>.service.ts`: a regra. Recebe o repositório pelo construtor.
   - `src/repositories/`: implementa `Repository<T>`. Serviço e rota nunca importam uma implementação concreta, só a interface.
3. Toda chamada para fora do processo (API externa, banco, IA) passa por `comRetry()` de `src/shared/retry.ts`, com `deveRepetir` recusando erro 4xx e de validação.
4. Registre a integração em `docs/04-tecnico/integracoes-externas.md` e a biblioteca nova em `docs/07-conformidade/licencas-e-assets.md` (skill `registrar-asset`).
5. Escreva o teste ao lado do arquivo (`*.test.ts`). Rota se testa com `app.inject()`, sem subir servidor.
6. Rode `npm run typecheck && npm test && npm run build` dentro de `backend/`.

## Regras da Vercel

- A função não guarda estado entre chamadas: nada de variável global com dado do usuário, arquivo em disco ou fila em memória.
- Instância fria leva tempo para subir. Mantenha as dependências enxutas e não faça trabalho pesado no carregamento do módulo.
- Segredo só em variável de ambiente do projeto na Vercel e em `.env.example` sem o valor.

## Regras do edital

- Dados sempre sintéticos. Nenhum dado pessoal real sai do dispositivo sem necessidade (`docs/07-conformidade/dados-e-privacidade.md`).
- Nada que integre com plataforma de apostas nem que lide com dinheiro real (Seção 8.4).
