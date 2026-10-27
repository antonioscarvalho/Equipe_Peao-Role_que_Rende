# Matriz conceito → funcionalidade (Fase 2)

> Feita em 27/10/2026 a partir da [pesquisa da Fase 1](../pesquisa/00-sintese.md), da [visão do produto](visao-do-produto.md) (conceito **Guardião**) e das skills de `.claude/skills/`.
> As skills obrigatórias `seguranca-e-crise` e `design-etico-saude-digital` foram aplicadas em **todas** as linhas.
> ⚠️ **Todo conteúdo clínico precisa de validação por profissional de psicologia antes do lançamento.**

## 1. Matriz

Legenda de evidência: **MA** = meta-análise/revisão sistemática · **ECR** = ensaio clínico randomizado · **OBS** = observacional · **OP** = opinião de especialista/plausibilidade teórica.

| # | Conceito | Mecanismo de mudança | Funcionalidade | Evidência | Métrica de sucesso | Risco → mitigação | Skill |
|---|---|---|---|---|---|---|---|
| 1 | Ambivalência e motivação própria | Evocar "fala de mudança"; balança decisória | **Onboarding "Seu motivo"** (≤ 5 telas): pergunta aberta, chips de motivos, régua de importância e confiança (0–10); o motivo fica fixado na tela inicial e no SOS | EM reduz frequência por até 12 meses (MA, Yakovenko 2015) | % que conclui o onboarding; confiança (0–10) na semana 1 vs. semana 4 | Tom de sermão → microcopy com perguntas abertas; quem ainda não decidiu parar não é empurrado para um plano | `entrevista-motivacional` |
| 2 | Fissura é uma onda que passa | Urge surfing; adiar a decisão; autoeficácia | **Botão SOS** a 1 toque, que funciona offline: fissura 0–10 → timer de 10–15 min com respiração → "Seu motivo" → card de distorção → ação do plano/contato → fissura 0–10 de novo | Mindfulness g ≈ 0,69 para fissura (MA, tentativo); urge surfing (Marlatt) (OP); JITAI promissor (ECR em revisão) | % de episódios de SOS que terminam sem aposta (autorrelato); queda média da fissura antes/depois | Desespero detectado no SOS → protocolo de crise (#9); o SOS nunca é o único caminho | `prevencao-recaida` |
| 3 | Distorção "vou recuperar o que perdi" (chasing) e ilusão de controle | Reestruturação cognitiva com perguntas socráticas | **Cards "Pare e examine"** no SOS e na biblioteca: uma distorção por card, 2–3 perguntas, sem resposta pronta | TCC: benefício pós-tratamento (MA Cochrane 2012); correção cognitiva (ECR, Ladouceur 2001) | % de usos do SOS em que um card foi aberto; utilidade percebida (👍/👎) | Tom culpabilizante → validar a emoção antes; revisão com a skill de EM | `tcc-reestruturacao-cognitiva` |
| 4 | Situações de alto risco e enfrentamento | Intenções de implementação ("Se… então…") | **Plano de prevenção de recaída**: mapa de gatilhos (chips + texto) e até 5 planos Se/Então editáveis | Prevenção de recaída como componente da TCC (ECR); intenções de implementação (OP para jogo) | % de usuários com pelo menos 1 plano; uso do plano no SOS | Lista de gatilhos estigmatizante → linguagem neutra; nada de citar times ou marcas | `prevencao-recaida` |
| 5 | Efeito de violação da abstinência | Lapso como informação, não fracasso | **Registro diário simples** (1 toque: "apostei / não apostei" + humor opcional) e **fluxo pós-lapso** sem punição: o que aconteceu antes → gatilho → ajuste do plano | Modelo de Marlatt & Gordon (OP/teoria); NICE prevê suporte a recaída | % de lapsos que geram ajuste no plano; dias sem apostar após um lapso | Registro virar vigilância/culpa → texto "Obrigado por registrar", sem destaque negativo | `prevencao-recaida` |
| 6 | Reforço de progresso e de valores (não de sorte) | Feedback previsível ligado aos valores da pessoa | **Contador de dias e de dinheiro preservado**: **total** de dias sem apostar no período + sequência atual com tom neutro; dinheiro preservado = estimativa semanal × semanas, ligada a uma meta concreta ("botijão de gás", "conta de luz") | Petry: exercícios feitos associados à abstinência (ECR); restante (OP) | Dias sem apostar/mês (desfecho principal); % com meta definida | Streak que "zera" → proibido; sem confete nem som de vitória; valor mostrado como **estimativa** (CDC) | `controle-estimulos-financas`, `design-etico-saude-digital` |
| 7 | Companheiro empático (Guardião) | Aliança e acolhimento; marcos previsíveis | **Guardião**: personagem que acompanha a jornada, cresce com marcos **anunciados** (7, 30, 90 dias) e acolhe nos lapsos ("Recomeçar faz parte"); nunca adoece nem morre | Gamificação em saúde mental pouco guiada por teoria (MA, Cheng 2019) → evidência fraca (OP) | Utilidade percebida; não usar tempo de tela como métrica | Virar Tamagotchi (culpa) ou loot box → só marcos previsíveis, sem recompensa aleatória nem itens colecionáveis | `design-etico-saude-digital` |
| 8 | Controle de estímulos (fricção) | Reduzir acesso e pistas | **Guia de bloqueio e autoexclusão** passo a passo: DNS/filtro no Android, desinstalar apps, sair de grupos de "tips", parar de seguir influenciadores, limite de Pix noturno, pessoa de confiança para o cartão; autoexclusão gov.br **se ainda ativa** | Bloqueio como "quebra-molas", sem ECR (OBS/OP); autoexclusão melhor em camadas (OBS) | % que conclui pelo menos 3 passos do guia | Desde a MP 1.394, **todo site de bet é ilegal** e não respeita autoexclusão → priorizar bloqueio técnico e financeiro; conteúdo regulatório em arquivo com data de verificação | `controle-estimulos-financas` |
| 9 | Risco de suicídio e crise | Encaminhamento imediato a ajuda humana | **Protocolo de crise**: tela calma → CVV 188, SAMU 192, contato de confiança, CAPS → respiração **depois** das opções → plano de segurança simples. Acessível a ≤ 2 toques de qualquer tela, funciona offline | Mortalidade por suicídio ≈ 15× (OBS, Karlsson 2018); NICE NG248 | % de telas com acesso ao protocolo em ≤ 2 toques (meta: 100%); nenhum evento de crise em analytics | Detecção automática errada → só perguntas diretas e opcionais; palavra-chave no diário só **oferece** ajuda | `seguranca-e-crise` |
| 10 | Apoio social | Rede de apoio reduz isolamento | **Círculo de Confiança**: até 3 contatos guardados **no dispositivo**, com mensagem pronta "Estou com vontade de apostar, pode falar comigo?" que **o usuário envia** (o app nunca envia sozinho) | JA associado à abstinência (ECR, Petry 2006); NICE inclui pessoas afetadas | % com pelo menos 1 contato; uso do contato no SOS | Exposição involuntária → nada de compartilhamento automático; dado de terceiro só local (LGPD) | `prevencao-recaida`, `seguranca-e-crise` |
| 11 | Apoio humano potencializa autoajuda | Ponte para tratamento | **Hub de apoio**: Meu SUS Digital/teleatendimento, UBS/CAPS, Jogadores Anônimos, CVV, Defensoria/Procon para dívidas, com links em arquivo de conteúdo datado | iCBT com apoio > sem apoio (MA); Petry 2006 (ECR) | Cliques em canais de ajuda profissional | Link quebrado ou serviço desatualizado → arquivo de conteúdo com data; ⚠️ teleatendimento SUS ainda sem fonte oficial | `seguranca-e-crise` |
| 12 | Memória seletiva | Confrontar com o saldo real | **"Saldo real"**: registro opcional de gastos e ganhos com apostas e total acumulado | TCC (MA); Ladouceur (ECR) | Uso em quem ainda aposta (público de redução de danos) | Gatilho de vergonha → tom neutro; nunca em notificação | `tcc-reestruturacao-cognitiva` |
| 13 | Psicoeducação sobre probabilidade | Correção de crenças sobre acaso | **Micro-lições** de 1 tela: margem da casa, falácia do apostador, quase-ganho, com simulação **visual e educativa** de 1.000 apostas mostrando a tendência do saldo | Ladouceur 2001 (ECR) | Conclusão das lições; 👍/👎 | Simulação atrativa → a regra 8.4 do edital exige finalidade educativa explícita; sem "você ganhou!", resultado sempre revelado | `tcc-reestruturacao-cognitiva`, `conformidade-legal-br` |
| 14 | Dívidas e reorganização | Reduzir dano financeiro | **Organizador de dívidas**: lista, prioridade sugerida (essenciais e juros altos primeiro), Desenrola 3.0 (a partir de fev/2027), Defensoria/Procon; **nunca** sugerir empréstimo | (OP) | % com lista criada | Informação errada sobre programa → fonte e data; nada de crédito | `controle-estimulos-financas` |
| 15 | Momentos de risco previsíveis | JITAI / EMA | **Agenda de alto risco**: a pessoa marca dias e horários (dia do pagamento, jogo de domingo) e recebe check-in leve, opt-in, com texto discreto | JITAI (ECR em revisão) | Lapsos nos horários marcados | Notificação como gatilho → texto neutro, opt-in, limite definido pela pessoa | `prevencao-recaida`, `design-etico-saude-digital` |
| 16 | Monitoramento do comportamento | Feedback objetivo | **Sensor Open Finance** (conceito do Guardião): detectar transações para intermediadoras e alimentar o "dinheiro resgatado" | Nenhuma evidência clínica encontrada (OP) | — | **Alto risco**: dado financeiro sensível de terceiro; detectar recaída automaticamente vira vigilância; com sites ilegais, intermediadoras mudam o tempo todo; o edital proíbe dados de clientes BB → **só demo com dados sintéticos/sandbox**, opt-in explícito, nunca "detecta recaída", só sugere registrar | `conformidade-legal-br`, `design-etico-saude-digital` |
| 17 | Rastreio de gravidade | Autoconhecimento e encaminhamento | **Autoavaliação PGSI** opcional, devolvida como orientação | PGSI usado no LENAD; no Brasil só validade de conteúdo (2026) | Mudança no PGSI em 4 semanas | Rótulo e diagnóstico → nunca; ⚠️ licença não verificada | `seguranca-e-crise` |
| 18 | Mindfulness além da fissura | Regulação emocional | **Exercícios curtos** (respiração, body scan de 3 min) com áudio opcional | MA (tentativo) | Uso fora do SOS | Substituir ajuda em crise → sempre depois das opções de ajuda | `prevencao-recaida` |

## 2. Ajustes propostos à visão do produto

| Na visão atual | Problema | Proposta |
|---|---|---|
| "Minigame anti-ansiedade (quebra do pico dopaminérgico em 5 minutos)" | Afirmação sem evidência (regra inegociável 6); minigame pode lembrar jogo de azar | **Timer de urge surfing de 10–15 min** com respiração; se houver interação, que seja calma e sem pontuação |
| "Open Finance como sensor passivo" / "sistema detecta recaída" | Vigilância e dado sensível; o edital veda dados de clientes BB; difícil com sites ilegais | Rebaixar para **Could**: demo com dados **sintéticos**, opt-in, e o app só **sugere** registrar, nunca conclui que houve recaída. Modo manual é o padrão |
| "Integrado ao ecossistema Open Finance do Banco do Brasil" / nome "Guardião Rolê que Rende" | O edital limita o uso das marcas BB e BBDW ao que a organização autorizar (8.4) | Confirmar com a organização; até lá, usar só **"Guardião"** e falar de "Open Finance" de forma genérica |
| Link para a Plataforma de Autoexclusão como item central | Status depois da MP 1.394 não confirmado; sites ilegais não respeitam | Manter como item condicional no guia de bloqueio, com data de verificação |
| "Compartilhando vitórias" no Círculo de Confiança | Pode expor a pessoa | Compartilhar só quando o usuário escolher, com prévia do texto; nada automático |

## 3. Priorização (MoSCoW)

| Prioridade | Funcionalidades |
|---|---|
| **Must** | #1 Onboarding "Seu motivo" · #2 Botão SOS · #4 Plano de prevenção de recaída · #5 Registro diário + pós-lapso · #6 Contador de dias e dinheiro preservado · #8 Guia de bloqueio/autoexclusão · #9 Protocolo de crise · #11 Hub de apoio |
| **Should** | #3 Cards "Pare e examine" (dentro do SOS) · #7 Guardião (camada visual sobre o contador) · #10 Círculo de Confiança |
| **Could** | #12 Saldo real · #13 Micro-lições · #14 Organizador de dívidas · #16 Open Finance (só demo sintética) · #18 Exercícios de mindfulness |
| **Won't (agora)** | #15 Agenda de alto risco com notificações (exige push e testes de tom) · #17 PGSI (licença e validação pendentes) |

## 4. MVP proposto (10 funcionalidades)

Os 7 itens obrigatórios do prompt ✅, mais 3 que sustentam o conceito Guardião e os pilares do edital:

| # | Funcionalidade | Pilar do edital | Obrigatório no prompt |
|---|---|---|---|
| 1 | Onboarding motivacional "Seu motivo" | Vontade de jogar | ✅ |
| 2 | Botão SOS de fissura (com cards "Pare e examine") | Vontade de jogar | ✅ |
| 3 | Plano de prevenção de recaída (gatilhos + Se/Então) | Vontade de jogar | ✅ |
| 4 | Registro diário simples + fluxo pós-lapso | Vontade de jogar | ✅ |
| 5 | Contador de dias e dinheiro preservado | Vida financeira | ✅ |
| 6 | Guia de bloqueio e autoexclusão | Vida financeira | ✅ |
| 7 | Protocolo de crise | Ajuda especializada | ✅ |
| 8 | Hub de apoio (SUS, CAPS, JA, CVV, Defensoria) | Ajuda especializada | — |
| 9 | Círculo de Confiança | Rede de apoio | — |
| 10 | Guardião (companheiro visual não punitivo) | Diferencial / Inovação | — |

**Viabilidade no Game Jam:** com 2 pessoas de desenvolvimento e entrega até 29/10 às 11h, a sugestão é implementar de ponta a ponta #1, #2, #5, #7 e #10 (o caminho da demo) e fazer #3, #4, #6, #8 e #9 em versão simples, com conteúdo em arquivo. Isso é decisão da equipe (Produto e Gestão).

## 5. Dúvidas abertas para a Fase 3
1. A equipe aceita rebaixar o Open Finance para "Could / só demo sintética"?
2. A organização autoriza "Rolê que Rende" no nome do app?
3. Frontend: o backend já está em Fastify na Vercel (branch do Danillo). O MVP precisa mesmo de backend? A pesquisa pede **offline-first sem cadastro**, então o backend serviria só para conteúdo ou para a demo de Open Finance.
4. Quem faz a revisão clínica dos textos de crise e dos cards?
