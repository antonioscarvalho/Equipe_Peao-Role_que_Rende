---
title: A Queda do Broto
schema-version: 2
genre: ficção interativa
sub-genre: fábula espacial de recuperação
setting-era: presente, num bairro brasileiro e no asteroide Vila Estrela
status: planning
themes:
  - recuperação é um passo de cada vez
  - pedir ajuda divide o peso
  - nada que foi aceso apaga
pov: first-person
tense: present
form: chapter-book
language: pt-BR
premise: "A gente se recupera quando cuida da luz que ainda tá acesa, uma de cada vez e junto de alguém, porque correr atrás do que foi perdido só apaga mais."
counter-premise: "Dá pra recuperar tudo de uma vez: o dobro tá logo ali, na próxima vez. (A voz do Cometa da Sorte.)"
ifid: FB6741F2-F85B-48E3-8CC4-6DA7A05B23B6
target-words: 10000
---

# A Queda do Broto

## Synopsis

O Broto cai da nave da família na praça de um bairro apagado. O pai dele perdeu a luz da casa para o Cometa da Sorte. Junto com a pessoa, o Broto acende o bairro, uma luz de cada vez, para a família conseguir achá-lo lá de cima.

## Tone & Style

Fala de gente jovem, leve e direta, com gíria leve ("bora", "rolê", "tamo junto") e sem caricatura. O Broto fala em primeira pessoa, no presente, com frases curtas.

O tom é de orgulho do que é seu: família, vizinhança, o que foi feito com esforço. A história nunca explora a dor, nunca promete dinheiro e nunca mostra pobreza como cenário triste.

## Notes

**Fonte de verdade dos textos:** `docs/03-design/narrativa-broto.md`. Este projeto organiza personagens, mundo, continuidade e o grafo de escolhas; não reescreve fala. Mudou aqui, mude lá (e o contrário).

**Hierarquia das skills.** As skills de história (`interactive-fiction`, `scene-craft`, `character-management`, `worldbuilding`, `plot-structure`, `revision-continuity`, `voice-style`, `theme-craft`) cuidam do ofício. Elas ficam **abaixo** das skills clínicas e éticas, que decidem o que o Broto pode dizer: `seguranca-e-crise`, `entrevista-motivacional`, `design-etico-saude-digital`, `prevencao-recaida`, `tcc-reestruturacao-cognitiva` e `conformidade-legal-br`. Quando um conselho de ofício (mais conflito, mais suspense, cliffhanger, vilão) bater com elas, a skill clínica vence.

**Regras que a história não quebra:**
- O Cometa aparece sempre de longe. Nada descreve o lado divertido da aposta.
- O pai não é vilão: caiu numa promessa feita para enganar e pediu ajuda.
- O Broto nunca morre, e nada que foi aceso apaga, nem num lapso.
- Toda conversa tem "Agora não". A pessoa nunca é obrigada a responder, e as respostas não são salvas.
- O Broto é apoio, não terapeuta.
- Sem gancho de ansiedade no fim do capítulo ("e agora?", contagem regressiva). O fim de cada capítulo fecha com calma; a vontade de voltar vem do vínculo, não da tensão.

**Forma interativa.** Cada capítulo é uma conversa (`web/src/historia/Dialogo.tsx`) depois de um jogo. As escolhas da pessoa mudam a fala do Broto **naquele momento** e voltam a se juntar no mesmo caminho (estrutura em gargalo): como nada é salvo, nenhuma escolha pode mudar um capítulo seguinte.

