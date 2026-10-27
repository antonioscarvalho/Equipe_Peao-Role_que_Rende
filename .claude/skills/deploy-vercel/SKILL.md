---
name: deploy-vercel
description: Como publicar o web (web/) na Vercel: projeto ligado ao GitHub, Root Directory, variáveis de ambiente por ambiente, pré-visualização por PR, rota de SPA e conferência pós-deploy. Use ao configurar ou mudar o deploy, quando um deploy falhar, ao acrescentar variável de ambiente e antes da demo.
---

# Deploy na Vercel

Motivação em `docs/04-tecnico/stack-e-motivacao.md`.

## Como está ligado

- Um projeto na Vercel por app publicado. O web usa **Root Directory = `web`** e o preset **Vite** (build `npm run build`, saída `dist`).
- Branch de produção: `main`. Todo push em outra branch e todo PR ganham uma **URL de pré-visualização** própria, que vai no PR para quem revisa.
- O backend customizado, se nascer (`backend/`), é outro projeto, com Root Directory `backend`.

## Passos

1. Mudou rota no web? Confira se `web/vercel.json` manda tudo para o `index.html`, senão recarregar a página numa rota interna dá 404:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
2. Variável nova: ponha o nome em `web/.env.example` e o valor em Vercel › Project › Settings › Environment Variables, marcando **Production** e **Preview**. Variável do Vite só chega ao build com prefixo `VITE_`, e só entra no **próximo** deploy.
3. Rode `npm run build` dentro de `web/` antes do push. Se falha local, falha na Vercel.
4. Depois do deploy, abra a URL, recarregue numa rota interna e faça o fluxo principal uma vez (login, uma leitura e uma escrita no Supabase).
5. Se o Supabase recusar o login na URL nova, acrescente a URL em Supabase › Authentication › URL Configuration (Redirect URLs). A de pré-visualização entra como curinga: `https://*-<time>.vercel.app/**`.

## Antes da demo

- Faça o deploy de produção até 29/10, 10h30, e não faça outro até a apresentação.
- Gere o build local (`npm run build`), confira com `npm run preview` **sem internet** e copie `web/dist` para dois notebooks (plano B de `docs/04-tecnico/setup-e-execucao.md`).

## Regras

- Nunca ponha `service_role` do Supabase em variável do web: ela iria para o bundle público.
- O plano Hobby é de uso pessoal e não comercial. Serve para o protótipo; se o projeto seguir depois do evento, a equipe revê.
