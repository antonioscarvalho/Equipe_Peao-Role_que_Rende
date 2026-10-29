import { useEffect, useState } from "react";
import { gravarGuardado, lerJson } from "../guardado";

/**
 * O que a pessoa contou ao Broto no cap. 1 (questionario-onboarding.md, telas 3 e 5).
 * Só é gravado se ela tocar em "Guardar". Fica só neste aparelho e sai em "Apagar o que contei".
 * O resto da conversa não é salvo.
 */
const CHAVE = "rqr:conhecer";
const EVENTO = "rqr:conhecer-mudou";

export const MOTIVOS = [
  "Minha família", "Meus filhos", "Pagar dívidas", "Guardar dinheiro pra um sonho", "Dormir melhor",
  "Minha saúde", "Meu trabalho ou estudo", "Voltar a confiar em mim", "Meu relacionamento",
  "Alguém me pediu", "Só quero entender melhor",
] as const;
export const METAS = ["Parar de apostar", "Diminuir primeiro", "Ainda não sei"] as const;

export type Conhecer = { motivos: string[]; meta: string | null };

export function lerConhecer(): Conhecer | null {
  const b = lerJson(CHAVE) as Partial<Conhecer> | null;
  if (!b || typeof b !== "object") return null;
  const motivos = Array.isArray(b.motivos) ? b.motivos.filter((m): m is string => (MOTIVOS as readonly string[]).includes(m as string)) : [];
  const meta = (METAS as readonly string[]).includes(b.meta as string) ? (b.meta as string) : null;
  return motivos.length || meta ? { motivos, meta } : null;
}

export function guardarConhecer(c: Conhecer) {
  gravarGuardado(CHAVE, JSON.stringify(c));
  window.dispatchEvent(new Event(EVENTO));
}

export function apagarConhecer() {
  gravarGuardado(CHAVE, null);
  window.dispatchEvent(new Event(EVENTO));
}

export function useConhecer() {
  const [c, setC] = useState(lerConhecer);
  useEffect(() => {
    const r = () => setC(lerConhecer());
    window.addEventListener(EVENTO, r);
    window.addEventListener("storage", r);
    return () => { window.removeEventListener(EVENTO, r); window.removeEventListener("storage", r); };
  }, []);
  return c;
}

/** "Minha família e Pagar dívidas" → "sua família e pagar dívidas", para o Broto refletir. */
export function refletirMotivos(motivos: string[]): string {
  const t = motivos.map((m) => m.replace(/^Minha /, "sua ").replace(/^Meus /, "seus ").replace(/^Meu /, "seu ")
    .replace(/^[A-Z]/, (l) => l.toLowerCase()));
  return t.length <= 1 ? t.join("") : `${t.slice(0, -1).join(", ")} e ${t[t.length - 1]}`;
}
