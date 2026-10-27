import { abrirBanco, type ConfiguracaoFinancas } from './db'

const PADRAO: ConfiguracaoFinancas = { gastoSemanalEstimado: null }

/** Estimativa de gasto informada pela pessoa. Fica só no aparelho. */
export const configuracao = {
  async lerFinancas(): Promise<ConfiguracaoFinancas> {
    const db = await abrirBanco()
    return (await db.get('configuracao', 'financas')) ?? PADRAO
  },

  async salvarFinancas(financas: ConfiguracaoFinancas): Promise<void> {
    const db = await abrirBanco()
    await db.put('configuracao', financas, 'financas')
  },
}
