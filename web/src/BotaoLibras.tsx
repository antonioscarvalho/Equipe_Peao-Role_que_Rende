import { useEffect, useState } from "react";
import { Icone } from "./Icone";
import { tocar } from "./sons";

const acharBotaoVLibras = () =>
  document.getElementById("vlibras-access-wrapper")?.shadowRoot?.querySelector<HTMLButtonElement>("#vlibras-button") ?? null;

/**
 * Botão de Libras no estilo do app (ícone de traço, papel creme, degrau de tinta), no topo da
 * tela principal e da história. Ele aciona o botão do próprio VLibras, em vez da bolha
 * flutuante que cobria a cena do bichinho. A bolha some enquanto um destes botões está na
 * camada de cima (regra em tema-livro.css) e volta nas outras telas por cima (jogos, respiração). Sem internet o VLibras não carrega e o
 * botão não aparece.
 */
export function BotaoLibras() {
  const [pronto, setPronto] = useState(() => !!acharBotaoVLibras());

  useEffect(() => {
    if (pronto) return;
    const id = window.setInterval(() => {
      if (acharBotaoVLibras()) { setPronto(true); window.clearInterval(id); }
    }, 500);
    return () => window.clearInterval(id);
  }, [pronto]);

  if (!pronto) return null;
  return (
    <button type="button" className="botao-topo botao-libras" onClick={() => { tocar("clique"); acharBotaoVLibras()?.click(); }}
      aria-label="Traduzir para Libras com o VLibras" title="Traduzir para Libras"
      data-vlibras-gloss="LIBRAS">
      <span className="botao-topo__icone" aria-hidden="true"><Icone nome="libras" tamanho={24} /></span>
    </button>
  );
}
