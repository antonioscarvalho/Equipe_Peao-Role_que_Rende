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
| Vitest | 4.1 (web) / 3.x (backend) | MIT | https://github.com/vitest-dev/vitest | Testes |
| idb | 8.0 | ISC | https://github.com/jakearchibald/idb | IndexedDB no web: registros da pessoa só no aparelho |
| jsdom | 30.1 | MIT | https://github.com/jsdom/jsdom | Ambiente de navegador nos testes do web |
| Testing Library (react, user-event, jest-dom) | 16.3 / 14.6 / 7.0 | MIT | https://github.com/testing-library | Testes de tela do web |
| fake-indexeddb | 6.2 | Apache 2.0 | https://github.com/dumbmatter/fakeIndexedDB | IndexedDB em memória nos testes |
| lottie-react | 2.4.1 | MIT | https://github.com/Gamote/lottie-react | Renderização de animações Lottie no app web |
| VLibras Widget | 7.12.2 (carregado de `vlibras.gov.br`, não vai no build) | LGPL 3.0 | https://github.com/spbgovbr-vlibras | Tradução para Libras do texto tocado (`web/src/vlibras.ts`). Usado sem alteração e servido pelo governo, então a LGPL não pede abrir o nosso código |

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
| Fonte Nunito Sans 5.3.0 (títulos; substituta da BancoDoBrasil Títulos) | Vernon Adams, Jacques Le Bailly et al. / Google Fonts, via Fontsource | SIL OFL 1.1 | https://fonts.google.com/specimen/Nunito+Sans · https://fontsource.org/fonts/nunito-sans | não | Manter o arquivo de licença junto (OFL); não vender a fonte sozinha | `.claude/skills/guia-estilo-role-que-rende/assets/fontes/nunito-sans-latin-*.woff2` + `OFL-NunitoSans.txt` (servida localmente, offline) |
| Fonte Roboto 5.3.0 (textos; substituta da BancoDoBrasil Textos) | Christian Robertson / Google Fonts, via Fontsource | SIL OFL 1.1 | https://fonts.google.com/specimen/Roboto · https://fontsource.org/fonts/roboto | não | Manter o arquivo de licença junto (OFL); não vender a fonte sozinha | `.claude/skills/guia-estilo-role-que-rende/assets/fontes/roboto-latin-*.woff2` + `OFL-Roboto.txt` (servida localmente, offline) |
| Ícones Lucide (SVGs) | Lucide Contributors | ISC | https://lucide.dev | não | Manter aviso de copyright | `web/src/components/icones-data.ts` |
| Animações Noto Animated Emoji (aliviado, brilho, broto) | Google | CC BY 4.0 | https://googlefonts.github.io/noto-emoji-animation/ | não | Atribuição ao Google (CC BY 4.0) | `web/src/components/lottie/` |

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
| WhatsApp "Click to Chat" (`https://wa.me/<número>?text=`) | https://www.whatsapp.com/legal/terms-of-service · formato: https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat/ (conferido em 27/10/2026) | Link público, sem API, chave ou SDK. O botão "Enviar pelo meu WhatsApp" do Círculo de Confiança (spec 005) só abre o WhatsApp da própria pessoa com a mensagem pronta; nada passa pelo nosso servidor. Não usa logo do WhatsApp |
| Esquema `sms:` (RFC 5724) | padrão aberto | Botão "Enviar por SMS" do Círculo; abre o app de SMS do aparelho |

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
