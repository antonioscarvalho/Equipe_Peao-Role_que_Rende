# `.claude/` — Skills de SDD para agentes de IA

Esta pasta guarda as **skills do Claude Code** que a equipe usa para trabalhar com **SDD (Spec-Driven Development)**: primeiro escrevemos a especificação, depois o plano e as tarefas, e só então o agente de IA implementa. Cada passo tem uma skill e gera um artefato versionado em [`specs/`](../specs/README.md).

> O Claude Code reconhece a pasta `.claude/` (em minúsculas). Não renomeie para `.CLAUDE`, senão as skills não são carregadas.

## Por que SDD num hackathon?

- **Foco:** a spec define o que entra na demo e o que fica de fora, antes de gastar tempo de código.
- **Paralelismo:** com tarefas bem descritas, cada integrante (e cada agente) pega uma sem conflito.
- **Rastreabilidade:** cada funcionalidade liga um pilar do desafio → spec → tarefas → commits. Isso ajuda no pitch e na declaração de uso de IA.
- **Conformidade:** toda spec passa pelas regras do edital (Seção 8.4) **antes** de virar código.

## Fluxo

```
/sdd-especificar → specs/NNN-nome/spec.md        (o QUÊ e o PORQUÊ)
       ↓  revisão humana
/sdd-planejar    → specs/NNN-nome/plano.md       (o COMO técnico)
       ↓  revisão humana
/sdd-tarefas     → specs/NNN-nome/tarefas.md     (passos pequenos e verificáveis)
       ↓
/sdd-implementar → código + commits              (uma tarefa por vez)
       ↓
/sdd-revisar     → specs/NNN-nome/revisao.md     (spec x código x edital)
       ↓
/conformidade-legal-br → relatório de conformidade (edital + leis)

Durante todo o fluxo:
/registrar-uso-ia  → docs/07-conformidade/declaracao-de-uso-de-ia.md
/registrar-asset   → docs/07-conformidade/licencas-e-assets.md
```

**Regra de ouro:** nenhum avanço de etapa sem um humano da equipe ler e aprovar o artefato anterior.

## Skills disponíveis

| Skill | Estado | Responsável | O que faz |
|---|---|---|---|
| [`sdd-especificar`](skills/sdd-especificar/SKILL.md) | 🟢 base pronta | _a definir_ | Cria a spec de uma funcionalidade |
| [`sdd-planejar`](skills/sdd-planejar/SKILL.md) | 🟢 base pronta | _a definir_ | Gera o plano técnico a partir da spec |
| [`sdd-tarefas`](skills/sdd-tarefas/SKILL.md) | 🟢 base pronta | _a definir_ | Quebra o plano em tarefas |
| [`sdd-implementar`](skills/sdd-implementar/SKILL.md) | 🟢 base pronta | _a definir_ | Implementa uma tarefa por vez |
| [`sdd-revisar`](skills/sdd-revisar/SKILL.md) | 🟢 base pronta | _a definir_ | Confere implementação x spec x edital |
| [`registrar-uso-ia`](skills/registrar-uso-ia/SKILL.md) | 🟢 base pronta | _a definir_ | Adiciona uma linha na declaração de uso de IA |
| [`registrar-asset`](skills/registrar-asset/SKILL.md) | 🟢 base pronta | _a definir_ | Registra biblioteca, asset ou API e sua licença |
| [`guia-estilo-role-que-rende`](skills/guia-estilo-role-que-rende/SKILL.md) | 🟢 base pronta | Maykon Júnio | Guia de estilo do Rolê que Rende (cores, fontes, grafismos, componentes, animações, tom de voz), extraído do site oficial e do Manual de Identidade Visual. Inclui tokens CSS/JSON e página de exemplo |
| [`conformidade-legal-br`](skills/conformidade-legal-br/SKILL.md) | 🟢 base pronta | Atyrson Souto | Revisa código, telas e textos contra o edital (Seção 8.4, 8.5, Anexo 2) e leis brasileiras: LGPD (dados de saúde são sensíveis), apostas, saúde mental, acessibilidade (LBI/WCAG), CDC, ECA, direitos autorais e Marco Civil. Também disponível em `.kiro/skills/` |
| [`arquiteto-de-software`](skills/arquiteto-de-software/SKILL.md) | 🟢 base pronta | Danillo Meira | Estrutura do backend (Fastify/Vercel): camadas, Repository e Retry, regras da Vercel e do edital |

### Skills de stack

Uma por tecnologia. A motivação de cada escolha está em [`docs/04-tecnico/stack-e-motivacao.md`](../docs/04-tecnico/stack-e-motivacao.md).

| Skill | Estado | Responsável | O que faz |
|---|---|---|---|
| [`web-react-vite`](skills/web-react-vite/SKILL.md) | 🟢 base pronta | Danillo Meira | App web em React + Vite + TypeScript: estrutura, componente, hook, variável de ambiente, build |
| [`mobile-expo`](skills/mobile-expo/SKILL.md) | 🟢 base pronta | Danillo Meira | App mobile em React Native com Expo: Expo Router, biblioteca compatível, teste no Expo Go |
| [`ui-ux-designer`](skills/ui-ux-designer/SKILL.md) | 🟢 base pronta | Danillo Meira | Componente reutilizável, tokens do guia de estilo, os quatro estados de uma tela, acessibilidade |
| [`supabase`](skills/supabase/SKILL.md) | 🟢 base pronta | Danillo Meira | Cliente único, repositório com retry, chaves, Edge Functions, ambiente local |
| [`postgresql`](skills/postgresql/SKILL.md) | 🟢 base pronta | Danillo Meira | Migração, nomes, RLS em toda tabela, seed sintético |
| [`deploy-vercel`](skills/deploy-vercel/SKILL.md) | 🟢 base pronta | Danillo Meira | Publicação do web, variáveis, pré-visualização por PR, checklist da demo |
| [`backend-customizado`](skills/backend-customizado/SKILL.md) | 🟢 base pronta | Danillo Meira | Quando criar backend próprio, Fastify ou Go, Repository e Retry |

### Skills de conteúdo clínico e ético (app de apoio a apostadores)

Vieram do prompt de produto em [`prompts/app-apoio-apostadores.md`](prompts/app-apoio-apostadores.md). As duas marcadas com ⚠️ são **obrigatórias em toda funcionalidade**.

| Skill | Estado | Responsável | O que faz |
|---|---|---|---|
| [`seguranca-e-crise`](skills/seguranca-e-crise/SKILL.md) ⚠️ | 🟢 base pronta | _a definir_ | Protocolo de risco e crise: CVV 188, SAMU 192, CAPS, plano de segurança, limites clínicos |
| [`design-etico-saude-digital`](skills/design-etico-saude-digital/SKILL.md) ⚠️ | 🟢 base pronta | _a definir_ | Gamificação sem mecânica de aposta, notificações discretas, LGPD, linguagem simples, acessibilidade |
| [`entrevista-motivacional`](skills/entrevista-motivacional/SKILL.md) | 🟢 base pronta | _a definir_ | Onboarding, metas e textos baseados em Entrevista Motivacional |
| [`prevencao-recaida`](skills/prevencao-recaida/SKILL.md) | 🟢 base pronta | _a definir_ | Gatilhos, botão SOS, urge surfing, plano Se/Então, resposta a lapsos |
| [`tcc-reestruturacao-cognitiva`](skills/tcc-reestruturacao-cognitiva/SKILL.md) | 🟢 base pronta | _a definir_ | Distorções cognitivas das apostas, registro de pensamentos, cards "Pare e examine" |
| [`controle-estimulos-financas`](skills/controle-estimulos-financas/SKILL.md) | 🟢 base pronta | _a definir_ | Bloqueios, autoexclusão, barreiras financeiras, dinheiro preservado, organizador de dívidas |

> Todo conteúdo clínico gerado com essas skills precisa de **revisão por psicólogo(a)** antes de ir para o produto.

As skills "base pronta" funcionam, mas são um ponto de partida. **Cada colaborador fica responsável por evoluir uma delas** conforme a stack e a ideia escolhidas (por exemplo: comandos de build e teste reais em `sdd-implementar`).

## Skills de terceiros

Skills da comunidade, copiadas **sem alterações** e revisadas antes de entrar (sem chamadas de rede nem comandos perigosos). Cada pasta tem `LICENSE` e `ORIGEM.md` (repositório e commit). Para atualizar, copie de novo a partir do repositório original e revise o conteúdo. As instruções delas estão em inglês e geram saídas em inglês, a menos que você peça em português.

| Skill | Para quê | Origem / licença | Atenção |
|---|---|---|---|
| **Ideias e produto** | | | |
| [`teach-acumen`](skills/teach-acumen/SKILL.md) | Configuração inicial: coleta o contexto do produto em `.acumen.md` | VGrss/Acumen · Apache-2.0 | **Rodar uma vez antes** das outras skills da Acumen |
| [`product-thinking`](skills/product-thinking/SKILL.md) | Núcleo de "pensamento de produto" usado pelas skills da Acumen | VGrss/Acumen · Apache-2.0 | Base das 4 abaixo |
| [`diagnose`](skills/diagnose/SKILL.md) | Acha problemas e oportunidades do produto | VGrss/Acumen · Apache-2.0 | Fluxo: diagnose → workshop → increment → critique-product |
| [`workshop`](skills/workshop/SKILL.md) | Gera várias soluções diferentes para um problema antes de escolher | VGrss/Acumen · Apache-2.0 | |
| [`increment`](skills/increment/SKILL.md) | Escopo de uma entrega (contexto, spec, wireframe) | VGrss/Acumen · Apache-2.0 | Sobrepõe `sdd-especificar`; prefira o fluxo SDD da equipe |
| [`critique-product`](skills/critique-product/SKILL.md) | Critica uma ideia/spec com rubrica e personas de avaliadores | VGrss/Acumen · Apache-2.0 | Bom para "pré-banca" |
| **Mercado e pitch** | | | |
| [`startup-validator`](skills/startup-validator/SKILL.md) | Validação rápida: mercado, concorrentes, problema, TAM/SAM | ailabs-393/ai-labs-claude-skills · MIT | Mais leve; boa para o Dia 1 |
| [`market-research`](skills/market-research/SKILL.md) | Pesquisa de mercado e concorrência com fontes | affaan-m/everything-claude-code · MIT | |
| [`startup-design`](skills/startup-design/SKILL.md) | Estratégia completa em 8 fases | ferdinandobons/startup-skill · MIT | **Pesada**: vários agentes em paralelo e muitas buscas. Cria uma pasta `<nome-do-projeto>/` na raiz |
| [`startup-competitors`](skills/startup-competitors/SKILL.md) | Battle cards e mapa de concorrentes | ferdinandobons/startup-skill · MIT | Pesada |
| [`startup-positioning`](skills/startup-positioning/SKILL.md) | Posicionamento (framework April Dunford) | ferdinandobons/startup-skill · MIT | Pesada |
| [`startup-pitch`](skills/startup-pitch/SKILL.md) | Roteiro de pitch (10, 5, 2 e 1 min), Q&A e rubrica | ferdinandobons/startup-skill · MIT | Útil para o [roteiro do pitch](../docs/06-entrega/roteiro-do-pitch.md) |
| **Revisão e erros** | | | |
| [`find-bugs`](skills/find-bugs/SKILL.md) | Bugs e falhas de segurança nas mudanças da branch | getsentry/skills · Apache-2.0 | Usa o comando `gh` para achar a branch base; sem ele, diga a base (ex.: `development`) |
| [`review-discipline`](skills/review-discipline/SKILL.md) | Revisão de código que exige provar cada problema | Skillproofdev/review-discipline · MIT | Dispara em qualquer pedido de revisão |
| [`codebase-review`](skills/codebase-review/SKILL.md) | Auditoria do projeto inteiro; gera `to_do.md` priorizado | nobelk/claude-tools · Apache-2.0 | |
| [`architecture-review`](skills/architecture-review/SKILL.md) | Analisa a arquitetura; gera `architecture_overview.md` | nobelk/claude-tools · Apache-2.0 | |
| [`security-scan`](skills/security-scan/SKILL.md) | Varredura OWASP Top 10 com script Python local | nobelk/claude-tools · Apache-2.0 | O script só lê arquivos |

Combo sugerido: `startup-validator` (Dia 1) → `critique-product` na ideia → fluxo SDD → `find-bugs` / `review-discipline` antes do PR → `startup-pitch`. Lembre: o que essas skills produzirem com IA entra na [declaração de uso de IA](../docs/07-conformidade/declaracao-de-uso-de-ia.md).

### Chamada automática (testado em 2026-10-27)

Todas as **40 skills** do projeto (da equipe e de terceiros) foram testadas numa sessão separada do Claude Code, com um pedido em português que **não citava o nome da skill**. Todas foram chamadas automaticamente. Duas só passaram depois de ajustar a descrição:
- `supabase`: não era chamada para "login com e-mail" ou "cadastro com senha"; ganhou esses gatilhos.
- `critique-product`: não era chamada com pedidos em português; ganhou gatilhos em português (registrado no `ORIGEM.md` dela).

Se uma skill não for chamada sozinha, escreva na `description` as palavras que a equipe usa de verdade, e não só o nome técnico. Ou chame direto com `/nome-da-skill`.

## Skills a construir pelos colaboradores

Ideias de skills que dependem da stack e da solução. Quem assumir, troque `⬜` por seu nome.

| Skill sugerida | Perfil indicado | Objetivo | Responsável |
|---|---|---|---|
| `revisar-tom-de-voz` | Narrativa e Conteúdo | Revisar textos do produto contra o [guia de tom de voz](../docs/03-design/conteudo-e-tom-de-voz.md) | ⬜ |
| `checar-acessibilidade` | Design / Dev | Auditar telas contra o [checklist de acessibilidade](../docs/03-design/acessibilidade.md) | ⬜ |
| `checar-fontes` | Narrativa e Conteúdo | Garantir que toda afirmação de saúde, finanças ou lei tenha fonte em [fontes](../docs/07-conformidade/fontes-e-referencias.md) | ⬜ |
| `gerar-dados-sinteticos` | Dev | Criar dados fictícios para a demo, nunca dados reais | ⬜ |
| `build-demo` | Dev | Gerar a build final e o checklist do plano B offline | ⬜ |
| `preparar-pitch` | Produto e Gestão | Montar o roteiro do pitch a partir das specs e das métricas | ⬜ |
| `diario-de-bordo` | Produto e Gestão | Registrar decisões no [diário de bordo](../docs/05-processo/diario-de-bordo.md) | ⬜ |

## Como criar uma nova skill

1. Crie `.claude/skills/<nome-da-skill>/SKILL.md`.
2. Use o cabeçalho:
   ```markdown
   ---
   name: nome-da-skill
   description: Uma frase dizendo o que faz e QUANDO usar. O agente decide usar a skill por esta frase.
   ---
   ```
3. Escreva as instruções em passos numerados, citando os arquivos do repositório que o agente deve ler.
4. Se precisar de modelos, coloque-os em `.claude/skills/<nome>/` (ex.: `modelo.md`) e referencie no `SKILL.md`.
5. Teste com `/nome-da-skill` no Claude Code, ajuste e abra um PR para `development`.
6. Atualize as tabelas acima.

## Regras para todos os agentes

Valem para qualquer skill e qualquer ferramenta de IA usada no projeto:

1. Ler o [resumo do edital](../docs/01-hackathon/resumo-do-edital.md) e respeitar a Seção 8.4 (nada que promova apostas, nada com dinheiro real ou valor monetário, nenhuma marca proibida, linguagem sem estigma).
2. Usar só dados públicos ou sintéticos. Nunca dados reais nem credenciais.
3. Nunca colocar chaves de API no repositório.
4. Todo uso relevante de IA é registrado com `/registrar-uso-ia`.
5. Todo asset, biblioteca ou API nova é registrada com `/registrar-asset`.
6. O agente propõe; **um humano da equipe revisa e aprova**.
