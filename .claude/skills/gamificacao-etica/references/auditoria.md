# Checklist de auditoria de gamificação

Para cada tela, componente ou spec. Classificação: 🔴 bloqueia (fere o edital ou o design ético) · 🟡 ajustar · 🟢 de acordo.

## 1. Objetivo e comportamento (Werbach 6D, Burke)
- [ ] O objetivo é **da pessoa** (o motivo dela), não de engajamento?
- [ ] O comportamento-alvo está escrito e é medido por **desfecho** (dias sem apostar, queda da vontade, acesso a ajuda), não por tempo de uso?

## 2. Motivações (Chou, Octalysis)
- [ ] Usa só motivações 1, 2, 3, 5 (e 4 com cuidado)?
- [ ] 🔴 Existe escassez, prazo, "só hoje" ou contagem regressiva (6)?
- [ ] 🔴 Existe algo imprevisível, sorteado ou surpresa como recompensa (7)?
- [ ] 🔴 Existe ameaça de perder algo, sequência que zera com destaque ou "perdeu tudo" (8)?

## 3. Laços (Kim, Adams)
- [ ] O laço principal é curto: ação → retorno ≤ 1 s → progresso?
- [ ] Os ciclos **estabilizam** (realimentação negativa) em vez de acelerar?
- [ ] 🔴 Existe recurso acumulável, gastável ou trocável (pontos, moedas, itens)?

## 4. Recompensa e punição (Schell)
- [ ] A recompensa é **previsível e anunciada**?
- [ ] Ela reforça esforço e valores, não sorte?
- [ ] 🔴 O lapso é punido (perda visual, personagem triste ou doente, texto de culpa)?

## 5. Participação voluntária (McGonigal)
- [ ] Tudo tem "pular", "agora não" ou "ainda não sei"?
- [ ] Nada obriga a voltar todo dia?

## 6. Sinais de cassino (edital 8.4, design ético)
- [ ] 🔴 Moeda girando, confete, brilho, som de vitória, roleta ou caça-níquel, mesmo como enfeite?
- [ ] 🔴 Valor em dinheiro atribuído a ações ou recompensas?
- [ ] 🔴 Ranking ou comparação com outras pessoas?

## 7. Execução
- [ ] Animação de 150–250 ms, desligável (`prefers-reduced-motion` e opção do app)?
- [ ] Retorno em texto, não só cor ou animação?
- [ ] Textos revisados com `entrevista-motivacional`?

## Como registrar
Em `docs/03-design/auditoria-gamificacao.md`: uma linha por achado, com onde está (arquivo, tela ou spec), classificação, autor ou princípio violado e sugestão.
