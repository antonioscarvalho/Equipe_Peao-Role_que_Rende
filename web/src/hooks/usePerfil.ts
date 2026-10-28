import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  fotoComoDataUri,
  normalizarNome,
  PERFIL_PADRAO,
  validarNome,
  type ErroFoto,
  type ErroNome,
  type FotoGuardada,
  type Perfil,
} from '@/domain/perfil'
import { useAparencia } from '@/hooks/useAparencia'
import { FotoRecusada, prepararFoto } from '@/lib/foto'
import { perfil as repositorio } from '@/lib/perfil'

type Estado = 'carregando' | 'pronto'

/**
 * Perfil inteiro para as telas: nome, cenário, foto (como `data:` para o <img>) e a aparência do bichinho,
 * que continua sendo lida e gravada por useAparencia. Gravar é melhor esforço, como no resto do app:
 * se o IndexedDB falhar (modo anônimo), a escolha vale até recarregar.
 */
export function usePerfil() {
  const [estado, setEstado] = useState<Estado>('carregando')
  const [dados, setDados] = useState<Perfil>(PERFIL_PADRAO)
  const [foto, setFoto] = useState<FotoGuardada | null>(null)
  // `data:` e não URL de objeto: não há o que revogar, e o StrictMode não deixa a imagem quebrada ao remontar.
  const fotoUrl = useMemo(() => fotoComoDataUri(foto), [foto])
  const atual = useRef(dados)
  const { aparencia, mudar: mudarAparencia, carregada: aparenciaCarregada } = useAparencia()

  useEffect(() => {
    atual.current = dados
  }, [dados])

  useEffect(() => {
    let ativo = true
    Promise.all([repositorio.ler(), repositorio.lerFoto()])
      .then(([lidos, lida]) => {
        if (!ativo) return
        setDados(lidos)
        setFoto(lida)
      })
      .catch(() => undefined)
      .finally(() => ativo && setEstado('pronto'))
    return () => {
      ativo = false
    }
  }, [])

  const gravar = useCallback((parcial: Partial<Perfil>) => {
    const novo = { ...atual.current, ...parcial }
    atual.current = novo
    setDados(novo)
    repositorio.salvar(novo).catch(() => undefined)
  }, [])

  /** Devolve o erro para o campo mostrar; com erro, nada é gravado. */
  const mudarNome = useCallback(
    (texto: string): ErroNome | null => {
      const erro = validarNome(texto)
      if (!erro) gravar({ nome: normalizarNome(texto) })
      return erro
    },
    [gravar],
  )

  const mudarCenario = useCallback((cenario: string) => gravar({ cenario }), [gravar])

  /** Devolve o motivo da recusa para a tela explicar; com recusa, a foto anterior continua. */
  const trocarFoto = useCallback(async (arquivo: File): Promise<ErroFoto | null> => {
    try {
      const nova = await prepararFoto(arquivo)
      setFoto(nova)
      repositorio.salvarFoto(nova).catch(() => undefined)
      return null
    } catch (erro) {
      return erro instanceof FotoRecusada ? erro.motivo : 'leitura'
    }
  }, [])

  const tirarFoto = useCallback(() => {
    setFoto(null)
    repositorio.apagarFoto().catch(() => undefined)
  }, [])

  return {
    estado: estado === 'pronto' && aparenciaCarregada ? 'pronto' : 'carregando',
    perfil: dados,
    fotoUrl,
    temFoto: foto !== null,
    aparencia,
    mudarNome,
    mudarCenario,
    trocarFoto,
    tirarFoto,
    mudarAparencia,
  } as const
}
