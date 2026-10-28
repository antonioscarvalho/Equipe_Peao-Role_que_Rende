import { useEffect, type RefObject } from "react";

const FOCAVEIS = 'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Foco preso dentro do modal, Esc fecha e o foco volta para onde estava ao desmontar.
 * `ativo = false` desliga a trava enquanto outra camada (jogo, crise) está por cima.
 */
export function useModal(ref: RefObject<HTMLElement | null>, aoFechar: () => void, ativo = true) {
  useEffect(() => {
    const antes = document.activeElement as HTMLElement | null;
    return () => { antes?.focus?.(); };
  }, []);

  useEffect(() => {
    if (!ativo) return;
    const tecla = (e: KeyboardEvent) => {
      const caixa = ref.current;
      if (!caixa) return;
      // O painel de crise fica por cima de tudo e cuida do próprio teclado.
      if (document.querySelector(".ajuda-agora__painel")) return;
      if (e.key === "Escape") { e.preventDefault(); aoFechar(); return; }
      if (e.key !== "Tab") return;
      const itens = Array.from(caixa.querySelectorAll<HTMLElement>(FOCAVEIS));
      if (!itens.length) return;
      const primeiro = itens[0], ultimo = itens[itens.length - 1];
      const atual = document.activeElement;
      if (e.shiftKey && (atual === primeiro || !caixa.contains(atual))) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && (atual === ultimo || !caixa.contains(atual))) { e.preventDefault(); primeiro.focus(); }
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [ref, aoFechar, ativo]);
}
