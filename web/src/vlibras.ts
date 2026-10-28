import { useEffect } from "react";

/**
 * VLibras Widget (governo federal): a bolha que traduz para Libras o texto que a pessoa toca.
 * Como adaptar tela nova para ele ler: skill `.claude/skills/vlibras`.
 *
 * O carregador 7.x desenha a própria bolha num shadow DOM e não usa mais o `<div vw>` da
 * documentação antiga. Ele lê `window.VLibrasWidget` uma vez só, ao iniciar: por isso a
 * configuração vai antes do script, e `new VLibras.Widget(...)` depois dele não muda nada.
 */
const ENDERECO = "https://vlibras.gov.br/app";

declare global {
  interface Window {
    VLibrasWidget?: {
      path?: string;
      position?: "L" | "R";
      avatar?: "icaro" | "hosana" | "guga" | "random";
    };
  }
}

let carregado = false;

export function carregarVLibras() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  window.VLibrasWidget = { path: ENDERECO, position: "R" };

  // Depois da primeira pintura: a bolha não pode atrasar o "Preciso de ajuda agora".
  const injetar = () => {
    const script = document.createElement("script");
    script.src = `${ENDERECO}/vlibras-plugin.js`;
    script.async = true;
    // Sem internet a bolha só não aparece; o app continua funcionando.
    script.onerror = () => script.remove();
    document.body.appendChild(script);
  };
  const quandoOcioso = () =>
    "requestIdleCallback" in window
      ? window.requestIdleCallback(injetar, { timeout: 3000 })
      : setTimeout(injetar, 1500);
  if (document.readyState === "complete") quandoOcioso();
  else window.addEventListener("load", quandoOcioso, { once: true });
}

/**
 * Esconde a bolha e o intérprete enquanto `ativo`. Só para a partida em andamento dos jogos:
 * ali o controle é de tempo real, a bolha fica em cima da metade direita da tela (que é um
 * comando do Pulo) e, aberto, o VLibras transforma cada toque em pedido de tradução.
 * As instruções e o resultado da partida continuam com a bolha.
 */
export function useEsconderVLibras(ativo: boolean) {
  useEffect(() => {
    if (!ativo) return;
    document.body.dataset.vlibrasOculto = "true";
    return () => {
      delete document.body.dataset.vlibrasOculto;
    };
  }, [ativo]);
}
