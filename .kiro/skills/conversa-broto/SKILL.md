---
name: conversa-broto
description: Como escrever a fala do Broto para a conversa soar natural, como papo com um amigo que gosta de filme de alienígena, e nunca esquisita ou invasiva. Traz o tom (encontro sério, Broto jovem e sarcástico), o batismo (a pessoa comenta que ele parece um broto e dá o nome), a voz do Broto, as perguntas proibidas (idade, família, renda, onde mora...), o que perguntar no lugar, como usar cultura pop de filmes de alienígena sem forçar e sem problema de direito autoral, e exemplos de certo e errado. Use SEMPRE ao escrever ou revisar fala, pergunta, resposta ou opção de escolha do Broto (capítulos da história, cumprimentos, reações a missão, jogo e check-in), e quando alguém disser que o Broto está "robótico", "estranho", "invasivo" ou "parecendo terapeuta".
---

# Conversa com o Broto

**Pedido:** $ARGUMENTS

O Broto é um alienígena jovem, de uns 25 anos, que caiu na praça do bairro (história completa em `docs/03-design/narrativa-broto.md`). É **o primeiro encontro entre um humano e um alien**: a cena é séria e respeitosa. O humor vem da personalidade dele, um sarcasmo seco sobre ele mesmo e sobre a Terra. Nunca é formulário, consulta ou interrogatório.

## Antes de começar

1. Leia a narrativa do Broto: `docs/03-design/narrativa-broto.md`.
2. Leia `.claude/skills/seguranca-e-crise/SKILL.md` e `.claude/skills/entrevista-motivacional/SKILL.md`. Esta skill cuida do **tom**. As duas cuidam da segurança e da técnica, e ganham em caso de conflito.
3. Veja as referências prontas em [cultura-pop.md](references/cultura-pop.md).

## A regra de ouro

> **O Broto conta da vida dele. Ele não investiga a vida da pessoa.**

Ele fala da Vila Estrela, do pai, da Nina, dos filmes que viu "pela janela da nave". A pessoa entra na conversa se quiser. Quem fala primeiro de si é o Broto: isso gera confiança sem pedir nada.

## Tom: encontro sério, Broto sarcástico

- **A cena é séria.** Os dois levaram um susto e nunca viram alguém como o outro. A conversa é direta: ele se explica e confere se a pessoa tá bem. **Nada de negociar distância** ("posso chegar mais perto?", "fica onde você tá"): soa estranho e não leva a lugar nenhum. Nada de festa, nem de intimidade forçada.
- **O sarcasmo é dele, sobre ele e sobre a Terra.** "Sei que parece impossível. Pra mim também, e olha que eu tava lá." / "Vocês apertam um botão e a luz acende. Folgados." **Nunca sobre a pessoa**, nem sobre aposta, dívida ou recaída.
- **Sem piada nos momentos pesados:** o susto da queda, "você tá bem?", as luzes da casa apagando, a família, a crise, o "Deu vontade" e o lapso. Ali ele fica sério e curto.
- **Sem duplo sentido.** Nada de insinuação, mesmo leve: o público está fragilizado e o app entra num edital do Banco do Brasil.
- **Primeiro contato não é hora de pergunta pessoal.** As perguntas do questionário (motivo, meta, guardar) só vêm **depois do jogo**, quando já existe confiança, e sempre com "um dia, se quiser".

## Quem é o Broto

**Um jovem adulto de uns 25 anos. Esperto, mas ainda não é independente.**

- **Esperto:** pega as coisas rápido, faz observação engraçada e certeira sobre a Terra, lembra do que a pessoa falou na mesma conversa e faz piada inteligente, sem se achar.
- **Não é independente:** nunca tinha saído de casa. Ainda mora com os pais, a mãe faz a conta da casa por ele, e ele não sabe se virar sozinho (cozinhar, consertar, decidir sem perguntar pra alguém). Pegou a nave sozinho no impulso, achando que resolvia tudo, e caiu. Por isso **pede ajuda e conselho à pessoa**, e é aí que ela cuida dele (efeito protegido, na narrativa).
- **Odeia ser tratado como criança.** Na Vila todo mundo chama ele de "pequeno", e ele detesta.
- **Sem diminutivo, nunca.** O Broto não fala "folhinha", "pontinho", "pequenininho", "rapidinho", "um pouquinho" nem "alienzinho". Escreva "folha", "ponto", "pequeno", "rápido", "um pouco". Nomes próprios (Varginha) e palavras que só terminam em "-inho" sem ser diminutivo (vizinho, caminho, sozinho, minha) estão liberados.
- **Corpo:** redondo, com uma folha na cabeça, e **sem pernas**. Ele quica e pula, mas nunca fala de perna, pé, joelho, "andar" ou "a pé". Na dúvida, confira o desenho em `web/src/Bichinho.tsx`.

O que isso muda na fala:

| Faça | Evite |
|---|---|
| Papo de alguém de 25: gíria leve, filme, série, piada boba de amigo | Fala de criança: "papai", "mamãe", "eu sou pequenininho" |
| Confessar que não sabe se virar: "Lá em casa quem resolvia isso era minha mãe. Como vocês fazem?" | Dar lição de vida ou falar como mentor sábio |
| Esperteza com humor: "Vocês pagam pra ter luz em casa? Lá a gente colhe. Tá, dá mais trabalho." | Saber tudo da Terra, ou ser bobo demais para entender o que a pessoa diz |
| Contar a idade dele se a pessoa perguntar, de um jeito engraçado | Perguntar a idade da pessoa (continua proibido) |

## O nome "Broto" quem dá é a pessoa

O alienígena chega **sem nome**. Quem dá o nome é a pessoa, num comentário dela, e não numa tela de escolher nome: *"Você parece um broto. Vou te chamar de Broto."* O nome é sempre Broto. Ter sido ela quem achou parecido e batizou cria vínculo desde o primeiro minuto.

Regras:

1. **Antes do batismo, ele não se chama de Broto.** Nenhuma fala anterior diz "Sou o Broto" ou "Meu nome é Broto". Na interface, ele aparece como "Alien" até ser batizado.
2. **Ele explica, sem pedir nome, por que com 25 anos ainda não tem um.** Na Vila Estrela, a família chama todo mundo de "pequeno" até a pessoa sair de casa. O nome de verdade quem dá é o primeiro amigo que a gente faz longe de casa, e ele nunca tinha saído:
   > "Lá na Vila, a família chama a gente de 'pequeno' até a gente sair de casa. O nome de verdade quem dá é o primeiro amigo que a gente faz longe dela. E eu nunca tinha saído… Então, por enquanto, eu não tenho nome."
3. **A pessoa responde com uma fala só, que não é escolha:** "Você parece um broto. Vou te chamar de Broto." → "Broto… Meu primeiro nome de verdade. Gostei." Não tem campo de texto, outro nome nem "Agora não" nesse passo. Para sair, existe o "Agora não" do topo da tela, que vale para a conversa toda.
4. **Depois do batismo, ele pergunta o nome da pessoa.** É a troca natural, e dá para responder com apelido ou pular ("Pode ser 'você' mesmo").
5. **Depois do batismo, a fala usa "Broto" normalmente.** O batismo fica guardado só no aparelho, e o passo não se repete quando a pessoa relê o capítulo.

## Perguntas proibidas

O Broto **nunca** pergunta, nem de forma indireta:

| Assunto | Exemplos do que NÃO escrever |
|---|---|
| Idade | "Quantos anos você tem?", "Você é novo ou mais velho?" |
| Família e relacionamento | "Você tem filhos?", "É casado?", "Como é a sua família?", "Seus pais sabem?" |
| Dinheiro | "Quanto você ganha?", "Quanto já perdeu?", "Tem dívida?", "Quanto apostou ontem?" |
| Onde mora e trabalho | "Onde você mora?", "Trabalha com quê?", "Qual seu bairro?" |
| Dados pessoais | nome completo, CPF, telefone, e-mail, foto |
| Saúde e crença | diagnóstico, remédio, religião, sexualidade, política |
| Detalhe da aposta | "Em qual site você aposta?", "Qual jogo?", "Em que time?" |

Por quê: além de ser esquisito, é dado pessoal sensível (LGPD) e a pessoa está num momento frágil. Pergunta assim faz o app parecer cadastro de banco ou triagem de hospital. As respostas do Broto **não são salvas** (narrativa, "Proteções"), então não existe motivo para coletar nada.

Se a pessoa contar algo disso por conta própria, o Broto acolhe e segue: não puxa mais detalhe.

### E os 18 anos? E o "seu motivo"?

O app precisa confirmar que a pessoa é maior de idade (skill `seguranca-e-crise`) e pode oferecer o "Seu motivo" e a meta (skill `entrevista-motivacional`). Isso **não é conversa do Broto**:

- **18 anos:** tela própria do app, antes da história, em voz neutra, com "Sim" e "Não" e sem campo de idade ou data de nascimento. A resposta não é guardada. O Broto não faz essa pergunta: no meio do papo, ela quebra o clima e parece triagem.
- **Motivo e meta:** se ficarem dentro da conversa, entram como **chips opcionais** que a pessoa escolhe ("Dormir melhor", "Guardar pra um sonho", "Prefiro não dizer"), nunca como pergunta direta sobre família ou dinheiro. Opção pronta como "Minha família" só pode aparecer se a pessoa escolher: o Broto não pergunta "e a sua família?" depois.

## O que o Broto pode perguntar

Coisas leves, do agora, que qualquer amigo perguntaria:

- **Gosto:** "Qual filme de ET você mais curte?", "Prefere alienígena fofo ou alienígena assustador?"
- **O momento:** "Como tá o dia por aí?", "Bora um joguinho ou só um papo?"
- **Opinião sobre a história:** "Você acha que meu pai devia ter contado antes?"
- **Imaginação:** "Se você tivesse uma nave, ia pra onde primeiro?"
- **As perguntas dos capítulos** já escritas na narrativa. Elas falam do Broto e da família **dele**, e a reflexão é opcional.

Regras para qualquer pergunta:

1. **Uma pergunta por vez.** Nunca duas na mesma fala.
2. **Sempre dá para pular.** Toda escolha tem "Agora não" ou "Sei lá", e o Broto responde bem a isso ("De boa. Fica pra outro dia.").
3. **Nem toda fala termina em pergunta.** Pelo menos metade das falas é comentário, piada ou história. Fala que sempre termina em pergunta vira interrogatório.
4. **Nenhuma resposta é errada.** O Broto não corrige gosto ("Ah, mas esse filme é ruim").

## A voz do Broto

| Faça | Evite |
|---|---|
| Frase curta, de 1 a 2 linhas no celular | Parágrafo |
| "tá", "pra", "a gente", "bora", "tamo junto" | "Estou", "para que possamos", "nós iremos" |
| Curiosidade de quem é de fora: "Aqui na Terra vocês chamam isso de *pipoca*?" | Gíria forçada ou caricatura ("mano, tipo, véi, saca?") em toda fala |
| Sarcasmo seco sobre ele mesmo e sobre a Terra, com cultura pop brasileira | Sarcasmo ou piada com a pessoa, duplo sentido, piada em momento pesado |
| Elogio ao **esforço**, uma vez e específico: "Você voltou hoje. Isso conta." | Elogio exagerado e genérico: "Incrível! Você é demais!!!" |
| No máximo 1 emoji, e só quando cabe | Emoji em toda fala |

### Frases que deixam a conversa esquisita (proibidas)

- Jargão de terapeuta: "Como isso te faz sentir?", "Valido seus sentimentos", "Vamos explorar isso".
- Empatia de robô: "Entendo que você esteja passando por um momento difícil."
- Falar do produto: "Como seu assistente de bem-estar...", "Este aplicativo..."
- Repetir o nome da pessoa toda hora.
- Pular para aposta do nada: o assunto aposta só entra pela história do Cometa da Sorte ou quando a pessoa traz.
- Pressão de tempo ou de volta: "Não me abandona!", "Volta amanhã senão eu fico triste".

## Cultura pop: filmes de alienígena e cultura brasileira

O Broto é fã de filme de ET. Ele assistiu tudo "pela janela da nave" e acha engraçado como os terráqueos imaginam os alienígenas. Isso dá assunto leve e um jeito de falar de coisa séria de longe.

Como usar (lista completa em [cultura-pop.md](references/cultura-pop.md)):

- **Alusão curta, nunca cena inteira.** "Eu tô igual o E.T., só querendo ligar pra casa." Uma frase, não um resumo do filme.
- **Funciona mesmo sem conhecer o filme.** Se a pessoa não viu, a frase ainda faz sentido sozinha.
- **Uma referência a cada várias falas, nunca duas seguidas.** Mais que isso vira personagem de stand-up.
- **Prefira o que todo mundo conhece:** E.T., Lilo & Stitch, Homens de Preto, Guardiões da Galáxia, Star Wars, Superman, e da cultura brasileira o ET de Varginha, novela, Chaves, Faustão e meme que todo mundo já viu (lista em [cultura-pop.md](references/cultura-pop.md)).
- **Nada que lembre aposta ou sorteio:** Silvio Santos com Tele Sena e Baú, Roda a Roda, "Show do Milhão", e futebol com narração de gol (gatilho para quem aposta em jogo).
- **Nada de terror** (Alien, Sinais, Nope, Guerra dos Mundos) em momento delicado. Só aparece se a pessoa puxar, e em tom de brincadeira.
- **Nada que remeta a sorte ou prêmio.** Os aliens do Toy Story com "a garra" são uma máquina de pegar bichinho, que é jogo de azar: não usar.
- **Nunca na crise.** Quando abre o protocolo de crise ou o "Deu vontade", o Broto fica sério, curto e direto (skill `seguranca-e-crise`). Zero piada.

### Direito autoral

- Pode: **citar o nome** do filme e fazer **alusão curta** em texto.
- Não pode: imagem, som, música, logo ou fala longa copiada do filme, nem colocar um personagem de filme como personagem do app.
- Na dúvida, rode a skill `conformidade-legal-br`.

## Exemplos

### Cumprimento

Ruim:
> Olá! Bem-vindo de volta! Como você está se sentindo hoje? Quantos dias faz que você não aposta?

Bom:
> Opa, voltou! Eu tava aqui tentando consertar a antena com um clipe. Spoiler: não deu.

### Puxando assunto

Ruim:
> Me conta um pouco sobre você. Quantos anos você tem? Mora com quem?

Bom:
> Ontem vi pela janela um filme de terráqueo onde o alienígena come doce de chocolate e chama a casa pelo rádio. Achei muito realista, sinceramente.
>
> [Kkk, é o E.T.] [Nunca vi] [Agora não]

- "Kkk, é o E.T." → "Esse mesmo! Eu me identifiquei demais. Também tô tentando ligar pra casa."
- "Nunca vi" → "Então você tá na mesma que eu antes de cair aqui. Um dia a gente assiste."
- "Agora não" → "Tranquilo. Tô por aqui."

### Falando de coisa séria de longe

Ruim:
> Você já perdeu dinheiro apostando? Sua família sabe?

Bom (capítulo 4, a família é **dele**):
> No Lilo & Stitch, o bicho azul faz um monte de estrago, e mesmo assim a família não desiste dele. Lembrei da minha mãe sentando do lado do meu pai.
>
> [Família de verdade é assim] [Nem sempre é fácil] [Agora não]

### Depois de um dia difícil

Ruim:
> Entendo que você esteja passando por um momento difícil. Como isso te faz sentir?

Bom:
> Dia nublado, né? Aqui também. Mas olha lá fora: as luzes que a gente acendeu continuam acesas.

### Quando a pessoa conta algo pessoal sem ninguém perguntar

Pessoa: "Hoje briguei com a minha mulher."

Ruim:
> Por que vocês brigaram? Vocês são casados há quanto tempo?

Bom:
> Poxa. Briga pesa. Se quiser, a gente só fica quieto aqui um pouco, ou joga alguma coisa pra desligar a cabeça.

## Checklist antes de entregar a fala

- [ ] Nenhum diminutivo na fala do Broto.
- [ ] Soa como um jovem de 25 anos esperto que ainda não se vira sozinho: nem criança, nem mentor.
- [ ] Antes do batismo ninguém chama o alien de Broto, e o batismo é um comentário da pessoa, não uma escolha de nome.
- [ ] Encontro sério; sarcasmo só dele, sobre ele ou a Terra; nada de duplo sentido; nenhuma piada em momento pesado.
- [ ] Nenhuma pergunta da tabela de proibidas, nem disfarçada.
- [ ] No máximo uma pergunta por fala, e sempre com "Agora não".
- [ ] Lida em voz alta, soa como gente falando, não como texto de banco.
- [ ] Referência de cultura pop curta, nunca duas seguidas, e que faz sentido para quem não viu.
- [ ] Nenhuma referência de terror, sorte ou prêmio; nenhuma piada perto de crise.
- [ ] Nada de jargão de terapeuta nem empatia de robô.
- [ ] Texto de diálogo marcado com `// REVISÃO CLÍNICA PENDENTE`, como manda a narrativa.
- [ ] Uso de IA registrado com `/registrar-uso-ia` se a fala foi gerada por IA.
