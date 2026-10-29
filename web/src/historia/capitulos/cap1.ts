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
    { cena: "cratera", humor: "cansado", fala: "Ai… ai, ai. Cadê o chão? Ah, achei. Tá aqui embaixo de mim." },
    { fala: "Opa. Tem alguém aí? Desculpa o susto. Eu não costumo cair do céu assim, juro.", opcoes: [
      { rotulo: "Você tá bem?", resposta: "Tô inteiro. Um pouco amassado, mas inteiro." },
      { rotulo: "Quem é você?", resposta: "Já já eu conto. Deixa eu só achar minha antena." },
    ] },
    { humor: "calmo", fala: "Eu sou o Broto. Sou um broto de luz, lá de cima. Mas olha meu estado… caí todo bagunçado." },
    { especial: "aparencia", humor: "feliz", fala: "Me ajuda a me arrumar? Escolhe minha cor e o que eu visto. Vou mudando aqui na sua frente." },
    { especial: "nome", fala: "E você? Como eu te chamo? Pode ser apelido. Se preferir, eu te chamo de \"você\" mesmo." },
    { humor: "feliz", fala: "Prazer, {nome}. Que bom que foi você que me achou." },
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
    { cena: "vila", humor: "feliz", fala: "Agora deixa eu te contar de mim. Tá vendo aquele pontinho lá em cima, brilhando? É a Vila Estrela. Minha casa." },
    { fala: "É um asteroide tão pequenininho que dá a volta nele a pé antes do almoço. Tem umas vinte casinhas e um quintal pra cada uma." },
    { cena: "colheita", fala: "Lá a gente vive de poeira de luz. Toda manhã, bem cedinho, a gente sai com uns potes pra colher a poeira que o sol deixa nas pedras.", opcoes: [
      { rotulo: "Pra que serve a poeira?", resposta: "Pra tudo! Acende as casas, esquenta a comida e faz as naves voarem. Não é muito, mas é nosso." },
      { rotulo: "Dá trabalho?", resposta: "Dá. Acordar cedo, encher pote por pote. Mas tem um gostinho de coisa feita com a mão, sabe?" },
    ] },
    { cena: "musica", humor: "feliz", fala: "E na colheita a gente canta. Tem uma cantiga que a minha Vó Vega ensinou… é assim: tum-tum, tá-rá, tum-tum… a luz vem devagar…" },
    { fala: "Desafinei, né? Pode falar. A Nina, minha irmã, sempre fala." },
    { fala: "E aqui embaixo, que música vocês ouvem?", opcoes: [
      { rotulo: "Samba ou pagode", resposta: "Ouvi um pagode enquanto caía! Acho que tinha uma roda perto da praça. Tum-tum, tá-rá… combina com a cantiga da Vó!" },
      { rotulo: "Funk", resposta: "Aquele grave que faz o chão tremer? Achei que era o meu coração batendo depois da queda!" },
      { rotulo: "Sertanejo", resposta: "Música de saudade, né? Acho que eu vou gostar. Tô com um pouco de saudade de casa." },
      { rotulo: "Gospel ou louvor", resposta: "Música de fé. A Vó Vega diz que cantar junto deixa a gente mais leve." },
      { rotulo: "Rock", resposta: "Barulhento e corajoso! Tipo cair de uma nave." },
      { rotulo: "Outra", resposta: "Um dia você me mostra? Eu adoro aprender música nova." },
      { rotulo: "Prefiro não dizer", resposta: "Tudo bem. A gente fica com a cantiga da Vó por enquanto." },
    ] },
    { cena: "lua", humor: "calmo", fala: "Posso perguntar uma coisa? Vocês aqui só têm uma lua?", opcoes: [
      { rotulo: "Só uma.", resposta: "Lá na Vila tem três! Uma pequenininha, uma média e uma que parece um pão de queijo." },
      { rotulo: "E vocês, quantas?", resposta: "Três! Uma pequenininha, uma média e uma que parece um pão de queijo." },
    ] },
    { fala: "Mas a de vocês é bonita. Grandona. Parece que tá cuidando da praça." },
    { cena: "bairro", humor: "feliz", fala: "Que engraçado… aqui o alienígena sou eu, né? Azulzinho, de antena, conversando com a lua.", opcoes: [
      { rotulo: "Você nem parece alien.", resposta: "Valeu! Mas eu brilho no escuro. Isso é meio alien, admite." },
      { rotulo: "É um alien fofo.", resposta: "Fofo eu aceito! Na Vila todo mundo me chama de \"pequeno\" e eu odeio. \"Fofo\" tá liberado." },
    ] },
    { humor: "calmo", fala: "Reparei numa coisa enquanto caía. O bairro de vocês tá meio apagado. Quase nenhuma janela acesa." },
    { fala: "Lá em casa também andou assim. As luzes foram apagando, uma por uma. É uma história comprida… outro dia eu te conto, pode ser?", opcoes: [
      { rotulo: "Pode, sem pressa.", resposta: "Obrigado. Você é gente boa, sabia?" },
      { rotulo: "Quer contar agora?", resposta: "Ainda não. Hoje eu só quero voltar pra casa." },
    ] },
    { cena: "familia", fala: "Minha família tá lá: meu pai Órion, que conserta nave; minha mãe Lyra, que faz a conta da casa render; a Nina; e a Vó Vega, que planta semente de luz no quintal." },
    { fala: "Eles devem tá me procurando. Se eu subir bem alto, quem sabe eles me veem." },
    { cena: "cratera", humor: "feliz", fala: "Já sei! Tá vendo essas plataformas? Se eu for pulando de uma em uma, chego lá em cima. Me ajuda?", opcoes: [
      { rotulo: "Bora!", resposta: "Bora! Você me guia e eu pulo." },
      { rotulo: "Como eu ajudo?", resposta: "Você me diz pra que lado ir: inclina o celular, usa as setas ou segura um lado da tela. Eu faço o resto." },
    ] },
    { fala: "Cada folhinha que a gente pegar no caminho eu guardo. São pequenas, mas são nossas. Vamos?" },
  ],
  depoisDoJogo: [
    { humor: "feliz", fala: "{folhas}" },
    { cena: "estrelas", humor: "calmo", fala: "Sabe o que a minha Vó diz? Que estrela sozinha é só um pontinho. Mas várias juntas viram desenho no céu. Constelação." },
    { fala: "Acho que a gente é meio assim. Eu sozinho caí. Com você aqui, até que eu subi bonito." },
    { cena: "regua", fala: "E olha: a altura que a gente subiu hoje, ninguém tira. Amanhã eu começo dali, não do chão." },
    { fala: "E você, já subiu alguma coisa que ninguém tira de você?", opcoes: [
      { rotulo: "Já.", resposta: "Eu sabia. Dá pra ver. Guarda isso com carinho." },
      { rotulo: "Não sei.", resposta: "Às vezes a gente não vê de perto. Eu vejo uma: você tá aqui, conversando comigo. Isso já é subir." },
      { rotulo: "Prefiro não dizer.", resposta: "Justo. Fica guardado contigo." },
    ] },
    { cena: "musica", humor: "feliz", fala: "Ei, vou cantar a cantiga da Vó com um tum-tum daqui de baixo: tum-tum, tá-rá… a luz vem devagar… Ficou melhor, vai." },
    { cena: "bairro", humor: "calmo", fala: "Tá ficando tarde. O bairro tá quietinho." },
  ],
  // Sem oferta: o capítulo 1 é só acolhimento.
  licao: "Não dá pra voltar pro céu num pulo só. É uma plataforma de cada vez. E cair não apaga o caminho que você já fez.",
};
