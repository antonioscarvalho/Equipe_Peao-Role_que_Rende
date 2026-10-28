import { useCallback, useEffect, useState } from "react";
import { aparenciaVisivel, sanear, type Aparencia } from "./aparencia";

/**
 * A escolha fica só neste aparelho (spec 009, CA-6). A prova visual não tem banco,
 * então usamos localStorage. O evento "storage" mantém a tela inicial em dia
 * se a personalização estiver aberta em outra aba do navegador.
 */
const CHAVE = "rqr:aparencia";
const EVENTO = "rqr:aparencia-mudou";

/**
 * Dias sem apostar da demonstração. A tela inicial mostra "12 dias" fixo (dados sintéticos, edital 8.5).
 * Quando o contador real existir, troque por ele: o resto do módulo já recebe o número pronto.
 */
export const DIAS_SEM_APOSTAR_DEMO = 12;

export function lerAparencia(): Aparencia {
  try {
    return sanear(JSON.parse(localStorage.getItem(CHAVE) ?? "null"));
  } catch {
    return sanear(null);
  }
}

function gravar(a: Aparencia) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(a));
  } catch {
    // Modo privado ou cota cheia: a escolha vale só até fechar a página.
  }
  window.dispatchEvent(new Event(EVENTO));
}

export function apagarAparencia() {
  try { localStorage.removeItem(CHAVE); } catch { /* nada a fazer */ }
  window.dispatchEvent(new Event(EVENTO));
}

export function useAparencia() {
  const [aparencia, setAparencia] = useState<Aparencia>(lerAparencia);

  useEffect(() => {
    const recarregar = () => setAparencia(lerAparencia());
    const deOutraAba = (e: StorageEvent) => { if (e.key === CHAVE || e.key === null) recarregar(); };
    window.addEventListener(EVENTO, recarregar);
    window.addEventListener("storage", deOutraAba);
    return () => {
      window.removeEventListener(EVENTO, recarregar);
      window.removeEventListener("storage", deOutraAba);
    };
  }, []);

  const mudar = useCallback((parcial: Partial<Aparencia>) => {
    gravar(sanear({ ...lerAparencia(), ...parcial }));
  }, []);

  return { aparencia, mudar };
}

/** Para a tela inicial: a aparência já sem itens de marco ainda não alcançados. */
export function useAparenciaVisivel(dias = DIAS_SEM_APOSTAR_DEMO): Aparencia {
  return aparenciaVisivel(useAparencia().aparencia, dias);
}
