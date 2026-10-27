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
