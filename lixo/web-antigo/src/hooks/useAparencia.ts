import { useCallback, useEffect, useRef, useState } from 'react'
import { APARENCIA_PADRAO, type Aparencia } from '@/domain/aparencia'
import { aparencia as repositorio } from '@/lib/aparencia'

/** Lê e grava a aparência do bichinho. Gravar é melhor esforço: se o IndexedDB falhar, vale até recarregar. */
export function useAparencia() {
  const [aparencia, setAparencia] = useState<Aparencia>(APARENCIA_PADRAO)
  const [carregada, setCarregada] = useState(false)
  // Guarda a última aparência para `mudar` gravar sem efeito colateral dentro do setState.
  const atualRef = useRef(aparencia)
  useEffect(() => {
    atualRef.current = aparencia
  }, [aparencia])

  useEffect(() => {
    let ativo = true
    repositorio
      .ler()
      .then((lida) => ativo && setAparencia(lida))
      .catch(() => undefined)
      .finally(() => ativo && setCarregada(true))
    return () => {
      ativo = false
    }
  }, [])

  const mudar = useCallback((parcial: Partial<Aparencia>) => {
    const nova = { ...atualRef.current, ...parcial }
    atualRef.current = nova
    setAparencia(nova)
    repositorio.salvar(nova).catch(() => undefined)
  }, [])

  return { aparencia, carregada, mudar }
}
