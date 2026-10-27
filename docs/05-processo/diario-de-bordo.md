# Diário de bordo

> Registro cronológico de decisões, mentorias e mudanças de rumo. Útil para o pitch e para provar que tudo foi feito durante o Game Jam (Seção 8.1).

## Modelo de entrada

```
### aaaa-mm-dd hh:mm — título
**Quem:** …
**O que aconteceu / foi decidido:** …
**Por quê:** …
**Próximos passos:** …
```

---

## Dia 1 — 27/10/2026

### 2026-10-27 — Repositório e documentação iniciais
**Quem:** Antonio Carvalho (com apoio de IA, ver declaração)
**O que aconteceu:** criação do repositório, da branch `development`, do README e da estrutura de documentação em `docs/`.
**Por quê:** organizar o trabalho e cumprir as exigências de entrega do edital desde o início.
**Próximos passos:** definir ideia, integrantes e papéis.

### 2026-10-27 — Stack definida
**Quem:** equipe; documentado por Danillo Meira (com apoio de IA, ver declaração)
**O que aconteceu / foi decidido:** web em React + Vite + TypeScript (PWA), mobile em React Native com Expo, backend inicial no Supabase sobre PostgreSQL, deploy do web na Vercel. Backend customizado em Fastify ou Go só se uma regra não couber no Supabase.
**Por quê:** cabe nas 44 horas, deixa os seis perfis verem o trabalho no ar e é o que o mercado mais pede. Detalhes em `docs/04-tecnico/stack-e-motivacao.md`.
**Próximos passos:** criar `web/` e ligar o deploy na Vercel; criar o projeto no Supabase (região São Paulo).

### 2026-10-27 — Guia de estilo e skills de terceiros
**Quem:** Maykon Júnio (com apoio de IA, ver declaração)
**O que aconteceu:** guia de estilo extraído do site e do Manual de Identidade Visual do Rolê que Rende (skill `guia-estilo-role-que-rende`); 17 skills de terceiros instaladas (MIT/Apache) e teste de chamada automática das 40 skills do projeto.
**Por quê:** uma fonte única para o visual do web e do mobile; ferramentas de revisão, mercado e pitch para os três dias.
**Próximos passos:** alinhar o guia com o design ético (modo calmo).

### 2026-10-27 — MVP do Guardião implementado (offline-first)
**Quem:** Maykon Júnio (com apoio de IA, ver declaração)
**O que aconteceu / foi decidido:** `web/` criado com as 10 funcionalidades do MVP da matriz (SOS, onboarding, plano, registro, contador, Guardião, bloqueio, Círculo de Confiança, hub de apoio e crise), 26 testes e PWA offline. O MVP **não usa Supabase**: os dados ficam só no aparelho, atrás de um repositório que permite trocar depois. Spec, plano e tarefas em `specs/001-mvp-guardiao/`, como rascunho. Guia de estilo ganhou o "modo calmo". Personas, jornada, backlog, papéis, métricas e roteiro do pitch preenchidos como **proposta**.
**Por quê:** o marco de 28/10 às 12h pedia o fluxo principal de ponta a ponta; a pesquisa e as skills de ética e crise pedem uso sem cadastro e SOS e crise funcionando sem internet.
**Desvio do fluxo SDD:** a spec foi escrita junto com o código, a pedido, para ganhar tempo. Ela precisa da aprovação de Produto e Gestão.
**Próximos passos:** aprovar a spec 001 e o backlog; revisão clínica dos textos em `web/src/content/`; deploy na Vercel; teste com leitor de tela; vídeo da demo.

## Dia 2 — 28/10/2026

_—_

## Dia 3 — 29/10/2026

_—_

---

## Mentorias

| Data/hora | Mentor(a) | Principais sugestões | O que aplicamos |
|---|---|---|---|
| _—_ | _—_ | _—_ | _—_ |
