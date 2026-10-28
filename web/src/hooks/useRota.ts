import { useCallback, useEffect, useState } from 'react'

export type Rota = '/' | '/sos' | '/ajuda' | '/plano' | '/circulo'

const ROTAS: Rota[] = ['/', '/sos', '/ajuda', '/plano', '/circulo']

function rotaAtual(): Rota {
  const caminho = window.location.pathname as Rota
  return ROTAS.includes(caminho) ? caminho : '/'
}

/** Navegação mínima com a History API. As rotas nunca carregam dado da pessoa (nada sensível na URL). */
export function useRota() {
  const [rota, setRota] = useState<Rota>(rotaAtual)

  useEffect(() => {
    const aoVoltar = () => setRota(rotaAtual())
    window.addEventListener('popstate', aoVoltar)
    return () => window.removeEventListener('popstate', aoVoltar)
  }, [])

  const ir = useCallback((destino: Rota) => {
    if (destino !== window.location.pathname) window.history.pushState(null, '', destino)
    setRota(destino)
    window.scrollTo?.(0, 0)
  }, [])

  return { rota, ir }
}
