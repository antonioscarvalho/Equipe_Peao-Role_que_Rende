import { useEffect, useRef, useState } from "react";
import { Bichinho } from "../Bichinho";
import { useAparenciaVisivel } from "../personalizacao";
import { CenaCap1 } from "./cenas/CenaCap1";
import { tocar } from "../sons";
import "./cenas/cenas.css";

/**
 * Abertura da história: o Broto cai do espaço, risca o céu como estrelinha e pousa na grama.
 * Só transform e opacity (skill animar-componente). O Broto quica e fica bem: ninguém se machuca.
 * Com `reduzir`, mostra a cena já pousada, sem movimento, e espera a pessoa seguir.
 * Sempre dá para pular (botão ou Esc).
 */
const DURACAO_MS = 2600;

export function Queda({ aoFim, reduzir }: { aoFim: () => void; reduzir: boolean }) {
  const aparencia = useAparenciaVisivel();
  const botao = useRef<HTMLButtonElement>(null);
  const [pousou, setPousou] = useState(reduzir);
  const acabou = useRef(false);
  const fim = useRef(aoFim);
  fim.current = aoFim;
  const terminar = () => { if (!acabou.current) { acabou.current = true; fim.current(); } };

  useEffect(() => {
    botao.current?.focus();
    if (reduzir) return;
    const pouso = window.setTimeout(() => { setPousou(true); tocar("pulo"); }, DURACAO_MS * 0.72);
    const t = window.setTimeout(terminar, DURACAO_MS + 900);
    return () => { window.clearTimeout(pouso); window.clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduzir]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); terminar(); } };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`queda ${reduzir ? "queda--parada" : ""}`} role="dialog" aria-modal="true" aria-labelledby="queda-texto">
      <CenaCap1 momento={{ etapa: "abertura", pergunta: null }} reduzir={reduzir} />
      <div className="queda__ceu" aria-hidden="true">
        <span className="queda__rastro" />
        <div className="queda__broto">
          <Bichinho humor={pousou ? "cansado" : "calmo"} nivel={1} tamanho={84} reduzir aparencia={aparencia} />
        </div>
        {pousou && <span className="queda__poeira"><i /><i /><i /><i /></span>}
      </div>
      <p id="queda-texto" className="sr-only" aria-live="polite">
        {pousou ? "O Broto pousou na grama, ao lado da cratera. Está bem." : "Uma estrelinha cai do espaço. É o Broto."}
      </p>
      <button ref={botao} className="queda__pular" onClick={terminar}>{reduzir || pousou ? "Continuar" : "Pular"}</button>
    </div>
  );
}
