export interface Entidade {
  id: string;
}

/**
 * Contrato de acesso a dado. Rota e serviço dependem desta interface, nunca da
 * implementação: trocar a memória por um banco é escrever outra classe, sem tocar
 * em quem usa.
 */
export interface Repository<T extends Entidade> {
  listar(): Promise<T[]>;
  obter(id: string): Promise<T | undefined>;
  criar(dados: Omit<T, 'id'>): Promise<T>;
  atualizar(id: string, dados: Partial<Omit<T, 'id'>>): Promise<T | undefined>;
  excluir(id: string): Promise<boolean>;
}
