import { useEffect, useState } from "react";
import { BotaoLibras } from "./BotaoLibras";
import { Bichinho } from "./Bichinho";
import { Icone } from "./Icone";
import { Animacao } from "./Animacao";
import { abaixarTrilha, tocar, tocarTrilha } from "./sons";

const fases = [
  { nome: "Inspire", dica: "pelo nariz, enchendo a barriga", seg: 4, classe: "inspira" },
  { nome: "Segure", dica: "de leve, sem forçar", seg: 4, classe: "segura" },
  { nome: "Solte devagar", dica: "pela boca, como quem apaga uma vela", seg: 6, classe: "expira" },
] as const;

/** Grãos de "poeira de luz" em volta do poste: só ambiente, somem com reduzir. */
const POEIRA = [0, 1, 2, 3, 4, 5];

const CICLOS = 3;

/** Momento de crise: respiração guiada 4-4-6 com o bichinho. Apoio complementar, com canais reais de ajuda. */
/** `aoJogar`: abre o Pulo do Bichinho como "3 minutos para a onda passar" (tarefa visual curta contra a fissura). */
export function Respiracao({ aoFechar, aoJogar, reduzir }: { aoFechar: () => void; aoJogar?: () => void; reduzir: boolean }) {
  const [ciclo, setCiclo] = useState(0);
  // Spec 003 CA-3: sem som por padrão no momento de crise; a pessoa pode ligar aqui.
  const [comSom, setComSom] = useState(false);
  const [fase, setFase] = useState(0);
  const [resta, setResta] = useState<number>(fases[0].seg);
  const terminou = ciclo >= CICLOS;
  // Começa "vazio" e cresce na primeira inspiração, para a transição aparecer desde o início.
  const [montado, setMontado] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setMontado(true)); return () => cancelAnimationFrame(id); }, []);
  // Com o som da respiração desligado (padrão): só abaixa a trilha alegre, sem parar.
  // Ligado: troca pra um som de fundo relaxante próprio, cujo volume sobe e desce no mesmo
  // ritmo 4-4-6 do exercício — sem o duplo abaixamento (esse som já nasce bem baixinho).
  // Adiado um tique por causa do StrictMode (dev), que monta/desmonta/monta de novo todo
  // componente — ver o comentário mais detalhado em jogos/pulo/PuloDoBichinho.tsx.
  useEffect(() => {
    if (!comSom) { abaixarTrilha(true); return () => abaixarTrilha(false); }
    let cancelado = false;
    const id = window.setTimeout(() => {
      if (!cancelado) tocarTrilha("/sons/respirar-calma.opus", { titulo: "Respire com calma", artista: "Som da respiração" });
    }, 0);
    return () => {
      cancelado = true;
      window.clearTimeout(id);
      tocarTrilha("/sons/trilha-leve.opus", { titulo: "Um Passo de Cada Vez", artista: "Trilha do app" });
    };
  }, [comSom]);

  useEffect(() => {
    if (terminou) return;
    const id = setTimeout(() => {
      if (resta > 1) return setResta(resta - 1);
      const prox = (fase + 1) % fases.length;
      if (prox === 0) setCiclo((c) => c + 1);
      setFase(prox);
      setResta(fases[prox].seg);
    }, 1000);
    return () => clearTimeout(id);
  }, [resta, fase, terminou]);

  // Título próprio enquanto a tela está aberta (WCAG 2.4.2); devolve o anterior ao fechar.
  useEffect(() => {
    const antes = document.title;
    document.title = "Respirar com o Broto · Meu amigo Broto!";
    return () => { document.title = antes; };
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && aoFechar();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aoFechar]);

  // Tom calmo marcando o ritmo, só se a pessoa ligou os sons. "Segure" fica em silêncio.
  useEffect(() => {
    if (terminou) return;
    const c = fases[fase].classe;
    if (!comSom) return;
    if (c === "inspira") tocar("inspira");
    if (c === "expira") tocar("expira");
  }, [fase, ciclo, terminou, comSom]);

  const f = fases[fase];

  return (
    <div className="crise respiro" role="dialog" aria-modal="true" aria-labelledby="crise-titulo">
      <div className="tela-libras"><BotaoLibras /></div>
      <button className="botao-topo respiro__fechar" onClick={aoFechar} aria-label="Fechar" data-vlibras-gloss="FECHAR">
        <span className="botao-topo__icone" aria-hidden="true">×</span>
      </button>
      {!terminou ? (
        <div className="respiro__conteudo">
          <p className="respiro__selo"><Icone nome="wind" tamanho={18} /> Respirar com o Broto</p>
          <h2 id="crise-titulo" className="crise__titulo respiro__titulo">A vontade vem em onda.<br />Vamos atravessar juntos.</h2>

          {/* Palco: luz do poste (halo) e disco de papel que enchem e esvaziam; o anel marca o tempo da fase. */}
          <div className={`respiro__palco respiro__palco--${montado ? f.classe : "expira"}`} style={{ ["--dur" as string]: `${f.seg}s` }} aria-hidden="true">
            <span className="respiro__halo" />
            {!reduzir && POEIRA.map((i) => <span key={i} className={`respiro__poeira respiro__poeira--${i}`} />)}
            <svg className="respiro__anel" viewBox="0 0 120 120">
              <circle className="respiro__trilho" cx="60" cy="60" r="54" />
              <circle key={`${ciclo}-${fase}`} className="respiro__tempo" cx="60" cy="60" r="54" pathLength={100} />
            </svg>
            <div className="respiro__lua"><Bichinho humor="apoio" nivel={1} tamanho={128} reduzir={reduzir} /></div>
          </div>

          <div className={`respiro__fase respiro__fase--${f.classe}`} aria-live="polite">
            <span className="respiro__nome">{f.nome}</span>
            <span className="respiro__seg" aria-label={`${resta} segundos`}>{resta}</span>
            <small className="respiro__dica">{f.dica}</small>
          </div>

          <ol className="respiro__ciclos" aria-label={`Ciclo ${ciclo + 1} de ${CICLOS}`}>
            {Array.from({ length: CICLOS }, (_, i) => (
              <li key={i} className={i < ciclo ? "is-ok" : i === ciclo ? "is-agora" : ""} />
            ))}
          </ol>

          <button className="kb kb--escuro respiro__som" onClick={() => setComSom((v) => !v)} aria-pressed={comSom}>
            <Icone nome="music" tamanho={20} /> {comSom ? "Som da respiração: ligado" : "Som da respiração: desligado"}
          </button>
        </div>
      ) : (
        <div className="respiro__fim">
          <div className="crise__alivio">
            <Bichinho humor="feliz" nivel={2} tamanho={120} reduzir={reduzir} />
            <Animacao nome="aliviado" tamanho={72} reduzir={reduzir} rotulo="Rosto aliviado" />
          </div>
          <h2 id="crise-titulo" className="respiro__fim-titulo">Você atravessou essa onda.</h2>
          <p>Se a vontade continuar forte, conversar com alguém ajuda.</p>
          <a className="kb kb--rosa respiro__acao" href="tel:188"><Icone nome="phone" /> CVV · ligar 188 (24h, gratuito)</a>
          <a className="kb kb--azul respiro__acao" href="https://www.gov.br/pt-br/servicos/plataforma-centralizada-de-autoexclusao-apostas" target="_blank" rel="noreferrer">
            <Icone nome="shieldCheck" /> Autoexclusão de apostas (gov.br, abre em outra aba)
          </a>
          {/* Spec 006, CA-4: situação da plataforma depois da MP 1.394/2026 não confirmada em fonte oficial. */}
          <small>Autoexclusão: situação depois da MP 1.394/2026 ainda não confirmada. Confira no site antes de contar com ela.</small>
          {aoJogar && (
            <button className="kb kb--verde respiro__acao" onClick={aoJogar}>
              <Icone nome="sprout" /> Pulo do Bichinho: 3 minutos pra onda passar
            </button>
          )}
          <button className="kb kb--amarelo respiro__acao" onClick={aoFechar}>Voltar pro início</button>
          <small>Este app é um apoio complementar e não substitui atendimento profissional.</small>
        </div>
      )}
    </div>
  );
}
