import type { IdCapitulo } from "./tipos";
import { hojeLocal } from "../plano";

/**
 * Progresso da história, só neste aparelho (mesmo padrão de personalizacao/armazenamento.ts).
 * Guarda APENAS quais capítulos foram concluídos e se o aviso inicial já foi visto.
 * As respostas da pessoa nas conversas nunca são salvas nem enviadas (narrativa-broto.md, "Proteções").
 * Desbloqueio só por jogar, nunca por sorte. Nada concluído se perde: só se acrescenta.
 * Um capítulo novo por dia: quem concluiu um hoje vê o próximo liberar amanhã (pedido do produto:
 * tempo fora do celular para fazer as missões). Reler capítulos já feitos é livre.
 */
const CHAVE = "rqr:historia";

export const ORDEM: readonly IdCapitulo[] = ["cap1", "cap2", "cap3", "cap4", "cap5", "cap6", "epilogo"];

/** Em que parte o capítulo parou, para não recomeçar 15 minutos do zero. Não guarda respostas. */
export type Parte = "jogo" | "depois";

type Gravado = { concluidos: IdCapitulo[]; avisoVisto: boolean; partes: Partial<Record<IdCapitulo, Parte>>; ultimoDia?: string };

function ler(): Gravado {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE) ?? "null") as Partial<Gravado> | null;
    const concluidos = Array.isArray(bruto?.concluidos)
      ? ORDEM.filter((id) => bruto!.concluidos!.includes(id))
      : [];
    const partes: Gravado["partes"] = {};
    for (const id of ORDEM) {
      const p = (bruto?.partes as Record<string, unknown> | undefined)?.[id];
      if (p === "jogo" || p === "depois") partes[id] = p;
    }
    const ultimoDia = typeof bruto?.ultimoDia === "string" ? bruto.ultimoDia : undefined;
    return { concluidos, avisoVisto: bruto?.avisoVisto === true, partes, ultimoDia };
  } catch {
    return { concluidos: [], avisoVisto: false, partes: {} };
  }
}

function gravar(g: Gravado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(g));
  } catch {
    // Modo privado ou cota cheia: o progresso vale só até fechar a página.
  }
}

export function capitulosConcluidos(): IdCapitulo[] {
  return ler().concluidos;
}

export function concluirCapitulo(id: IdCapitulo) {
  const g = ler();
  const partes = { ...g.partes };
  delete partes[id];
  const novo = !g.concluidos.includes(id);
  gravar({ ...g, partes, concluidos: novo ? [...g.concluidos, id] : g.concluidos, ultimoDia: novo ? hojeLocal() : g.ultimoDia });
}

/** Onde retomar um capítulo em andamento. `undefined` = do começo. */
export function parteDoCapitulo(id: IdCapitulo): Parte | undefined {
  return ler().partes[id];
}

export function marcarParte(id: IdCapitulo, parte: Parte) {
  const g = ler();
  gravar({ ...g, partes: { ...g.partes, [id]: parte } });
}

/** cap1 sempre; os outros quando o anterior na ORDEM estiver concluído e não foi hoje que um capítulo terminou. */
export function estaDesbloqueado(id: IdCapitulo): boolean {
  const i = ORDEM.indexOf(id);
  if (i <= 0) return i === 0;
  const g = ler();
  if (g.concluidos.includes(id) || g.partes[id]) return true;
  return g.concluidos.includes(ORDEM[i - 1]) && !jaFezCapituloHoje();
}

/** O anterior está pronto, mas hoje já teve capítulo novo: libera amanhã. */
export function liberaAmanha(id: IdCapitulo): boolean {
  const i = ORDEM.indexOf(id);
  if (i <= 0) return false;
  const g = ler();
  return !g.concluidos.includes(id) && !g.partes[id] && g.concluidos.includes(ORDEM[i - 1]) && jaFezCapituloHoje();
}

export function jaFezCapituloHoje(): boolean {
  return ler().ultimoDia === hojeLocal();
}

export function avisoVisto(): boolean {
  return ler().avisoVisto;
}

export function marcarAvisoVisto() {
  gravar({ ...ler(), avisoVisto: true });
}
