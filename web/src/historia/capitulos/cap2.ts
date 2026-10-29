// REVISÃO CLÍNICA PENDENTE
// Textos copiados de docs/03-design/narrativa-broto.md, "Capítulo 2: O Cometa da Sorte". Não editar aqui sem editar lá.
// Estágio: contemplação. Técnica: distorções do quase-ganho, do ganho no começo, da ilusão de controle e da memória
// seletiva (skill tcc-reestruturacao-cognitiva), pela história do pai do Broto (distância de si, Kross e Ayduk), e
// balança decisória (skill entrevista-motivacional). Nada da pessoa é guardado: só o apelido do perfil entra na fala.
// O jogo Desvia dos Cometas entra em capitulos/index.ts quando ficar pronto; sem ele, a conversa vai direto do "antes" ao "depois".
import type { Capitulo } from "../tipos";

export const cap2: Capitulo = {
  id: "cap2",
  titulo: "Capítulo 2: O Cometa da Sorte",
  falaAbertura: "Ufa. Desviar do brilho cansa mais do que parece.",
  perguntas: [
    { pergunta: "Alguém ganhava de verdade?", resposta: "Ganhava um aqui, outro ali, e a Vila inteira ficava sabendo. De quem perdia, ninguém falava." },
    { pergunta: "Você chegou a ir no cometa?", resposta: "Não. Eu só via do quintal. De longe parecia uma festa. De perto, eu nunca quis saber." },
    { pergunta: "O que a Vó Vega achava?", resposta: "Ela dizia que luz de verdade vem devagar, igual na cantiga. E que promessa que precisa de tanta música não se sustenta sozinha." },
    { pergunta: "Sua mãe sabia?", resposta: "No começo, não. Essa é uma história pra outro dia." },
  ],
  perguntaDoBroto: {
    texto: "Se meu pai te perguntasse se \"quase ganhar\" é meio caminho andado, o que você diria pra ele?",
    opcoes: [
      { rotulo: "Que quase é perder.", resposta: "Eu ia gostar que ele ouvisse isso de você. Às vezes, de fora, a gente enxerga melhor." },
      { rotulo: "Que eu entendo ele.", resposta: "Eu também entendo. Entender não é concordar. Dá pra entender e mesmo assim dizer que não é por aí." },
      { rotulo: "Não sei.", resposta: "Tudo bem. Eu demorei um tempão pra saber." },
    ],
  },
  antesDoJogo: [
    { humor: "feliz", fala: "Oi, {nome}. Você voltou. Ainda tô me acostumando com o nome. Broto. Combina comigo, admito." },
    { humor: "calmo", fala: "Da outra vez eu falei que lá na Vila aconteceu uma coisa com aposta, e que um dia eu te contava. Acho que hoje dá.", opcoes: [
      { rotulo: "Pode contar.", resposta: "Tá. Vou contar do meu jeito, devagar." },
      { rotulo: "Só se você quiser.", resposta: "Eu quero. Acho que contar ajuda a entender." },
    ] },
    { fala: "Lembra da cantiga da Vó? \"A luz vem devagar.\" Lá na Vila todo mundo sabia ela de cor." },
    { fala: "Aí um dia apareceu no céu uma coisa que prometia o contrário. Luz rápida. A gente chamava de Cometa da Sorte." },
    { fala: "Era uma estação enorme, passando bem no meio das três luas. Cheia de cor e de música. Dava pra ver de qualquer quintal." },
    { fala: "A promessa era simples. Você dava um pouco da sua luz e ele devolvia o dobro. Era só apertar um botão.", opcoes: [
      { rotulo: "Parece bom demais.", resposta: "Lá na Vila ninguém tinha estudado conta de cometa. Mas a Vó desconfiou na hora." },
      { rotulo: "E as pessoas acreditavam?", resposta: "Muita gente. Quando a conta da casa aperta, uma promessa fácil soa como saída." },
    ] },
    { humor: "calmo", fala: "Meu pai foi um dos primeiros. Dizia que era só pra dar uma força nas contas. E ele não é uma pessoa ruim, tá? Conserta a nave de meio mundo sem cobrar nada." },
    { fala: "No começo ele ganhou. Chegou em casa com o pote cheio, e todo mundo comemorou." },
    { fala: "Hoje eu acho que foi a pior coisa que podia ter acontecido. Ele achou que tinha descoberto o jeito.", opcoes: [
      { rotulo: "Por que a pior?", resposta: "Porque depois daquele dia, toda perda parecia azar, e todo ganho parecia talento dele." },
      { rotulo: "Ele entendia do cometa?", resposta: "Ele achava que sim. Dizia que sabia a hora certa de ir. O cometa não tava nem aí pra hora dele." },
    ] },
    { humor: "calmo", fala: "Os cometas desse jogo são parecidos com aquele: dourados, brilhando, prometendo o dobro. Encostar neles apaga uma luz minha." },
    { fala: "As sementes verdes são o contrário. Simples, e sempre no mesmo lugar. Essas fazem a gente crescer. Você me ajuda a desviar?", opcoes: [
      { rotulo: "Bora.", resposta: "Então eu desvio do brilho, e você me avisa quando eu me distrair." },
      { rotulo: "Como funciona?", resposta: "Você me guia pros lados. O dourado a gente deixa passar, o verde a gente pega. Dá pra parar quando quiser." },
    ] },
  ],
  depoisDoJogo: [
    { humor: "feliz", fala: "{folhas}" },
    { humor: "calmo", fala: "Reparou? O dourado brilha mais justo quando chega perto. É de propósito." },
    { fala: "Com meu pai era assim. Toda vez ele voltava dizendo \"Foi quase, filho. Na próxima vem.\"" },
    { fala: "Só que o quase nunca acendeu uma lâmpada lá em casa. Quase ganhar é só um jeito bonito de perder.", opcoes: [
      { rotulo: "Faz sentido.", resposta: "Eu demorei pra entender. O cometa fazia o quase parecer um prêmio." },
      { rotulo: "Às vezes o quase dá esperança.", resposta: "Dá. E era isso que o cometa queria: que a esperança voltasse no dia seguinte, com mais luz." },
    ] },
    { fala: "E tem uma coisa que ninguém comentava. O cometa sempre ia embora mais brilhante do que tinha chegado. Aquela luz vinha de algum lugar." },
    { fala: "Vocês aqui na Terra têm novela, né? Era igual. A vila inteira via que a vilã ia aprontar. Menos o meu pai." },
    { humor: "apoio", fala: "Fiquei pensando numa coisa. O que o cometa dava pro meu pai? E o que ele tirava?", opcoes: [
      { rotulo: "Dava esperança.", resposta: "Dava. E um alívio rápido quando a conta apertava. Isso é verdade, não vou fingir que não." },
      { rotulo: "Tirava a luz da casa.", resposta: "Tirava. E tirava ele da gente. Tava em casa, mas com a cabeça no céu." },
      { rotulo: "As duas coisas.", resposta: "É isso que deixa tudo difícil. Se o cometa só tirasse, ninguém voltava lá." },
    ] },
    { humor: "calmo", fala: "Quer pensar nisso pra você também? Só pensar. Não precisa me contar nada.", opcoes: [
      { rotulo: "Quero pensar.", resposta: "Então pensa com calma no que a aposta te dá e no que ela te tira. Fica só com você. Eu não guardo nada disso." },
      { rotulo: "Hoje não.", resposta: "Justo. A pergunta fica aí pra quando fizer sentido." },
      { rotulo: "Tá pesado ouvir isso.", resposta: "Obrigado por me dizer. A gente pode parar aqui. Olha quem pode te ajudar agora. Eu espero.", abreCrise: true },
    ] },
    { humor: "calmo", fala: "Ainda tem uma parte que eu não contei. O que aconteceu com as luzes lá de casa depois disso." },
    { fala: "Meu pai dizia que amanhã recuperava tudo. Essa eu conto da próxima vez. Hoje já foi bastante." },
    { humor: "calmo", fala: "Obrigado por escutar. Aqui na Terra, você é a primeira pessoa pra quem eu conto isso." },
  ],
  // A balança decisória sobre o pai fica na conversa. A versão para a pessoa ("o que dá × o que custa") é só para
  // pensar, sem campo e sem guardar nada; quando a função existir no app, ela entra como `oferta`.
  licao: "Quase ganhar não é meio ganhar. O cometa brilha de propósito pra parecer que tá perto. O que faz a gente crescer é a semente simples, que tá sempre ali.",
};
