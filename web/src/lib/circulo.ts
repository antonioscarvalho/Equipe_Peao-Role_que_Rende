import { conteudoPrevencao } from '@/content/conteudo'
import { normalizarTelefone } from '@/domain/mensagem'
import { abrirBanco, type ContatoCirculo } from './db'
import { LimiteAtingido } from './limite'

export { LimiteAtingido }
export const LIMITE_CONTATOS = conteudoPrevencao.limiteContatos

/** Telefone que não tem 10 ou 11 dígitos com DDD. */
export class TelefoneInvalido extends Error {
  constructor() {
    super('Telefone inválido')
    this.name = 'TelefoneInvalido'
  }
}

export interface NovoContato {
  id?: string
  nome: string
  telefone: string
}

/**
 * Repositório local do Círculo de Confiança (spec 005, CA-4).
 * Nome e telefone são dados de terceiro (LGPD): ficam só neste aparelho, nunca vão para a rede nem para log.
 */
export const circulo = {
  async listar(): Promise<ContatoCirculo[]> {
    const db = await abrirBanco()
    return db.getAllFromIndex('circulo', 'porCriacao')
  },

  /** Cria (sem id) ou edita (com id). Recusa o 4º contato com LimiteAtingido. */
  async salvar({ id, nome, telefone }: NovoContato): Promise<ContatoCirculo> {
    const nomeLimpo = nome.trim()
    if (!nomeLimpo) throw new Error('Contato precisa de nome')
    const telefone55 = normalizarTelefone(telefone)
    if (!telefone55) throw new TelefoneInvalido()

    const db = await abrirBanco()
    const tx = db.transaction('circulo', 'readwrite')
    const atual = id ? await tx.store.get(id) : undefined

    if (!atual && (await tx.store.count()) >= LIMITE_CONTATOS) {
      tx.abort()
      await tx.done.catch(() => undefined)
      throw new LimiteAtingido(LIMITE_CONTATOS)
    }

    const contato: ContatoCirculo = atual
      ? { ...atual, nome: nomeLimpo, telefone: telefone55 }
      : { id: id ?? crypto.randomUUID(), nome: nomeLimpo, telefone: telefone55, criadoEm: new Date().toISOString() }
    await tx.store.put(contato)
    await tx.done
    return contato
  },

  async apagar(id: string): Promise<void> {
    const db = await abrirBanco()
    await db.delete('circulo', id)
  },
}
