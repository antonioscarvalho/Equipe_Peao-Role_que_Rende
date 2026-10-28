import { useEffect, useRef, useState } from "react";
import { Icone } from "./Icone";

/**
 * "Preciso de ajuda agora": ajuda humana a 1 toque, em qualquer tela, sem internet.
 * Specs 001 (CA-2) e 006 (CA-1, CA-2); skill seguranca-e-crise (obrigatória).
 * Fica acima de todas as camadas (respiração, Pulo do Bichinho, personalização).
 * Ordem do protocolo: ajuda humana primeiro; nada de exercício no lugar dela.
 * REVISÃO CLÍNICA PENDENTE dos textos.
 */
export function AjudaAgora() {
  const [aberto, setAberto] = useState(false);
  const titulo = useRef<HTMLHeadingElement>(null);
  const botao = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    titulo.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  const fechar = () => {
    setAberto(false);
    botao.current?.focus();
  };

  return (
    <>
      <button ref={botao} className="ajuda-agora" onClick={() => setAberto(true)} aria-haspopup="dialog">
        <Icone nome="phone" /> Preciso de ajuda agora
      </button>
      {aberto && (
        <div className="crise ajuda-agora__painel" role="dialog" aria-modal="true" aria-labelledby="ajuda-agora-titulo">
          <button className="crise__fechar" onClick={fechar} aria-label="Fechar">×</button>
          <h2 id="ajuda-agora-titulo" ref={titulo} tabIndex={-1} className="crise__titulo">
            Você não precisa passar por isso sozinho(a).
          </h2>
          <p>Parece que está pesado. Escolha uma opção. Ligar é gratuito.</p>
          <a className="ajuda" href="tel:188"><Icone nome="phone" /> CVV · conversar com alguém agora · 188 (24h)</a>
          <a className="ajuda" href="tel:192"><Icone nome="phone" /> SAMU · risco imediato · 192</a>
          <a className="ajuda" href="https://cvv.org.br" target="_blank" rel="noreferrer"><Icone nome="heartHandshake" /> Chat do CVV (precisa de internet)</a>
          <p>Você também pode ir à unidade de saúde (UBS) do seu bairro ou ao CAPS.</p>
          <small>O Guardião é um apoio e não substitui atendimento profissional nem serviço de emergência.</small>
          <button className="rqr-botao" onClick={fechar}>Voltar, sem pressa</button>
        </div>
      )}
    </>
  );
}
