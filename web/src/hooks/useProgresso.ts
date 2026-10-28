import { useCallback, useEffect, useMemo, useState } from 'react'
import { dataLocal } from '@/domain/datas'
import { progresso as calcular } from '@/domain/progresso'
import { checkins } from '@/lib/checkins'
import { configuracao } from '@/lib/configuracao'
import type { Checkin, ConfiguracaoFinancas } from '@/lib/db'

type Estado = 'carregando' | 'pronto'

/**
 * Check-ins, estimativa de gasto e meta do aparelho, já convertidos no progresso.
 * Gravar é melhor esforço, como no SOS: se o IndexedDB falhar (modo anônimo), a tela
 * mostra o registro mesmo assim e ele só não sobrevive ao recarregar.
 */
export function useProgresso(hoje: string = dataLocal()) {
  const [estado, setEstado] = useState<Estado>('carregando')
  const [lista, setLista] = useState<Checkin[]>([])
  const [financas, setFinancas] = useState<ConfiguracaoFinancas>({ gastoSemanalEstimado: null, meta: null })

  useEffect(() => {
    let ativo = true
    Promise.all([checkins.listar(), configuracao.lerFinancas()])
      .then(([salvos, lidas]) => {
        if (!ativo) return
        setLista(salvos)
        setFinancas(lidas)
      })
      .catch(() => undefined)
      .finally(() => ativo && setEstado('pronto'))
    return () => {
      ativo = false
    }
  }, [])

  const registrar = useCallback(
    (apostou: boolean, gatilhos?: string[]) => {
      const local: Checkin = {
        data: hoje,
        apostou,
        ...(apostou && gatilhos?.length ? { gatilhos } : {}),
        registradoEm: new Date().toISOString(),
      }
      setLista((atual) => [...atual.filter((c) => c.data !== hoje), local])
      checkins.registrar(apostou, gatilhos).catch(() => undefined)
    },
    [hoje],
  )

  const salvarFinancas = useCallback((novas: ConfiguracaoFinancas) => {
    setFinancas(novas)
    configuracao.salvarFinancas(novas).catch(() => undefined)
  }, [])

  const gastoSemanal = financas.gastoSemanalEstimado
  const progresso = useMemo(() => calcular(hoje, lista, gastoSemanal), [hoje, lista, gastoSemanal])
  const registroDeHoje = lista.find((c) => c.data === hoje) ?? null

  return { estado, hoje, progresso, registroDeHoje, gastoSemanal, meta: financas.meta, registrar, salvarFinancas }
}
