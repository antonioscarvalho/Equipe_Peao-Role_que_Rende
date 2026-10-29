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
| vite-plugin-pwa | 0.21.x | MIT | https://github.com/vite-pwa/vite-plugin-pwa | App instalável no celular (manifesto e service worker) |
| Workbox (via vite-plugin-pwa) | 7.x | MIT | https://github.com/GoogleChrome/workbox | Guarda o app no aparelho para abrir sem internet |
| @resvg/resvg-js (só para gerar os ícones, fora do app) | 2.x | MPL 2.0 | https://github.com/thx/resvg-js | `web/scripts/gerar-icones.cjs`: transforma `icones/broto.svg` nos PNGs do ícone |
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
| `motion-design` | https://github.com/LottieFiles/motion-design-skill | MIT | Manter aviso de copyright |
| `interactive-fiction`, `story-init`, `character-management`, `worldbuilding`, `plot-structure`, `scene-craft`, `revision-continuity`, `voice-style`, `theme-craft`, `story-maintenance` (com a CLI `story.js`) | https://github.com/danjdewhurst/story-skills (commit e44c97c) | MIT | Manter aviso de copyright |

Avaliadas e **não instaladas** por não terem licença declarada: `brainstorm` (happycatlabs/bradley-skills) e `idea` (jorgenschaefer/skills).

## Assets gráficos (imagens, ícones, sprites, fontes tipográficas)

| Asset | Autor / fonte | Licença | Link | Gerado por IA? | Atribuição exigida | Arquivo no repo |
|---|---|---|---|---|---|---|
| Mockups do Manual de Identidade Visual Rolê que Rende (5 imagens) | Banco do Brasil | Marca de terceiro, sem licença aberta: **só referência interna**, não usar no produto | https://www.bb.com.br/docs/portal/direc/BB-ROLE-QUE-RENDE-MANUAL-IDV.pdf | não | Uso da marca BB só com autorização da organização (Seção 8.4) | `.claude/skills/guia-estilo-role-que-rende/assets/referencias/` |
| Fontes BancoDoBrasil Títulos / Textos | Banco do Brasil | Proprietária: **não incluída no repo**; só usar se a organização fornecer | — | não | — | — |
| Fonte Nunito Sans 5.3.0 (títulos; substituta da BancoDoBrasil Títulos) | Vernon Adams, Jacques Le Bailly et al. / Google Fonts, via Fontsource | SIL OFL 1.1 | https://fonts.google.com/specimen/Nunito+Sans · https://fontsource.org/fonts/nunito-sans | não | Manter o arquivo de licença junto (OFL); não vender a fonte sozinha | `.claude/skills/guia-estilo-role-que-rende/assets/fontes/nunito-sans-latin-*.woff2` + `OFL-NunitoSans.txt` (servida localmente, offline) |
| Fonte Roboto 5.3.0 (textos; substituta da BancoDoBrasil Textos) | Christian Robertson / Google Fonts, via Fontsource | SIL OFL 1.1 | https://fonts.google.com/specimen/Roboto · https://fontsource.org/fonts/roboto | não | Manter o arquivo de licença junto (OFL); não vender a fonte sozinha | `.claude/skills/guia-estilo-role-que-rende/assets/fontes/roboto-latin-*.woff2` + `OFL-Roboto.txt` (servida localmente, offline) |
| Fonte Fredoka (variável) 5.3.0 (títulos e botões do app) | Milena Brandão, Hafontia / Google Fonts, via Fontsource | SIL OFL 1.1 | https://fonts.google.com/specimen/Fredoka · https://fontsource.org/fonts/fredoka | não | Manter a licença OFL junto (vem no pacote); não vender a fonte sozinha | pacote npm `@fontsource-variable/fredoka` (empacotada no build, offline) |
| Fonte Nunito (variável) 5.3.0 (texto corrido do app) | Vernon Adams, Cyreal, Jacques Le Bailly / Google Fonts, via Fontsource | SIL OFL 1.1 | https://fonts.google.com/specimen/Nunito · https://fontsource.org/fonts/nunito | não | Manter a licença OFL junto (vem no pacote); não vender a fonte sozinha | pacote npm `@fontsource-variable/nunito` (empacotada no build, offline) |
| Ícone "sign-language" (botão de Libras) | IconOven / Appic Marketing | MIT | https://iconoven.com/icons | não | Manter aviso de copyright | `web/src/icones-data.ts` (`libras`) |
| Logo "Rolê que Rende BB · Inovathon · #TodoRolêImporta" (abertura do app) | Banco do Brasil / organização do Inovathon | Marca de terceiro, sem licença aberta. ⚠️ **Uso pendente de autorização** da organização (Seção 8.4): se não vier, tirar a etapa 1 da abertura | arquivo `assets/bbdw-hero-image-1.png` trazido pela equipe | não | Sem alteração na arte (manual de marca: não distorcer, não recolorir); só recortada e convertida | `web/public/marca/role-que-rende.webp` (recorte do original em `assets/`) |
| Cenários dos capítulos em WebP (cap1, cap2, cap4, cap5, cap6) | Equipe Peão (mesma origem de `assets/cenarios/`) | a mesma dos originais em `assets/cenarios/` | — | ver registro dos originais | — | `web/public/cenarios/*.webp` (versões reduzidas para a web) |
| Ícones Lucide (SVGs) | Lucide Contributors | ISC | https://lucide.dev | não | Manter aviso de copyright | `web/src/components/icones-data.ts` |
| Ícones de acessibilidade e de Libras (`universal-access`, desenho do logo de acessibilidade da ONU; `hands-asl-interpreting`, Símbolo Internacional de Interpretação em Língua de Sinais) | Fonticons, Inc. (Font Awesome Free 6) | CC BY 4.0 (ícones) | https://fontawesome.com/license/free | não | Atribuição: "Font Awesome Free by Fonticons, Inc., CC BY 4.0" (está no comentário de `web/src/icones-data.ts` e aqui) | `web/src/icones-data.ts` (`acessibilidade`, `linguaDeSinais`): botão de Libras, título de Acessibilidade em Ajustes e modal do primeiro acesso |
| Ícone de acesso do VLibras (`vlibras-access.svg`) | Governo Federal / UFPB (VLibras, gov.br) | LGPL-3.0 (VLibras); marca do governo usada só para acionar o próprio VLibras, como nos sites gov.br | https://vlibras.gov.br | não | Usar só no botão que abre o VLibras, sem alterar o desenho | `web/public/marca/vlibras.svg`, `web/src/BotaoLibras.tsx` |
| Novo símbolo de acessibilidade (figura com cabeça, mãos e pés azuis dentro do círculo, versão em cores do logo de acessibilidade da ONU), sobre quadrado claro em `acessibilidade-onu.svg` | Nações Unidas, Graphic Design Unit (arquivo do Wikimedia Commons) | Domínio público (segundo o Wikimedia Commons) | https://commons.wikimedia.org/wiki/File:Accessibility_logo.svg | não | Nenhuma; manter o desenho sem alterar | `web/public/marca/acessibilidade-onu.svg`, topo do modal de acessibilidade |
| Ícones fechar (`xmark`/fa-times) e alto contraste (`circle-half-stroke`/fa-adjust) | Fonticons, Inc. (Font Awesome Free 6), os mesmos do DS gov.br | CC BY 4.0 (ícones) | https://fontawesome.com/license/free | não | Atribuição (comentário em `web/src/icones-data.ts` e aqui) | Botão de fechar de todas as telas cheias e linha "Alto contraste" em Ajustes |
| Animações Noto Animated Emoji (aliviado, brilho, broto) | Google | CC BY 4.0 | https://googlefonts.github.io/noto-emoji-animation/ | não | Atribuição ao Google (CC BY 4.0) | `web/src/components/lottie/` |

## Assets sonoros (música, efeitos, voz)

| Asset | Autor / fonte | Licença | Link | Gerado por IA? | Atribuição exigida | Arquivo no repo |
|---|---|---|---|---|---|---|
| Cantiga da Vó (cena "musica" do cap. 1) — síntese aditiva própria (seno/harmônicos), sem sample de terceiros, exportada em Opus. Versão "bem fofa" (a pedido): timbre de caixinha de música mais redondo, um arrulho grave de "mmm" por baixo da frase "a luz vem devagar" (ecoando o roteiro: "a Nina sempre entra nessa parte") e sininhos esparsos de pingente de berço entre as frases | Equipe Peão (gerado via Claude) | MIT (código do projeto) | — | sim (Claude, script Python próprio de síntese, convertido a Opus com ffmpeg) | Não exige | `web/public/sons/cantiga-vo.opus`, script em `web/scripts/compor-cantiga-vo.py` |
| Tema do menu Jogos "Rolê de Hoje" (loop de 17s, 112 bpm) — motor cinematográfico próprio com pad sustentado (colchão tipo Interstellar), bateria leve, melodia em timbre de corda/metal e sino esparso; síntese própria, sem sample de terceiros, Opus. Recomposta pra sair do som "de jogo" e ganhar corpo orquestral; o pulso motorik contínuo testado numa 1ª versão foi tirado depois do feedback de que não encaixou; o colchão também teve o vibrato e o "inchar/esvaziar" a cada troca de acorde cortados, depois do feedback de que ainda sobrava "um som de vai e vem" | Equipe Peão (gerado via Claude) | MIT (código do projeto) | — | sim (Claude, script Python próprio de síntese, convertido a Opus com ffmpeg) | Não exige | `web/public/sons/trilha-alegre.opus`, script em `web/scripts/compor_trilhas_exploracao.py` (perfil "alegre", chamado por `web/scripts/compor-trilha-alegre.py`) |
| Trilha de navegação do app (loop de 21s, 92 bpm) — mesmo motor cinematográfico, perfil mais "pad" (colchão em primeiro plano), pra ficar mais espaçosa/atmosférica que as demais; síntese própria, sem sample de terceiros, Opus | Equipe Peão (gerado via Claude) | MIT (código do projeto) | — | sim (Claude, script Python próprio de síntese, convertido a Opus com ffmpeg) | Não exige | `web/public/sons/trilha-leve.opus`, script em `web/scripts/compor_trilhas_exploracao.py` (perfil "leve", chamado por `web/scripts/compor-trilha-leve.py`) |
| Trilha do Pulo do Bichinho (loop de 17s, 116 bpm) — mesmo motor cinematográfico, perfil equilibrado entre pad, bateria e melodia; síntese própria, sem sample de terceiros, Opus. Recomposta junto das demais pra sair do timbre de "musiquinha de plataforma" | Equipe Peão (gerado via Claude) | MIT (código do projeto) | — | sim (Claude, script Python próprio de síntese, convertido a Opus com ffmpeg) | Não exige | `web/public/sons/trilha-pulo.opus`, script em `web/scripts/compor_trilhas_exploracao.py` (perfil "pulo", chamado por `web/scripts/compor-trilha-pulo.py`) |
| Som de fundo relaxante do "Deu vontade" (respiração guiada) — drone grave cujo volume segue o ritmo 4-4-6 da respiração (14s, loop natural, sem crossfade), síntese própria, sem sample de terceiros, Opus. Desligado por padrão (spec 003 CA-3), só toca se a pessoa ligar "som da respiração" | Equipe Peão (gerado via Claude) | MIT (código do projeto) | — | sim (Claude, script Python próprio de síntese, convertido a Opus com ffmpeg) | Não exige | `web/public/sons/respirar-calma.opus`, script em `web/scripts/compor-respirar-calma.py` |
| Trilha do Rolê de Carrinho (loop de 16s, 120 bpm) — mesmo motor cinematográfico, perfil mais "bateria" (o mais rítmico das quatro, acompanhando a aceleração do carrinho); síntese própria, sem sample de terceiros, Opus | Equipe Peão (gerado via Claude) | MIT (código do projeto) | — | sim (Claude, script Python próprio de síntese, convertido a Opus com ffmpeg) | Não exige | `web/public/sons/trilha-carrinho.opus`, script em `web/scripts/compor_trilhas_exploracao.py` (perfil "carrinho", chamado por `web/scripts/compor-trilha-carrinho.py`) |

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
