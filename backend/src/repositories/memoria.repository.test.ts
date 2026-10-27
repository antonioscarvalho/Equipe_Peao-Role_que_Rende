import { describe, expect, it } from 'vitest';
import { MemoriaRepository } from './memoria.repository.js';

interface Nota {
  id: string;
  texto: string;
}

describe('MemoriaRepository', () => {
  it('cria com id gerado e devolve na listagem', async () => {
    const repo = new MemoriaRepository<Nota>();
    const criada = await repo.criar({ texto: 'primeira' });
    expect(criada.id).toBeTruthy();
    expect(await repo.listar()).toEqual([criada]);
  });

  it('atualiza sem deixar trocar o id', async () => {
    const repo = new MemoriaRepository<Nota>([{ id: 'a', texto: 'antes' }]);
    const novo = await repo.atualizar('a', { texto: 'depois', id: 'b' } as Partial<Nota>);
    expect(novo).toEqual({ id: 'a', texto: 'depois' });
  });

  it('devolve undefined e false para id que não existe', async () => {
    const repo = new MemoriaRepository<Nota>();
    expect(await repo.obter('x')).toBeUndefined();
    expect(await repo.atualizar('x', { texto: '' })).toBeUndefined();
    expect(await repo.excluir('x')).toBe(false);
  });
});
