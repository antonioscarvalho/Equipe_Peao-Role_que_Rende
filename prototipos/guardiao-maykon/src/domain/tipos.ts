/** Datas no formato AAAA-MM-DD, no fuso do aparelho. */
export type DataISO = string

export interface Onboarding {
  concluidoEm: string
  inicio: DataISO
  motivos: string[]
  motivoTexto: string
  importancia: number
  confianca: number
  /** Estimativa de quanto a pessoa apostava por semana, em reais. */
  gastoSemanal: number | null
  metaConcreta: string
}

export interface PosLapso {
  antes: string
  gatilho: string
  ajuste: string
}

export interface Registro {
  data: DataISO
  apostou: boolean
  /** 1 (muito mal) a 5 (muito bem), opcional. */
  humor?: number
  posLapso?: PosLapso
}

export interface SeEntao {
  se: string
  entao: string
}

export interface Contato {
  nome: string
  telefone: string
}

export interface PlanoSeguranca {
  sinais: string
  acalma: string
  pessoas: string
  profissionais: string
  ambiente: string
}

export interface EpisodioSos {
  em: string
  antes: number
  depois: number | null
}

export type TamanhoFonte = 'normal' | 'grande' | 'maior'

export interface Preferencias {
  fonte: TamanhoFonte
  altoContraste: boolean
  reduzirMovimento: boolean
}

export interface Estado {
  versao: 1
  onboarding: Onboarding | null
  registros: Registro[]
  plano: { gatilhos: string[]; seEntao: SeEntao[] }
  contatos: Contato[]
  bloqueioFeitos: string[]
  planoSeguranca: PlanoSeguranca
  episodiosSos: EpisodioSos[]
  preferencias: Preferencias
}

export const LIMITE_SE_ENTAO = 5
export const LIMITE_CONTATOS = 3

export function estadoInicial(): Estado {
  return {
    versao: 1,
    onboarding: null,
    registros: [],
    plano: { gatilhos: [], seEntao: [] },
    contatos: [],
    bloqueioFeitos: [],
    planoSeguranca: { sinais: '', acalma: '', pessoas: '', profissionais: '', ambiente: '' },
    episodiosSos: [],
    preferencias: { fonte: 'normal', altoContraste: false, reduzirMovimento: false },
  }
}
