---
name: gamificacao-etica
description: Projeta e audita gamificação no Guardião com base em Werbach, Yu-kai Chou (Octalysis), Amy Jo Kim, Jesse Schell, Ernest Adams, Jane McGonigal e Brian Burke, filtrada para um app de quem quer parar de apostar. Use ao criar ou revisar missões, marcos, progresso, recompensas, feedback, personagem (Guardião), metas, desafios, notificações ou qualquer "mecânica de jogo", e quando pedirem "gamificar", "engajar", "motivar", "dar recompensa", "missão", "nível", "conquista", "badge", "pontos", "trilha" ou "isso vicia?".
---

# Gamificação ética — Guardião

Base: 7 livros indicados pela equipe ([bibliografia](references/bibliografia.md)). Os conceitos estão resumidos com palavras nossas em [frameworks](references/frameworks.md); o que pode e o que não pode no nosso app está no [catálogo](references/catalogo.md).

> **Por que "ética":** o público é especialmente sensível a recompensa variável, urgência e perda — exatamente o que as apostas exploram. Toda técnica passa pelo filtro da skill `design-etico-saude-digital` e da Seção 8.4 do edital (nada de sorte, aposta ou valor monetário, salvo fim educativo explícito).

## Princípios (o que os autores dizem e como aplicamos)

1. **Motivação de dentro, não de fora** (Chou: "chapéu branco" e lado direito do Octalysis; Burke: o objetivo é o da pessoa, não o do app). Usamos sentido, progresso visível, autonomia e vínculo. **Não** usamos escassez, imprevisibilidade nem medo de perder.
2. **Comece pelo comportamento, não pelos pontos** (Werbach, 6D). Antes de qualquer mecânica: qual comportamento queremos (atravessar a vontade, registrar o dia, pedir ajuda) e qual é a métrica de **desfecho**.
3. **Laço curto que ensina** (Amy Jo Kim, laço de aprendizagem; Adams, ciclos de realimentação). Ação → retorno imediato e honesto → progresso. Preferimos **realimentação negativa** (estabiliza: depois de um lapso, o app acolhe e reequilibra) a **positiva** (que acelera e vicia).
4. **Participação voluntária** (McGonigal: meta, regras, retorno e participação voluntária). Tudo é convite: pular, "agora não" e "ainda não sei" são sempre possíveis.
5. **Experiência antes da mecânica** (Schell, tétrade e lentes). Pergunte que **emoção** a pessoa deve sentir — no nosso caso, calma, competência e não estar sozinha — e só então escolha mecânica, história, estética e tecnologia.
6. **Jornada do jogador** (Kim): descoberta → entrada → hábito → domínio. No Guardião o "domínio" é **precisar menos do app**, não usar mais.

## Como usar

### Ao projetar uma funcionalidade
1. Rode os **6D** de Werbach ([frameworks](references/frameworks.md)) em 6 linhas: objetivo, comportamento-alvo, quem é a pessoa (Marcos ou Dona Célia), laço de atividade, onde está a diversão (aqui: alívio e competência) e ferramentas.
2. Marque no **Octalysis** quais motivações a funcionalidade aciona. Se acionar 6 (escassez), 7 (imprevisibilidade) ou 8 (perda e evitação), **redesenhe**.
3. Escolha componentes só da coluna "permitido" do [catálogo](references/catalogo.md).
4. Desenhe o laço: ação → retorno (≤ 1 s, em texto) → progresso previsível. Confira se o laço **estabiliza**.
5. Escreva os textos com a skill `entrevista-motivacional` e anime com `animar-componente` (modo calmo do `guia-estilo-role-que-rende`).

### Ao revisar (auditoria)
Use o [checklist de auditoria](references/auditoria.md). Classifique cada achado em 🔴 bloqueia (fere edital ou ética), 🟡 ajustar, 🟢 de acordo. Registre a auditoria em `docs/03-design/auditoria-gamificacao.md`.

## Regras rápidas

| Sempre | Nunca |
|---|---|
| Marcos **anunciados** antes (7, 30, 90 dias, com "faltam N") | Recompensa surpresa, baú, roleta, sorteio, "girar" |
| Progresso que **um lapso não apaga** (total do período) | Sequência que zera com destaque, "perdeu tudo" |
| Retorno em texto, calmo, sobre o esforço e os valores da pessoa | Confete, som de vitória, moeda girando, "+R$" por tarefa |
| Comparar só consigo mesmo | Ranking, placar entre pessoas, competição |
| Convites opcionais, sem prazo | "Missões do dia" que expiram, contagem regressiva, "só hoje" |
| Dinheiro sempre como **estimativa** ligada a uma meta real | Moeda, ponto ou item trocável; valor atribuído a ações |
| Personagem que acompanha e acolhe | Bichinho que adoece, chora ou morre (Tamagotchi punitivo) |

## Relação com outras skills
- `design-etico-saude-digital` e `seguranca-e-crise`: obrigatórias, vencem em caso de conflito.
- `criar-personagem` e `animar-componente`: execução visual; esta skill decide **se** e **como** gamificar.
- `pitch-gamificacao`: como apresentar isto à Banca.
