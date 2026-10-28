import { useEffect, useState } from "react";

/**
 * Tema da interface: "auto" segue o navegador; "claro" e "escuro" fixam.
 * Aplica data-tema="claro" | "escuro" no <html> (as cores estão em tokens.css).
 * O index.html faz a mesma conta antes do React carregar, para a tela não piscar.
 */
export type PreferenciaTema = "auto" | "claro" | "escuro";

const CHAVE = "rqr-tema";
const ESCURO = "(prefers-color-scheme: dark)";
const COR_BARRA = { claro: "#FCFC30", escuro: "#13133A" } as const;

export const ORDEM_TEMA: PreferenciaTema[] = ["auto", "claro", "escuro"];
export const NOME_TEMA: Record<PreferenciaTema, string> = { auto: "Automático", claro: "Claro", escuro: "Escuro" };

function lerPreferencia(): PreferenciaTema {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "claro" || v === "escuro" ? v : "auto";
  } catch { return "auto"; }
}

function aplicar(pref: PreferenciaTema) {
  const tema = pref === "auto" ? (matchMedia(ESCURO).matches ? "escuro" : "claro") : pref;
  document.documentElement.dataset.tema = tema;
  // Barra do navegador no celular acompanha o tema escolhido, não só o do sistema.
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", COR_BARRA[tema]));
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
