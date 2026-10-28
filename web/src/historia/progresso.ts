import type { IdCapitulo } from "./tipos";

/**
 * Progresso da história, só neste aparelho (mesmo padrão de personalizacao/armazenamento.ts).
 * Guarda APENAS quais capítulos foram concluídos e se o aviso inicial já foi visto.
 * As respostas da pessoa nas conversas nunca são salvas nem enviadas (narrativa-broto.md, "Proteções").
 * Desbloqueio só por jogar, nunca por sorte. Nada concluído se perde: só se acrescenta.
 */
const CHAVE = "rqr:historia";

export const ORDEM: readonly IdCapitulo[] = ["cap1", "cap2", "cap3", "cap4", "cap5", "cap6", "epilogo"];

type Gravado = { concluidos: IdCapitulo[]; avisoVisto: boolean };

function ler(): Gravado {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE) ?? "null") as Partial<Gravado> | null;
    const concluidos = Array.isArray(bruto?.concluidos)
      ? ORDEM.filter((id) => bruto!.concluidos!.includes(id))
      : [];
    return { concluidos, avisoVisto: bruto?.avisoVisto === true };
  } catch {
    return { concluidos: [], avisoVisto: false };
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
  if (!g.concluidos.includes(id)) gravar({ ...g, concluidos: [...g.concluidos, id] });
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
