/**
 * Repositório local (offline-first, sem cadastro). Os dados ficam SÓ neste aparelho.
 * Skill design-etico-saude-digital: coleta mínima, exportar e apagar com 1 ação.
 * Pendência registrada: criptografia local com PIN (ver docs/07-conformidade/dados-e-privacidade.md).
 */
import { estadoInicial, type Estado } from '@/domain/tipos'

export const CHAVE = 'guardiao:v1'

export interface Repositorio {
  ler(): Estado
  salvar(estado: Estado): void
  apagarTudo(): void
  exportar(): string
}

function storageSeguro(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

export function criarRepositorioLocal(storage: Storage | null = storageSeguro()): Repositorio {
  let memoria: Estado = estadoInicial()
  return {
    ler() {
      if (!storage) return memoria
      try {
        const bruto = storage.getItem(CHAVE)
        if (!bruto) return estadoInicial()
        const dados = JSON.parse(bruto) as Partial<Estado>
        if (dados.versao !== 1) return estadoInicial()
        const base = estadoInicial()
        return {
          ...base,
          ...dados,
          plano: { ...base.plano, ...dados.plano },
          planoSeguranca: { ...base.planoSeguranca, ...dados.planoSeguranca },
          preferencias: { ...base.preferencias, ...dados.preferencias },
        }
      } catch {
        return estadoInicial()
      }
    },
    salvar(estado) {
      memoria = estado
      try {
        storage?.setItem(CHAVE, JSON.stringify(estado))
      } catch {
        /* sem espaço ou bloqueado: segue em memória */
      }
    },
    apagarTudo() {
      memoria = estadoInicial()
      try {
        storage?.removeItem(CHAVE)
      } catch {
        /* nada a fazer */
      }
    },
    exportar() {
      return JSON.stringify(this.ler(), null, 2)
    },
  }
}
