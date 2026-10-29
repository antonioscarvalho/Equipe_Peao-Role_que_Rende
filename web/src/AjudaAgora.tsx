import { useEffect, useRef, useState } from "react";
import { BotaoLibras } from "./BotaoLibras";
import { Icone } from "./Icone";

/**
 * "Preciso de ajuda agora": ajuda humana a 1 toque, em qualquer tela, sem internet.
 * Specs 001 (CA-2) e 006 (CA-1, CA-2); skill seguranca-e-crise (obrigatória).
 * Fica acima de todas as camadas (respiração, Pulo do Bichinho, personalização, história).
 * Ordem do protocolo: ajuda humana primeiro; nada de exercício no lugar dela.
 * REVISÃO CLÍNICA PENDENTE dos textos.
 */
export function AjudaAgora() {
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);

  const fechar = () => {
    setAberto(false);
    botao.current?.focus();
  };

  return (
    <>
      <button ref={botao} className="ajuda-agora" onClick={() => setAberto(true)} aria-haspopup="dialog">
        <Icone nome="phone" /> Preciso de ajuda agora
      </button>
      {aberto && <PainelCrise aoFechar={fechar} />}
    </>
  );
}

/**
 * O painel do protocolo de crise (CVV 188, SAMU 192, UBS/CAPS).
 * Usado pelo botão "Preciso de ajuda agora" e pelas opções `abreCrise` da história do Broto.
 * Quem abre cuida de devolver o foco em `aoFechar`.
 */
export function PainelCrise({ aoFechar }: { aoFechar: () => void }) {
  const titulo = useRef<HTMLHeadingElement>(null);
  const fechar = useRef(aoFechar);
  fechar.current = aoFechar;

  useEffect(() => {
    titulo.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fechar.current();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <div className="crise ajuda-agora__painel" role="dialog" aria-modal="true" aria-labelledby="ajuda-agora-titulo">
      <div className="tela-libras"><BotaoLibras /></div>
      <button className="crise__fechar" onClick={aoFechar} aria-label="Fechar" data-vlibras-gloss="FECHAR">×</button>
      <h2 id="ajuda-agora-titulo" ref={titulo} tabIndex={-1} className="crise__titulo">
        Você não precisa passar por isso sozinho(a).
      </h2>
      <p>Parece que está pesado. Escolha uma opção. Ligar é gratuito.</p>
      <a className="ajuda" href="tel:188"><Icone nome="phone" /> CVV · conversar com alguém agora · 188 (24h)</a>
      <a className="ajuda" href="tel:192"><Icone nome="phone" /> SAMU · risco imediato · 192</a>
      <a className="ajuda" href="https://cvv.org.br" target="_blank" rel="noreferrer"><Icone nome="heartHandshake" /> Chat do CVV (precisa de internet)</a>
      <p>Você também pode ir à unidade de saúde (UBS) do seu bairro ou ao CAPS.</p>
      <small>O Guardião é um apoio e não substitui atendimento profissional nem serviço de emergência.</small>
      <button className="rqr-botao" onClick={aoFechar}>Voltar, sem pressa</button>
    </div>
  );
}
