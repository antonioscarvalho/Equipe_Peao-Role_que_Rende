import { useCallback, useEffect, useState } from "react";
import { useAparencia } from "./armazenamento";
import { FotoRecusada, prepararFoto } from "./foto";
import { normalizarNome, sanearFoto, sanearPerfil, validarNome, type ErroFoto, type ErroNome, type Perfil } from "./perfil";

/**
 * Perfil só neste aparelho, em localStorage como a aparência. A foto fica numa chave própria
 * (algumas dezenas de KB) para ler o nome sem carregar a imagem.
 */
const CHAVE = "rqr:perfil";
const CHAVE_FOTO = "rqr:foto";
const EVENTO = "rqr:perfil-mudou";

// Quando o navegador recusa gravar (modo privado, cota cheia), a escolha vale até fechar a página.
const naMemoria = new Map<string, string>();

function ler(chave: string): string | null {
  if (naMemoria.has(chave)) return naMemoria.get(chave)!;
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravar(chave: string, valor: string | null) {
  naMemoria.delete(chave);
  try {
    if (valor === null) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch {
    if (valor !== null) naMemoria.set(chave, valor);
  }
  window.dispatchEvent(new Event(EVENTO));
}

export function lerPerfil(): Perfil {
  try {
    return sanearPerfil(JSON.parse(ler(CHAVE) ?? "null"));
  } catch {
    return sanearPerfil(null);
  }
}

export function lerFoto(): string | null {
  return sanearFoto(ler(CHAVE_FOTO));
}

export function apagarPerfil() {
  gravar(CHAVE, null);
  gravar(CHAVE_FOTO, null);
}

/**
 * Perfil inteiro para as telas: nome, cenário, foto (`data:` pronto para o <img>) e a aparência
 * do bichinho, que continua sendo lida e gravada por useAparencia.
 */
export function usePerfil() {
  const [perfil, setPerfil] = useState<Perfil>(lerPerfil);
  const [fotoUrl, setFotoUrl] = useState<string | null>(lerFoto);
  const { aparencia, mudar: mudarAparencia } = useAparencia();

  useEffect(() => {
    const recarregar = () => {
      setPerfil(lerPerfil());
      setFotoUrl(lerFoto());
    };
    const deOutraAba = (e: StorageEvent) => {
      if (e.key === CHAVE || e.key === CHAVE_FOTO || e.key === null) recarregar();
    };
    window.addEventListener(EVENTO, recarregar);
    window.addEventListener("storage", deOutraAba);
    return () => {
      window.removeEventListener(EVENTO, recarregar);
      window.removeEventListener("storage", deOutraAba);
    };
  }, []);

  const mudar = useCallback((parcial: Partial<Perfil>) => {
    gravar(CHAVE, JSON.stringify(sanearPerfil({ ...lerPerfil(), ...parcial })));
  }, []);

  /** Devolve o erro para o campo mostrar; com erro, nada é gravado. */
  const mudarNome = useCallback(
    (texto: string): ErroNome | null => {
      const erro = validarNome(texto);
      if (!erro) mudar({ nome: normalizarNome(texto) });
      return erro;
    },
    [mudar],
  );

  /** Batismo do alien: mesmas regras do nome da pessoa. Texto vazio desfaz o batismo. */
  const mudarNomeBroto = useCallback(
    (texto: string): ErroNome | null => {
      const erro = validarNome(texto);
      if (!erro) mudar({ nomeBroto: normalizarNome(texto) });
      return erro;
    },
    [mudar],
  );

  const mudarCenario = useCallback((cenario: string) => mudar({ cenario }), [mudar]);

  /** Devolve o motivo da recusa para a tela explicar; com recusa, a foto anterior continua. */
  const trocarFoto = useCallback(async (arquivo: File): Promise<ErroFoto | null> => {
    try {
      gravar(CHAVE_FOTO, await prepararFoto(arquivo));
      return null;
    } catch (erro) {
      return erro instanceof FotoRecusada ? erro.motivo : "leitura";
    }
  }, []);

  const tirarFoto = useCallback(() => gravar(CHAVE_FOTO, null), []);

  return {
    perfil,
    fotoUrl,
    aparencia,
    mudarNome,
    mudarNomeBroto,
    mudarCenario,
    trocarFoto,
    tirarFoto,
    mudarAparencia,
  } as const;
}
