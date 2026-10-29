import { useEffect, useRef, type ReactNode } from "react";
import { BotaoLibras } from "./BotaoLibras";
import { Icone } from "./Icone";
import { useModal } from "./historia/useModal";
import { tocar } from "./sons";

/**
 * Primeiro acesso: antes da história, um modal com os ajustes de acessibilidade (os mesmos da aba
 * Ajustes). Configurar é opcional; "Começar a história" segue direto. Esc também segue.
 * WCAG 2.2: foco preso no modal, título focado ao abrir, Esc fecha, tudo pelo teclado.
 */
export function ModalAcessibilidade({ children, aoTerminar }: { children: ReactNode; aoTerminar: () => void }) {
  const caixa = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  useModal(caixa, aoTerminar);
  useEffect(() => { titulo.current?.focus(); }, []);

  return (
    <div className="modal-acess" role="dialog" aria-modal="true" aria-labelledby="modal-acess-titulo" aria-describedby="modal-acess-texto">
      <div ref={caixa} className="modal-acess__caixa">
        <div className="modal-acess__selos" aria-hidden="true">
          <span className="modal-acess__selo"><Icone nome="acessibilidade" tamanho={30} /></span>
          <span className="modal-acess__selo"><Icone nome="linguaDeSinais" tamanho={30} /></span>
        </div>
        <h2 id="modal-acess-titulo" ref={titulo} tabIndex={-1} className="modal-acess__titulo">Deixe o app do seu jeito</h2>
        <p id="modal-acess-texto" className="modal-acess__texto">
          Antes de começar, ajuste o que ajudar você a ler e ouvir melhor. Dá para mudar depois em Ajustes.
        </p>
        <div className="modal-acess__libras">
          <BotaoLibras />
          <span>Libras: toque para ver a tradução com o VLibras</span>
        </div>
        <div className="modal-acess__ajustes">{children}</div>
        <button className="rqr-botao modal-acess__seguir" onClick={() => { tocar("clique"); aoTerminar(); }}>
          Pronto, começar a história
        </button>
      </div>
    </div>
  );
}
