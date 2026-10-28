import { abrirBanco, type EpisodioSos } from './db'

/** Repositório local dos episódios do SOS. Nada sai do aparelho. */
export const episodiosSos = {
  async iniciar(vontadeAntes: number): Promise<EpisodioSos> {
    const episodio: EpisodioSos = {
      id: crypto.randomUUID(),
      inicio: new Date().toISOString(),
      vontadeAntes,
      foiParaCrise: false,
    }
    const db = await abrirBanco()
    await db.put('episodiosSos', episodio)
    return episodio
  },

  async atualizar(id: string, mudancas: Partial<Omit<EpisodioSos, 'id' | 'inicio'>>): Promise<void> {
    const db = await abrirBanco()
    const atual = await db.get('episodiosSos', id)
    if (!atual) return
    await db.put('episodiosSos', { ...atual, ...mudancas })
  },

  async listar(): Promise<EpisodioSos[]> {
    const db = await abrirBanco()
    return db.getAllFromIndex('episodiosSos', 'porInicio')
  },
}
