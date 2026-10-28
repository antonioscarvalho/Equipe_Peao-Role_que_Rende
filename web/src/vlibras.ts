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
    quandoABolhaSurgir(discreta);
  };
  const quandoOcioso = () =>
    "requestIdleCallback" in window
      ? window.requestIdleCallback(injetar, { timeout: 3000 })
      : setTimeout(injetar, 1500);
  if (document.readyState === "complete") quandoOcioso();
  else window.addEventListener("load", quandoOcioso, { once: true });
}

/**
 * No hover e no foco a bolha se abre numa faixa de 200 px com a imagem "Acessível com VLibras",
 * por cima do conteúdo. A faixa só repete o que o aria-label do botão já diz, então fica
 * fechada. Parada, ela fica quase transparente e só aparece inteira com o mouse em cima ou com
 * foco (pedido do produto: a 20% ela não tem o contraste de 3:1 da WCAG 1.4.11 até ser
 * selecionada). O estilo entra no shadow DOM (aberto) do carregador, que o CSS da página não alcança;
 * se uma versão nova mudar os ids, a regra só deixa de valer e a faixa volta.
 */
function discreta(raiz: ShadowRoot) {
  const estilo = document.createElement("style");
  estilo.textContent = `
    #vlibras-access { width: 40px !important; opacity: 0.2; transition: opacity 0.2s ease !important; }
    #vlibras-access:hover, #vlibras-access:focus-within { opacity: 1; }
    #vlibras-popup { display: none !important; }
    @media (prefers-reduced-motion: reduce) { #vlibras-access { transition: none !important; } }
  `;
  raiz.appendChild(estilo);
}

function quandoABolhaSurgir(aplicar: (raiz: ShadowRoot) => void) {
  const tentar = () => {
    const raiz = document.getElementById("vlibras-access-wrapper")?.shadowRoot;
    if (raiz) aplicar(raiz);
    return !!raiz;
  };
  if (tentar()) return;
  const observador = new MutationObserver(
    () => tentar() && observador.disconnect(),
  );
  observador.observe(document.body, { childList: true });
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
