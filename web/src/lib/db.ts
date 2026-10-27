import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

/** Tudo que é da pessoa fica neste banco, só no aparelho. Ver docs/04-tecnico/privacidade-e-dados-locais.md. */
export interface EpisodioSos {
  id: string
  inicio: string
  vontadeAntes: number
  vontadeDepois?: number
  foiParaCrise: boolean
}

interface GuardiaoDB extends DBSchema {
  episodiosSos: { key: string; value: EpisodioSos; indexes: { porInicio: string } }
}

const NOME = 'guardiao'
const VERSAO = 1

let conexao: Promise<IDBPDatabase<GuardiaoDB>> | null = null

export function abrirBanco(): Promise<IDBPDatabase<GuardiaoDB>> {
  conexao ??= openDB<GuardiaoDB>(NOME, VERSAO, {
    upgrade(db) {
      const store = db.createObjectStore('episodiosSos', { keyPath: 'id' })
      store.createIndex('porInicio', 'inicio')
    },
  })
  return conexao
}

/** Usado pelo "Apagar tudo" e pelos testes. */
export async function apagarBanco(): Promise<void> {
  if (conexao) (await conexao).close()
  conexao = null
  await new Promise<void>((resolve, reject) => {
    const pedido = indexedDB.deleteDatabase(NOME)
    pedido.onsuccess = () => resolve()
    pedido.onerror = () => reject(pedido.error)
    pedido.onblocked = () => resolve()
  })
}
