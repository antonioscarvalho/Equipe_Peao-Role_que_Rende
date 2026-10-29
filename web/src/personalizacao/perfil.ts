/**
 * Perfil da pessoa: como o Broto a chama, a foto e o cenário. A aparência do bichinho é
 * de `aparencia.ts` e o perfil só a junta na leitura (`usePerfil`).
 *
 * Regras (skill design-etico-saude-digital, spec 008):
 * - Tudo é opcional: o app funciona sem nome, sem foto e sem cadastro.
 * - Nada sai do aparelho. O nome é um apelido, não precisa ser o nome de registro.
 * - "Apagar tudo" apaga o perfil junto (`apagarPerfil`).
 */

export interface Perfil {
  /** Como o Broto chama a pessoa. null = sem nome, e os textos falam "você". */
  nome: string | null;
  /** Nome que a pessoa deu ao alien no cap. 1 (skill conversa-broto). null = ainda não batizado. */
  nomeBroto: string | null;
  cenario: string;
}

export interface OpcaoCenario {
  id: string;
  nome: string;
}

/** Por enquanto só o bairro que já existe (Bairro.tsx). Cenário novo entra aqui. */
export const CENARIOS: OpcaoCenario[] = [{ id: "bairro", nome: "Bairro" }];

export const PERFIL_PADRAO: Perfil = { nome: null, nomeBroto: null, cenario: "bairro" };

export const NOME_MAX = 30;

/** Espaços repetidos viram um, as pontas somem, e nome vazio vira null. */
export function normalizarNome(texto: string): string | null {
  const limpo = texto.replace(/\s+/g, " ").trim();
  return limpo ? limpo.slice(0, NOME_MAX) : null;
}

export type ErroNome = "longo" | "caracteres";

/** Só o que o campo precisa recusar. Nome vazio não é erro: é a pessoa preferindo não dizer. */
export function validarNome(texto: string): ErroNome | null {
  const limpo = texto.replace(/\s+/g, " ").trim();
  if (limpo.length > NOME_MAX) return "longo";
  // Letras de qualquer língua, espaço, hífen, apóstrofo e ponto ("Zé", "D'Ávila", "Ma. Clara").
  if (limpo && !/^[\p{L}\p{M} .'’-]+$/u.test(limpo)) return "caracteres";
  return null;
}

/** Aceita qualquer coisa vinda do armazenamento (versão antiga, dado corrompido) e devolve um perfil válido. */
export function sanearPerfil(bruto: unknown): Perfil {
  const p = (bruto && typeof bruto === "object" ? bruto : {}) as Partial<Record<keyof Perfil, unknown>>;
  const nome = typeof p.nome === "string" && validarNome(p.nome) === null ? normalizarNome(p.nome) : null;
  const nomeBroto = typeof p.nomeBroto === "string" && validarNome(p.nomeBroto) === null ? normalizarNome(p.nomeBroto) : null;
  const cenario = typeof p.cenario === "string" && CENARIOS.some((c) => c.id === p.cenario) ? p.cenario : PERFIL_PADRAO.cenario;
  return { nome, nomeBroto, cenario };
}

/** Como o alien aparece antes do batismo: ele chega sem nome (skill conversa-broto). */
export const NOME_BROTO_PROVISORIO = "Alien";

export function nomeDoBroto(p: Pick<Perfil, "nomeBroto">): string {
  return p.nomeBroto ?? NOME_BROTO_PROVISORIO;
}

// ---------- foto ----------

export const FOTO_TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"] as const;
/** Arquivo de entrada: foto de celular cabe com folga. */
export const FOTO_ENTRADA_MAX_BYTES = 15 * 1024 * 1024;
/** Lado da foto guardada. 256 px cobre o avatar em tela 3× e fica em poucas dezenas de KB. */
export const FOTO_LADO = 256;

export type ErroFoto = "tipo" | "tamanho" | "leitura";

export function validarArquivoFoto(arquivo: { type: string; size: number }): ErroFoto | null {
  if (!(FOTO_TIPOS_ACEITOS as readonly string[]).includes(arquivo.type)) return "tipo";
  if (arquivo.size > FOTO_ENTRADA_MAX_BYTES) return "tamanho";
  return null;
}

/** Recorte quadrado central da imagem original: o avatar é redondo e a pessoa costuma estar no meio. */
export function recorteQuadrado(largura: number, altura: number): { x: number; y: number; lado: number } {
  const lado = Math.min(largura, altura);
  return { x: Math.round((largura - lado) / 2), y: Math.round((altura - lado) / 2), lado };
}

/** A foto é guardada já como `data:` para o <img>. Qualquer outra coisa vira "sem foto". */
export function sanearFoto(bruto: unknown): string | null {
  return typeof bruto === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(bruto) ? bruto : null;
}
