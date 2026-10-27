import { randomUUID } from 'node:crypto';
import type { Entidade, Repository } from './repository.js';

/**
 * Guarda em memória. Na Vercel cada instância da função tem a própria memória e
 * ela some quando a instância é reciclada: serve para demo e teste, não para dado
 * que precisa durar.
 */
export class MemoriaRepository<T extends Entidade> implements Repository<T> {
  private readonly itens = new Map<string, T>();

  constructor(iniciais: T[] = []) {
    for (const item of iniciais) this.itens.set(item.id, item);
  }

  async listar() {
    return [...this.itens.values()];
  }

  async obter(id: string) {
    return this.itens.get(id);
  }

  async criar(dados: Omit<T, 'id'>) {
    const item = { ...dados, id: randomUUID() } as T;
    this.itens.set(item.id, item);
    return item;
  }

  async atualizar(id: string, dados: Partial<Omit<T, 'id'>>) {
    const atual = this.itens.get(id);
    if (!atual) return undefined;
    const novo = { ...atual, ...dados, id };
    this.itens.set(id, novo);
    return novo;
  }

  async excluir(id: string) {
    return this.itens.delete(id);
  }
}
