import { useEffect, useRef } from "react";
import { Bichinho } from "./Bichinho";
import { useAparenciaVisivel } from "./personalizacao";
import "./abertura.css";

/**
 * Abertura do app, toda vez que ele abre (estilo livro ilustrado, skill estilo-livro-ilustrado):
 * a praça do capítulo 1 com as luzes acendendo, a placa de papel com o nome do app e o Broto
 * saltando da navezinha. Cerca de 2,8 s. "Pular", Enter ou Esc pulam. Com reduzir, fica parada
 * e some em 1,2 s.
 */
const DURACAO_MS = 2800;

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
      {/* A praça do capítulo 1 ao entardecer: as luzes acendem e a "câmera" se afasta devagar. */}
      <div className="abertura__cenario" aria-hidden="true" />
      <div className="abertura__veu" aria-hidden="true" />
      <div className="abertura__placa">
        <h1 className="abertura__nome">Guardião</h1>
        <p className="abertura__frase">Um passo de cada vez, com alguém do seu lado.</p>
      </div>
      {/* O Broto sai da navezinha pousada na grama. */}
      <div className="abertura__broto" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => <i key={i} className="abertura__poeira" style={{ ["--i" as string]: i }} />)}
        <Bichinho humor="feliz" nivel={2} tamanho={132} reduzir aparencia={aparencia} />
      </div>
      <p className="sr-only" role="status">Abrindo o Guardião.</p>
      <button className="kb kb--amarelo abertura__pular" onClick={terminar}>Pular</button>
    </div>
  );
}
