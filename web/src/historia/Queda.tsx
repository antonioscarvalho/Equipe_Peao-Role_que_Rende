import { useEffect, useRef, useState } from "react";
import { Bichinho } from "../Bichinho";
import { useAparenciaVisivel } from "../personalizacao";
import { CenaCap1 } from "./cenas/CenaCap1";
import { tocar } from "../sons";
import "./cenas/cenas.css";

/**
 * Abertura do cap. 1: o Broto cai do espaço, risca o céu e pousa ao lado da cratera, na mesma cena da conversa
 * (a transição para o diálogo fica sem corte). Só transform e opacity (skills animar-componente e motion-design).
 * O Broto quica e fica bem. Com `reduzir`, mostra a cena já pousada. "Pular" ou Esc a qualquer momento.
 */
const DURACAO_MS = 2400;

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
    const pouso = window.setTimeout(() => { setPousou(true); tocar("pulo"); }, 1700);
    const t = window.setTimeout(terminar, DURACAO_MS + 900);
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); terminar(); } };
    window.addEventListener("keydown", esc);
    return () => { window.clearTimeout(pouso); window.clearTimeout(t); window.removeEventListener("keydown", esc); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduzir]);

  return (
    <div className={`queda ${reduzir ? "queda--parada" : ""}`} role="dialog" aria-modal="true" aria-labelledby="queda-texto">
      <CenaCap1 momento={{ etapa: "abertura", pergunta: null, cena: "queda" }} reduzir={reduzir}
        ator={<div className="queda__broto"><Bichinho humor={pousou ? "cansado" : "calmo"} nivel={1} tamanho={104} reduzir aparencia={aparencia} /></div>} />
      <p id="queda-texto" className="sr-only" aria-live="polite">
        {pousou ? "O Broto pousou na grama, ao lado da cratera. Está bem." : "Uma estrelinha cai do espaço. É o Broto."}
      </p>
      <button ref={botao} className="queda__pular" onClick={terminar}>{reduzir || pousou ? "Continuar" : "Pular"}</button>
    </div>
  );
}
