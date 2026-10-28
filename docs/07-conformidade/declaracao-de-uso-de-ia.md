# Declaração de uso de Inteligência Artificial

**Projeto:** _nome da solução (a definir)_
**Equipe:** Equipe Peão
**Evento:** Rolê que Rende – BBDW 2026 (Banco do Brasil / Açaí Valley)
**Base:** Seção 8.5 do edital — "é permitido o uso de ferramentas de IA como apoio ao desenvolvimento, sendo os participantes responsáveis pela originalidade, autoria e veracidade do conteúdo apresentado. O uso deverá ser declarado na entrega."

---

## 1. Declaração

A Equipe Peão declara que usou ferramentas de Inteligência Artificial **como apoio** no desenvolvimento desta solução, nas finalidades descritas abaixo. Declaramos também que:

1. Todo conteúdo gerado ou sugerido por IA foi **revisado, editado e validado por integrantes da equipe** antes de entrar no projeto.
2. A equipe assume **total responsabilidade** pela originalidade, autoria e veracidade de todo o conteúdo apresentado, incluindo o produzido com apoio de IA.
3. Informações sobre saúde, finanças e legislação geradas com apoio de IA foram **conferidas em fontes confiáveis**, listadas em [fontes e referências](fontes-e-referencias.md).
4. **Nenhum dado pessoal real**, dado de cliente do Banco do Brasil, sistema interno ou credencial institucional foi enviado a ferramentas de IA. Só usamos dados públicos ou sintéticos.
5. Nenhuma ferramenta de IA foi usada para promover apostas ou para gerar conteúdo que viole as regras da Seção 8.4.
6. Assets (imagens, áudios, textos) gerados por IA respeitam os termos de uso da ferramenta usada e estão identificados neste documento e em [licenças e assets](licencas-e-assets.md).

## 2. Ferramentas de IA utilizadas

| Ferramenta | Fornecedor | Modelo / versão | Forma de acesso | Termos de uso |
|---|---|---|---|---|
| Claude Code | Anthropic | Claude Opus 5.5 (`claude-opus-5-5`) | CLI no terminal | https://www.anthropic.com/legal |
| Antigravity | Google DeepMind | Gemini 3.8 Flash | IDE / Assistente de código | https://ai.google.dev/terms |
| Kiro CLI | Amazon Web Services | Claude Opus 5.5 | CLI no terminal | https://kiro.dev/license/ |
| _a preencher_ | | | | |

## 3. Finalidades do uso

Marque todas as que se aplicam e detalhe no registro (seção 4).

| Categoria | Usou? | Descrição resumida |
|---|---|---|
| **Geração de documentação** (README, docs, guias) | ✅ | Estrutura e textos iniciais do README e da pasta `docs/`, com base no edital |
| **Definição de tema e conceito** (brainstorm de ideias, narrativa, mecânicas) | ✅ | Análise crítica do conceito frente aos requisitos do edital e refinamento da visão do Guardião + Open Finance |
| **Geração de código** (funcionalidades, correções, testes) | ✅ | Backend inicial (Danillo) e app web: base, SOS e crise (spec 001); plano Se/Então e Círculo de Confiança (spec 005) |
| **Conexão com APIs externas** (código de integração, ou IA como API dentro do produto) | ⬜ | _a preencher_ |
| **Conteúdo do produto** (textos, diálogos, mensagens ao usuário) | ✅ | Textos de interface da spec 005 (`prevencao.json`), derivados do microcopy; revisão clínica pendente |
| **Arte e assets visuais** (imagens, ícones, sprites) | ⬜ | _a preencher_ |
| **Áudio** (música, efeitos, voz/TTS) | ⬜ | _a preencher_ |
| **Pitch** (roteiro, slides, revisão de texto) | ⬜ | _a preencher_ |
| **Pesquisa** (resumo de fontes, dados sobre o tema) | ✅ | Extração da identidade visual do Rolê que Rende (site oficial e Manual de Identidade Visual do BB); pesquisa baseada em evidências da Fase 1 (`docs/pesquisa/`) |
| **Tradução / revisão ortográfica** | ⬜ | _a preencher_ |

### 3.1 IA dentro do produto (se houver)

Se a solução final **usa um modelo de IA em tempo de execução** (ex.: chatbot de apoio, geração de mensagens), preencha:

| Item | Resposta |
|---|---|
| Modelo / API | _a preencher_ |
| Função no produto | _a preencher_ |
| Que dados do usuário são enviados ao modelo | _a preencher_ |
| Salvaguardas (filtros, instruções de sistema, encaminhamento para ajuda humana em crise) | _a preencher_ |
| Como o usuário é informado de que está interagindo com IA | _a preencher_ |

> Uma IA voltada a pessoas em sofrimento **nunca** deve se apresentar como profissional de saúde e deve sempre oferecer canais de ajuda humana (ver [fontes e referências](fontes-e-referencias.md)). Registre a integração também em [integrações externas](../04-tecnico/integracoes-externas.md).

## 4. Registro detalhado de uso

Uma linha por uso relevante. Atualize **na hora**, não no fim.

| # | Data | Integrante | Ferramenta | Categoria | O que foi pedido | O que foi aproveitado | Revisão humana | Arquivos afetados |
|---|---|---|---|---|---|---|---|---|
| 1 | 2026-10-27 | Antonio Carvalho | Claude Code (Opus 5.5) | Documentação | Criar README com a descrição da equipe e do desafio a partir do edital | Estrutura e textos do README | Revisado por Antonio Carvalho | `README.md` |
| 2 | 2026-10-27 | Antonio Carvalho | Claude Code (Opus 5.5) | Documentação | Criar a pasta `docs/` organizada e esta declaração de uso de IA | Estrutura, modelos de documento e textos-base | _pendente_ | `docs/**` |
| 3 | 2026-10-27 | Antonio Carvalho | Claude Code (Opus 5.5) | Documentação | Criar skills de SDD para agentes de IA e modelos de especificação | Skills em `.claude/skills/` e modelos em `specs/_modelo/` | _pendente_ | `.claude/**`, `specs/**` |
| 4 | 2026-10-27 | Maykon Júnio | Claude Code (Opus 5.5) | Pesquisa / Documentação | Extrair o guia de estilo do site oficial do Rolê que Rende e do Manual de Identidade Visual, e criar uma skill sobre ele | Skill `guia-estilo-role-que-rende`: paleta, tipografia, grafismos, componentes, proposta de animações, tom de voz, tokens CSS/JSON e página de exemplo | _pendente_ | `.claude/skills/guia-estilo-role-que-rende/**` |
| 5 | 2026-10-27 | Ian Costa Guimarães | Antigravity (Gemini 3.8 Flash) | Definição de tema e conceito / Documentação | Análise crítica do conceito frente aos requisitos do edital BBDW 2026 e refinamento da proposta de valor do Guardião + Open Finance | Estruturação da visão de produto, pilares do desafio, escopo e conformidade | _pendente_ | `docs/02-produto/visao-do-produto.md` |
| 6 | 2026-10-27 | Antonio Carvalho | Claude Code (Opus 5.5) | Documentação | Trazer de `projeto-app-bets` as 6 skills clínicas e éticas e o prompt de produto | Skills copiadas sem alteração, exceto um aviso regulatório (MP 1.394) em `controle-estimulos-financas` | _pendente_ | `.claude/skills/{seguranca-e-crise,design-etico-saude-digital,entrevista-motivacional,prevencao-recaida,tcc-reestruturacao-cognitiva,controle-estimulos-financas}/`, `.claude/prompts/` |
| 7 | 2026-10-27 | Antonio Carvalho | Claude Code (Opus 5.5) com busca na web | Pesquisa | Fase 1: pesquisa baseada em evidências sobre transtorno do jogo, intervenções, instrumentos, contexto brasileiro e saúde digital | Síntese e 5 documentos com fontes; afirmações não confirmadas marcadas com ⚠️ | _pendente: revisão humana e clínica_ | `docs/pesquisa/**` |
| 8 | 2026-10-27 | Antonio Carvalho | Claude Code (Opus 5.5) | Definição de tema e conceito | Fase 2: matriz conceito → funcionalidade, MoSCoW e MVP, com base na pesquisa, nas skills e na visão do produto | Matriz com 18 funcionalidades, ajustes propostos à visão e MVP de 10 itens | _pendente_ | `docs/02-produto/matriz-conceito-funcionalidade.md` |
| 9 | 2026-10-27 | Danillo Meira | Claude Code (Opus 5.5) | Geração de código | Esqueleto do backend em Fastify para a Vercel, com Repository e Retry pattern e testes | Estrutura em `backend/` e skill `arquiteto-de-software` | _pendente_ | `backend/**`, `.claude/skills/arquiteto-de-software/` |
| 10 | 2026-10-27 | Danillo Meira | Claude Code (Opus 5.5) com busca na web | Documentação / Pesquisa | Documentar a motivação da stack com dados de mercado e criar uma skill por tecnologia | Documento de stack, decisões técnicas e 7 skills; números conferidos na Stack Overflow 2025 e no State of JS 2025 | _pendente_ | `docs/04-tecnico/**`, `docs/07-conformidade/{licencas-e-assets,fontes-e-referencias}.md`, `.claude/skills/{web-react-vite,mobile-expo,ui-ux-designer,supabase,postgresql,deploy-vercel,backend-customizado}/` |
| 11 | 2026-10-27 | Antonio Carvalho | Claude Code (Opus 5.5) | Documentação / Conteúdo do produto | Fase 3: arquitetura de privacidade, fluxos e microcopy, com base nas skills clínicas, éticas e de estilo | Fluxos de 10 telas, textos de interface e regras de dados locais | _pendente: revisão humana e clínica (textos 🩺)_ | `docs/02-produto/fluxos.md`, `docs/02-produto/microcopy.md`, `docs/04-tecnico/privacidade-e-dados-locais.md` |
| 12 | 2026-10-27 | Antonio Carvalho | Claude Code (Opus 5.5) | Geração de código | Fase 4, spec 001: base do app web, SOS de fissura e protocolo de crise, com testes, service worker e revisões | Código em `web/src/` (telas, componentes, conteúdo JSON, repositório IndexedDB), 85 testes, `sw.js` e manifest, spec/plano/tarefas e revisões | _pendente: revisão humana e clínica_ | `web/**`, `specs/001-base-sos-crise/**`, `docs/revisoes/**` |
| 13 | 2026-10-27 | Ian Costa Guimarães | Antigravity (Gemini 3.8 Flash) | Documentação / Definição de tema | Elaboração e estruturação das 5 especificações técnicas do MVP (Specs 002 a 006 (renumeradas de 001–005)) e backlog com critérios de aceite verificáveis | Specs em specs/002 a 006, specs/README.md e docs/02-produto/escopo-e-backlog.md | _pendente_ | `specs/**`, `docs/02-produto/escopo-e-backlog.md` |
| 14 | 2026-10-27 | Maykon Júnio | Claude Code (Opus 5.5) com busca na web | Pesquisa / Documentação | Pesquisar, revisar e instalar skills de terceiros (ideias, mercado, pitch, revisão de código) e testar se todas as skills do projeto são chamadas automaticamente | 17 skills de terceiros com licença MIT/Apache; gatilhos em português nas descrições de `supabase` e `critique-product` | _pendente_ | `.claude/skills/**`, `.claude/README.md`, `docs/07-conformidade/licencas-e-assets.md` |
| 15 | 2026-10-27 | Maykon Júnio | Claude Code (Opus 5.5) | Geração de código / Conteúdo do produto / Arte / Documentação | Protótipo paralelo do MVP do Guardião; rascunhos de documentos; personagem Guardião em SVG; modo calmo do guia de estilo | Protótipo em `prototipos/guardiao-maykon/` (26 testes), propostas de documentos, ajustes no guia de estilo | _pendente_ (textos clínicos também pendentes de psicólogo) | `prototipos/guardiao-maykon/**`, `.claude/skills/guia-estilo-role-que-rende/**` |
| 16 | 2026-10-27 | Maykon Júnio | Claude Code (Opus 5.5) | Documentação / Definição de tema | Revisar as specs 001–006 e os requisitos; corrigir as 002–006, criar as specs 007 e 008, atualizar as issues e a documentação de produto | Specs 002–006 corrigidas (fontes, critérios verificáveis, lacunas, dependências) e marcadas para reaprovação; specs 007 (Open Finance, Must, só dados sintéticos) e 008 (configurações, privacidade e acessibilidade); issues #4, #5, #7, #8 e #9 renumeradas e #15 e #16 criadas; personas, fluxos, microcopy, visão, backlog e índice atualizados. Decisões de persona, contador, Open Finance e responsável da 008 tomadas por Maykon Júnio | _pendente_ (reaprovação das specs pela equipe) | `specs/**`, `docs/02-produto/**` |
| 17 | 2026-10-27 | Danillo Meira | Claude Code (Opus 5.5) | Geração de código / Documentação | Plano, tarefas e implementação da spec 004: check-in diário, pós-lapso, contador do mês, dinheiro preservado e simulação de Open Finance com extrato sintético (depois da revisão de 27/10: contador pelo total, meta, humor opcional; a simulação saiu para a branch `feat/007-open-finance-demo`) | Código em `web/src/`, testes, plano e revisão; textos tirados de `docs/02-produto/microcopy.md` | Decisões do plano aprovadas por Danillo Meira; revisão clínica _pendente_ | `specs/004-contador-e-dinheiro/`, `web/src/**`, `docs/revisoes/checkin-e-dinheiro.md` |
| 18 | 2026-10-27 | Danillo Meira | Claude Code (Opus 5.5) com busca na web | Pesquisa / Geração de código / Documentação | Revalidar a spec 004 contra o código, conferir na fonte os valores das metas (ANP e DIEESE) e fechar as lacunas: texto livre do pós-lapso, "estimativa" na visão em metas, leitura acessível de "≈", modo demo | Valores das metas conferidos nos PDFs oficiais; código, testes e conferência no navegador; revisão atualizada | Danillo Meira; revisão clínica _pendente_ | `web/src/**`, `docs/07-conformidade/fontes-e-referencias.md`, `docs/revisoes/checkin-e-dinheiro.md`, `docs/02-produto/microcopy.md` |
| 19 | 2026-10-27 | Atyrson Souto | Kiro CLI (Claude Opus 5.5) | Geração de código / Conteúdo do produto / Documentação | Implementar a spec 005 (tarefas T001–T009, T011 e T012): banco versão 3, repositórios de planos e Círculo, links de WhatsApp/SMS, telas "Seu plano" e "Seu Círculo", ações do plano no SOS, testes e revisão de conformidade | Código em `web/src/` (telas, componentes, domínio, repositórios IndexedDB), textos de interface em `prevencao.json` a partir do microcopy, testes e o checklist em `docs/revisoes/prevencao-e-circulo.md` | _pendente_: revisão humana de Atyrson Souto e revisão clínica dos textos | `web/src/**`, `specs/005-prevencao-e-circulo/tarefas.md`, `docs/revisoes/prevencao-e-circulo.md`, `docs/07-conformidade/**`, `docs/04-tecnico/integracoes-externas.md` |
| 20 | 2026-10-27 | Ian Costa Guimarães | Antigravity (Gemini 3.8 Flash) | Geração de código / Arte / UI-UX | Implementação da Spec 007 (Open Finance com dados sintéticos no módulo de dinheiro preservado), mascote Guardião em SVG no início com evolução de fases e adaptação visual ao Modo Calmo | Componente Guardião SVG, extrato sintético, análise de transações sem julgamento, selo demo, confirmação de privacidade, 446 testes passando | _pendente_ | `web/src/**`, `specs/007-open-finance-demo/**`, `docs/07-conformidade/declaracao-de-uso-de-ia.md` |
| 21 | 2026-10-28 | Ian Costa Guimarães | Antigravity (Gemini 3.8 Flash) | Geração de código / Arte / UI-UX | Integração da identidade visual do Rolê que Rende a partir de `prototipos/prova-visual/`: mockup de celular com background interativo, mascote Bichinho vivo com humores/evolução, Bairro SVG dinâmico por conquistas, TimerOnda com círculos de respiração concêntricos e suporte completo a acessibilidade (redução de movimento, modo calmo) | Componentes Bichinho, Bairro, Decoracao, Icone, TimerOnda integrado, index.css responsivo, mock para lottie-react em testes | Ian Costa Guimarães | `web/src/**`, `docs/07-conformidade/**` |
| 22 | 2026-10-28 | Danillo Meira | Claude Code (Opus 5.5) | Geração de código / Documentação | Criar uma skill que aponte quando dois devs estão na mesma spec ou no mesmo arquivo, antes de virar retrabalho | Skill `orquestrar-branches` com o script `mapa-branches.mjs` (branches remotas × spec × arquivos × conflito por `git merge-tree`), testado contra o repositório; linha no fluxo de trabalho | _pendente_: revisão humana de Danillo Meira | `.claude/skills/orquestrar-branches/**`, `.claude/README.md`, `docs/05-processo/fluxo-de-trabalho.md` |
| 23 | 2026-10-28 | Danillo Meira | Claude Code (Opus 5.5) | Geração de código / Documentação | Criar uma skill de acessibilidade rigorosa baseada na WCAG, cobrindo o máximo possível para o público do app | Skill `acessibilidade-wcag`: os 86 critérios da WCAG 2.2 aplicados ao app (AA + 20 AAA promovidos), acessibilidade cognitiva e caminho de crise, padrões de código, protocolo de teste manual e roteiro da demo; scripts `auditar.mjs` e `contraste.mjs`, testados contra o app e contra um arquivo com erros de propósito | _pendente_: revisão humana de Danillo Meira | `.claude/skills/acessibilidade-wcag/**`, `.claude/README.md`, `docs/03-design/acessibilidade.md` |
| 24 | 2026-10-28 | Maykon Júnio | Claude Code (Opus 5.5) | Documentação / Definição de tema | Criar skills de gamificação a partir de 7 livros indicados pela equipe e auditar o projeto com elas | Skills `gamificacao-etica` (frameworks, catálogo, checklist, bibliografia) e `pitch-gamificacao`; auditoria em `docs/03-design/auditoria-gamificacao.md` (17 achados). Resumos com palavras da equipe, sem trechos dos livros; lista de material gratuito e oficial dos autores, com links verificados | _pendente_ | `.claude/skills/gamificacao-etica/**`, `.claude/skills/pitch-gamificacao/**`, `docs/03-design/auditoria-gamificacao.md` |
| 25 | 2026-10-28 | Maykon Júnio | Claude Code (Opus 5.5) | Geração de código / Documentação | Baixar fontes livres e deixar disponíveis para as skills e os apps, sem CDN | Nunito Sans e Roboto (OFL) em `assets/fontes/` do guia de estilo, `fontes.css` importado pelo `tokens.css`, liberação no `web/vite.config.ts` para o modo dev, docs da tipografia e registro de licenças | _pendente_ | `.claude/skills/guia-estilo-role-que-rende/**`, `web/vite.config.ts`, `docs/07-conformidade/licencas-e-assets.md` |
| 26 | 2026-10-28 | Maykon Júnio | Claude Code (Opus 5.5) | Definição de tema / Conteúdo do produto | Propor um questionário de entrada sobre por que a pessoa quer ficar longe das apostas, quem ela é e qual meta tem, com base nos materiais de gamificação e nas skills clínicas | `docs/02-produto/questionario-onboarding.md`: entrada em 5 telas, blocos opcionais "Me conta mais", acompanhamento, o que não perguntar e mapa de uso; textos 🩺 para revisão clínica | _pendente_ | `docs/02-produto/questionario-onboarding.md`, `docs/03-design/proposta-gamificacao.md` |
| 27 | 2026-10-28 | Danillo Meira | Claude Code (Opus 5.5) | Geração de código / Documentação | Criar a base do perfil (nome, foto, personalização do bichinho, cenário) e recomendar onde guardar | Domínio `perfil.ts` (validação de apelido, foto recortada e reduzida, cenário), preparo da foto e hook `usePerfil` em localStorage, junto da aparência do bichinho (spec 009); linha na tabela de privacidade. Portado para o `web/` novo quando o app antigo foi para `lixo/` | _pendente_: revisão humana de Danillo Meira | `web/src/personalizacao/{perfil,foto,armazenamento-perfil,index}.ts`, `docs/04-tecnico/privacidade-e-dados-locais.md` |
| 28 | 2026-10-28 | Maykon Júnio | Claude Code (Opus 5.5) | Geração de código / Documentação | Corrigir o `web/` novo (fontes offline, ajuda a 1 toque, autoexclusão condicional) e atualizar a documentação depois da troca pela prova visual | `AjudaAgora.tsx` (CVV 188, SAMU 192, UBS/CAPS em todas as telas), fontes locais do guia (com peso 900), aviso de autoexclusão; setup, índice das specs, reauditoria de gamificação e proposta atualizados | _pendente_ (textos de crise: revisão clínica) | `web/**`, `docs/**`, `specs/README.md`, guia de estilo |
| 29 | 2026-10-28 | Atyrson Souto | Kiro CLI (Claude Opus 5.5) | Geração de código / Conteúdo do produto / Documentação | Criar a base da história do Broto (tipos, progresso local, diálogo, mapa de capítulos) e ligar o Capítulo 1, A Queda, ao Pulo do Bichinho | Código em `web/src/historia/`, `web/src/jogos/pulo/` e `AjudaAgora.tsx` (painel de crise reutilizável); textos do cap. 1 copiados da narrativa; a fala de transição "Pode me perguntar o que quiser. Ou a gente segue." e os rótulos de botão foram escritos pela IA | _pendente_: revisão humana de Atyrson Souto e revisão clínica dos textos | `web/src/historia/**`, `web/src/jogos/pulo/**`, `web/src/AjudaAgora.tsx`, `web/src/App.tsx`, `docs/05-processo/historia-divisao.md` |
| 30 | 2026-10-28 | Atyrson Souto | Kiro CLI (Claude Opus 5.5) | Arte / Geração de código / Conteúdo do produto / Documentação | Cena de fundo do cap. 1 por momento da conversa, fala em balão, animação da queda do espaço; instalar as skills de história (story-skills) e montar a bíblia da história a partir da narrativa | SVG e CSS próprios em `web/src/historia/cenas/` e `Queda.tsx`; bíblia em `docs/03-design/historia-broto/` (personagens, lugares, promessas, capítulos, mapa de escolhas); os textos de fala continuam os da narrativa | _pendente_: revisão humana de Atyrson Souto | `web/src/historia/**`, `docs/03-design/historia-broto/**`, `.claude/skills/`, `.kiro/skills/`, `docs/07-conformidade/licencas-e-assets.md` |
| 31 | 2026-10-28 | Atyrson Souto | Kiro CLI (Claude Opus 5.5) | Conteúdo do produto / Arte / Geração de código / Documentação | Abertura do app, capítulo 1 com 10 a 15 min (questionário de entrada na voz do Broto e conversa para criar confiança), diálogo no formato de RPG, cenas novas e transições; instalar a skill motion-design | Roteiro do cap. 1 escrito pela IA a partir da lore e do questionário (`cap1.ts`, `narrativa-broto.md`); `Abertura.tsx`, `Especial.tsx`, `conhecer.ts`, cenas em SVG/CSS próprios | _pendente_: revisão humana de Atyrson Souto e **revisão clínica de todo o roteiro novo** | `web/src/**`, `docs/03-design/narrativa-broto.md`, `docs/05-processo/historia-divisao.md`, `.claude/skills/motion-design/` |
| 32 | | | | | | | | |

## 5. Componentes sem uso de IA

Liste o que foi produzido **sem** IA, para deixar clara a autoria humana:

- Levantamento, triagem e verificação das fontes e pesquisas sobre apostas online no Brasil (`docs/07-conformidade/fontes-e-referencias.md`)
- _a preencher_ (ex.: mecânica central, direção de arte, roteiro principal)

## 6. Assinaturas

Declaramos que as informações acima são verdadeiras.

| Integrante | Assinatura / de acordo | Data |
|---|---|---|
| Antonio Carvalho | | |
| Atyrson Souto | | |
| Danillo Meira | | |
| Ian Costa Guimarães | | |
| Maykon Júnio | | |
| Vanessa Ramos | | |

---

_Para a entrega, exporte este documento para PDF junto com [licenças e assets](licencas-e-assets.md)._
