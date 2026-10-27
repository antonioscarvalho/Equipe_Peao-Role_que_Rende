export interface RetryOptions {
  /** Total de tentativas, contando a primeira. */
  tentativas?: number;
  /** Espera antes da segunda tentativa, em ms. Dobra a cada nova falha. */
  esperaInicialMs?: number;
  esperaMaximaMs?: number;
  /** Diz se o erro vale nova tentativa. Erro de validação, por exemplo, não vale. */
  deveRepetir?: (erro: unknown) => boolean;
  esperar?: (ms: number) => Promise<void>;
}

const esperarDeVerdade = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function comRetry<T>(operacao: () => Promise<T>, opcoes: RetryOptions = {}): Promise<T> {
  const {
    tentativas = 3,
    esperaInicialMs = 200,
    esperaMaximaMs = 2000,
    deveRepetir = () => true,
    esperar = esperarDeVerdade,
  } = opcoes;

  let ultimoErro: unknown;
  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    try {
      return await operacao();
    } catch (erro) {
      ultimoErro = erro;
      if (tentativa === tentativas || !deveRepetir(erro)) break;
      // Jitter evita que várias instâncias da função repitam no mesmo instante.
      const base = Math.min(esperaInicialMs * 2 ** (tentativa - 1), esperaMaximaMs);
      await esperar(base / 2 + Math.random() * (base / 2));
    }
  }
  throw ultimoErro;
}
