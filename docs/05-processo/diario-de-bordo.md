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

### 2026-10-27 — Pesquisa, MVP e privacidade (Fases 1 a 3)
**Quem:** Antonio Carvalho (com apoio de IA, ver declaração)
**O que aconteceu / foi decidido:** pesquisa baseada em evidências (`docs/pesquisa/`); descoberta da MP 1.394/2026, que proibiu as bets em 25/09/2026; matriz conceito → funcionalidade e MVP de 10 itens; dados pessoais e de saúde só no aparelho, Supabase só para conteúdo público e demo sintética; fluxos e microcopy.
**Por quê:** dado de saúde é sensível (LGPD); offline e sem cadastro combina com o público (Android de entrada, internet instável) e reduz risco na demo.
**Próximos passos:** a equipe validar os ajustes à visão do produto (Open Finance como demo sintética, uso da marca); revisão clínica dos textos 🩺; Fase 4 (implementação).

### 2026-10-27 — Revisão das specs 001–006
**Quem:** Maykon Júnio (com apoio de IA, ver declaração)
**O que aconteceu / foi decidido:** revisão de todas as specs contra o edital, as skills obrigatórias, a matriz e os fluxos. Specs 002–006 corrigidas e marcadas para **reaprovação**; criadas a **007** (Open Finance só com dados sintéticos; primeiro Could, depois elevada a **Must** por Maykon por ser diferencial do produto, responsável a definir) e a **008** (configurações, privacidade e acessibilidade, Must, responsável Maykon). Decisões de Maykon: persona principal **Marcos**; contador mostra o **total desde o início** (o mês vira detalhe); Open Finance sai da 004. Issues #4, #5, #7, #8 e #9 renumeradas; #15 e #16 criadas.
**Por quê:** a 004 tinha Open Finance com marca BB como Must; o fluxo F10 (privacidade e acessibilidade, que valem bônus) não tinha spec; havia afirmações clínicas sem fonte e critérios que não dava para testar.
**Próximos passos:** reaprovar 002–006 e aprovar 007 e 008; definir o responsável da 007; responder as dúvidas abertas (link de CAPS, autoexclusão, revisão clínica, PIN com criptografia).

## Dia 2 — 28/10/2026

### 2026-10-28 — Skills de gamificação e auditoria
**Quem:** Maykon Júnio (com apoio de IA, ver declaração)
**O que aconteceu:** skills `gamificacao-etica` e `pitch-gamificacao` criadas a partir de 7 livros (Werbach, Chou, Kim, Schell, Adams, McGonigal, Burke) e auditoria de todo o projeto ([auditoria](../03-design/auditoria-gamificacao.md)): o app oficial está de acordo; a prova visual e as skills `animar-componente` e `criar-personagem` usam moeda girando e "+R$" por missão (🔴); o SOS sorteia o card e o PR #20 não anuncia o próximo marco (🟡).
**Próximos passos:** corrigir os 🔴 antes de reaproveitar a prova visual; ajustar o PR #20; preencher o game design com os 6D.

_—_

## Dia 3 — 29/10/2026

_—_

---

## Mentorias

| Data/hora | Mentor(a) | Principais sugestões | O que aplicamos |
|---|---|---|---|
| _—_ | _—_ | _—_ | _—_ |
