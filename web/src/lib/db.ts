import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

/** Tudo que é da pessoa fica neste banco, só no aparelho. Ver docs/04-tecnico/privacidade-e-dados-locais.md. */
export interface EpisodioSos {
  id: string
  inicio: string
  vontadeAntes: number
  vontadeDepois?: number
  foiParaCrise: boolean
}

export interface Checkin {
  /** 'AAAA-MM-DD' no fuso do aparelho; um check-in por dia, o último vale. */
  data: string
  apostou: boolean
  /** Só quando apostou. A spec 005 lê daqui para montar o plano Se/Então. */
  gatilhos?: string[]
  registradoEm: string
}

export interface ConfiguracaoFinancas {
  gastoSemanalEstimado: number | null
}

interface GuardiaoDB extends DBSchema {
  episodiosSos: { key: string; value: EpisodioSos; indexes: { porInicio: string } }
  checkins: { key: string; value: Checkin }
  configuracao: { key: 'financas'; value: ConfiguracaoFinancas }
}

const NOME = 'guardiao'
const VERSAO = 2

let conexao: Promise<IDBPDatabase<GuardiaoDB>> | null = null

export function abrirBanco(): Promise<IDBPDatabase<GuardiaoDB>> {
  conexao ??= openDB<GuardiaoDB>(NOME, VERSAO, {
    // Cada versão só cria o que falta, para quem já usa o app não perder o que guardou.
    upgrade(db, versaoAnterior) {
      if (versaoAnterior < 1) {
        const store = db.createObjectStore('episodiosSos', { keyPath: 'id' })
        store.createIndex('porInicio', 'inicio')
      }
      if (versaoAnterior < 2) {
        db.createObjectStore('checkins', { keyPath: 'data' })
        db.createObjectStore('configuracao')
      }
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
