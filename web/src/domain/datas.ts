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

export function somarDias(dia: DataLocal, n: number): DataLocal {
  const [ano, mes, d] = dia.split('-').map(Number)
  return dataLocal(new Date(ano, mes - 1, d + n))
}

/** "27 de outubro"; o ano só entra quando não é o de referência. */
export function dataPorExtenso(dia: DataLocal, referencia: DataLocal): string {
  const [ano, mes, d] = dia.split('-').map(Number)
  const texto = new Date(ano, mes - 1, d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
  return dia.slice(0, 4) === referencia.slice(0, 4) ? texto : `${texto} de ${ano}`
}
