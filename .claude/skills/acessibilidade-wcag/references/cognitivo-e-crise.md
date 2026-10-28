# Acessibilidade cognitiva e o momento de crise

A WCAG cobre pouco a cognição. Aqui ela é o centro: quem abre o Guardião na hora da fissura está com a atenção estreitada, a memória de curto prazo comprometida, às vezes alcoolizado, com vergonha e com pressa. Uma tela que exige ler três parágrafos ou lembrar o que foi dito antes **falha com essa pessoa**, mesmo passando em todo critério AA.

Base: [W3C COGA, Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/) (os oito objetivos abaixo vêm de lá) e as skills `seguranca-e-crise`, `design-etico-saude-digital` e `prevencao-recaida` deste repositório. Onde esta lista e a WCAG pedem coisas diferentes, vale a mais exigente.

## As regras, por objetivo do COGA

### 1. Ajudar a pessoa a entender o que é e como usar
- Uma tela, um propósito, uma ação principal. A ação principal é a maior e fica ao alcance do polegar.
- Botão diz o que acontece ("Ligar para o CVV, 188"), nunca "OK", "Continuar" solto ou "Clique aqui".
- Ícone sempre com texto. Ícone sozinho só se for universal (X de fechar, seta de voltar) e ainda assim com `aria-label`.

### 2. Ajudar a encontrar o que precisa
- "Preciso de ajuda agora" em **toda** tela, no mesmo lugar, a um toque, sem PIN, primeiro na ordem do teclado depois do "pular para o conteúdo".
- No máximo 5 itens na barra de navegação, sempre na mesma ordem.
- Caminho para a crise: de qualquer tela, no máximo **2 toques** até o número de telefone discado.

### 3. Usar conteúdo claro
- Frase de até 15 palavras na média; uma ideia por frase; voz ativa; segunda pessoa ("você").
- Palavra do dia a dia: "vontade de apostar", não "fissura" sem explicar; "recaída" só depois de explicada, e preferindo "lapso" (sem tom de fracasso).
- Sigla por extenso na primeira vez em cada tela (CVV, CAPS, SAMU) (3.1.4).
- Número escrito como número ("3 semanas"), data por extenso ("27 de outubro"), dinheiro com R$ e a palavra "estimativa" quando for estimativa.
- Nada de ironia, metáfora que precise ser decifrada, ou linguagem de aposta ("aposte em você", "ganhe", "prêmio", "sorte").

### 4. Ajudar a evitar erros e a corrigi-los
- Toda ação que apaga é confirmada ou desfeita (3.3.6). Desfazer é melhor que confirmar: "Contato apagado. **Desfazer**" por alguns segundos, sem sumir sozinho antes de a pessoa ver (2.2.1).
- Erro diz o que fazer, sem culpa: "Escreva só números, como 150", não "Valor inválido".
- Nenhum campo obrigatório que não precise ser. Relato, humor, gatilho: opcionais e ditos como opcionais.

### 5. Ajudar a manter o foco
- Sem interrupção (2.2.4): nada de pop-up, pedido de avaliação, toast que rouba foco ou "dica do dia" no meio de uma tarefa.
- Sem movimento competindo com o texto: o bichinho pode respirar devagar, mas para quando a pessoa está lendo instrução, e para de vez com "reduzir animações".
- Sem som que toca sozinho (1.4.2). Som só por escolha, com volume e parar.

### 6. Não depender da memória
- Nada que foi dito numa tela é pedido de novo na seguinte (3.3.7): o gatilho do pós-lapso chega marcado no plano.
- Instrução fica visível enquanto a pessoa faz a tarefa, não só antes (a fase da respiração fica escrita durante a fase).
- PIN: aceita colar, aceita gerenciador, mostra os números se pedir, e o esqueci tem saída que não exige lembrar nada (3.3.8, 3.3.9).
- Progresso salvo sempre: sair no meio e voltar devolve onde parou.

### 7. Dar ajuda e apoio
- Todo campo que pede reflexão ("o que costuma vir antes da vontade?") tem exemplo e dica.
- Ajuda humana sempre visível; o app nunca é a única saída.
- Mensagem no momento difícil acolhe antes de instruir: "Que bom que você abriu o app. Vamos passar por isso juntos." e depois a ação.

### 8. Respeitar o ritmo e a autonomia
- Sem prazo em nada (2.2.3). O timer da onda é a atividade, e tem pausar, mais tempo e parar.
- Nada muda de tela sozinho (3.2.5): fim do timer, fim da respiração e fim do check-in mostram o resultado na mesma tela.
- Nada de pressão por sequência ("não perca sua sequência!"); perder a sequência não é punido nem anunciado com tom de perda.

## O caminho de crise: critérios que nunca podem falhar

Toda mudança que toca o `Crise.tsx`, o `Sos.tsx`, o shell (`App.tsx`) ou o PIN passa por esta lista **à mão**, com teclado e com leitor de tela, antes do PR. Uma falha aqui bloqueia mesmo que tudo o mais esteja verde.

| # | Critério | Como conferir |
|---|---|---|
| C1 | "Preciso de ajuda agora" visível e alcançável em toda tela, inclusive com PIN ligado e com o modal aberto. | Percorrer as rotas; ligar o PIN; abrir cada modal. |
| C2 | Com teclado: no máximo 3 Tabs desde o topo da página até o botão de ajuda. | Recarregar a página, contar os Tabs. |
| C3 | Com leitor de tela: o botão é anunciado como "Preciso de ajuda agora, botão" (ou link), sem nada antes que confunda. | NVDA ou TalkBack. |
| C4 | Na tela de crise, o primeiro foco é o título, e o segundo é a ligação para o CVV 188. Número e nome por extenso no rótulo. | Leitor de tela. |
| C5 | Contraste ≥ 7:1 em todo texto das telas de SOS e crise, nos dois temas. | `contraste.mjs --minimo 7` e conferir os seletores dessas telas. |
| C6 | Funciona sem internet (o service worker serve a tela de crise). | DevTools → Network → Offline → recarregar em `/ajuda`. |
| C7 | Nenhuma animação, som ou mudança automática de tela no caminho de crise. | Abrir com "reduzir animações" desligado e observar 30 s. |
| C8 | Alvos ≥ 48 px e afastados; nenhum toque acidental liga para o número errado. | DevTools → modo dispositivo 360 px, inspecionar caixas. |
| C9 | Com a fonte em "maior" (spec 008) e zoom de 200%, o número de telefone não quebra no meio nem fica cortado. | Ajustar e olhar. |

## Texto do produto: checagem rápida antes do commit

- [ ] Li em voz alta e não tropecei.
- [ ] Nenhuma frase com mais de 25 palavras.
- [ ] Nenhuma sigla sem extenso na tela.
- [ ] Nenhuma palavra de aposta ou de culpa ("viciado", "fracasso", "perdeu", "sorte", "ganhe").
- [ ] Botões dizem o que acontece.
- [ ] Revisão clínica pendente marcada no arquivo de conteúdo, se o texto é clínico.
