import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { criarRepositorioLocal, type Repositorio } from '@/lib/armazenamento'
import { estadoInicial, type Estado } from '@/domain/tipos'

interface ValorDados {
  estado: Estado
  atualizar: (mudar: (atual: Estado) => Estado) => void
  apagarTudo: () => void
  exportar: () => string
}

const Contexto = createContext<ValorDados | null>(null)

export function DadosProvider({ children, repositorio }: { children: ReactNode; repositorio?: Repositorio }) {
  const repo = useMemo(() => repositorio ?? criarRepositorioLocal(), [repositorio])
  const [estado, setEstado] = useState<Estado>(() => repo.ler())

  const atualizar = useCallback(
    (mudar: (atual: Estado) => Estado) => {
      setEstado((atual) => {
        const novo = mudar(atual)
        repo.salvar(novo)
        return novo
      })
    },
    [repo],
  )

  const apagarTudo = useCallback(() => {
    repo.apagarTudo()
    setEstado(estadoInicial())
  }, [repo])

  const exportar = useCallback(() => repo.exportar(), [repo])

  // Preferências de acessibilidade aplicadas na raiz do documento.
  useEffect(() => {
    const raiz = document.documentElement
    raiz.dataset.fonte = estado.preferencias.fonte
    raiz.dataset.contraste = estado.preferencias.altoContraste ? 'alto' : 'normal'
    raiz.dataset.movimento = estado.preferencias.reduzirMovimento ? 'reduzido' : 'normal'
  }, [estado.preferencias])

  const valor = useMemo(() => ({ estado, atualizar, apagarTudo, exportar }), [estado, atualizar, apagarTudo, exportar])
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useDados(): ValorDados {
  const v = useContext(Contexto)
  if (!v) throw new Error('useDados precisa estar dentro de <DadosProvider>')
  return v
}
