# Stack e motivação

> Por que escolhemos cada tecnologia, o que ela resolve no Game Jam e o que ela vale para cada integrante depois dele. Decidido em 27/10/2026. Toda mudança entra em [arquitetura](arquitetura.md) como decisão técnica e no [diário de bordo](../05-processo/diario-de-bordo.md).

## Resumo

| Camada | Tecnologia | Licença | Papel no projeto |
|---|---|---|---|
| Linguagem | TypeScript | Apache 2.0 | Uma linguagem só, do banco à tela |
| Frontend web | React + Vite | MIT / MIT | O protótipo que a Banca abre no navegador |
| Mobile | React Native com Expo | MIT / MIT | O mesmo produto no celular, sem Xcode nem Android Studio |
| Backend inicial | Supabase | Apache 2.0 | Autenticação, API, armazenamento de arquivo e tempo real prontos |
| Banco de dados | PostgreSQL | PostgreSQL License (estilo MIT) | Onde o dado mora, com permissão por linha |
| Deploy web | Vercel | serviço (plano Hobby) | Cada push vira um endereço público |
| Backend customizado (futuro) | Fastify ou Go | MIT / BSD-3 | Só se uma regra de negócio não couber no Supabase |

Tudo é open source, menos a Vercel, que é serviço de hospedagem e pode ser trocada por equivalente (Netlify, Cloudflare Pages) sem mexer no código, porque o build do Vite gera arquivos estáticos. O edital prefere open source (Seção 8), e o Supabase também é: dá para rodar o mesmo backend na nossa máquina, com `supabase start`.

## O critério da escolha

Escolhemos a stack por três perguntas, nesta ordem:

1. **Cabe em 44 horas?** O desenvolvimento vai de 27/10, às 15h30, até 29/10, às 11h. Cada hora gasta configurando servidor, login ou pipeline de deploy é uma hora a menos no que a Banca avalia: o problema resolvido para a pessoa que quer parar de apostar.
2. **Seis pessoas conseguem trabalhar juntas?** A equipe tem perfis diferentes (dois de desenvolvimento, game design, arte e som, narrativa, produto). A stack precisa deixar quem não é dev ver o próprio trabalho no ar logo, e deixar os dois devs trabalharem em paralelo sem pisar um no outro.
3. **Vale depois do evento?** Quem passou três dias numa stack tem que sair dela com algo que o mercado pede. Por isso medimos a demanda em pesquisa pública, citada abaixo, e não pela impressão de quem escolheu.

## O que o produto pede da stack

A [visão do produto](../02-produto/visao-do-produto.md) define três coisas que pesam direto na escolha técnica:

| O produto pede | A stack responde com |
|---|---|
| **Web responsivo / PWA, mobile-first**, para Android de entrada (77,5% dos apostadores usam Android, metade com sistema anterior a 2023) | React + Vite, que gera um site estático leve, instalável como PWA, sem download de loja. É o entregável principal e o que a Banca abre. |
| Presença no celular no momento da fissura | Expo, para quando o PWA não bastar (notificação nativa confiável, widget). Fica em segundo plano no Game Jam. |
| **Open Finance pela Pluggy** (sandbox ou mock), com o **modo manual** como alternativa | A chave da Pluggy é segredo e não pode ir para o navegador: a chamada mora numa Edge Function do Supabase. Se ela precisar de fila, repetição longa ou processamento em lote, é o primeiro caso real de backend customizado. |

## Os números de mercado

As porcentagens abaixo são da **Stack Overflow Developer Survey 2025**, a maior pesquisa anual com pessoas desenvolvedoras, e respondem a "com que tecnologia você trabalhou extensivamente no último ano" (todos os respondentes). Os dados de satisfação são do **State of JavaScript 2025**.

| Tecnologia | Uso (Stack Overflow 2025) | Posição |
|---|---|---|
| JavaScript | 66% | linguagem mais usada |
| TypeScript | 43,6% | 4ª linguagem mais usada |
| Node.js | 48,7% | tecnologia web mais usada |
| React | 44,7% | framework web mais usado; o 2º colocado (jQuery) tem 23,4% |
| PostgreSQL | 55,6% | banco de dados mais usado; o 2º (MySQL) tem 40,5% |
| Vite | 25,4% | ferramenta de build de front mais usada, à frente do Webpack (18,4%) |
| Vercel | 10,6% | entre as plataformas feitas para front-end, à frente de Netlify (5,9%) e Heroku (5,4%) |
| Supabase | 6% como banco, 5,4% como plataforma | já à frente do Cloud Firestore, do Google (5,7%) |
| Go | 16,4% | à frente de Rust (14,8%) |
| Fastify | 2,9% | nicho, mas é o framework Node feito para desempenho |

No **State of JavaScript 2025**, o Vite aparece com **84% de uso** entre as ferramentas de build e **98% de satisfação** (quem usou e usaria de novo), contra 26% do Webpack, que ele vem substituindo.

O que esses números dizem para a equipe: **React, TypeScript e PostgreSQL são o centro do mercado**, não aposta. Vite e Supabase são a parte que cresce, e é onde está a vantagem de quem já chega sabendo.

> Fontes completas em [fontes e referências](../07-conformidade/fontes-e-referencias.md#mercado-de-tecnologia-motivação-da-stack).

---

## TypeScript

**O que é:** JavaScript com tipos. O código vira JavaScript comum na hora do build.

**Por que no Game Jam:**
- Uma linguagem só para web, mobile, banco e funções. Os dois devs trocam de camada sem trocar de cabeça.
- O tipo do dado nasce do banco: o Supabase gera os tipos TypeScript a partir das tabelas (`supabase gen types`). Se alguém muda uma coluna, o erro aparece no editor de quem usa, e não na frente da Banca.
- **É o que torna os agentes de IA confiáveis aqui.** O agente erra menos quando o tipo diz o que cada função recebe e devolve, e o compilador pega o que ele inventou antes de chegar ao navegador. Como a equipe trabalha com SDD e agentes (ver [`.claude/README.md`](../../.claude/README.md)), isso conta mais do que conta num projeto comum.

**Mercado:** 4ª linguagem mais usada no mundo (43,6%) e o padrão de fato em vaga de front-end React. Quem sabe JavaScript e não sabe TypeScript hoje tem metade do currículo que a vaga pede.

## Frontend web: React + Vite

**O que é:** React é a biblioteca de interface por componentes, da Meta. Vite é a ferramenta que roda o projeto em desenvolvimento e gera o build.

**Por que React:**
- **Componente é a unidade de reuso.** Um `Botao`, um `Cartao`, um `CampoTexto` escritos uma vez servem a todas as telas. Isso responde direto ao que o quadro da equipe pediu, "alta reutilização de componentes para facilitar os agentes de IA": o agente que compõe peças que já existem erra muito menos do que o que escreve tela do zero, e a tela sai com cara de produto, não de colcha.
- É o que o React Native usa também (ver abaixo). A mesma forma de pensar vale nas duas plataformas.
- Tem o maior ecossistema que existe: para quase todo problema já há uma biblioteca madura e um exemplo.

**Por que Vite, e não Next.js:**
- O protótipo é uma aplicação que roda no navegador, não um site que precisa de SEO ou renderização no servidor. O Next.js resolve problemas que não temos e cobra em configuração, em conceitos (Server Components, cache) e em tempo de build.
- O Vite sobe o servidor de desenvolvimento em menos de um segundo e atualiza a tela a cada salvamento sem perder o estado. Em 44 horas, isso soma.
- O build gera **arquivos estáticos**. Isso é o que permite a demo offline exigida pelo nosso plano B ([setup](setup-e-execucao.md#demo-offline-plano-b)): a pasta `dist/` roda em qualquer notebook, sem internet e sem servidor.
- Satisfação de 98% no State of JS 2025. É difícil achar outra ferramenta com esse número.

**Para o Android de entrada:** o build do Vite divide o código por tela e só baixa o que a tela usa. Com `vite-plugin-pwa`, o site vira app instalável que abre sem rede, o que importa para quem tem plano de dados curto.

**Mercado:** React é o framework web mais usado do mundo (44,7%), quase o dobro do segundo. Vite já passou o Webpack na Stack Overflow 2025 (25,4% contra 18,4%), é o padrão atual para React sem framework e é a base de outras ferramentas (Vitest, Astro, SvelteKit, Nuxt). Saber Vite é saber o motor de metade do ecossistema de front moderno.

## Mobile: React Native com Expo

**O que é:** React Native transforma componentes React em tela nativa de Android e iOS. Expo é o framework em volta dele.

**Por que React Native:**
- O quadro da equipe já apontava: flexibilidade entre navegador e celular. O público do desafio (pessoa que aposta pelo celular, muitas vezes de madrugada, no momento da vontade) vive no celular. Um recurso de "enfrentar a vontade de jogar" que só existe no navegador chega tarde.
- Quem escreve React para a web escreve React Native no dia seguinte: mesmos componentes, mesmos hooks, mesmo TypeScript. Muda o elemento (`View` em vez de `div`) e o estilo (objeto em vez de CSS).
- A lógica que não é tela (tipos, consultas ao Supabase, validação, cálculo do orçamento) é **a mesma** nos dois apps. Ela mora numa pasta compartilhada e é escrita uma vez.

**Por que Expo:**
- **É o caminho que o próprio React Native recomenda.** A documentação oficial diz que "a maioria das pessoas se beneficia de usar um framework de React Native como o Expo" e recomenda um framework para todo app novo.
- Roda no celular de qualquer integrante pelo app Expo Go, lendo um QR code. Arte, som e narrativa conferem o trabalho no aparelho de verdade, sem instalar Android Studio nem ter um Mac.
- Gera build de loja na nuvem (EAS) quando for a hora, sem máquina especial.

**Mercado:** React Native é a forma de entrar em mobile para quem já é dev React, e as vagas de "React/React Native" juntas formam um perfil muito procurado: uma pessoa que entrega web e app. Expo é o padrão atual de projeto React Native novo.

## Backend inicial: Supabase

**O que é:** uma plataforma open source montada em volta de um PostgreSQL: autenticação, API gerada a partir das tabelas, armazenamento de arquivos, tempo real e funções (Edge Functions), com painel web.

**Por que Supabase, e não escrever um backend:**
- **Ele elimina o backend que a gente teria que escrever no primeiro dia.** Login com e-mail ou link mágico, API de leitura e escrita, controle de quem vê o quê, upload de imagem: tudo pronto. As horas vão para o produto.
- **A permissão mora no banco**, com Row Level Security (RLS) do PostgreSQL: uma regra como "cada pessoa só lê o próprio diário" é uma política na tabela, e vale para web, mobile e qualquer outro cliente, sem que alguém possa esquecer de checar numa rota.
- Tem SDK para TypeScript que funciona igual no Vite e no Expo.
- **É open source (Apache 2.0) e roda local** com `supabase start`. Isso conversa com a preferência do edital por open source e dá um plano B: se a internet do evento cair, o backend roda no notebook.
- Por baixo é **PostgreSQL de verdade**, não um banco proprietário. Se um dia precisarmos sair do Supabase, levamos o banco inteiro, com tabelas, políticas e funções, para qualquer PostgreSQL.

**O cuidado com dado sensível.** A nossa regra é "local primeiro, sem servidor com dado pessoal" ([dados e privacidade](../07-conformidade/dados-e-privacidade.md)), e o tema (apostas, dívidas, saúde mental) é sensível. Ter um backend não muda essa regra, muda como a cumprimos:
- na demo, **todo dado é sintético**;
- só vai para o Supabase o que precisa sair do aparelho (por exemplo, a rede de apoio, que é compartilhada entre pessoas). O que é só da pessoa pode ficar no dispositivo;
- toda tabela nasce com RLS ligado, e nenhuma é lida pela chave de serviço no cliente;
- o projeto fica na região de São Paulo (`sa-east-1`), para o dado não sair do país.

**Mercado:** Supabase aparece na pesquisa da Stack Overflow 2025 com 6% como banco, à frente do Cloud Firestore do Google (5,7%), que é a alternativa mais conhecida. Também é o backend que ferramentas de criar app com IA, como o Lovable, ligam por padrão. Saber Supabase é, na prática, saber PostgreSQL com autenticação e permissão bem feitas, e isso não se perde se a plataforma mudar.

## Banco de dados: PostgreSQL

**O que é:** o banco relacional open source mais completo que existe, nascido como projeto da Universidade da Califórnia em Berkeley em 1986.

**Por que:**
- Vem com o Supabase, então não é uma escolha a mais, é a consequência da escolha anterior. Mas é uma consequência boa: relacional, com chave estrangeira, transação e restrição, o dado fica consistente sem código extra.
- **Row Level Security** é o que deixa o Supabase ser seguro sem backend próprio.
- Guarda JSON (`jsonb`) quando o formato ainda não está decidido, o que é a regra num Game Jam, e dá para virar coluna de verdade depois.
- As mudanças de estrutura viram arquivos de migração em `supabase/migrations/`, versionados no Git. Qualquer integrante recria o banco do zero com um comando.

**Mercado:** é o **banco mais usado do mundo** na pesquisa da Stack Overflow 2025 (55,6%), 15 pontos à frente do MySQL. SQL e PostgreSQL aparecem em vaga de back-end, de dados e de full-stack. De tudo nesta stack, é o conhecimento que dura mais.

## Deploy web: Vercel

**O que é:** plataforma de hospedagem para front-end, ligada ao GitHub.

**Por que:**
- **Cada push vira um endereço público.** Cada PR ganha uma URL de pré-visualização própria. Quem não é dev revisa a tela pelo link, no celular, sem rodar nada.
- Detecta Vite sozinha: `npm run build`, pasta `dist`, pronto. Zero configuração de servidor.
- HTTPS e CDN incluídos, e o plano gratuito basta para o protótipo.
- É trocável: como o build é estático, Netlify ou Cloudflare Pages publicam a mesma pasta sem mudar uma linha.

**Os limites que conhecemos:**
- O plano Hobby é para uso pessoal e não comercial, o que serve para um protótipo de competição. Se o projeto seguir depois do evento, revemos.
- O Expo para celular não é publicado na Vercel. O app roda pelo Expo Go durante o evento e, se precisar, a versão web do Expo também é estática e pode ir para lá.

**Mercado:** entre as plataformas feitas só para front-end, é a mais usada da pesquisa (10,6%, contra 5,9% da Netlify), atrás apenas de nuvens mais amplas como Cloudflare (20,1%) e Firebase (13,1%). É também a casa do Next.js. O conceito que ela ensina (deploy por push, ambiente de pré-visualização por PR) é o padrão de qualquer time moderno, use ele a Vercel ou não.

## Backend customizado (futuro): Fastify ou Go

**Quando entra:** **só** quando uma regra de negócio não couber no Supabase. O candidato mais provável aqui é o Open Finance: sincronizar as transações da Pluggy, detectar os dias sem pagamento para intermediadora de aposta e alimentar o Cofre do Dinheiro Resgatado. Outros exemplos são um cálculo pesado que não deve rodar no celular ou um processamento agendado. Antes de abrir um serviço novo, a pergunta é se uma Edge Function do Supabase ou uma função no banco resolvem, porque elas não pedem hospedagem nova.

**Fastify (Node + TypeScript):** primeira opção, porque mantém a linguagem do resto do projeto e reaproveita os tipos. É um dos frameworks Node mais rápidos, com validação de entrada por esquema. Já existe um esqueleto pronto na branch `feat/backend`, com Repository pattern, Retry pattern e publicação como função na Vercel.

**Go:** quando o motivo for desempenho ou concorrência (muitas conexões, processamento em lote). Compila para um binário só, sobe em milissegundos e gasta pouca memória. Usado em 16,4% dos projetos da pesquisa, à frente de Rust, e é a linguagem de boa parte da infraestrutura de nuvem (Docker, Kubernetes).

**Por que deixar para depois:** um serviço a mais é um deploy a mais, um lugar a mais para falhar durante a demo e horas que saem do produto. O Supabase cobre o MVP. Os patterns que o quadro da equipe pediu (Repository e Retry) valem desde já na camada de dado do front, e o backend customizado herda os mesmos nomes quando nascer.

---

## Como as peças se ligam

```
┌──────────────┐   ┌──────────────┐
│ web/         │   │ mobile/      │
│ React + Vite │   │ Expo (RN)    │
└──────┬───────┘   └──────┬───────┘
       │   shared/ (tipos, repositórios, validação)
       └─────────┬────────┘
                 │ supabase-js, com retry
        ┌────────▼─────────┐        ┌───────────────────────┐
        │ Supabase         │ ─────► │ backend/ (futuro)     │
        │ Auth · API · RLS │        │ Fastify ou Go, só se  │
        │ PostgreSQL       │        │ a regra não couber    │
        └──────────────────┘        └───────────────────────┘

Deploy: web/ → Vercel · mobile/ → Expo Go / EAS · supabase/ → migrations no Git
```

## O que isto vale para cada perfil da equipe

| Perfil | O que a stack dá |
|---|---|
| Desenvolvimento | React, TypeScript e PostgreSQL, o centro do mercado; Vite, Expo e Supabase, a parte que cresce |
| Game Design | Vê cada mecânica no ar pela URL de pré-visualização do PR, no celular, sem rodar nada |
| Arte e Som | Confere arte e som no aparelho de verdade pelo Expo Go |
| Narrativa e Conteúdo | Revisa o texto na tela publicada, no contexto em que a pessoa vai ler |
| Produto e Gestão | Um link sempre atualizado para mostrar a mentores e à Banca |

## Skills dos agentes

Cada tecnologia tem uma skill em `.claude/skills/`, com o como fazer aqui e as armadilhas conhecidas:

| Skill | Tecnologia |
|---|---|
| [`web-react-vite`](../../.claude/skills/web-react-vite/SKILL.md) | React + Vite + TypeScript |
| [`mobile-expo`](../../.claude/skills/mobile-expo/SKILL.md) | React Native com Expo |
| [`ui-ux-designer`](../../.claude/skills/ui-ux-designer/SKILL.md) | Componentes reutilizáveis e tela |
| [`supabase`](../../.claude/skills/supabase/SKILL.md) | Auth, API, Storage e Edge Functions |
| [`postgresql`](../../.claude/skills/postgresql/SKILL.md) | Tabela, migração e RLS |
| [`deploy-vercel`](../../.claude/skills/deploy-vercel/SKILL.md) | Publicação do web |
| [`backend-customizado`](../../.claude/skills/backend-customizado/SKILL.md) | Fastify ou Go, quando a regra exigir |
