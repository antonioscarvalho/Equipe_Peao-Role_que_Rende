# Licenças, código aberto e assets de terceiros

> Obrigatório na entrega (Seções 8.5 e 9.1). Registre **cada** biblioteca, engine, fonte, imagem, som ou API no momento em que entrar no projeto.

## Licença do projeto

Código da equipe: **MIT** (ver [LICENSE](../../LICENSE)). Componentes de terceiros mantêm as licenças originais (Seção 11).

## Engines, frameworks e bibliotecas

| Nome | Versão | Licença | Link | Uso no projeto |
|---|---|---|---|---|
| TypeScript | 5.x | Apache 2.0 | https://github.com/microsoft/TypeScript | Linguagem de todo o projeto |
| React | 19.x | MIT | https://github.com/facebook/react | Interface do web e do mobile |
| Vite | a definir no setup | MIT | https://github.com/vitejs/vite | Dev server e build do web |
| React Native | 0.88 | MIT | https://github.com/facebook/react-native | App mobile |
| Expo | SDK 58 | MIT | https://github.com/expo/expo | Framework do app mobile |
| Supabase (plataforma e CLI) | a definir no setup | Apache 2.0 | https://github.com/supabase/supabase | Backend inicial: Auth, API, Storage, Edge Functions |
| supabase-js | 2.x | MIT | https://github.com/supabase/supabase-js | Cliente do Supabase nos apps |
| PostgreSQL | a do Supabase | PostgreSQL License | https://www.postgresql.org/about/licence/ | Banco de dados |
| Fastify | 5.x | MIT | https://github.com/fastify/fastify | Backend customizado (`backend/`) |
| Zod | 4.x | MIT | https://github.com/colinhacks/zod | Validação de entrada no backend |
| Vitest | 3.x | MIT | https://github.com/vitest-dev/vitest | Testes |

## Assets gráficos (imagens, ícones, sprites, fontes tipográficas)

| Asset | Autor / fonte | Licença | Link | Gerado por IA? | Atribuição exigida | Arquivo no repo |
|---|---|---|---|---|---|---|
| Mockups do Manual de Identidade Visual Rolê que Rende (5 imagens) | Banco do Brasil | Marca de terceiro, sem licença aberta: **só referência interna**, não usar no produto | https://www.bb.com.br/docs/portal/direc/BB-ROLE-QUE-RENDE-MANUAL-IDV.pdf | não | Uso da marca BB só com autorização da organização (Seção 8.4) | `.claude/skills/guia-estilo-role-que-rende/assets/referencias/` |
| Fontes BancoDoBrasil Títulos / Textos | Banco do Brasil | Proprietária: **não incluída no repo**; só usar se a organização fornecer | — | não | — | — |
| Fonte Nunito Sans (fallback de títulos) | Vernon Adams et al. / Google Fonts | SIL OFL 1.1 | https://fonts.google.com/specimen/Nunito+Sans | não | Não exige no produto | carregada via Google Fonts em `assets/exemplo.html` |
| Fonte Roboto (fallback de textos) | Google / Google Fonts | SIL OFL 1.1 | https://fonts.google.com/specimen/Roboto | não | Não exige no produto | carregada via Google Fonts em `assets/exemplo.html` |
| _a preencher_ | | | | sim/não | | |

## Assets sonoros (música, efeitos, voz)

| Asset | Autor / fonte | Licença | Link | Gerado por IA? | Atribuição exigida | Arquivo no repo |
|---|---|---|---|---|---|---|
| _a preencher_ | | | | sim/não | | |

## APIs e serviços externos

Detalhes em [integrações externas](../04-tecnico/integracoes-externas.md).

| Serviço | Termos de uso | Uso no projeto |
|---|---|---|
| Vercel (plano Hobby) | https://vercel.com/legal/terms | Hospedagem do web; o Hobby é para uso pessoal e não comercial |
| Supabase (plano Free) | https://supabase.com/terms | Backend e banco; projeto pausa após uma semana sem uso |

## Licenças compatíveis (referência rápida)

| Licença | Pode usar? | Observação |
|---|---|---|
| MIT, BSD, Apache 2.0, Zlib | ✅ | Manter o aviso de copyright |
| CC0 / domínio público | ✅ | Sem exigências |
| CC BY | ✅ | **Atribuição obrigatória** |
| CC BY-SA | ⚠️ | Atribuição + obra derivada na mesma licença |
| CC BY-NC | ⚠️ | Não comercial; conferir com a equipe, pois o BB recebe licença de uso institucional |
| GPL / LGPL | ⚠️ | Pode exigir abrir o código derivado; avaliar antes |
| Sem licença declarada | ❌ | Não usar |
| Marcas de casas de apostas, clubes ou atletas | ❌ | Proibido (Seção 8.4) |
