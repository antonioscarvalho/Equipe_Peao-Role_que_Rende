// REVISÃO CLÍNICA PENDENTE
// Textos copiados de docs/03-design/narrativa-broto.md, "Capítulo 1: A Queda". Não editar aqui sem editar lá.
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
  // Sem oferta: o capítulo 1 é só acolhimento.
  licao: "Não dá pra voltar pro céu num pulo só. É uma plataforma de cada vez. E cair não apaga o caminho que você já fez.",
};
