# Setup e execução

> Qualquer integrante (ou a Banca) deve conseguir rodar o protótipo seguindo só este documento.

## Pré-requisitos

- Node 20.19 ou mais novo (testado com Node 24)
- Navegador Chrome, Edge ou Firefox
- Não precisa de Docker, Supabase nem chave de API: o MVP é offline-first e guarda os dados só no aparelho
- Stack e motivação em [stack e motivação](stack-e-motivacao.md)

## Instalação

```bash
git clone https://github.com/antonioscarvalho/equipepeao.git
cd equipepeao/web
npm install
```

## Variáveis de ambiente

O MVP não usa nenhuma. O `web/.env.example` só documenta as chaves públicas do Supabase para quando ele entrar (ver [integrações externas](integracoes-externas.md)).

## Rodar em desenvolvimento

```bash
cd web
npm run dev          # http://localhost:5173
```

Para a demo com dados sintéticos, abra **http://localhost:5173/?demo**. Isso substitui os dados do navegador por uma jornada fictícia de 12 dias.

## Testes e build

```bash
cd web
npm run check        # typecheck + testes (Vitest) + build
npm run build        # gera web/dist (PWA com service worker)
npm run preview      # serve o dist em http://localhost:4173
```

## Deploy (Vercel)

Projeto ligado ao GitHub com **Root Directory = `web`**, framework Vite, comando `npm run build`, saída `dist`. O `web/vercel.json` reescreve as rotas para o `index.html` (SPA). Detalhes na skill `deploy-vercel`.

## Demo offline (plano B)

A internet do evento pode falhar. Antes da etapa eliminatória:

- [ ] Build local testada **sem internet** (`npm run build && npm run preview`, abrir uma vez com internet para o service worker guardar tudo, desligar a rede e recarregar)
- [ ] Vídeo da demo gravado (o edital permite demonstração em vídeo), seguindo o roteiro da [jornada do usuário](../02-produto/jornada-do-usuario.md#roteiro-da-demo-pitch)
- [ ] Build e vídeo em pelo menos dois notebooks da equipe

## Problemas conhecidos

| Problema | Solução |
|---|---|
| `npm install` lento na rede do evento | Rodar antes e levar `web/node_modules` no notebook; ou usar a build pronta em `web/dist` com `npm run preview` |
| A tela abre no onboarding mesmo depois da demo | Os dados ficam por navegador; abra de novo com `?demo` |
| Mudança no código não aparece no `preview` | O service worker guarda a versão anterior: recarregue duas vezes ou use aba anônima |
| `git push` por HTTPS falha em alguma máquina | Usar SSH: `git push git@github.com:antonioscarvalho/equipepeao.git <branch>` |
