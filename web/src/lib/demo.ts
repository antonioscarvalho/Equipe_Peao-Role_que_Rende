/**
 * Dados SINTÉTICOS para a demonstração à Banca (edital, Seção 8.5). Nada aqui é de pessoa real.
 * Abrir o app com `?demo` troca os check-ins e a estimativa deste aparelho por estes;
 * os episódios do SOS ficam como estão.
 */
import { dataLocal } from '@/domain/datas'
import { abrirBanco, type Checkin, type ConfiguracaoFinancas } from './db'

const DIAS = 45
const LAPSO = 9
/** Dias sem registro: o contador só soma o que a pessoa afirmou (decisão 1 do plano 004). */
const EM_BRANCO = [30, 22, 15]

export const financasDemo: ConfiguracaoFinancas = { gastoSemanalEstimado: 150, meta: 'pagar a conta de luz atrasada' }

export function checkinsDemo(hoje: Date = new Date()): Checkin[] {
  const lista: Checkin[] = []
  for (let atras = DIAS; atras >= 1; atras--) {
    if (EM_BRANCO.includes(atras)) continue
    const dia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - atras, 21)
    const apostou = atras === LAPSO
    lista.push({
      data: dataLocal(dia),
      apostou,
      ...(apostou ? { gatilhos: ['dia do pagamento'], relato: 'Recebi e fiquei sozinho em casa.' } : {}),
      humor: apostou ? 2 : atras < LAPSO ? 4 : 3,
      registradoEm: dia.toISOString(),
    })
  }
  return lista
}

export async function carregarDemo(hoje: Date = new Date()): Promise<void> {
  const db = await abrirBanco()
  const tx = db.transaction(['checkins', 'configuracao'], 'readwrite')
  await tx.objectStore('checkins').clear()
  for (const c of checkinsDemo(hoje)) await tx.objectStore('checkins').put(c)
  await tx.objectStore('configuracao').put(financasDemo, 'financas')
  await tx.done
}
