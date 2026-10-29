import { useEffect, useRef, useState } from "react";
import { Bichinho } from "./Bichinho";
import { useAparenciaVisivel } from "./personalizacao";
import { CAMINHO_CORPO } from "./personalizacao/ItensBichinho";
import "./abertura.css";

/**
 * Abertura do app (cerca de 8 s), em três etapas sobre o fundo preto:
 * 1. o logo do Rolê que Rende aparece, fica e some (2 s);
 * 2. o logo da Açaí Valley (organizadora do hackathon), do mesmo jeito (2 s);
 * 3. a logo do app: o contorno do Broto se desenha em traço claro, fica 1 s no escuro,
 *    o amarelo toma a tela a partir do Broto, que ganha cor, e tudo some revelando o app (4 s).
 * Sem botão de pular (pedido do produto). Enter ou Esc ainda pulam tudo.
 * Com reduzir: cada etapa aparece parada (o logo 1,2 s, o Broto colorido 1,2 s), sem movimento.
 * É decorativa (aria-hidden): o app por baixo já tem título e nome próprios.
 */
const MARCA_MS = 2000;
const APP_MS = 4000;
const PARADA_MS = 1200;

export function Abertura({ aoFim, reduzir }: { aoFim: () => void; reduzir: boolean }) {
  const aparencia = useAparenciaVisivel();
  const [etapa, setEtapa] = useState<"marca" | "parceiro" | "app">("marca");
  const acabou = useRef(false);
  const fim = useRef(aoFim);
  fim.current = aoFim;
  const terminar = () => { if (!acabou.current) { acabou.current = true; fim.current(); } };

  useEffect(() => {
    // O logo da Açaí Valley já baixa enquanto o do Rolê que Rende aparece.
    new Image().src = "/marca/acai-valley.webp";
    const marca = reduzir ? PARADA_MS : MARCA_MS;
    const t1 = window.setTimeout(() => setEtapa("parceiro"), marca);
    const t3 = window.setTimeout(() => setEtapa("app"), marca * 2);
    const t2 = window.setTimeout(terminar, marca * 2 + (reduzir ? PARADA_MS : APP_MS));
    const tecla = (e: KeyboardEvent) => { if (["Escape", "Enter"].includes(e.key)) { e.preventDefault(); terminar(); } };
    window.addEventListener("keydown", tecla);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); window.clearTimeout(t3); window.removeEventListener("keydown", tecla); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`abertura abertura--${etapa} ${reduzir ? "abertura--parada" : ""}`} aria-hidden="true">
      {etapa === "marca" ? (
        <img key="marca" className="abertura__marca" src="/marca/role-que-rende.webp" alt="" width={449} height={315} decoding="async" />
      ) : etapa === "parceiro" ? (
        <img key="parceiro" className="abertura__marca abertura__marca--parceiro" src="/marca/acai-valley.webp" alt="" width={1080} height={567} decoding="async" />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
