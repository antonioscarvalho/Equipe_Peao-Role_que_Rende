import { conteudoPrevencao } from '@/content/conteudo'
import { abrirBanco, type GatilhosPessoa, type PlanoSeEntao } from './db'
import { LimiteAtingido } from './limite'

export { LimiteAtingido }
export const LIMITE_PLANOS = conteudoPrevencao.limitePlanos

export interface NovoPlano {
  id?: string
  se: string
  entao: string
}

/** Repositório local dos gatilhos e dos planos Se/Então (spec 005). Nada sai do aparelho. */
export const prevencao = {
  async lerGatilhos(): Promise<GatilhosPessoa | undefined> {
    const db = await abrirBanco()
    return db.get('prevencao', 'gatilhos')
  },

  async salvarGatilhos(selecionados: string[], outro?: string): Promise<GatilhosPessoa> {
    const texto = outro?.trim()
    const gatilhos: GatilhosPessoa = {
      selecionados: [...new Set(selecionados)],
      ...(texto ? { outro: texto } : {}),
      atualizadoEm: new Date().toISOString(),
    }
    const db = await abrirBanco()
    await db.put('prevencao', gatilhos, 'gatilhos')
    return gatilhos
  },

  async listarPlanos(): Promise<PlanoSeEntao[]> {
    const db = await abrirBanco()
    return db.getAllFromIndex('planos', 'porCriacao')
  },

  /** Cria (sem id) ou edita (com id). Recusa o 6º plano com LimiteAtingido. */
  async salvarPlano({ id, se, entao }: NovoPlano): Promise<PlanoSeEntao> {
    const campos = { se: se.trim(), entao: entao.trim() }
    if (!campos.se || !campos.entao) throw new Error('Plano precisa do "Se" e do "Então"')

    const db = await abrirBanco()
    const tx = db.transaction('planos', 'readwrite')
    const agora = new Date().toISOString()
    const atual = id ? await tx.store.get(id) : undefined

    if (!atual && (await tx.store.count()) >= LIMITE_PLANOS) {
      tx.abort()
      await tx.done.catch(() => undefined)
      throw new LimiteAtingido(LIMITE_PLANOS)
    }

    const plano: PlanoSeEntao = atual
      ? { ...atual, ...campos, atualizadoEm: agora }
      : { id: id ?? crypto.randomUUID(), ...campos, criadoEm: agora, atualizadoEm: agora }
    await tx.store.put(plano)
    await tx.done
    return plano
  },

  async apagarPlano(id: string): Promise<void> {
    const db = await abrirBanco()
    await db.delete('planos', id)
  },
}
