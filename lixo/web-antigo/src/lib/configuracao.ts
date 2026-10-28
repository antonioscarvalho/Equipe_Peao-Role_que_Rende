import { abrirBanco, type ConfiguracaoFinancas } from './db'

const PADRAO: ConfiguracaoFinancas = { gastoSemanalEstimado: null, meta: null }

/** Estimativa de gasto e meta informadas pela pessoa. Ficam só no aparelho. */
export const configuracao = {
  async lerFinancas(): Promise<ConfiguracaoFinancas> {
    const db = await abrirBanco()
    // Quem gravou antes da meta existir tem só o gasto.
    return { ...PADRAO, ...((await db.get('configuracao', 'financas')) as ConfiguracaoFinancas | undefined) }
  },

  async salvarFinancas(financas: ConfiguracaoFinancas): Promise<void> {
    const db = await abrirBanco()
    await db.put('configuracao', financas, 'financas')
  },
}
