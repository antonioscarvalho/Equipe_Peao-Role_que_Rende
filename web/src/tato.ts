import { useEffect, useState } from "react";

/**
 * Retorno tátil: o celular vibra (Vibration API, `navigator.vibrate`).
 *
 * Regras (skills design-etico-saude-digital, seguranca-e-crise, acessibilidade-wcag):
 * - Vibração curta e previsível, sempre ligada a uma ação da pessoa. Nada de padrão longo de
 *   "prêmio", nada aleatório, nada em loop. A mais longa (semana completa) dura menos de 0,2 s.
 * - Nunca é a única pista: todo evento que vibra também tem texto na tela e para o leitor de tela.
 * - No momento de crise (respiração e "Preciso de ajuda agora") nada vibra sozinho. A única
 *   exceção é o "Vibrar no ritmo" da respiração, que a pessoa liga de propósito (começa desligado).
 * - Começa ligada e fica guardada no aparelho; o interruptor "Vibrar" está em Ajustes.
 * - Quem não tem vibração no navegador (iPhone e computador, em geral) não perde nada: é só um extra.
 */

export type Toque =
  | "toque"      // botão comum
  | "sucesso"    // missão feita
  | "conquista"  // semana completa
  | "aviso"      // algo não deu (nome inválido, item ainda bloqueado)
  | "impacto"    // o Broto pousa, o bichinho cai na grama
  | "inspira"    // respiração: uma vibração longa
  | "expira";    // respiração: duas curtas

const PADROES: Record<Toque, number | number[]> = {
  toque: 10,
  sucesso: [16, 50, 16],
  conquista: [18, 60, 18, 60, 30],
  aviso: [30, 45, 30],
  impacto: [60, 40, 25],
  inspira: 320,
  expira: [90, 140, 90],
};

const CHAVE = "rqr-vibrar";

function lerLigado(): boolean {
  try { return localStorage.getItem(CHAVE) !== "0"; } catch { return true; }
}

let ligado = lerLigado();

/** O navegador deixa vibrar? (Android sim; iPhone e computador, em geral, não.) */
export const vibracaoSuportada = typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

/** Respiração ou painel de crise abertos: a tela de crise pede calma. */
function emCrise() {
  return typeof document !== "undefined" && document.querySelector(".crise") !== null;
}

/** Vibra com o padrão do evento. `noRitmo` é o pedido explícito da respiração (vale na crise). */
export function vibrar(toque: Toque, { noRitmo = false }: { noRitmo?: boolean } = {}) {
  if (!vibracaoSuportada || !ligado || document.hidden) return;
  if (emCrise() && !noRitmo) return;
  try { navigator.vibrate(PADROES[toque]); } catch { /* alguns navegadores bloqueiam sem gesto do usuário */ }
}

/** Para qualquer vibração em andamento (ao fechar a respiração, por exemplo). */
export function pararVibracao() {
  if (vibracaoSuportada) try { navigator.vibrate(0); } catch { /* nada a fazer */ }
}

const ouvintes = new Set<() => void>();

/** Preferência compartilhada: trocar num lugar atualiza todos. */
export function useVibrar() {
  const [, atualizar] = useState(0);
  useEffect(() => {
    const f = () => atualizar((n) => n + 1);
    ouvintes.add(f);
    return () => { ouvintes.delete(f); };
  }, []);

  return {
    ligado,
    suportado: vibracaoSuportada,
    mudar(v: boolean) {
      ligado = v;
      try { localStorage.setItem(CHAVE, v ? "1" : "0"); } catch { /* vale só nesta visita */ }
      ouvintes.forEach((f) => f());
      if (v) vibrar("sucesso"); // amostra do que a pessoa vai sentir
    },
  };
}
