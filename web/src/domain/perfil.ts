/**
 * Perfil da pessoa: como o Guardião a chama, a foto e o cenário. A aparência do bichinho é
 * de `domain/aparencia` e o perfil só a junta na leitura (hooks/usePerfil).
 *
 * Regras (skill design-etico-saude-digital, spec 008):
 * - Tudo é opcional: o app funciona sem nome, sem foto e sem cadastro.
 * - Nada sai do aparelho. O nome é um apelido, não precisa ser o nome de registro.
 * - "Apagar tudo" apaga o perfil junto (store `perfil` do banco `guardiao`).
 */

export interface Perfil {
  /** Como o Guardião chama a pessoa. null = sem nome, e os textos falam "você". */
  nome: string | null
  cenario: string
}

export interface OpcaoCenario {
  id: string
  nome: string
}

/** Por enquanto só o bairro que já existe (components/Bairro). Cenário novo entra aqui. */
export const CENARIOS: OpcaoCenario[] = [{ id: 'bairro', nome: 'Bairro' }]

export const PERFIL_PADRAO: Perfil = { nome: null, cenario: 'bairro' }

export const NOME_MAX = 30

/** Espaços repetidos viram um, as pontas somem, e nome vazio vira null. */
export function normalizarNome(texto: string): string | null {
  const limpo = texto.replace(/\s+/g, ' ').trim()
  return limpo ? limpo.slice(0, NOME_MAX) : null
}

export type ErroNome = 'longo' | 'caracteres'

/** Só o que o campo precisa recusar. Nome vazio não é erro: é a pessoa preferindo não dizer. */
export function validarNome(texto: string): ErroNome | null {
  const limpo = texto.replace(/\s+/g, ' ').trim()
  if (limpo.length > NOME_MAX) return 'longo'
  // Letras de qualquer língua, espaço, hífen, apóstrofo e ponto ("Zé", "D'Ávila", "Ma. Clara").
  if (limpo && !/^[\p{L}\p{M} .'’-]+$/u.test(limpo)) return 'caracteres'
  return null
}

/** Aceita qualquer coisa vinda do banco (versão antiga, dado corrompido) e devolve um perfil válido. */
export function sanearPerfil(bruto: unknown): Perfil {
  const p = (bruto && typeof bruto === 'object' ? bruto : {}) as Partial<Record<keyof Perfil, unknown>>
  const nome = typeof p.nome === 'string' && validarNome(p.nome) === null ? normalizarNome(p.nome) : null
  const cenario = typeof p.cenario === 'string' && CENARIOS.some((c) => c.id === p.cenario) ? p.cenario : PERFIL_PADRAO.cenario
  return { nome, cenario }
}

// ---------- foto ----------

/** Foto já preparada para guardar: quadrada, pequena, em bytes (o Blob não sobrevive em todo IndexedDB). */
export interface FotoGuardada {
  tipo: string
  bytes: ArrayBuffer
  lado: number
}

export const FOTO_TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'] as const
/** Arquivo de entrada: foto de celular cabe com folga. */
export const FOTO_ENTRADA_MAX_BYTES = 15 * 1024 * 1024
/** Lado da foto guardada. 256 px cobre o avatar em tela 3× e fica em poucas dezenas de KB. */
export const FOTO_LADO = 256

export type ErroFoto = 'tipo' | 'tamanho' | 'leitura'

export function validarArquivoFoto(arquivo: { type: string; size: number }): ErroFoto | null {
  if (!(FOTO_TIPOS_ACEITOS as readonly string[]).includes(arquivo.type)) return 'tipo'
  if (arquivo.size > FOTO_ENTRADA_MAX_BYTES) return 'tamanho'
  return null
}

/** Recorte quadrado central da imagem original: o avatar é redondo e a pessoa costuma estar no meio. */
export function recorteQuadrado(largura: number, altura: number): { x: number; y: number; lado: number } {
  const lado = Math.min(largura, altura)
  return { x: Math.round((largura - lado) / 2), y: Math.round((altura - lado) / 2), lado }
}

/** `data:image/webp;base64,…` para o <img>. Em pedaços, porque espalhar 30 mil bytes num `String.fromCharCode` estoura a pilha. */
export function fotoComoDataUri(foto: FotoGuardada | null): string | null {
  if (!foto) return null
  const bytes = new Uint8Array(foto.bytes)
  let binario = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binario += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return `data:${foto.tipo};base64,${btoa(binario)}`
}

export function sanearFoto(bruto: unknown): FotoGuardada | null {
  const f = bruto as Partial<FotoGuardada> | undefined
  if (!f || typeof f !== 'object') return null
  // Não `instanceof`: o ArrayBuffer que volta do IndexedDB pode ser de outro realm (iframe, jsdom).
  if (Object.prototype.toString.call(f.bytes) !== '[object ArrayBuffer]' || !(f.bytes as ArrayBuffer).byteLength) return null
  if (typeof f.tipo !== 'string' || !f.tipo.startsWith('image/')) return null
  return { tipo: f.tipo, bytes: f.bytes as ArrayBuffer, lado: typeof f.lado === 'number' ? f.lado : FOTO_LADO }
}
