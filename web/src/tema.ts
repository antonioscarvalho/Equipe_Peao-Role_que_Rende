import { useEffect, useState } from "react";

/**
 * Tema da interface: "claro" (padrão para todo mundo), "escuro", ou "auto" (segue o navegador).
 * Aplica data-tema="claro" | "escuro" no <html> (as cores estão em tokens.css e tema-livro.css).
 *
 * Alto contraste (WCAG 1.4.6 e 1.4.8, spec 008 CA-2): data-contraste="alto" no <html>, com as
 * cores em alto-contraste.css. Vale junto com o claro ou com o escuro. Sem escolha guardada,
 * segue o pedido do aparelho (prefers-contrast: more), como o "Reduzir animações".
 *
 * O index.html faz a mesma conta antes do React carregar, para a tela não piscar.
 */
export type PreferenciaTema = "auto" | "claro" | "escuro";

const CHAVE = "rqr-tema";
const CHAVE_CONTRASTE = "rqr-contraste";
const ESCURO = "(prefers-color-scheme: dark)";
const MAIS_CONTRASTE = "(prefers-contrast: more)";
const COR_BARRA = {
  claro: "#FCFC30", escuro: "#13133A",
  "claro-alto": "#FFFFFF", "escuro-alto": "#000000",
} as const;

export const ORDEM_TEMA: PreferenciaTema[] = ["claro", "escuro", "auto"];
export const NOME_TEMA: Record<PreferenciaTema, string> = { auto: "Automático", claro: "Claro", escuro: "Escuro" };

function lerPreferencia(): PreferenciaTema {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "auto" || v === "escuro" ? v : "claro";
  } catch { return "claro"; }
}

/** Barra do navegador no celular acompanha o tema escolhido, não só o do sistema. */
function pintarBarra() {
  const raiz = document.documentElement;
  const tema = raiz.dataset.tema === "escuro" ? "escuro" : "claro";
  const chave = raiz.dataset.contraste === "alto" ? (`${tema}-alto` as const) : tema;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", COR_BARRA[chave]));
}

function aplicar(pref: PreferenciaTema) {
  const tema = pref === "auto" ? (matchMedia(ESCURO).matches ? "escuro" : "claro") : pref;
  document.documentElement.dataset.tema = tema;
  pintarBarra();
}

const ouvintes = new Set<(p: PreferenciaTema) => void>();

/** Preferência compartilhada: trocar num botão atualiza todos os outros na tela. */
export function useTema() {
  const [pref, setPref] = useState(lerPreferencia);

  useEffect(() => {
    ouvintes.add(setPref);
    return () => { ouvintes.delete(setPref); };
  }, []);

  useEffect(() => {
    aplicar(pref);
    if (pref !== "auto") return;
    const mq = matchMedia(ESCURO);
    const mudou = () => aplicar("auto");
    mq.addEventListener("change", mudou);
    return () => mq.removeEventListener("change", mudou);
  }, [pref]);

  const escolher = (p: PreferenciaTema) => {
    try { localStorage.setItem(CHAVE, p); } catch { /* sem armazenamento: vale só nesta visita */ }
    ouvintes.forEach((f) => f(p));
  };

  return { pref, escolher };
}

// ---------- Alto contraste ----------

/** null = a pessoa ainda não escolheu: segue o aparelho. */
function lerContraste(): boolean | null {
  try {
    const v = localStorage.getItem(CHAVE_CONTRASTE);
    return v === "alto" ? true : v === "normal" ? false : null;
  } catch { return null; }
}

function aplicarContraste(alto: boolean) {
  const raiz = document.documentElement;
  if (alto) raiz.dataset.contraste = "alto";
  else delete raiz.dataset.contraste;
  pintarBarra();
}

const ouvintesContraste = new Set<(v: boolean | null) => void>();

/** Alto contraste ligado ou não; `mudar` grava a escolha e vale para todas as telas. */
export function useContraste() {
  const [escolha, setEscolha] = useState(lerContraste);
  const [doAparelho, setDoAparelho] = useState(() => typeof matchMedia === "function" && matchMedia(MAIS_CONTRASTE).matches);

  useEffect(() => {
    ouvintesContraste.add(setEscolha);
    return () => { ouvintesContraste.delete(setEscolha); };
  }, []);

  useEffect(() => {
    if (typeof matchMedia !== "function") return;
    const mq = matchMedia(MAIS_CONTRASTE);
    const mudou = () => setDoAparelho(mq.matches);
    mq.addEventListener("change", mudou);
    return () => mq.removeEventListener("change", mudou);
  }, []);

  const alto = escolha ?? doAparelho;
  useEffect(() => { aplicarContraste(alto); }, [alto]);

  const mudar = (v: boolean) => {
    try { localStorage.setItem(CHAVE_CONTRASTE, v ? "alto" : "normal"); } catch { /* vale só nesta visita */ }
    ouvintesContraste.forEach((f) => f(v));
  };

  return { alto, mudar };
}
