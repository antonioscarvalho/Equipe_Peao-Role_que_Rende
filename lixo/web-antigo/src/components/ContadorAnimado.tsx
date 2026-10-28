import { useEffect, useRef, useState } from 'react'

/** Número que sobe suavemente até o valor (requestAnimationFrame, sem travar). */
export function ContadorAnimado({ valor, reduzir = false }: { valor: number; reduzir?: boolean }) {
  const [mostrado, setMostrado] = useState(valor)
  const anterior = useRef(valor)

  useEffect(() => {
    const inicio = anterior.current
    anterior.current = valor
    if (reduzir || inicio === valor) {
      setMostrado(valor)
      return
    }
    const duracao = 900
    const t0 = performance.now()
    let id = 0
    const passo = (t: number) => {
      const p = Math.min(1, (t - t0) / duracao)
      const suave = 1 - Math.pow(1 - p, 3)
      setMostrado(Math.round(inicio + (valor - inicio) * suave))
      if (p < 1) id = requestAnimationFrame(passo)
    }
    id = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(id)
  }, [valor, reduzir])

  return <>{mostrado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</>
}
