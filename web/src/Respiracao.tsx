import { useEffect, useState } from "react";
import { BotaoLibras } from "./BotaoLibras";
import { Bichinho } from "./Bichinho";
import { Icone } from "./Icone";
import { Animacao } from "./Animacao";
import { abaixarTrilha, tocar } from "./sons";

const fases = [
  { nome: "Inspire", seg: 4, classe: "inspira" },
  { nome: "Segure", seg: 4, classe: "segura" },
  { nome: "Solte devagar", seg: 6, classe: "expira" },
] as const;

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
  // Mesmo ritmo calmo da respiração: a trilha alegre abaixa enquanto essa tela estiver aberta.
  useEffect(() => { abaixarTrilha(true); return () => abaixarTrilha(false); }, []);

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
    <div className="crise" role="dialog" aria-modal="true" aria-labelledby="crise-titulo">
      <div className="tela-libras"><BotaoLibras /></div>
      <button className="crise__fechar" onClick={aoFechar} aria-label="Fechar" data-vlibras-gloss="FECHAR">×</button>
      {!terminou ? (
        <>
          <h2 id="crise-titulo" className="crise__titulo">A vontade vem em onda.<br />Vamos atravessar juntos.</h2>
          <div className={`onda onda--${montado ? f.classe : "expira"}`} style={{ ["--dur" as string]: `${f.seg}s` }}>
            <span className="onda__anel onda__anel--1" />
            <span className="onda__anel onda__anel--2" />
            <div className="onda__centro"><Bichinho humor="apoio" nivel={1} tamanho={150} reduzir={reduzir} /></div>
          </div>
          <button className="link" onClick={() => setComSom((v) => !v)} aria-pressed={comSom}>
            {comSom ? "Desligar som da respiração" : "Ligar som da respiração"}
          </button>
          <p className="crise__fase" aria-live="polite">{f.nome} <b>{resta}</b></p>
          <div className="crise__ciclos" aria-label={`Ciclo ${ciclo + 1} de ${CICLOS}`}>
            {Array.from({ length: CICLOS }, (_, i) => <span key={i} className={i < ciclo ? "ok" : i === ciclo ? "agora" : ""} />)}
          </div>
        </>
      ) : (
        <div className="crise__fim rqr-escalonado">
          <div className="crise__alivio">
            <Bichinho humor="feliz" nivel={2} tamanho={130} reduzir={reduzir} />
            <Animacao nome="aliviado" tamanho={84} reduzir={reduzir} rotulo="Rosto aliviado" />
          </div>
          <h2 id="crise-titulo" className="crise__titulo">Você atravessou essa onda.</h2>
          <p>Se a vontade continuar forte, conversar com alguém ajuda.</p>
          <a className="ajuda" href="tel:188"><Icone nome="phone" /> CVV · ligar 188 (24h, gratuito)</a>
          <a className="ajuda" href="https://www.gov.br/pt-br/servicos/plataforma-centralizada-de-autoexclusao-apostas" target="_blank" rel="noreferrer">
            <Icone nome="shieldCheck" /> Autoexclusão de apostas (gov.br)
          </a>
          {/* Spec 006, CA-4: situação da plataforma depois da MP 1.394/2026 não confirmada em fonte oficial. */}
          <small>Autoexclusão: situação depois da MP 1.394/2026 ainda não confirmada. Confira no site antes de contar com ela.</small>
          {aoJogar && (
            <button className="ajuda ajuda--botao" onClick={aoJogar}>
              <Icone nome="sprout" /> Pulo do Bichinho: 3 minutos pra onda passar
            </button>
          )}
          <button className="rqr-botao" onClick={aoFechar}>Voltar pro início</button>
          <small>Este app é um apoio complementar e não substitui atendimento profissional.</small>
        </div>
      )}
    </div>
  );
}
