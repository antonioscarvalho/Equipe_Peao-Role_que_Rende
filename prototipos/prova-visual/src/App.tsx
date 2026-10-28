import { useCallback, useEffect, useState } from "react";
import { Bichinho, type Humor } from "./Bichinho";
import { Bairro, totalPecas } from "./Bairro";
import { Contador } from "./Contador";
import { Respiracao } from "./Respiracao";
import { Icone } from "./Icone";
import { Animacao } from "./Animacao";
import { Confete } from "./Confete";
import type { NomeIcone } from "./icones-data";
import { ligarSons, tocar, tocarMissao } from "./sons";

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

export default function App() {
  const [feitas, setFeitas] = useState<number[]>([]);
  const [humor, setHumor] = useState<Humor>("calmo");
  const [protegido, setProtegido] = useState(1240);
  const [crise, setCrise] = useState(false);
  const [moedaKey, setMoedaKey] = useState(0);
  const [confete, setConfete] = useState(0);
  const [reduzir, setReduzir] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [aviso, setAviso] = useState("");
  // Sons das missões ligados por padrão; o interruptor desliga.
  // A respiração (SOS) continua sem som por padrão, conforme spec 003 CA-3.
  const [sons, setSons] = useState(true);

  useEffect(() => { ligarSons(sons); }, [sons]);

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
            <h1 className="topo__titulo"><span className="rqr-realce rqr-anim-marca-texto">Seu rolê</span> de hoje</h1>
          </div>
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
          </div>
        </header>

        <section className="cena" aria-label="Seu bichinho">
          <div className="balao" key={humor}>{falas[humor]}</div>
          <Bichinho humor={humor} nivel={nivel} reduzir={reduzir} />
          <Bairro construidas={construidas} />
          {moedaKey > 0 && humor === "feliz" && (
            <div className="cena__brilho" key={moedaKey}>
              <Animacao nome="brilho" tamanho={120} repetir={false} reduzir={reduzir} />
            </div>
          )}
        </section>

        <div className="humores" role="group" aria-label="Ver humores do bichinho (demonstração)">
          {humores.map((h) => (
            <button key={h.id} className={`chip ${humor === h.id ? "is-on" : ""}`}
              aria-pressed={humor === h.id} onClick={() => setHumor(h.id)}>{h.rotulo}</button>
          ))}
        </div>

        <section className="cards rqr-escalonado">
          <article className="rqr-card mini">
            <span className="mini__icone mini__icone--lottie" style={{ background: "var(--rqr-verde-claro)" }}>
              <Animacao nome="broto" tamanho={34} reduzir={reduzir} />
            </span>
            <div>
              <p className="mini__rotulo">Dias de cuidado</p>
              <p className="mini__valor">12 dias</p>
              <p className="mini__nota">Dia difícil não zera nada.</p>
            </div>
          </article>
          <article className="rqr-card mini">
            <span className="mini__icone mini__icone--moeda" key={moedaKey}>
              <span className={moedaKey ? "moeda rqr-anim-moeda" : "moeda"} aria-hidden="true">R$</span>
            </span>
            <div>
              <p className="mini__rotulo">Dinheiro protegido</p>
              <p className="mini__valor"><Contador valor={protegido} reduzir={reduzir} /></p>
              <p className="mini__nota">Estimativa do que deixou de ir pra apostas.</p>
            </div>
          </article>
        </section>

        <section aria-labelledby="missoes-titulo">
          <div className="secao">
            <h2 id="missoes-titulo">Missões do dia</h2>
            <span className="progresso" aria-label={`${nivel} de ${missoes.length} missões`}>
              <span style={{ transform: `scaleX(${nivel / missoes.length})` }} />
            </span>
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
          {nivel > 0 && <button className="link" onClick={reiniciar}>Reiniciar demonstração</button>}
        </section>

        <button className="sos rqr-anim-on" onClick={() => setCrise(true)}>
          <Icone nome="wind" tamanho={28} /> Deu vontade
        </button>

        <p className="sr-only" aria-live="polite">{aviso}</p>
      </main>
      <Confete disparo={confete} reduzir={reduzir} />
      {crise && <Respiracao aoFechar={() => setCrise(false)} reduzir={reduzir} />}
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
