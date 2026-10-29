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
      resposta: "De um asteroide bem pequenininho, a Vila Estrela. Lá a gente trabalha colhendo poeira de luz. Não é muito, mas é nosso.",
    },
    {
      pergunta: "Por que você caiu?",
      resposta: "A nave da minha família ficou sem combustível. Eu tentei voar mesmo assim, achando que dava pra resolver tudo de uma vez só… e caí.",
    },
    {
      pergunta: "Você tá machucado?",
      resposta: "Um pouco amassado. Mas ninguém tira de mim a altura que eu já subi.",
    },
  ],
  perguntaDoBroto: {
    texto: "Você já quis resolver tudo de uma vez só?",
    opcoes: [
      { rotulo: "Já", resposta: "Eu também. Acho que todo mundo que tá cansado quer." },
      { rotulo: "Não sei", resposta: "Tudo bem. A gente descobre junto." },
    ],
  },
  antesDoJogo: [
    { cena: "cratera", humor: "cansado", fala: "Ai… minha antena… A nave parou? Tem alguém aí no meio dessa fumaça?" },
    { fala: "Espera… fica aí um pouquinho. Eu também tô com medo. Não conheço esse lugar.", opcoes: [
      { rotulo: "Você tá bem?", resposta: "Acho que sim. Minhas pernas ainda estão tremendo. Você pode ficar aí enquanto eu levanto?" },
      { rotulo: "Quem é você?", resposta: "Meu nome é Broto. Eu vinha naquela nave… você viu mais alguém cair?" },
    ] },
    { humor: "calmo", fala: "Sou o Broto, um broto de luz. Vim do espaço. Eu ia tentar explicar melhor, mas esqueci tudo quando vi você." },
    { humor: "calmo", fala: "Você não foi embora… Posso chegar um pouco mais perto?", opcoes: [
      { rotulo: "Pode, vem devagar.", resposta: "Assim? Pronto. Vou sentar aqui na beirada. O chão de vocês é bem firme." },
      { rotulo: "Prefiro ficar aqui.", resposta: "Tudo bem. Eu fico deste lado. Dá pra conversar daqui." },
    ] },
    { especial: "aparencia", humor: "feliz", fala: "A queda bagunçou minhas cores. Me ajuda a escolher uma cor e uma roupa? Ou posso ficar assim por enquanto." },
    { especial: "nome", fala: "E você? Como eu te chamo? Pode ser apelido. Se preferir, eu te chamo de \"você\" mesmo." },
    { humor: "feliz", fala: "Prazer, {nome}. Quando ouvi seus passos, achei que precisava me esconder. Agora tô feliz que você chegou." },
    { especial: "idade", humor: "calmo", fala: "Pergunta chata, mas eu preciso fazer: você tem 18 anos ou mais?" },
    { fala: "E você, tá chegando como hoje?", opcoes: [
      { rotulo: "Tô de boa", resposta: "Que bom. Fica à vontade, então." },
      { rotulo: "Meio cansado(a)", resposta: "Eu entendo. Cair cansa, e viver cansa também. Aqui pode ir devagar." },
      { rotulo: "Tá pesado demais", resposta: "Obrigado por me contar. Isso importa. Olha quem pode te ajudar agora. Eu espero aqui.", abreCrise: true },
      { rotulo: "Prefiro não dizer", resposta: "Tudo bem. Não precisa." },
    ] },
    { humor: "apoio", fala: "Deixa eu te contar uma coisa antes: eu não sou médico nem nada, tá? Sou só um broto. Mas escutar eu sei. E você não precisa me contar nada que não queira." },
    { especial: "motivo", humor: "calmo", fala: "Se quiser me contar… o que te trouxe até aqui hoje?" },
    { especial: "meta", fala: "E o que faz sentido pra você agora, com as apostas?" },
    { especial: "guardar", fala: "Quer que eu guarde isso só aqui no seu celular? Assim eu lembro de você quando a vontade apertar. Ninguém mais vê, e dá pra apagar quando quiser." },
    { cena: "vila", humor: "feliz", fala: "Tá vendo aquele pontinho perto das estrelas? É pra lá que eu tava olhando quando você chegou. A Vila Estrela. Minha casa." },
    { fala: "É um asteroide tão pequenininho que dá a volta nele a pé antes do almoço. Tem umas vinte casinhas e um quintal pra cada uma." },
    { cena: "colheita", fala: "Lá a gente vive de poeira de luz. Toda manhã, bem cedinho, a gente sai com uns potes pra colher a poeira que o sol deixa nas pedras.", opcoes: [
      { rotulo: "Pra que serve a poeira?", resposta: "Pra tudo! Acende as casas, esquenta a comida e faz as naves voarem. Não é muito, mas é nosso." },
      { rotulo: "Dá trabalho?", resposta: "Dá. Acordar cedo, encher pote por pote. Mas tem um gostinho de coisa feita com a mão, sabe?" },
    ] },
    { cena: "musica", humor: "feliz", fala: "E na colheita a gente canta. Tem uma cantiga que a minha Vó Vega ensinou… é assim: tum-tum, tá-rá, tum-tum… a luz vem devagar…" },
    { fala: "A Nina, minha irmã, sempre entra nessa parte. Fiquei esperando a voz dela… Esqueci por um segundo que tô longe." },
    { fala: "E você, tem alguma música de que gosta? Quero conhecer um pedacinho daqui também.", opcoes: [
      { rotulo: "Samba ou pagode", resposta: "Ouvi um pagode enquanto caía! Acho que tinha uma roda perto da praça. Tum-tum, tá-rá… combina com a cantiga da Vó!", som: "cantiga" },
      { rotulo: "Funk", resposta: "Aquele grave que faz o chão tremer? Achei que era o meu coração batendo depois da queda!" },
      { rotulo: "Sertanejo", resposta: "Música de saudade, né? Acho que eu vou gostar. Tô com um pouco de saudade de casa." },
      { rotulo: "Gospel ou louvor", resposta: "Música de fé. A Vó Vega diz que cantar junto deixa a gente mais leve." },
      { rotulo: "Rock", resposta: "Barulhento e corajoso! Tipo cair de uma nave." },
      { rotulo: "Outra", resposta: "Um dia você me mostra? Eu adoro aprender música nova." },
      { rotulo: "Prefiro não dizer", resposta: "Tudo bem. A gente fica com a cantiga da Vó por enquanto." },
    ] },
    { cena: "lua", humor: "calmo", fala: "Posso perguntar uma coisa meio estranha? Aquela é a única lua de vocês?", opcoes: [
      { rotulo: "Só uma.", resposta: "Lá na Vila tem três! Uma pequenininha, uma média e uma que parece um pão de queijo." },
      { rotulo: "E vocês, quantas?", resposta: "Três! Uma pequenininha, uma média e uma que parece um pão de queijo." },
    ] },
    { fala: "Mas a de vocês é bonita. Grandona. Parece que tá cuidando da praça." },
    { cena: "bairro", humor: "feliz", fala: "Na minha vila, você é que ia ser a visita do espaço. Acho que eu também ia ficar olhando, tentando entender.", opcoes: [
      { rotulo: "Você nem parece alien.", resposta: "Valeu! Mas eu brilho no escuro. Isso é meio alien, admite." },
      { rotulo: "É um alien fofo.", resposta: "Fofo eu aceito! Na Vila todo mundo me chama de \"pequeno\" e eu odeio. \"Fofo\" tá liberado." },
    ] },
    { humor: "calmo", fala: "Quando a nave começou a cair, procurei uma luz pra pousar perto. Vim parar nesta praça. Aí você apareceu." },
    { fala: "Antes de eu sair, as luzes lá de casa foram apagando, uma por uma. Tem uma coisa que eu ainda não sei contar… Podemos deixar pra outro dia?", opcoes: [
      { rotulo: "Pode, sem pressa.", resposta: "Obrigado por não me apressar. Ainda tô tentando entender o que aconteceu." },
      { rotulo: "Quer contar agora?", resposta: "Ainda não. Hoje eu só quero voltar pra casa." },
    ] },
    { cena: "familia", fala: "Minha família tá lá: meu pai Órion, que conserta nave; minha mãe Lyra, que faz a conta da casa render; a Nina; e a Vó Vega, que planta semente de luz no quintal." },
    { fala: "Eles devem tá me procurando. Eu queria conseguir dizer que tô aqui… e que encontrei alguém que ficou comigo." },
    { cena: "cratera", humor: "feliz", fala: "Tá vendo essas plataformas acima da cratera? Talvez lá do alto eu consiga fazer um sinal pra minha família. Você me guia numa tentativa?", opcoes: [
      { rotulo: "Bora!", resposta: "Tá. Você me guia e eu pulo. Vou começar pela mais perto." },
      { rotulo: "Como eu ajudo?", resposta: "Você me diz pra que lado ir: inclina o celular, usa as setas ou segura um lado da tela. Eu faço o resto." },
    ] },
    { fala: "Se aparecerem folhinhas no caminho, a gente pode guardar. E, se quiser parar, tudo bem. Vamos tentar a primeira plataforma?" },
  ],
  depoisDoJogo: [
    { humor: "feliz", fala: "{folhas}" },
    { cena: "estrelas", humor: "calmo", fala: "Sabe o que a minha Vó diz? Que estrela sozinha é só um pontinho. Mas várias juntas viram desenho no céu. Constelação." },
    { fala: "Quando eu olhei pra baixo e vi você, tive coragem de tentar a próxima plataforma. Obrigado por me acompanhar." },
    { cena: "regua", fala: "E olha: a altura que a gente subiu hoje, ninguém tira. Amanhã eu começo dali, não do chão." },
    { fala: "E você, já subiu alguma coisa que ninguém tira de você?", opcoes: [
      { rotulo: "Já.", resposta: "Eu sabia. Dá pra ver. Guarda isso com carinho." },
      { rotulo: "Não sei.", resposta: "Às vezes a gente não vê de perto. Eu vejo uma: você tá aqui, conversando comigo. Isso já é subir." },
      { rotulo: "Prefiro não dizer.", resposta: "Justo. Fica guardado contigo." },
    ] },
    { cena: "musica", humor: "feliz", fala: "Ei, vou cantar a cantiga da Vó com um tum-tum daqui de baixo: tum-tum, tá-rá… a luz vem devagar… Ficou melhor, vai." },
    { humor: "calmo", fala: "Na minha vila, a gente chama de amigo quem começa a dividir o caminho. Gostei de dividir esse pedaço com você.", opcoes: [
      { rotulo: "Também gostei, Broto.", resposta: "Então, até a próxima conversa. Tenho um monte de perguntas sobre a Terra." },
      { rotulo: "Vamos nos conhecer aos poucos.", resposta: "Combinado. Um pedaço do caminho de cada vez." },
      { rotulo: "Prefiro não dizer.", resposta: "Tudo bem. Obrigado pela companhia de hoje." },
    ] },
    { cena: "bairro", humor: "calmo", fala: "Tá ficando tarde. Vou ficar perto da praça por enquanto. Se você voltar, quero aprender aquela música daqui." },
  ],
  // Sem oferta: o capítulo 1 é só acolhimento.
  licao: "Não dá pra voltar pro céu num pulo só. É uma plataforma de cada vez. E cair não apaga o caminho que você já fez.",
};
