import { dataLocal } from '@/domain/datas'
import { abrirBanco, type Checkin } from './db'

/** O que a pessoa conta depois de um lapso; tudo opcional (spec 004, CA-3). */
export interface DetalhesLapso {
  gatilhos?: string[]
  relato?: string
}

/** Só existe quando apostou, e só com o que foi de fato preenchido. */
export function detalhesDoLapso(apostou: boolean, detalhes?: DetalhesLapso): Pick<Checkin, 'gatilhos' | 'relato'> {
  if (!apostou || !detalhes) return {}
  const relato = detalhes.relato?.trim()
  return {
    ...(detalhes.gatilhos?.length ? { gatilhos: detalhes.gatilhos } : {}),
    ...(relato ? { relato } : {}),
  }
}

/** Repositório local do check-in diário. Nada sai do aparelho. */
export const checkins = {
  async registrar(apostou: boolean, detalhes?: DetalhesLapso, quando: Date = new Date()): Promise<Checkin> {
    const checkin: Checkin = {
      data: dataLocal(quando),
      apostou,
      ...detalhesDoLapso(apostou, detalhes),
      registradoEm: quando.toISOString(),
    }
    const db = await abrirBanco()
    // Registrar de novo troca o "apostei / não apostei", mas o humor do dia continua.
    const humor = (await db.get('checkins', checkin.data))?.humor
    const final = humor === undefined ? checkin : { ...checkin, humor }
    await db.put('checkins', final)
    return final
  },

  /** null tira o humor. Sem registro no dia não há onde guardar, e nada muda. */
  async registrarHumor(humor: number | null, quando: Date = new Date()): Promise<void> {
    const db = await abrirBanco()
    const atual = await db.get('checkins', dataLocal(quando))
    if (!atual) return
    const { humor: _anterior, ...semHumor } = atual
    await db.put('checkins', humor === null ? semHumor : { ...semHumor, humor })
  },

  async listar(): Promise<Checkin[]> {
    const db = await abrirBanco()
    return db.getAll('checkins')
  },
}
