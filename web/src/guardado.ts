/**
 * Leitura e gravação no localStorage com reserva na memória. Quando o navegador recusa
 * (modo privado, armazenamento bloqueado, cota cheia), a escolha vale até fechar a página
 * em vez de sumir na hora. Nada daqui lança erro.
 */
const naMemoria = new Map<string, string | null>();

export function lerGuardado(chave: string): string | null {
  if (naMemoria.has(chave)) return naMemoria.get(chave)!;
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

/** `null` apaga. */
export function gravarGuardado(chave: string, valor: string | null) {
  naMemoria.delete(chave);
  try {
    if (valor === null) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch {
    naMemoria.set(chave, valor);
  }
}

export function lerJson(chave: string): unknown {
  try {
    return JSON.parse(lerGuardado(chave) ?? "null");
  } catch {
    return null;
  }
}

/** Recorde dos mini jogos: número finito e não negativo, ou 0. */
export function lerRecorde(chave: string): number {
  const v = Number(lerGuardado(chave));
  return Number.isFinite(v) && v > 0 ? v : 0;
}
