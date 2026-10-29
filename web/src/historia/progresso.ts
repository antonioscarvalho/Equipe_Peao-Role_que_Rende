import type { IdCapitulo } from "./tipos";

/**
 * Progresso da história, só neste aparelho (mesmo padrão de personalizacao/armazenamento.ts).
 * Guarda APENAS quais capítulos foram concluídos e se o aviso inicial já foi visto.
 * As respostas da pessoa nas conversas nunca são salvas nem enviadas (narrativa-broto.md, "Proteções").
 * Desbloqueio só por jogar, nunca por sorte. Nada concluído se perde: só se acrescenta.
 */
const CHAVE = "rqr:historia";

export const ORDEM: readonly IdCapitulo[] = ["cap1", "cap2", "cap3", "cap4", "cap5", "cap6", "epilogo"];

/** Em que parte o capítulo parou, para não recomeçar 15 minutos do zero. Não guarda respostas. */
export type Parte = "jogo" | "depois";

type Gravado = { concluidos: IdCapitulo[]; avisoVisto: boolean; partes: Partial<Record<IdCapitulo, Parte>> };

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
    return { concluidos, avisoVisto: bruto?.avisoVisto === true, partes };
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
  gravar({ ...g, partes, concluidos: g.concluidos.includes(id) ? g.concluidos : [...g.concluidos, id] });
}

/** Onde retomar um capítulo em andamento. `undefined` = do começo. */
export function parteDoCapitulo(id: IdCapitulo): Parte | undefined {
  return ler().partes[id];
}

export function marcarParte(id: IdCapitulo, parte: Parte) {
  const g = ler();
  gravar({ ...g, partes: { ...g.partes, [id]: parte } });
}

/** cap1 sempre; os outros quando o anterior na ORDEM estiver concluído. */
export function estaDesbloqueado(id: IdCapitulo): boolean {
  const i = ORDEM.indexOf(id);
  if (i <= 0) return i === 0;
  const feitos = ler().concluidos;
  return feitos.includes(id) || feitos.includes(ORDEM[i - 1]);
}

export function avisoVisto(): boolean {
  return ler().avisoVisto;
}

export function marcarAvisoVisto() {
  gravar({ ...ler(), avisoVisto: true });
}
