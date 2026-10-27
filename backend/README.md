# Backend: Rolê que Rende

API em **Node 20 + TypeScript + Fastify**, publicada na **Vercel** como função serverless.

## Rodar

```bash
cd backend
npm install
cp .env.example .env
npm run dev        # http://localhost:3333/api/saude
npm test
npm run build
```

## Estrutura

```
backend/
├── api/index.ts            # entrada da Vercel: entrega a requisição ao Fastify
├── vercel.json             # manda /api/* para essa função
└── src/
    ├── app.ts              # monta o Fastify (CORS e rotas); usado pela Vercel e pelo server.ts
    ├── server.ts           # servidor local (npm run dev)
    ├── routes/             # uma pasta ou arquivo por recurso
    ├── repositories/       # Repository pattern: interface + implementações
    └── shared/retry.ts     # Retry pattern com espera exponencial e jitter
```

## Patterns

- **Repository**: rota e serviço dependem de `Repository<T>`, nunca da implementação. Hoje existe só `MemoriaRepository`. Trocar por um banco é criar outra classe que implementa a mesma interface.
- **Retry**: toda chamada a serviço externo passa por `comRetry()`. Use `deveRepetir` para não repetir erro que não muda na segunda tentativa (validação, 4xx).

## Deploy na Vercel

Na Vercel, crie um projeto a partir deste repositório com **Root Directory = `backend`** e Framework Preset **Other**. Não precisa de comando de build: a Vercel compila `api/index.ts` sozinha.

Variáveis de ambiente do projeto:

| Variável | Valor |
|---|---|
| `CORS_ORIGIN` | URL do frontend na Vercel (ex.: `https://role-que-rende.vercel.app`) |

Depois do deploy, `https://<projeto>.vercel.app/api/saude` responde `{"status":"ok"}`.

> A memória de uma função na Vercel não dura: cada instância tem a sua e ela é reciclada. `MemoriaRepository` serve para demo, não para guardar dado.
