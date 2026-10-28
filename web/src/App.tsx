import { useCallback, useEffect, useState } from "react";
import { Bichinho, type Humor } from "./Bichinho";
import { Bairro, totalPecas } from "./Bairro";
import { Contador } from "./Contador";
import { Respiracao } from "./Respiracao";
import { Icone } from "./Icone";
import { Animacao } from "./Animacao";
import { Confete } from "./Confete";
import { AjudaAgora } from "./AjudaAgora";
import { PuloDoBichinho } from "./jogos/pulo/PuloDoBichinho";
import { Historia } from "./historia/Historia";
import type { NomeIcone } from "./icones-data";
import { ligarSons, tocar, tocarMissao } from "./sons";
import { BotaoPersonalizar, useAparenciaVisivel } from "./personalizacao";
import { BotaoCarrinho } from "./carrinho/RoleDeCarrinho";
import { BotaoTema } from "./BotaoTema";

type Missao = { id: number; texto: string; icone: NomeIcone; valor: number };

// Dados sintéticos para a demonstração (edital 8.5).
const missoes: Missao[] = [
  { id: 1, texto: "Caminhar 15 minutos", icone: "sprout", valor: 20 },
  { id: 2, texto: "Mandar mensagem pra alguém de confiança", icone: "heartHandshake", valor: 30 },
  { id: 3, texto: "Anotar os gastos de hoje", icone: "piggyBank", valor: 50 },
  { id: 4, texto: "Jogar bola ou ir na praça", icone: "house", valor: 40 },
];

const humores: { id: Humor; rotulo: string }[] = [
  { id: "calmo", rotulo: "Calmo" },
  { id: "feliz", rotulo: "Feliz" },
  { id: "orgulhoso", rotulo: "Orgulhoso" },
  { id: "cansado", rotulo: "Dia difícil" },
];

const falas: Record<Humor, string> = {
  calmo: "Bora cuidar do nosso rolê hoje?",
  feliz: "Boa! Cada passo conta.",
  orgulhoso: "Olha quanto você já protegeu!",
  cansado: "Dia difícil acontece. Tô aqui, nada do que construímos sumiu.",
  apoio: "Respira comigo.",
};

type Aba = "role" | "missoes" | "jogos" | "ajustes";
const TITULOS_ABA: Record<Aba, string> = { role: "Seu rolê de hoje", missoes: "Missões do dia", jogos: "Jogos", ajustes: "Ajustes" };

function BotaoAba({ aba, atual, mudar, icone, rotulo }: { aba: Aba; atual: Aba; mudar: (a: Aba) => void; icone: NomeIcone; rotulo: string }) {
  const ativa = aba === atual;
  return (
    <button className={`tabbar__item ${ativa ? "is-active" : ""}`} aria-current={ativa ? "page" : undefined}
      onClick={() => { mudar(aba); tocar("clique"); }}>
      <Icone nome={icone} tamanho={22} />
      <span>{rotulo}</span>
    </button>
  );
}

export default function App() {
  const [aba, setAba] = useState<Aba>("role");
  const [feitas, setFeitas] = useState<number[]>([]);
  const [humor, setHumor] = useState<Humor>("calmo");
  const [protegido, setProtegido] = useState(1240);
  const [crise, setCrise] = useState(false);
  // "crise": aberto pelo "Deu vontade", com convite de 3 minutos pra onda passar.
  const [jogo, setJogo] = useState<false | "inicio" | "crise">(false);
  const [historia, setHistoria] = useState(false);
  const [moedaKey, setMoedaKey] = useState(0);
  const [confete, setConfete] = useState(0);
  const [reduzir, setReduzir] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [aviso, setAviso] = useState("");
  // Sons das missões ligados por padrão; o interruptor desliga.
  // A respiração (SOS) continua sem som por padrão, conforme spec 003 CA-3.
  const [sons, setSons] = useState(true);
  const aparencia = useAparenciaVisivel();

  useEffect(() => { ligarSons(sons); }, [sons]);
  useEffect(() => { document.title = `${TITULOS_ABA[aba]} · Guardião`; }, [aba]);

  useEffect(() => {
    document.documentElement.classList.toggle("reduzir-animacoes", reduzir);
  }, [reduzir]);

  const concluir = useCallback((m: Missao) => {
    if (feitas.includes(m.id)) return;
    setFeitas((f) => [...f, m.id]);
    setProtegido((v) => v + m.valor);
    setMoedaKey((k) => k + 1);
    setConfete((c) => c + 1);
    setHumor("feliz");
    tocarMissao(feitas.length + 1, missoes.length);
    window.setTimeout(() => tocar("moeda"), 250);
    window.setTimeout(() => tocar("folha"), 650);
    if (feitas.length + 1 === missoes.length) {
      // Todas concluídas: conquista do dia, depois da moeda e da folha.
      window.setTimeout(() => tocar("conquista"), 1300);
    }
    setAviso(feitas.length + 1 === missoes.length
      ? `Todas as missões de hoje concluídas! O bairro inteiro agradece.`
      : `Missão concluída: ${m.texto}. Mais um lugar do bairro foi reconstruído.`);
    window.setTimeout(() => setHumor((h) => (h === "feliz" ? "calmo" : h)), 2600);
  }, [feitas]);

  const reiniciar = () => { setFeitas([]); setHumor("calmo"); setProtegido(1240); };

  const nivel = feitas.length;
  const construidas = Math.min(totalPecas, 2 + nivel);

  return (
    <div className="palco">
      <Decoracao />
      <main className="celular" aria-label="Prova visual do app">
        <header className="topo">
          <div>
            <p className="topo__oi">Oi, Lucas</p>
            <h1 className="topo__titulo">{TITULOS_ABA[aba]}</h1>
          </div>
          <BotaoTema compacto />
        </header>

        {aba === "role" && (
          <>
            <section className="cena" aria-label="Seu bichinho">
              <div className="balao" key={humor}>{falas[humor]}</div>
              <Bichinho humor={humor} nivel={nivel} reduzir={reduzir} aparencia={aparencia} />
              <BotaoPersonalizar />
              <Bairro construidas={construidas} />
              {moedaKey > 0 && humor === "feliz" && (
                <div className="cena__brilho" key={moedaKey}>
                  <Animacao nome="brilho" tamanho={120} repetir={false} reduzir={reduzir} />
                </div>
              )}
            </section>
            <section className="cards">
              <article className="rqr-card mini mini--linha">
                <span className="mini__icone mini__icone--lottie" style={{ background: "var(--rqr-verde-claro)" }}>
                  <Animacao nome="broto" tamanho={34} reduzir={reduzir} />
                </span>
                <div>
                  <p className="mini__rotulo">Dias de cuidado</p>
                  <p className="mini__valor">12 dias</p>
                </div>
              </article>
              <article className="rqr-card mini mini--linha">
                <span className="mini__icone mini__icone--moeda" key={moedaKey}>
                  <span className={moedaKey ? "moeda rqr-anim-moeda" : "moeda"} aria-hidden="true">R$</span>
                </span>
                <div>
                  <p className="mini__rotulo">Protegido</p>
                  <p className="mini__valor"><Contador valor={protegido} reduzir={reduzir} /></p>
                </div>
              </article>
            </section>
            <button className="atalho-missoes" onClick={() => setAba("missoes")}>
              <Icone nome="listChecks" /> {nivel} de {missoes.length} missões feitas hoje <span aria-hidden="true">›</span>
            </button>
          </>
        )}

        {aba === "missoes" && (
          <section aria-labelledby="missoes-titulo" className="aba-missoes">
            <div className="secao">
              <h2 id="missoes-titulo" className="sr-only">Missões do dia</h2>
              <span className="progresso" aria-label={`${nivel} de ${missoes.length} missões`}>
                <span style={{ transform: `scaleX(${nivel / missoes.length})` }} />
              </span>
              <span className="secao__conta">{nivel}/{missoes.length}</span>
            </div>
            <ul className="missoes rqr-escalonado">
              {missoes.map((m) => {
                const ok = feitas.includes(m.id);
                return (
                  <li key={m.id}>
                    <button className={`missao ${ok ? "is-ok" : ""}`} onClick={() => concluir(m)} aria-pressed={ok}>
                      <span className="missao__icone"><Icone nome={ok ? "check" : m.icone} /></span>
                      <span className="missao__texto">{m.texto}</span>
                      <span className="missao__valor">+ R$ {m.valor}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mini__nota">Cada missão reconstrói um pedaço do bairro. Dia difícil não zera nada.</p>
            {nivel > 0 && <button className="link" onClick={reiniciar}>Reiniciar demonstração</button>}
          </section>
        )}

        {aba === "jogos" && (
          <section className="aba-jogos" aria-label="Jogos">
            <button className="rqr-botao jogo-botao" onClick={() => setHistoria(true)}>História do Broto</button>
            <button className="rqr-botao jogo-botao" onClick={() => setJogo("inicio")}>Jogar: Pulo do Bichinho</button>
            <BotaoCarrinho reduzir={reduzir} />
            <p className="mini__nota">Partidas de até 3 minutos. Sem moeda, sem vidas, sem perder.</p>
          </section>
        )}

        {aba === "ajustes" && (
          <section className="aba-ajustes" aria-label="Ajustes">
            <div className="interruptores">
              <label className="interruptor">
                <input type="checkbox" checked={reduzir} onChange={(e) => setReduzir(e.target.checked)} />
                <span className="interruptor__trilho" aria-hidden="true" />
                <span className="interruptor__texto">Reduzir animações</span>
              </label>
              <label className="interruptor">
                <input type="checkbox" checked={sons} onChange={(e) => { setSons(e.target.checked); if (e.target.checked) { ligarSons(true); tocar("clique"); } }} />
                <span className="interruptor__trilho" aria-hidden="true" />
                <span className="interruptor__texto">Sons</span>
              </label>
              <BotaoTema />
            </div>
            <h2 className="aba-ajustes__titulo">Humor do bichinho (demonstração)</h2>
            <div className="humores" role="group" aria-label="Ver humores do bichinho (demonstração)">
              {humores.map((h) => (
                <button key={h.id} className={`chip ${humor === h.id ? "is-on" : ""}`}
                  aria-pressed={humor === h.id} onClick={() => setHumor(h.id)}>{h.rotulo}</button>
              ))}
            </div>
          </section>
        )}

        <nav className="tabbar" aria-label="Navegação principal">
          <BotaoAba aba="role" atual={aba} mudar={setAba} icone="house" rotulo="Rolê" />
          <BotaoAba aba="missoes" atual={aba} mudar={setAba} icone="listChecks" rotulo="Missões" />
          <button className="tabbar__sos" onClick={() => setCrise(true)}>
            <span className="tabbar__sos-circulo rqr-anim-on"><Icone nome="wind" tamanho={24} /></span>
            <span>Deu vontade</span>
          </button>
          <BotaoAba aba="jogos" atual={aba} mudar={setAba} icone="gamepad" rotulo="Jogos" />
          <BotaoAba aba="ajustes" atual={aba} mudar={setAba} icone="settings" rotulo="Ajustes" />
        </nav>

        <p className="sr-only" aria-live="polite">{aviso}</p>
      </main>
      <Confete disparo={confete} reduzir={reduzir} />
      {historia && <Historia aoFechar={() => setHistoria(false)} reduzir={reduzir} />}
      {/* Na história o botão flutuante sai; ela tem o próprio link de ajuda (Historia/Dialogo). */}
      {!historia && <AjudaAgora />}
      {jogo && <PuloDoBichinho aoFechar={() => setJogo(false)} reduzir={reduzir}
        chamada={jogo === "crise" ? "3 minutos pra onda passar. Ajude o bichinho a subir!" : undefined} />}
      {crise && <Respiracao aoFechar={() => setCrise(false)} reduzir={reduzir}
        aoJogar={() => { setCrise(false); setJogo("crise"); }} />}
    </div>
  );
}

function Decoracao() {
  return (
    <div className="decor" aria-hidden="true">
      <svg className="g g--seta rqr-anim-flutuar" viewBox="0 0 120 80"><path className="rqr-anim-pincelada" style={{ ["--rqr-traco" as string]: 260 }} d="M8 60 C30 10 70 10 74 40 C78 64 50 64 56 40 C62 20 96 18 112 30 M112 30 l-16 -4 M112 30 l-6 14" /></svg>
      <svg className="g g--anel rqr-anim-flutuar" viewBox="0 0 60 60"><circle cx="30" cy="30" r="20" /></svg>
      <svg className="g g--flor rqr-anim-flutuar" viewBox="0 0 60 60"><path d="M30 6v48M6 30h48M13 13l34 34M47 13L13 47" /></svg>
      <svg className="g g--arco rqr-anim-flutuar" viewBox="0 0 100 60"><path d="M8 10 C20 56 80 56 92 10" /></svg>
      <svg className="g g--tri rqr-anim-flutuar" viewBox="0 0 60 60"><path d="M30 8 L54 50 L6 50Z" /></svg>
    </div>
  );
}
