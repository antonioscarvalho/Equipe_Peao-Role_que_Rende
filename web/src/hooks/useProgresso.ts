import { useCallback, useEffect, useMemo, useState } from 'react'
import { dataLocal } from '@/domain/datas'
import { progressoDoMes } from '@/domain/progresso'
import { checkins } from '@/lib/checkins'
import { configuracao } from '@/lib/configuracao'
import type { Checkin } from '@/lib/db'

type Estado = 'carregando' | 'pronto'

/**
 * Check-ins e estimativa de gasto do aparelho, já convertidos no progresso do mês.
 * Gravar é melhor esforço, como no SOS: se o IndexedDB falhar (modo anônimo), a tela
 * mostra o registro mesmo assim e ele só não sobrevive ao recarregar.
 */
export function useProgresso(hoje: string = dataLocal()) {
  const [estado, setEstado] = useState<Estado>('carregando')
  const [lista, setLista] = useState<Checkin[]>([])
  const [gastoSemanal, setGastoSemanal] = useState<number | null>(null)

  useEffect(() => {
    let ativo = true
    Promise.all([checkins.listar(), configuracao.lerFinancas()])
      .then(([salvos, financas]) => {
        if (!ativo) return
        setLista(salvos)
        setGastoSemanal(financas.gastoSemanalEstimado)
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

  const salvarGastoSemanal = useCallback((valor: number | null) => {
    setGastoSemanal(valor)
    configuracao.salvarFinancas({ gastoSemanalEstimado: valor }).catch(() => undefined)
  }, [])

  const progresso = useMemo(() => progressoDoMes(hoje, lista, gastoSemanal), [hoje, lista, gastoSemanal])
  const registroDeHoje = lista.find((c) => c.data === hoje) ?? null

  return { estado, hoje, progresso, registroDeHoje, gastoSemanal, registrar, salvarGastoSemanal }
}
