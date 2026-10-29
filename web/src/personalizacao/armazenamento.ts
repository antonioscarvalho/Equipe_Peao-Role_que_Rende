import { useCallback, useEffect, useState } from "react";
import { aparenciaVisivel, sanear, type Aparencia, type Progresso } from "./aparencia";
import { usePlano } from "../plano";
import { capitulosConcluidos } from "../historia/progresso";
import { gravarGuardado, lerJson } from "../guardado";

/**
 * A escolha fica só neste aparelho (spec 009, CA-6). A prova visual não tem banco,
 * então usamos localStorage. O evento "storage" mantém a tela inicial em dia
 * se a personalização estiver aberta em outra aba do navegador.
 */
const CHAVE = "rqr:aparencia";
const EVENTO = "rqr:aparencia-mudou";

/**
 * O que conta para as metas da personalização: dias do plano de 90 dias, missões feitas e
 * capítulos concluídos. Tudo real, deste aparelho (sem dado de demonstração).
 */
export function useProgresso(): Progresso {
  const plano = usePlano();
  return { dias: plano.dia, missoes: plano.totalFeitas, capitulos: capitulosConcluidos().length };
}

export function lerAparencia(): Aparencia {
  try {
    return sanear(lerJson(CHAVE));
  } catch {
    return sanear(null);
  }
}

function gravar(a: Aparencia) {
  gravarGuardado(CHAVE, JSON.stringify(a));
  window.dispatchEvent(new Event(EVENTO));
}

export function apagarAparencia() {
  gravarGuardado(CHAVE, null);
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

/** Para a tela inicial: a aparência já sem itens cuja meta ainda não foi alcançada. */
export function useAparenciaVisivel(): Aparencia {
  const progresso = useProgresso();
  return aparenciaVisivel(useAparencia().aparencia, progresso);
}
