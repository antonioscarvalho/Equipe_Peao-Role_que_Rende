import { useEffect, useRef } from "react";
import { Bichinho } from "./Bichinho";
import { useAparenciaVisivel } from "./personalizacao";
import "./abertura.css";

/**
 * Abertura do app, toda vez que ele abre: a carinha do Broto como logo, a poeira de luz em volta
 * e o nome do app. Cerca de 2,6 s (skill motion-design: entrada que desacelera, um herói, camada
 * secundária e ambiente). "Pular", Enter ou Esc pulam. Com reduzir, fica parada e some em 1,2 s.
 */
const DURACAO_MS = 2600;

export function Abertura({ aoFim, reduzir }: { aoFim: () => void; reduzir: boolean }) {
  const aparencia = useAparenciaVisivel();
  const acabou = useRef(false);
  const fim = useRef(aoFim);
  fim.current = aoFim;
  const terminar = () => { if (!acabou.current) { acabou.current = true; fim.current(); } };

  useEffect(() => {
    const t = window.setTimeout(terminar, reduzir ? 1200 : DURACAO_MS);
    const tecla = (e: KeyboardEvent) => { if (["Escape", "Enter", " "].includes(e.key)) { e.preventDefault(); terminar(); } };
    window.addEventListener("keydown", tecla);
    return () => { window.clearTimeout(t); window.removeEventListener("keydown", tecla); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`abertura ${reduzir ? "abertura--parada" : ""}`}>
      <div className="abertura__logo" aria-hidden="true">
        <span className="abertura__anel" />
        {Array.from({ length: 8 }, (_, i) => <i key={i} className="abertura__poeira" style={{ ["--i" as string]: i }} />)}
        <div className="abertura__rosto">
          <Bichinho humor="feliz" nivel={2} tamanho={150} reduzir aparencia={aparencia} />
        </div>
      </div>
      <h1 className="abertura__nome">Guardião</h1>
      <p className="abertura__frase">Um passo de cada vez, com alguém do seu lado.</p>
      <p className="sr-only" role="status">Abrindo o Guardião.</p>
      <button className="abertura__pular" onClick={terminar}>Pular</button>
    </div>
  );
}
