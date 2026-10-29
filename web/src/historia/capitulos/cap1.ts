// REVISÃO CLÍNICA PENDENTE
// Textos copiados de docs/03-design/narrativa-broto.md, "Capítulo 1: A Queda". Não editar aqui sem editar lá.
// O roteiro antes e depois do jogo tem cerca de 9 min de leitura; com o Pulo (3 min), o capítulo dura de 10 a 15 min.
import type { Capitulo } from "../tipos";

export const cap1: Capitulo = {
  id: "cap1",
  titulo: "Capítulo 1: A Queda",
  falaAbertura: "Ufa. Não deu pra chegar lá em cima hoje. Mas olha quanto a gente subiu.",
  perguntas: [
    {
      pergunta: "De onde você veio?",
      resposta: "De um asteroide pequeno na beira da galáxia, a Vila Estrela. A gente vive de colher poeira de luz. Não é muito, mas é nosso.",
    },
    {
      pergunta: "Por que você caiu?",
      resposta: "A nave da minha família ficou sem combustível. Eu tentei voar mesmo assim, achando que dava pra resolver tudo de uma vez só… e caí.",
    },
    {
      pergunta: "Quantos anos você tem?",
      resposta: "Uns 25. Lá na Vila isso ainda conta como \"pequeno\". Uma injustiça cósmica.",
    },
  ],
  perguntaDoBroto: {
    texto: "Você já quis resolver tudo de uma vez só?",
    opcoes: [
      { rotulo: "Já", resposta: "Eu também. Deu no que deu: tô numa cratera. Acho que todo mundo que tá cansado quer." },
      { rotulo: "Não sei", resposta: "Tudo bem. A gente descobre junto." },
    ],
  },
  antesDoJogo: [
    { cena: "cratera", humor: "cansado", fala: "Ai… Tem alguém aí no meio dessa fumaça?" },
    { fala: "Você tá me vendo, né? Então eu não bati a cabeça tão forte assim.", opcoes: [
      { rotulo: "Você tá bem?", resposta: "Acho que sim. Foi só o susto. A nave é que ficou bem pior." },
      { rotulo: "O que é você?", resposta: "Boa pergunta. Lá de onde eu venho, a gente ia querer saber a mesma coisa de você." },
    ] },
    { humor: "calmo", fala: "Eu vim do espaço. Essa folha na cabeça veio junto. Sei que parece impossível. Pra mim também, e olha que eu tava lá." },
    { humor: "apoio", fala: "E você? Levou um susto? Tá tudo bem?", opcoes: [
      { rotulo: "Tô bem.", resposta: "Que bom. Eu não queria assustar ninguém." },
      { rotulo: "Um pouco assustado(a).", resposta: "Faz sentido. Não é todo dia que alguém cai do céu." },
      { rotulo: "Não tô bem, não.", resposta: "Obrigado por me dizer. Olha quem pode te ajudar agora. Eu espero aqui.", abreCrise: true },
      { rotulo: "Prefiro não dizer.", resposta: "Tudo bem. Não precisa." },
    ] },
    // Batismo (skill conversa-broto): a pessoa comenta que ele parece um broto e dá o nome. Pulado se ele já tiver nome.
    { especial: "batismo", humor: "calmo", fala: "Lá na Vila, a família chama a gente de \"pequeno\" até a gente sair de casa. O nome de verdade quem dá é o primeiro amigo que a gente faz longe dela. E eu nunca tinha saído… Então, por enquanto, eu não tenho nome." },
    { especial: "nome", fala: "E você? Como eu te chamo? Pode ser apelido. Ou eu te chamo de \"você\" mesmo." },
    { fala: "Prazer, {nome}. Você é o primeiro humano que eu vejo de perto. E a recepção tá melhor que a do ET de Varginha: ele foi parar no jornal, eu ganhei alguém pra conversar." },
    { cena: "vila", fala: "Tá vendo aquele ponto de luz perto das estrelas? É a Vila Estrela. Minha casa." },
    { fala: "É um asteroide pequeno. Umas vinte casas, um quintal pra cada uma. Minha maior aventura até ontem era ir na casa do vizinho. Olha eu agora." },
    { cena: "colheita", fala: "Lá a gente vive de poeira de luz. Toda manhã a gente colhe a poeira que o sol deixa nas pedras.", opcoes: [
      { rotulo: "Pra que serve a poeira?", resposta: "Pra tudo. Acende as casas, esquenta a comida e faz as naves voarem. Não é muito, mas é nosso." },
      { rotulo: "Dá trabalho?", resposta: "Dá. Acordar cedo, encher pote por pote. Vocês apertam um botão e a luz acende. Folgados." },
    ] },
    { cena: "musica", fala: "Na colheita a gente canta. A minha Vó Vega ensinou uma cantiga: \"a luz vem devagar…\"" },
    { fala: "A Nina, minha irmã, sempre entra nessa parte. Esperei a voz dela agora. Esqueci por um segundo que tô longe." },
    { cena: "lua", humor: "calmo", fala: "Aquela é a única lua de vocês?", opcoes: [
      { rotulo: "É, só uma.", resposta: "Lá na Vila tem três. Daqui só dá pra ver uma… Então eu tô longe mesmo." },
      { rotulo: "Quantas vocês têm?", resposta: "Três. Daqui não dá pra ver nenhuma. Então eu tô longe mesmo." },
    ] },
    { cena: "bairro", fala: "Lá na Vila contam histórias sobre vocês. Nenhuma chegou perto de como é de verdade.", opcoes: [
      { rotulo: "O que contam?", resposta: "Que vocês olham muito pro céu. Agora eu entendo: daqui ele parece enorme." },
      { rotulo: "Você também não é como nos filmes.", resposta: "Eu vi alguns pela janela da nave. Tem um de um ET que só queria ligar pra casa. Agora eu entendo ele." },
    ] },
    { humor: "calmo", fala: "Quando a nave começou a cair, procurei uma luz pra pousar perto. Vim parar nesta praça. Aí você apareceu." },
    { fala: "Antes de eu sair, as luzes lá de casa foram apagando, uma por uma. Tem uma coisa que eu ainda não sei contar. Pode ficar pra outro dia?", opcoes: [
      { rotulo: "Pode, sem pressa.", resposta: "Obrigado por não me apressar. Ainda tô tentando entender o que aconteceu." },
      { rotulo: "Quer contar agora?", resposta: "Ainda não. Hoje eu só quero voltar pra casa." },
    ] },
    { cena: "familia", fala: "Minha família tá lá: meu pai Órion, que conserta nave; minha mãe Lyra, que faz a conta da casa render; a Nina; e a Vó Vega, que planta semente de luz no quintal." },
    { fala: "Eu peguei a nave sozinho, sem avisar ninguém. Eles devem tá me procurando. Eu queria conseguir dizer que tô aqui… e que alguém ficou comigo." },
    { cena: "cratera", humor: "calmo", fala: "Tá vendo essas plataformas acima da cratera? Lá do alto talvez eu consiga mandar um sinal pra minha família. Você me guia?", opcoes: [
      { rotulo: "Bora.", resposta: "Tá. Você me guia e eu pulo. Vou começar pela mais perto." },
      { rotulo: "Como eu ajudo?", resposta: "Você me diz pra que lado ir: inclina o celular, usa as setas ou segura um lado da tela. Eu faço o resto." },
    ] },
    { fala: "Se aparecerem folhas no caminho, a gente pode guardar. E, se quiser parar, tudo bem. Vamos tentar a primeira plataforma?" },
  ],
  depoisDoJogo: [
    { humor: "feliz", fala: "{folhas}" },
    { cena: "estrelas", humor: "calmo", fala: "Sabe o que a minha Vó diz? Que estrela sozinha é só um ponto. Mas várias juntas viram desenho no céu. Constelação." },
    { fala: "Quando eu olhei pra baixo e vi você, tive coragem de tentar a próxima plataforma. Obrigado por ficar." },
    { cena: "regua", fala: "E olha: a altura que a gente subiu hoje, ninguém tira. Amanhã eu começo dali, não do chão." },
    { especial: "aparencia", fala: "A queda bagunçou minhas cores. Quer me ajudar a arrumar? Ou eu fico assim mesmo." },
    { humor: "apoio", fala: "Posso te contar uma coisa? Eu não sou médico nem nada. Nem sei me virar direito longe de casa. Mas escutar eu sei. E você não precisa me contar nada que não queira." },
    { especial: "motivo", humor: "calmo", fala: "Se um dia quiser me contar o que te trouxe até aqui, eu escuto. Pode ser hoje, outro dia ou nunca." },
    { especial: "meta", fala: "Lá na Vila aconteceu uma coisa com aposta. Um dia eu te conto. E você, com as apostas, o que faz sentido agora? Pode não responder." },
    { especial: "guardar", fala: "Quer que eu guarde isso só aqui no seu celular? Assim eu lembro de você quando a vontade apertar. Ninguém mais vê, e dá pra apagar quando quiser." },
    { humor: "calmo", fala: "Na minha vila, a gente chama de amigo quem começa a dividir o caminho. Obrigado por dividir esse pedaço comigo.", opcoes: [
      { rotulo: "Também gostei, Broto.", resposta: "Então até a próxima. Ainda tenho muita coisa pra entender sobre a Terra. Tipo por que vocês gritam com a novela como se a vilã fosse ouvir." },
      { rotulo: "Vamos com calma.", resposta: "Combinado. Um pedaço do caminho de cada vez." },
      { rotulo: "Prefiro não dizer.", resposta: "Tudo bem. Obrigado pela companhia de hoje." },
    ] },
    { cena: "bairro", humor: "calmo", fala: "Tá ficando tarde. Vou ficar perto da praça. Se você voltar, eu tô aqui. Não tenho muita opção, né: tô sem nave." },
  ],
  // Sem oferta: o capítulo 1 é só acolhimento.
  licao: "Não dá pra voltar pro céu num pulo só. É uma plataforma de cada vez. E cair não apaga o caminho que você já fez.",
};
