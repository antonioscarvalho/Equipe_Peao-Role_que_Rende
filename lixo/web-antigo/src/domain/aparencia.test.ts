import { describe, expect, it } from 'vitest'
import {
  APARENCIA_PADRAO,
  CABECA,
  CORES,
  PEITO,
  ROSTO,
  ROUPAS,
  aparenciaVisivel,
  descreverAparencia,
  diasQueFaltam,
  liberado,
  proximoMarco,
  sanear,
} from './aparencia'

describe('aparência do bichinho', () => {
  it('quase tudo é livre no primeiro dia; só os 3 itens de marco têm condição', () => {
    const todos = [...ROUPAS, ...CABECA, ...ROSTO, ...PEITO]
    expect(todos.filter((i) => !liberado(i, 0)).map((i) => i.marco)).toEqual([7, 30, 90])
  })

  it('anuncia o próximo marco com quantos dias faltam (CA-9)', () => {
    expect(proximoMarco(0)).toMatchObject({ item: { id: 'cachecol' }, faltam: 7 })
    expect(proximoMarco(7)).toMatchObject({ item: { id: 'flor' }, faltam: 23 })
    expect(proximoMarco(89)).toMatchObject({ item: { id: 'estrela' }, faltam: 1 })
    expect(proximoMarco(90)).toBeNull()
    expect(diasQueFaltam(ROUPAS[0], 0)).toBe(0)
  })

  it('esconde item de marco não alcançado, sem mudar o que foi escolhido', () => {
    const escolhida = { ...APARENCIA_PADRAO, roupa: 'cachecol', peito: 'estrela' }
    expect(aparenciaVisivel(escolhida, 3)).toMatchObject({ roupa: 'nenhuma', peito: 'nenhum' })
    expect(aparenciaVisivel(escolhida, 90)).toMatchObject({ roupa: 'cachecol', peito: 'estrela' })
    expect(escolhida.roupa).toBe('cachecol')
  })

  it('saneia dado desconhecido ou corrompido vindo do banco', () => {
    expect(sanear(null)).toEqual(APARENCIA_PADRAO)
    expect(sanear('lixo')).toEqual(APARENCIA_PADRAO)
    expect(sanear({ cor: 'rosa', roupa: 'roleta', cabeca: 42, extra: '<script>' })).toEqual({ ...APARENCIA_PADRAO, cor: 'rosa' })
  })

  it('só usa cores claras no corpo, para o contorno azul-escuro manter contraste ≥ 3:1', () => {
    const luminancia = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const contorno = luminancia('#3333BD')
    for (const cor of CORES) expect((luminancia(cor.valor) + 0.05) / (contorno + 0.05)).toBeGreaterThanOrEqual(3)
  })

  it('descreve a aparência em texto simples para leitor de tela', () => {
    expect(descreverAparencia(APARENCIA_PADRAO)).toBe('corpo azul-céu')
    expect(descreverAparencia({ ...APARENCIA_PADRAO, cor: 'rosa', roupa: 'moletom', corRoupa: 'roxo', cabeca: 'bone' })).toBe(
      'corpo rosa, de moletom roxo, com boné',
    )
  })
})
