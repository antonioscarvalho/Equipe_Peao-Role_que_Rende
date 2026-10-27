/** Data no formato 'AAAA-MM-DD', sempre no fuso do aparelho. */
export type DataLocal = string

const dois = (n: number) => String(n).padStart(2, '0')

// Nunca `toISOString().slice(0, 10)`: em UTC, um check-in às 23h no Brasil cairia no dia seguinte.
export function dataLocal(data: Date = new Date()): DataLocal {
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}`
}

export function inicioDoMes(dia: DataLocal): DataLocal {
  return `${dia.slice(0, 7)}-01`
}

export function mesmoMes(a: DataLocal, b: DataLocal): boolean {
  return a.slice(0, 7) === b.slice(0, 7)
}

/** Quantos dias do mês já passaram, contando o dia de hoje. */
export function diasDecorridosNoMes(hoje: DataLocal): number {
  return Number(hoje.slice(8, 10))
}

export function nomeDoMes(dia: DataLocal): string {
  const [ano, mes] = dia.split('-').map(Number)
  return new Date(ano, mes - 1, 1).toLocaleDateString('pt-BR', { month: 'long' })
}
