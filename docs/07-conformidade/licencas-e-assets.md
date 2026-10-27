# Licenças, código aberto e assets de terceiros

> Obrigatório na entrega (Seções 8.5 e 9.1). Registre **cada** biblioteca, engine, fonte, imagem, som ou API no momento em que entrar no projeto.

## Licença do projeto

Código da equipe: **MIT** (ver [LICENSE](../../LICENSE)). Componentes de terceiros mantêm as licenças originais (Seção 11).

## Engines, frameworks e bibliotecas

| Nome | Versão | Licença | Link | Uso no projeto |
|---|---|---|---|---|
| TypeScript | 5.x | Apache 2.0 | https://github.com/microsoft/TypeScript | Linguagem de todo o projeto |
| React | 19.x | MIT | https://github.com/facebook/react | Interface do web e do mobile |
| Vite | 8.3.5 | MIT | https://github.com/vitejs/vite | Dev server e build do web |
| React DOM | 19.3.1 | MIT | https://github.com/facebook/react | Renderização do web |
| React Router | 7.18.4 | MIT | https://github.com/remix-run/react-router | Rotas do web |
| @vitejs/plugin-react | 6.1.2 | MIT | https://github.com/vitejs/vite-plugin-react | Plugin React do Vite |
| vite-plugin-pwa + Workbox | 2.0.0 / 7.4.1 | MIT | https://github.com/vite-pwa/vite-plugin-pwa | PWA: service worker e funcionamento offline |
| Testing Library (react, jest-dom, user-event) | 16.3.3 / 6.9.1 / 14.6.8 | MIT | https://github.com/testing-library | Testes de tela do web |
| jsdom | 30.1.3 | MIT | https://github.com/jsdom/jsdom | Ambiente de teste do web |
| React Native | 0.88 | MIT | https://github.com/facebook/react-native | App mobile |
| Expo | SDK 58 | MIT | https://github.com/expo/expo | Framework do app mobile |
| Supabase (plataforma e CLI) | a definir no setup | Apache 2.0 | https://github.com/supabase/supabase | Backend inicial: Auth, API, Storage, Edge Functions |
| supabase-js | 2.x | MIT | https://github.com/supabase/supabase-js | Cliente do Supabase nos apps |
| PostgreSQL | a do Supabase | PostgreSQL License | https://www.postgresql.org/about/licence/ | Banco de dados |
| Fastify | 5.x | MIT | https://github.com/fastify/fastify | Backend customizado (`backend/`) |
| Zod | 4.x | MIT | https://github.com/colinhacks/zod | Validação de entrada no backend |
| Vitest | 3.x (backend) / 5.0.5 (web) | MIT | https://github.com/vitest-dev/vitest | Testes |

## Skills de IA de terceiros (`.claude/skills/`)

Copiadas sem alterações; cada pasta tem `LICENSE` e `ORIGEM.md` com o commit de origem. São ferramentas de desenvolvimento, não fazem parte do produto entregue.

| Skills | Repositório | Licença | Atribuição |
|---|---|---|---|
| `find-bugs` | https://github.com/getsentry/skills | Apache-2.0 | Manter `LICENSE` |
| `review-discipline` | https://github.com/Skillproofdev/review-discipline | MIT | Manter aviso de copyright |
| `architecture-review`, `codebase-review`, `security-scan` | https://github.com/nobelk/claude-tools | Apache-2.0 | Manter `LICENSE` |
| `startup-design`, `startup-competitors`, `startup-positioning`, `startup-pitch` | https://github.com/ferdinandobons/startup-skill | MIT | Manter aviso de copyright |
| `startup-validator` | https://github.com/ailabs-393/ai-labs-claude-skills | MIT | Manter aviso de copyright |
| `market-research` | https://github.com/affaan-m/everything-claude-code | MIT | Manter aviso de copyright |
| `product-thinking`, `teach-acumen`, `diagnose`, `workshop`, `increment`, `critique-product` | https://github.com/VGrss/Acumen | Apache-2.0 | Manter `LICENSE` |

Avaliadas e **não instaladas** por não terem licença declarada: `brainstorm` (happycatlabs/bradley-skills) e `idea` (jorgenschaefer/skills).

## Assets gráficos (imagens, ícones, sprites, fontes tipográficas)

| Asset | Autor / fonte | Licença | Link | Gerado por IA? | Atribuição exigida | Arquivo no repo |
|---|---|---|---|---|---|---|
| Mockups do Manual de Identidade Visual Rolê que Rende (5 imagens) | Banco do Brasil | Marca de terceiro, sem licença aberta: **só referência interna**, não usar no produto | https://www.bb.com.br/docs/portal/direc/BB-ROLE-QUE-RENDE-MANUAL-IDV.pdf | não | Uso da marca BB só com autorização da organização (Seção 8.4) | `.claude/skills/guia-estilo-role-que-rende/assets/referencias/` |
| Fontes BancoDoBrasil Títulos / Textos | Banco do Brasil | Proprietária: **não incluída no repo**; só usar se a organização fornecer | — | não | — | — |
| Fonte Nunito Sans (fallback de títulos) | Vernon Adams et al. / Google Fonts | SIL OFL 1.1 | https://fonts.google.com/specimen/Nunito+Sans | não | Não exige no produto | carregada via Google Fonts em `assets/exemplo.html` |
| Fonte Roboto (fallback de textos) | Google / Google Fonts | SIL OFL 1.1 | https://fonts.google.com/specimen/Roboto | não | Não exige no produto | carregada via Google Fonts em `assets/exemplo.html` |
| Personagem Guardião (SVG) e ícone do app | Equipe Peão (Maykon Júnio), com apoio do Claude Code | MIT (licença do projeto) | — | parcialmente (desenho em SVG escrito com apoio de IA, revisado pela equipe) | — | `web/src/components/Guardiao.tsx`, `web/public/icone*` |

## Assets sonoros (música, efeitos, voz)

| Asset | Autor / fonte | Licença | Link | Gerado por IA? | Atribuição exigida | Arquivo no repo |
|---|---|---|---|---|---|---|
| — | Nenhum: o MVP não tem áudio | — | — | — | — | — |

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
