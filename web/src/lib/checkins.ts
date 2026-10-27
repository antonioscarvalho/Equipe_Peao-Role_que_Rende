import { dataLocal } from '@/domain/datas'
import { abrirBanco, type Checkin } from './db'

/** Repositório local do check-in diário. Nada sai do aparelho. */
export const checkins = {
  async registrar(apostou: boolean, gatilhos?: string[], quando: Date = new Date()): Promise<Checkin> {
    const checkin: Checkin = {
      data: dataLocal(quando),
      apostou,
      ...(apostou && gatilhos?.length ? { gatilhos } : {}),
      registradoEm: quando.toISOString(),
    }
    const db = await abrirBanco()
    await db.put('checkins', checkin)
    return checkin
  },

  async listar(): Promise<Checkin[]> {
    const db = await abrirBanco()
    return db.getAll('checkins')
  },
}
