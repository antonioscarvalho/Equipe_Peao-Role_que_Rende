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
  /** Só quando apostou: o que a pessoa contou com as palavras dela. Nunca sai do aparelho. */
  relato?: string
  /** 1 (muito mal) a 5 (muito bem); opcional, marcado depois do registro (CA-1). */
  humor?: number
  registradoEm: string
}

export interface ConfiguracaoFinancas {
  gastoSemanalEstimado: number | null
  /** Para onde a pessoa quer levar o dinheiro, nas palavras dela ("conta de luz"). */
  meta: string | null
}

/** Spec 005: gatilhos que a pessoa marcou (chave fixa 'gatilhos'). */
export interface GatilhosPessoa {
  selecionados: string[]
  outro?: string
  atualizadoEm: string
}

/** Spec 005: plano "Se… então eu vou…". No máximo 5. */
export interface PlanoSeEntao {
  id: string
  se: string
  entao: string
  criadoEm: string
  atualizadoEm: string
}

/** Spec 005: pessoa do Círculo de Confiança. Dado de terceiro (LGPD): só no aparelho. No máximo 3. */
export interface ContatoCirculo {
  id: string
  nome: string
  /** Só dígitos, com o 55 na frente. */
  telefone: string
  criadoEm: string
}

interface GuardiaoDB extends DBSchema {
  episodiosSos: { key: string; value: EpisodioSos; indexes: { porInicio: string } }
  checkins: { key: string; value: Checkin }
  // 'aparencia' guarda a personalização do bichinho; o formato é validado na leitura (domain/aparencia).
  configuracao: { key: 'financas' | 'aparencia'; value: ConfiguracaoFinancas | Record<string, unknown> }
  prevencao: { key: 'gatilhos'; value: GatilhosPessoa }
  planos: { key: string; value: PlanoSeEntao; indexes: { porCriacao: string } }
  circulo: { key: string; value: ContatoCirculo; indexes: { porCriacao: string } }
  // Perfil: 'dados' (nome e cenário) e 'foto' (bytes). O formato é validado na leitura (domain/perfil).
  perfil: { key: 'dados' | 'foto'; value: Record<string, unknown> }
}

export const NOME_BANCO = 'guardiao'
const NOME = NOME_BANCO
export const VERSAO_BANCO = 4

let conexao: Promise<IDBPDatabase<GuardiaoDB>> | null = null

export function abrirBanco(): Promise<IDBPDatabase<GuardiaoDB>> {
  conexao ??= openDB<GuardiaoDB>(NOME, VERSAO_BANCO, {
    // Cada versão só cria o que falta, para quem já usa o app não perder o que guardou.
    upgrade(db, versaoAnterior) {
      const existe = (nome: string) => db.objectStoreNames.contains(nome as never)
      if (versaoAnterior < 1) {
        const store = db.createObjectStore('episodiosSos', { keyPath: 'id' })
        store.createIndex('porInicio', 'inicio')
      }
      // Versão 2 = spec 004.
      if (versaoAnterior < 2) {
        if (!existe('checkins')) db.createObjectStore('checkins', { keyPath: 'data' })
        if (!existe('configuracao')) db.createObjectStore('configuracao')
      }
      // Versão 3 = spec 005.
      if (versaoAnterior < 3) {
        if (!existe('prevencao')) db.createObjectStore('prevencao')
        if (!existe('planos')) db.createObjectStore('planos', { keyPath: 'id' }).createIndex('porCriacao', 'criadoEm')
        if (!existe('circulo')) db.createObjectStore('circulo', { keyPath: 'id' }).createIndex('porCriacao', 'criadoEm')
      }
      // Versão 4 = perfil (nome, foto, cenário).
      if (versaoAnterior < 4) {
        if (!existe('perfil')) db.createObjectStore('perfil')
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
