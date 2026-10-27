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
| _a preencher_ | | | | |

## 3. Finalidades do uso

Marque todas as que se aplicam e detalhe no registro (seção 4).

| Categoria | Usou? | Descrição resumida |
|---|---|---|
| **Geração de documentação** (README, docs, guias) | ✅ | Estrutura e textos iniciais do README e da pasta `docs/`, com base no edital |
| **Definição de tema e conceito** (brainstorm de ideias, narrativa, mecânicas) | ✅ | Análise crítica do conceito frente aos requisitos do edital e refinamento da visão do Guardião + Open Finance |
| **Geração de código** (funcionalidades, correções, testes) | ⬜ | _a preencher_ |
| **Conexão com APIs externas** (código de integração, ou IA como API dentro do produto) | ⬜ | _a preencher_ |
| **Conteúdo do produto** (textos, diálogos, mensagens ao usuário) | ⬜ | _a preencher_ |
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
| 8 | 2026-10-27 | Danillo Meira | Claude Code (Opus 5.5) | Geração de código | Esqueleto do backend em Fastify para a Vercel, com Repository e Retry pattern e testes | Estrutura em `backend/` e skill `arquiteto-de-software` | _pendente_ | `backend/**`, `.claude/skills/arquiteto-de-software/` |
| 9 | 2026-10-27 | Danillo Meira | Claude Code (Opus 5.5) com busca na web | Documentação / Pesquisa | Documentar a motivação da stack com dados de mercado e criar uma skill por tecnologia | Documento de stack, decisões técnicas e 7 skills; números conferidos na Stack Overflow 2025 e no State of JS 2025 | _pendente_ | `docs/04-tecnico/**`, `docs/07-conformidade/{licencas-e-assets,fontes-e-referencias}.md`, `.claude/skills/{web-react-vite,mobile-expo,ui-ux-designer,supabase,postgresql,deploy-vercel,backend-customizado}/` |
| 10 | | | | | | | | |

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
