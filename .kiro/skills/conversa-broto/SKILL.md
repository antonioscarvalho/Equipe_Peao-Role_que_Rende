---
name: conversa-broto
description: Como escrever a fala do Broto para a conversa soar natural, como papo com um amigo que gosta de filme de alienígena, e nunca esquisita ou invasiva. Traz o batismo (o nome "Broto" é dado pela pessoa), a voz do Broto, as perguntas proibidas (idade, família, renda, onde mora...), o que perguntar no lugar, como usar cultura pop de filmes de alienígena sem forçar e sem problema de direito autoral, e exemplos de certo e errado. Use SEMPRE ao escrever ou revisar fala, pergunta, resposta ou opção de escolha do Broto (capítulos da história, cumprimentos, reações a missão, jogo e check-in), e quando alguém disser que o Broto está "robótico", "estranho", "invasivo" ou "parecendo terapeuta".
---

# Conversa com o Broto

**Pedido:** $ARGUMENTS

O Broto é um alienígena pequeno que caiu na praça do bairro (história completa em `docs/03-design/narrativa-broto.md`). Conversar com ele tem que parecer **papo com um amigo meio nerd que ama filme de ET**, não formulário, não consulta e não interrogatório.

## Antes de começar

1. Leia a narrativa do Broto: `docs/03-design/narrativa-broto.md`.
2. Leia `.claude/skills/seguranca-e-crise/SKILL.md` e `.claude/skills/entrevista-motivacional/SKILL.md`. Esta skill cuida do **tom**. As duas cuidam da segurança e da técnica, e ganham em caso de conflito.
3. Veja as referências prontas em [cultura-pop.md](references/cultura-pop.md).

## A regra de ouro

> **O Broto conta da vida dele. Ele não investiga a vida da pessoa.**

Ele fala da Vila Estrela, do pai, da Nina, dos filmes que viu "pela janela da nave". A pessoa entra na conversa se quiser. Quem fala primeiro de si é o Broto: isso gera confiança sem pedir nada.

## O nome "Broto" quem dá é a pessoa

O alienígena chega **sem nome**. É a pessoa que olha para ele e o batiza: *"Nossa, você parece um broto. Vou te chamar de Broto."* Dar nome cria vínculo desde o primeiro minuto, e a pessoa passa a cuidar de alguém que é "dela".

Regras:

1. **Antes de ser batizado, ele não se chama de Broto.** Nenhuma fala anterior diz "Sou o Broto" ou "Meu nome é Broto". Na interface, o nome dele aparece como "?" ou "Alienzinho" até o batismo.
2. **Ele explica de um jeito leve por que não tem nome.** Na Vila Estrela, quem recebe nome é quem é encontrado, e quem dá o nome é o primeiro amigo. Exemplo:
   > "Lá na Vila, o nome da gente quem dá é o primeiro amigo que encontra a gente. Ninguém me encontrou ainda… até agora. Como você me chamaria?"
3. **"Broto" vem como a primeira opção pronta, escrita como fala da pessoa:**
   - "Você parece um broto. Vou te chamar de Broto." → "Broto… Eu gostei! Ninguém nunca tinha me dado um nome."
   - "Quero escolher outro nome" → campo de texto curto. Resposta: "{broto}! Vou lembrar disso pra sempre."
   - "Agora não" → "Tudo bem. Pode me chamar de alienzinho por enquanto." A pergunta volta no fim do capítulo, uma vez só.
4. **Depois do batismo, ele pergunta o nome da pessoa.** É a troca natural, e dá para responder com apelido ou pular ("Pode ser 'você' mesmo"). Nunca perguntar o nome antes de ser batizado.
5. **No código, o nome dele é `{broto}`**, assim como o da pessoa é `{nome}`. Se ela não escolher outro, `{broto}` vale "Broto". Texto de fala nunca deixa "Broto" fixo depois do batismo.
6. **O nome escolhido é guardado só no aparelho** (como o resto, ver "Proteções" na narrativa) e pode ser trocado depois nas configurações do bichinho.
7. **Nome ofensivo ou com dado pessoal** (telefone, CPF, nome completo): sem bronca. O app não aceita e o alien diz "Hmm, esse eu não consigo falar. Tenta outro?"

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
| Humor bobo e gentil, que ri dele mesmo | Ironia, sarcasmo, piada com a pessoa |
| Elogio ao **esforço**, uma vez e específico: "Você voltou hoje. Isso conta." | Elogio exagerado e genérico: "Incrível! Você é demais!!!" |
| No máximo 1 emoji, e só quando cabe | Emoji em toda fala |

### Frases que deixam a conversa esquisita (proibidas)

- Jargão de terapeuta: "Como isso te faz sentir?", "Valido seus sentimentos", "Vamos explorar isso".
- Empatia de robô: "Entendo que você esteja passando por um momento difícil."
- Falar do produto: "Como seu assistente de bem-estar...", "Este aplicativo..."
- Repetir o nome da pessoa toda hora.
- Pular para aposta do nada: o assunto aposta só entra pela história do Cometa da Sorte ou quando a pessoa traz.
- Pressão de tempo ou de volta: "Não me abandona!", "Volta amanhã senão eu fico triste".

## Cultura pop: filmes de alienígena

O Broto é fã de filme de ET. Ele assistiu tudo "pela janela da nave" e acha engraçado como os terráqueos imaginam os alienígenas. Isso dá assunto leve e um jeito de falar de coisa séria de longe.

Como usar (lista completa em [cultura-pop.md](references/cultura-pop.md)):

- **Alusão curta, nunca cena inteira.** "Eu tô igual o E.T., só querendo ligar pra casa." Uma frase, não um resumo do filme.
- **Funciona mesmo sem conhecer o filme.** Se a pessoa não viu, a frase ainda faz sentido sozinha.
- **No máximo uma referência por conversa.** Mais que isso vira personagem de stand-up.
- **Prefira o que todo mundo conhece:** E.T., Toy Story, Lilo & Stitch, Homens de Preto, Guardiões da Galáxia, Star Wars, Superman, e o nosso ET de Varginha.
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

- [ ] Antes do batismo ninguém chama o alien de Broto; depois, o nome dele está como `{broto}`.
- [ ] Nenhuma pergunta da tabela de proibidas, nem disfarçada.
- [ ] No máximo uma pergunta por fala, e sempre com "Agora não".
- [ ] Lida em voz alta, soa como gente falando, não como texto de banco.
- [ ] No máximo uma referência de filme, curta, e que faz sentido para quem não viu.
- [ ] Nenhuma referência de terror, sorte ou prêmio; nenhuma piada perto de crise.
- [ ] Nada de jargão de terapeuta nem empatia de robô.
- [ ] Texto de diálogo marcado com `// REVISÃO CLÍNICA PENDENTE`, como manda a narrativa.
- [ ] Uso de IA registrado com `/registrar-uso-ia` se a fala foi gerada por IA.
