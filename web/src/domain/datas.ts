import type { DataISO } from './tipos'

/** Data local do aparelho em AAAA-MM-DD (não usa UTC, para não virar o dia às 21h). */
export function hojeISO(agora: Date = new Date()): DataISO {
  const a = agora.getFullYear()
  const m = String(agora.getMonth() + 1).padStart(2, '0')
  const d = String(agora.getDate()).padStart(2, '0')
  return `${a}-${m}-${d}`
}

function paraDiaUTC(data: DataISO): number {
  const [a, m, d] = data.split('-').map(Number)
  return Date.UTC(a, m - 1, d) / 86_400_000
}

/** Quantos dias de `de` até `ate`, sem contar `de` (mesmo dia = 0). */
export function diferencaEmDias(de: DataISO, ate: DataISO): number {
  return Math.round(paraDiaUTC(ate) - paraDiaUTC(de))
}

export function formatarData(data: DataISO): string {
  const [a, m, d] = data.split('-')
  return `${d}/${m}/${a}`
}
