import { APARENCIA_PADRAO, sanear, type Aparencia } from '@/domain/aparencia'
import { abrirBanco } from './db'

/** Personalização do bichinho. Fica só no aparelho, como o resto (banco `guardiao`, store `configuracao`). */
export const aparencia = {
  async ler(): Promise<Aparencia> {
    const db = await abrirBanco()
    const salvo = await db.get('configuracao', 'aparencia')
    return salvo ? sanear(salvo) : { ...APARENCIA_PADRAO }
  },

  async salvar(nova: Aparencia): Promise<void> {
    const db = await abrirBanco()
    await db.put('configuracao', { ...sanear(nova) }, 'aparencia')
  },
}
