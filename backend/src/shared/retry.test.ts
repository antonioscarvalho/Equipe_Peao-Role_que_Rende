import { describe, expect, it, vi } from 'vitest';
import { comRetry } from './retry.js';

const semEspera = { esperar: async () => {} };

describe('comRetry', () => {
  it('devolve o resultado quando a primeira tentativa dá certo', async () => {
    const operacao = vi.fn().mockResolvedValue('ok');
    await expect(comRetry(operacao, semEspera)).resolves.toBe('ok');
    expect(operacao).toHaveBeenCalledTimes(1);
  });

  it('repete até dar certo', async () => {
    const operacao = vi.fn().mockRejectedValueOnce(new Error('falha')).mockResolvedValue('ok');
    await expect(comRetry(operacao, semEspera)).resolves.toBe('ok');
    expect(operacao).toHaveBeenCalledTimes(2);
  });

  it('desiste depois do total de tentativas e lança o último erro', async () => {
    const operacao = vi.fn().mockRejectedValue(new Error('fora do ar'));
    await expect(comRetry(operacao, { ...semEspera, tentativas: 4 })).rejects.toThrow('fora do ar');
    expect(operacao).toHaveBeenCalledTimes(4);
  });

  it('não repete erro que deveRepetir recusa', async () => {
    const operacao = vi.fn().mockRejectedValue(new Error('inválido'));
    await expect(comRetry(operacao, { ...semEspera, deveRepetir: () => false })).rejects.toThrow();
    expect(operacao).toHaveBeenCalledTimes(1);
  });

  it('dobra a espera a cada falha, sem passar do máximo', async () => {
    const esperas: number[] = [];
    const operacao = vi.fn().mockRejectedValue(new Error('x'));
    vi.spyOn(Math, 'random').mockReturnValue(1);
    await comRetry(operacao, {
      tentativas: 5,
      esperaInicialMs: 100,
      esperaMaximaMs: 300,
      esperar: async (ms) => void esperas.push(ms),
    }).catch(() => {});
    expect(esperas).toEqual([100, 200, 300, 300]);
    vi.restoreAllMocks();
  });
});
