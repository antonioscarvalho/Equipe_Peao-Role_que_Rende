---
name: web-react-vite
description: Como escrever o frontend web em web/ com React + Vite + TypeScript: estrutura de pastas, componente, estado, acesso ao Supabase, variável de ambiente, teste e build. Use ao criar ou alterar tela, componente, hook ou rota do app web, e ao rodar ou buildar o web.
---

# Web: React + Vite + TypeScript

Motivação da escolha em `docs/04-tecnico/stack-e-motivacao.md`. Antes de criar componente visual, leia também a skill `ui-ux-designer`.

## Estrutura

```
web/
├── index.html
├── vite.config.ts
├── .env.example          # só VITE_*, sem valor
└── src/
    ├── main.tsx          # monta o React e o roteador
    ├── app/              # telas, uma pasta por tela (rota)
    ├── components/       # peças reutilizáveis (Botao, Cartao, CampoTexto…)
    ├── hooks/            # useAlgumaCoisa: estado e efeito reaproveitáveis
    ├── lib/supabase.ts   # cliente único do Supabase
    └── theme/            # tokens de cor, espaço, fonte
shared/                   # tipos, repositórios e validação usados por web e mobile
```

## Passos

1. Ache a tela na spec (`specs/NNN-*/spec.md`). Tela sem spec aprovada não se escreve.
2. Procure em `web/src/components/` a peça antes de criar uma. Se não existir e for genérica, ela nasce lá, não dentro da tela.
3. A tela só compõe: busca o dado por um hook (`useMetas()`), que chama um repositório de `shared/`, que chama o Supabase. A tela nunca importa `supabase` direto.
4. Estado local com `useState`/`useReducer`. Dado do servidor no hook, com os três estados: carregando, erro, pronto. Sem biblioteca de estado global até a spec pedir.
5. Rode `npm run typecheck && npm test && npm run build` dentro de `web/`.

## Regras

- TypeScript `strict`. Nada de `any`; o tipo do dado vem de `shared/types/database.ts`, gerado pelo Supabase (skill `supabase`).
- Componente é função, um por arquivo, nome em PascalCase, props tipadas com `interface`.
- Variável de ambiente no cliente **precisa** do prefixo `VITE_` e vai no bundle público: só URL e chave anon do Supabase. Chave de serviço nunca entra aqui.
- Import com alias `@/` (configurado no `vite.config.ts` e no `tsconfig.json`), sem `../../`.
- Imagem e som em `web/public/` ou `web/src/assets/`, registrados com `/registrar-asset`.
- O build tem que rodar **sem internet** depois de pronto (plano B): nada de fonte ou script carregado de CDN em tempo de execução.
- Texto de tela segue `docs/03-design/conteudo-e-tom-de-voz.md`; acessibilidade, `docs/03-design/acessibilidade.md`.

## Comandos

```bash
cd web
npm run dev        # http://localhost:5173
npm run build      # gera web/dist
npm run preview    # serve o dist, para conferir o build
```
