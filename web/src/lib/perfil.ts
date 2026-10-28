import { PERFIL_PADRAO, sanearFoto, sanearPerfil, type FotoGuardada, type Perfil } from '@/domain/perfil'
import { abrirBanco } from './db'

/** Perfil da pessoa (nome, cenário e foto). Fica só no aparelho, na store `perfil` do banco `guardiao`. */
export const perfil = {
  async ler(): Promise<Perfil> {
    const db = await abrirBanco()
    const salvo = await db.get('perfil', 'dados')
    return salvo ? sanearPerfil(salvo) : { ...PERFIL_PADRAO }
  },

  async salvar(novo: Perfil): Promise<Perfil> {
    const limpo = sanearPerfil(novo)
    const db = await abrirBanco()
    await db.put('perfil', { ...limpo }, 'dados')
    return limpo
  },

  async lerFoto(): Promise<FotoGuardada | null> {
    const db = await abrirBanco()
    return sanearFoto(await db.get('perfil', 'foto'))
  },

  async salvarFoto(foto: FotoGuardada): Promise<void> {
    const db = await abrirBanco()
    await db.put('perfil', { ...foto }, 'foto')
  },

  async apagarFoto(): Promise<void> {
    const db = await abrirBanco()
    await db.delete('perfil', 'foto')
  },
}
