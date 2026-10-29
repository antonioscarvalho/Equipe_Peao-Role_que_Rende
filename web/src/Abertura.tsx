import { useEffect, useRef } from "react";
import { Bichinho } from "./Bichinho";
import { useAparenciaVisivel } from "./personalizacao";
import { CAMINHO_CORPO } from "./personalizacao/ItensBichinho";
import "./abertura.css";

/**
 * Abertura do app (cerca de 3 s), discreta, como a logo de um app:
 * 1. tela preta;
 * 2. o contorno do Broto se desenha em traço claro (o esboço vira a logo);
 * 3. o amarelo toma a tela a partir do Broto, que ganha cor;
 * 4. tudo some, revelando o app (sem nome: a logo é o próprio Broto).
 * Sem botão de pular (pedido do produto). Enter ou Esc ainda pulam. Com reduzir, fica parada e some em 1,2 s.
 */
const DURACAO_MS = 3000;

export function Abertura({ aoFim, reduzir }: { aoFim: () => void; reduzir: boolean }) {
  const aparencia = useAparenciaVisivel();
  const acabou = useRef(false);
  const fim = useRef(aoFim);
  fim.current = aoFim;
  const terminar = () => { if (!acabou.current) { acabou.current = true; fim.current(); } };

  useEffect(() => {
    const t = window.setTimeout(terminar, reduzir ? 1200 : DURACAO_MS);
    const tecla = (e: KeyboardEvent) => { if (["Escape", "Enter"].includes(e.key)) { e.preventDefault(); terminar(); } };
    window.addEventListener("keydown", tecla);
    return () => { window.clearTimeout(t); window.removeEventListener("keydown", tecla); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`abertura ${reduzir ? "abertura--parada" : ""}`} aria-hidden="true">
      <div className="abertura__amarelo" />
      <div className="abertura__centro">
        <div className="abertura__logo">
          {/* O esboço: os mesmos traços do Broto, desenhados em linha clara sobre o preto. */}
          <svg className="abertura__esboco" viewBox="0 0 200 200">
            <path pathLength={1} d={CAMINHO_CORPO} />
            <path pathLength={1} d="M48 140 C30 136 22 150 28 158 C34 164 46 156 52 150" />
            <path pathLength={1} d="M152 140 C170 136 178 150 172 158 C166 164 154 156 148 150" />
            <path pathLength={1} d="M100 52 C100 40 100 34 100 26" />
            <path pathLength={1} d="M100 38 C88 30 80 34 78 26 C90 22 98 28 100 38Z" />
            <path pathLength={1} d="M100 32 C112 24 120 28 124 20 C110 16 102 22 100 32Z" />
            <path pathLength={1} d="M68 110 Q78 98 88 110 M112 110 Q122 98 132 110" />
            <path pathLength={1} d="M88 132 Q100 146 112 132" />
          </svg>
          <div className="abertura__broto">
            <Bichinho humor="feliz" nivel={2} tamanho={150} reduzir aparencia={aparencia} />
          </div>
        </div>
      </div>
    </div>
  );
}
