import { useCallback, useEffect, useState } from "react";
import type { NomeIcone } from "./icones-data";

/**
 * Plano de 90 dias: 13 semanas, cada uma com um tema e 4 missões semanais.
 * Regras (skills gamificacao-etica, design-etico-saude-digital, prevencao-recaida,
 * controle-estimulos-financas, entrevista-motivacional):
 * - Missão é convite: sem prazo que expira, sem "+R$", sem perder nada. Semana passada continua
 *   aberta; dá pra fazer depois. Semanas futuras aparecem desde já (nada é surpresa).
 * - O plano conta dias desde o primeiro uso. Um dia sem missão não apaga nada.
 * - Tudo fica só neste aparelho (localStorage). Nada é enviado.
 * REVISÃO CLÍNICA PENDENTE dos textos das missões.
 */
export type Missao = { id: string; texto: string; dica?: string; icone: NomeIcone; tempo: string };
export type Semana = { numero: number; tema: string; missoes: Missao[] };

const m = (semana: number, n: number, icone: NomeIcone, tempo: string, texto: string, dica?: string): Missao =>
  ({ id: `s${semana}-${n}`, icone, tempo, texto, dica });

/**
 * Progressão: as primeiras semanas são atos de minutos, fáceis de cumprir no primeiro dia
 * (dá competência logo de cara). Depois as missões vão ficando mais longas, com mais gente e
 * mais mudança de vida: um passeio, negociar uma dívida, um hobby fixo, um grupo de apoio.
 * As semanas que ainda não chegaram ficam ocultas (aparece só quando começam).
 */
export const SEMANAS: Semana[] = [
  { numero: 1, tema: "Pequenos começos", missoes: [
    m(1, 1, "sun", "2 min", "Abrir a janela e respirar fundo 3 vezes"),
    m(1, 2, "sprout", "5 min", "Dar uma volta no quarteirão"),
    m(1, 3, "heartHandshake", "2 min", "Mandar um \"oi, tudo bem?\" pra alguém que você gosta"),
    m(1, 4, "house", "3 min", "Beber um copo d'água agora"),
  ] },
  { numero: 2, tema: "Olhar pro dia", missoes: [
    m(2, 1, "piggyBank", "5 min", "Anotar tudo o que gastou hoje", "No papel ou no bloco de notas. Sem julgar, só olhar."),
    m(2, 2, "moon", "1 noite", "Deixar o celular longe da cama uma noite"),
    m(2, 3, "sprout", "15 min", "Caminhar 15 minutos fora de casa"),
    m(2, 4, "wind", "3 min", "Respirar com o Broto, mesmo sem vontade de apostar", "É o \"Deu vontade\" da tela inicial. Treinar na calma ajuda na hora difícil."),
  ] },
  { numero: 3, tema: "Proteger o caminho", missoes: [
    m(3, 1, "shieldCheck", "10 min", "Bloquear sites e apps de aposta no celular", "Os bloqueadores de conteúdo gratuitos já ajudam muito."),
    m(3, 2, "shieldCheck", "15 min", "Pedir a autoexclusão de apostas no gov.br", "Plataforma Centralizada de Autoexclusão, do governo federal."),
    m(3, 3, "heartHandshake", "10 min", "Contar pra alguém de confiança que você tá se cuidando", "Não precisa contar tudo. Só que você tá nessa."),
    m(3, 4, "sun", "20 min", "Ir a uma praça e tirar uma foto de algo bonito", "Se quiser, posta ou manda pra alguém."),
  ] },
  { numero: 4, tema: "Ar livre", missoes: [
    m(4, 1, "sun", "30 min", "Passar meia hora num parque", "Sentar, andar, olhar as árvores. Vale tudo menos o celular."),
    m(4, 2, "moon", "3 noites", "Dormir 30 minutos mais cedo em 3 noites", "Cansaço deixa a vontade mais forte."),
    m(4, 3, "sprout", "3 dias", "Caminhar 20 minutos em 3 dias da semana"),
    m(4, 4, "house", "1 refeição", "Fazer uma refeição sem o celular na mão"),
  ] },
  { numero: 5, tema: "Dinheiro com rumo", missoes: [
    m(5, 1, "piggyBank", "15 min", "Escolher uma meta pra grana que sobra", "Um sonho, uma conta pra quitar, um presente."),
    m(5, 2, "shieldCheck", "15 min", "Pedir ao banco pra baixar o limite do PIX à noite"),
    m(5, 3, "piggyBank", "1 semana", "Anotar os gastos da semana inteira"),
    m(5, 4, "piggyBank", "10 min", "Separar um valor pra meta no dia em que o dinheiro entra"),
  ] },
  { numero: 6, tema: "Gente por perto", missoes: [
    m(6, 1, "phone", "20 min", "Ligar pra alguém que você gosta e não fala faz tempo"),
    m(6, 2, "heartHandshake", "1 hora", "Chamar alguém pra um café, uma bola ou uma volta"),
    m(6, 3, "sun", "1 hora", "Ir ao parque com alguém e tirar uma foto juntos"),
    m(6, 4, "heartHandshake", "10 min", "Combinar com alguém um sinal pra pedir ajuda"),
  ] },
  { numero: 7, tema: "Conhecer os gatilhos", missoes: [
    m(7, 1, "bookOpen", "1 semana", "Anotar os momentos em que deu vontade e o que tava acontecendo", "Hora, lugar, com quem, como você tava."),
    m(7, 2, "shieldCheck", "15 min", "Silenciar grupos e perfis que falam de aposta"),
    m(7, 3, "shieldCheck", "10 min", "Apagar ou esconder o app que mais te leva pras apostas"),
    m(7, 4, "bookOpen", "20 min", "Escrever 3 passos pra quando a vontade apertar", "Ex.: sair de casa, ligar pra alguém, respirar com o Broto."),
  ] },
  { numero: 8, tema: "Corpo em dia", missoes: [
    m(8, 1, "sprout", "3 vezes", "Fazer 30 minutos de um exercício que você curte, 3 vezes"),
    m(8, 2, "moon", "1 semana", "Ficar 1 hora sem celular antes de dormir, a semana toda"),
    m(8, 3, "house", "1 hora", "Cozinhar uma refeição de verdade"),
    m(8, 4, "sun", "2 horas", "Fazer uma trilha, um passeio longo ou um banho de rio ou mar"),
  ] },
  { numero: 9, tema: "Contas em ordem", missoes: [
    m(9, 1, "piggyBank", "1 hora", "Listar as dívidas e quanto falta de cada uma"),
    m(9, 2, "phone", "1 manhã", "Ir ao banco ou ligar pra negociar uma dívida"),
    m(9, 3, "shieldCheck", "1 fim de semana", "Deixar o cartão de crédito em casa num fim de semana"),
    m(9, 4, "piggyBank", "30 min", "Ver quanto você já juntou pra sua meta"),
  ] },
  { numero: 10, tema: "Prazeres que ficam", missoes: [
    m(10, 1, "palette", "2 horas", "Escolher um hobby e reservar um horário fixo pra ele"),
    m(10, 2, "bookOpen", "3 vezes", "Aprender algo novo por 20 minutos, 3 vezes", "Uma receita, um instrumento, um idioma, um esporte."),
    m(10, 3, "sun", "1 tarde", "Conhecer um lugar da cidade onde você nunca foi"),
    m(10, 4, "palette", "15 min", "Postar ou mandar a foto de algo que te fez bem nesse caminho"),
  ] },
  { numero: 11, tema: "Rede de apoio", missoes: [
    m(11, 1, "house", "2 horas", "Ir a um grupo de apoio", "Jogadores Anônimos, o CAPS do seu bairro ou um grupo on-line."),
    m(11, 2, "heartHandshake", "1 hora", "Agradecer pessoalmente alguém que te apoiou"),
    m(11, 3, "heartHandshake", "1 hora", "Ajudar alguém com algo que você sabe fazer"),
    m(11, 4, "moon", "1 tarde", "Tirar uma tarde só pra descansar, sem culpa"),
  ] },
  { numero: 12, tema: "Olhar pra trás", missoes: [
    m(12, 1, "bookOpen", "30 min", "Escrever o que mudou desde o começo"),
    m(12, 2, "bookOpen", "20 min", "Reler seus 3 passos pros dias difíceis e ajustar"),
    m(12, 3, "heartHandshake", "1 hora", "Contar uma conquista sua pra alguém de confiança"),
    m(12, 4, "sun", "1 dia", "Fazer aquele passeio que você vivia adiando"),
  ] },
  { numero: 13, tema: "Daqui pra frente", missoes: [
    m(13, 1, "sprout", "30 min", "Escolher 3 hábitos pra manter depois dos 90 dias"),
    m(13, 2, "heartHandshake", "1 manhã", "Marcar uma conversa na UBS ou com um profissional, se fizer sentido"),
    m(13, 3, "heartHandshake", "1 tarde", "Comemorar com alguém de um jeito que não envolva dinheiro"),
    m(13, 4, "sun", "1 hora", "Voltar ao parque e tirar uma foto pra fechar o ciclo"),
  ] },
];

export const DIAS_DO_PLANO = 90;
export const TOTAL_MISSOES = SEMANAS.reduce((t, s) => t + s.missoes.length, 0);

const CHAVE = "rqr:plano";
const EVENTO = "rqr:plano-mudou";
type Gravado = { inicio: string; feitas: Record<string, string> };

/** Data local no formato AAAA-MM-DD (o "dia" da pessoa, não o do servidor). */
export function hojeLocal(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const diasEntre = (de: string, ate: string) =>
  Math.round((Date.parse(`${ate}T12:00:00`) - Date.parse(`${de}T12:00:00`)) / 86_400_000);

function ler(): Gravado {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE) ?? "null") as Partial<Gravado> | null;
    if (bruto && typeof bruto.inicio === "string" && /^\d{4}-\d{2}-\d{2}$/.test(bruto.inicio)) {
      const feitas: Record<string, string> = {};
      const validas = new Set(SEMANAS.flatMap((s) => s.missoes.map((x) => x.id)));
      for (const [id, dia] of Object.entries(bruto.feitas ?? {})) if (validas.has(id) && typeof dia === "string") feitas[id] = dia;
      return { inicio: bruto.inicio, feitas };
    }
  } catch { /* dado corrompido: recomeça */ }
  const novo = { inicio: hojeLocal(), feitas: {} };
  gravar(novo);
  return novo;
}
function gravar(g: Gravado) {
  try { localStorage.setItem(CHAVE, JSON.stringify(g)); } catch { /* modo privado: vale até fechar */ }
  window.dispatchEvent(new Event(EVENTO));
}

export type EstadoPlano = {
  /** Dia do plano, de 1 a 90 (para em 90; depois disso o plano está concluído). */
  dia: number;
  /** Semana atual, de 1 a 13. */
  semana: number;
  concluido: boolean;
  feitas: Record<string, string>;
  totalFeitas: number;
  /** Missões feitas hoje (para o humor do Broto). */
  feitasHoje: number;
};

export function estadoPlano(): EstadoPlano {
  const g = ler();
  const passados = Math.max(0, diasEntre(g.inicio, hojeLocal()));
  const dia = Math.min(DIAS_DO_PLANO, passados + 1);
  const hoje = hojeLocal();
  return {
    dia,
    semana: Math.min(SEMANAS.length, Math.floor(passados / 7) + 1),
    concluido: passados + 1 > DIAS_DO_PLANO,
    feitas: g.feitas,
    totalFeitas: Object.keys(g.feitas).length,
    feitasHoje: Object.values(g.feitas).filter((d) => d === hoje).length,
  };
}

/** Marca ou desmarca (toque sem querer acontece). Devolve true se ficou feita. */
export function alternarMissao(id: string): boolean {
  const g = ler();
  const feitas = { ...g.feitas };
  const ficouFeita = !feitas[id];
  if (ficouFeita) feitas[id] = hojeLocal(); else delete feitas[id];
  gravar({ ...g, feitas });
  return ficouFeita;
}

/** Dia (1–90) em que a semana começa, para anunciar as próximas. */
export const diaDeInicio = (semana: number) => (semana - 1) * 7 + 1;

export function usePlano(): EstadoPlano {
  const [estado, setEstado] = useState(estadoPlano);
  const recarregar = useCallback(() => setEstado(estadoPlano()), []);
  useEffect(() => {
    window.addEventListener(EVENTO, recarregar);
    window.addEventListener("storage", recarregar);
    // Virada do dia com o app aberto: confere a cada minuto.
    const t = window.setInterval(recarregar, 60_000);
    return () => { window.removeEventListener(EVENTO, recarregar); window.removeEventListener("storage", recarregar); window.clearInterval(t); };
  }, [recarregar]);
  return estado;
}
