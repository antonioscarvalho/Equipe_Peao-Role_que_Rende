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
 * A bolha padrão fica no meio da borda direita, por cima da cena do bichinho, e no hover se abre
 * numa faixa de 200 px ("Acessível com VLibras") que só repete o aria-label do botão.
 * Aqui ela vira um botão redondo no canto inferior direito, logo acima do menu de abas, no
 * mesmo estilo dos outros botões do app (contorno azul-escuro e degrau embaixo), sem a faixa.
 * O estilo entra no shadow DOM (aberto) do carregador, que o CSS da página não alcança;
 * se uma versão nova mudar os ids, a regra só deixa de valer e a bolha volta ao padrão.
 */
function discreta(raiz: ShadowRoot) {
  const estilo = document.createElement("style");
  estilo.textContent = `
    #vlibras-access {
      top: auto !important; left: auto !important;
      right: max(14px, calc((100vw - 560px) / 2 + 14px)) !important;
      bottom: calc(92px + env(safe-area-inset-bottom, 0px)) !important;
      width: 48px !important; height: 48px !important; margin: 0 !important; transform: none !important;
    }
    #vlibras-popup { display: none !important; }
    #vlibras-button {
      width: 48px !important; height: 48px !important; padding: 6px !important; border-radius: 50% !important;
      display: grid !important; place-items: center; overflow: hidden; cursor: pointer;
      background: #FFFFFF !important; border: 3px solid #3333BD !important; box-shadow: 0 4px 0 #3333BD !important;
      transition: transform 220ms cubic-bezier(.3, 1.6, .5, 1), box-shadow 220ms cubic-bezier(.3, 1.6, .5, 1) !important;
    }
    #vlibras-button img { width: 100% !important; height: 100% !important; object-fit: contain; }
    #vlibras-button:active { transform: translateY(4px); box-shadow: 0 0 0 #3333BD !important; transition-duration: 60ms !important; }
    #vlibras-button:focus-visible { outline: 3px solid #FF6E91; outline-offset: 3px; }
    @media (prefers-reduced-motion: reduce) { #vlibras-button { transition: none !important; } }
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
