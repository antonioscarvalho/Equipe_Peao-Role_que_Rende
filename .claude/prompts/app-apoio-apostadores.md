# Prompt para o Claude Code — App de apoio a pessoas com problemas com apostas ("bets")

> Cole este texto no Claude Code, na raiz do projeto, depois de copiar a pasta `.claude/skills/` para lá.

---

## Contexto e papel

Você vai atuar como uma equipe multidisciplinar condensada: **engenheiro(a) de software sênior**, **designer de produto com foco em saúde digital** e **pesquisador(a) em psicologia clínica baseada em evidências**. Vamos construir um **webapp (PWA) e/ou aplicativo mobile** para ajudar pessoas no Brasil que apostam de forma problemática em casas de apostas — especialmente sites ilegais/não autorizados — a reduzir e interromper o comportamento, recuperar o controle financeiro e prevenir recaídas.

O app **não substitui tratamento profissional**. Ele é uma ferramenta de autoajuda guiada e de ponte para ajuda especializada (CAPS AD, psicólogos, grupos de mútua ajuda, CVV).

## Skills disponíveis neste projeto

Antes de projetar qualquer funcionalidade, carregue e siga as skills relevantes em `.claude/skills/`:

| Skill | Use quando |
|---|---|
| `tcc-reestruturacao-cognitiva` | Funcionalidades que trabalham pensamentos e crenças sobre aposta (distorções, registro de pensamentos, diário) |
| `entrevista-motivacional` | Onboarding, metas, textos do app, qualquer momento de ambivalência ou de definir "por que parar" |
| `prevencao-recaida` | Gatilhos, fissura/urgência, plano de enfrentamento, botão SOS, lidar com lapsos |
| `controle-estimulos-financas` | Bloqueios, autoexclusão, barreiras financeiras, contador de dinheiro poupado, ambiente |
| `seguranca-e-crise` | **Sempre**. Qualquer tela, notificação, conteúdo ou fluxo que toque em risco, sofrimento intenso, dívidas ou ideação suicida |
| `design-etico-saude-digital` | **Sempre**. Gamificação, notificações, retenção, dados sensíveis (LGPD), linguagem e acessibilidade |

`seguranca-e-crise` e `design-etico-saude-digital` são obrigatórias em todas as fases.

## Fase 1 — Pesquisa baseada em evidências

Pesquise na web e consolide, **citando fontes com link** e indicando o nível de evidência (revisão sistemática/meta-análise > ECR > estudo observacional > opinião de especialista):

1. **Transtorno do jogo**: critérios do DSM-5-TR e CID-11 (6C50), curso, comorbidades (depressão, ansiedade, uso de álcool, risco de suicídio aumentado), particularidades das apostas esportivas e cassinos online (velocidade, disponibilidade 24h, apostas ao vivo, PIX).
2. **Intervenções com evidência**: TCC para transtorno do jogo (incluindo a abordagem cognitiva de Ladouceur e o modelo de Petry), Entrevista Motivacional, Prevenção de Recaída (Marlatt & Gordon), intervenções baseadas em mindfulness, intervenções digitais/autoguiadas e por internet (iCBT), terapia de casal/família, abordagens de mútua ajuda. Priorize revisões Cochrane, meta-análises recentes e a diretriz do NICE sobre danos relacionados a jogo de azar.
3. **Instrumentos de rastreio e acompanhamento**: PGSI, BBGS, NODS-CLiP, e escalas de desfecho (gasto, frequência, tempo, fissura). Verifique validação em português do Brasil e licenciamento antes de propor uso.
4. **Contexto brasileiro**: Lei 14.790/2023 e portarias da Secretaria de Prêmios e Apostas (SPA/Ministério da Fazenda), lista oficial de operadores autorizados, mecanismos de autoexclusão disponíveis hoje, regras sobre PIX/cartão para apostas, dados recentes de prevalência e endividamento (Banco Central, Datafolha, pesquisas acadêmicas), rede de cuidado (CAPS AD, RAPS, CVV 188, Jogadores Anônimos). **Verifique o estado atual** — essa regulação muda com frequência.
5. **Evidências sobre apps de saúde mental**: o que funciona em engajamento sem prejudicar (just-in-time adaptive interventions, EMA), riscos conhecidos e o que evitar.

**Entregáveis da Fase 1** (em `docs/pesquisa/`):
- `01-transtorno-do-jogo.md`, `02-intervencoes.md`, `03-instrumentos.md`, `04-contexto-brasil.md`, `05-saude-digital.md`
- `00-sintese.md`: resumo de 1–2 páginas com as 10 conclusões mais importantes para o produto.
- Marque com ⚠️ toda afirmação que você não conseguiu confirmar em fonte primária. Não invente números, estudos ou citações.

## Fase 2 — Do conceito à funcionalidade

Crie `docs/produto/matriz-conceito-funcionalidade.md`: uma tabela que liga **cada conceito psicológico** → **mecanismo de mudança** → **funcionalidade do app** → **evidência** → **métrica de sucesso** → **riscos e mitigação**. Use as skills para gerar as funcionalidades. Exemplo de linha esperada:

| Conceito | Mecanismo | Funcionalidade | Evidência | Métrica | Risco/mitigação |
|---|---|---|---|---|---|
| Distorção "vou recuperar o que perdi" (chasing) | Reestruturação cognitiva | Card "Pare e examine" acionado no SOS, com perguntas socráticas | TCC para TJ (citar) | % de episódios de fissura sem aposta | Tom culpabilizante → revisar com skill de EM |

Depois, priorize com MoSCoW e defina um **MVP** de 6–10 funcionalidades. O MVP deve obrigatoriamente incluir: onboarding motivacional, botão SOS de fissura, plano de prevenção de recaída, registro diário simples, contador de dias/dinheiro preservado, guia de bloqueio/autoexclusão e protocolo de crise.

## Fase 3 — Arquitetura e design

- Proponha 2 opções de stack (ex.: PWA com Next.js; React Native/Expo) com prós e contras para este público (celulares Android de entrada, internet instável, privacidade). **Pergunte qual eu prefiro antes de codar.**
- **Privacidade por padrão**: offline-first, dados sensíveis criptografados no dispositivo, uso sem cadastro possível, nenhuma telemetria sem consentimento explícito, conformidade com a LGPD (dados de saúde = dados sensíveis).
- Escreva os fluxos principais (`docs/produto/fluxos.md`) e os textos de interface (`docs/produto/microcopy.md`) seguindo as skills de EM e design ético.
- Linguagem: português do Brasil simples (nível de leitura de ensino fundamental), sem jargão, sem julgamento.

## Fase 4 — Implementação

- Implemente o MVP em incrementos pequenos, um módulo por vez, com testes.
- Conteúdos psicoeducativos e exercícios ficam em arquivos de conteúdo separados do código (ex.: `content/*.json` ou `*.md`), para revisão por um(a) psicólogo(a).
- Cada módulo terapêutico deve ter no topo um comentário com: conceito, skill usada, fonte(s).
- Antes de concluir cada módulo, rode o checklist das skills `seguranca-e-crise` e `design-etico-saude-digital` e registre o resultado em `docs/revisoes/<modulo>.md`.

## Regras inegociáveis

1. Nunca use mecânicas de aposta no app: recompensas aleatórias, roletas, caixas surpresa, "streak" que pune a quebra, rankings competitivos.
2. Nunca culpe, envergonhe ou ameace o usuário. Lapso é dado, não fracasso.
3. O app não diagnostica. Rastreios geram orientação e encaminhamento, nunca rótulo.
4. Todo fluxo com risco detectado mostra caminho imediato para ajuda humana (CVV 188, SAMU 192, CAPS).
5. Não colete dados que não são essenciais. Nada de dados sensíveis em URL, logs ou analytics.
6. Não faça promessas de cura nem afirmações sem evidência.
7. Sinalize claramente que todo conteúdo clínico precisa de validação por profissional de psicologia antes do lançamento.

## Como trabalhar comigo

- Comece pela Fase 1 sem me perguntar; ao terminar, mostre a síntese e espere meu ok para a Fase 2.
- Ao fim de cada fase, me dê: o que foi feito, decisões tomadas, dúvidas abertas e próximo passo.
- Se encontrar evidência que contradiz algo deste prompt, me avise em vez de seguir cegamente.
