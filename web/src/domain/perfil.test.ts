import { describe, expect, it } from 'vitest'
import {
  FOTO_ENTRADA_MAX_BYTES,
  fotoComoDataUri,
  NOME_MAX,
  PERFIL_PADRAO,
  normalizarNome,
  recorteQuadrado,
  sanearFoto,
  sanearPerfil,
  validarArquivoFoto,
  validarNome,
} from './perfil'

describe('nome', () => {
  it('normaliza espaços e trata vazio como sem nome', () => {
    expect(normalizarNome('  Ana   Clara ')).toBe('Ana Clara')
    expect(normalizarNome('   ')).toBeNull()
  })

  it('aceita acento, apelido curto, hífen, apóstrofo e ponto', () => {
    for (const nome of ['Zé', 'João-Pedro', "D'Ávila", 'Ma. Clara', 'Ñandú']) expect(validarNome(nome)).toBeNull()
  })

  it('recusa nome longo demais e caractere que não é de nome', () => {
    expect(validarNome('a'.repeat(NOME_MAX + 1))).toBe('longo')
    expect(validarNome('ana@email.com')).toBe('caracteres')
    expect(validarNome('<script>')).toBe('caracteres')
  })

  it('nome vazio não é erro', () => {
    expect(validarNome('')).toBeNull()
  })
})

describe('sanearPerfil', () => {
  it('dado ausente ou estranho vira o perfil padrão', () => {
    expect(sanearPerfil(undefined)).toEqual(PERFIL_PADRAO)
    expect(sanearPerfil('lixo')).toEqual(PERFIL_PADRAO)
  })

  it('mantém o que é válido e descarta o resto', () => {
    expect(sanearPerfil({ nome: ' Bia ', cenario: 'bairro' })).toEqual({ nome: 'Bia', cenario: 'bairro' })
    expect(sanearPerfil({ nome: 'x@y', cenario: 'cassino' })).toEqual(PERFIL_PADRAO)
  })
})

describe('foto', () => {
  it('aceita JPEG, PNG e WebP até o limite', () => {
    expect(validarArquivoFoto({ type: 'image/jpeg', size: 2_000_000 })).toBeNull()
    expect(validarArquivoFoto({ type: 'image/webp', size: FOTO_ENTRADA_MAX_BYTES })).toBeNull()
  })

  it('recusa outro tipo e arquivo grande demais', () => {
    expect(validarArquivoFoto({ type: 'image/gif', size: 10 })).toBe('tipo')
    expect(validarArquivoFoto({ type: 'application/pdf', size: 10 })).toBe('tipo')
    expect(validarArquivoFoto({ type: 'image/png', size: FOTO_ENTRADA_MAX_BYTES + 1 })).toBe('tamanho')
  })

  it('recorta o quadrado do meio, em pé ou deitada', () => {
    expect(recorteQuadrado(4000, 3000)).toEqual({ x: 500, y: 0, lado: 3000 })
    expect(recorteQuadrado(1080, 1920)).toEqual({ x: 0, y: 420, lado: 1080 })
    expect(recorteQuadrado(500, 500)).toEqual({ x: 0, y: 0, lado: 500 })
  })

  it('vira data URI para o <img>, inclusive foto grande', () => {
    const bytes = new TextEncoder().encode('RIFF').buffer as ArrayBuffer
    expect(fotoComoDataUri({ tipo: 'image/webp', bytes, lado: 256 })).toBe('data:image/webp;base64,UklGRg==')
    const grande = new Uint8Array(200_000).fill(65).buffer
    expect(fotoComoDataUri({ tipo: 'image/jpeg', bytes: grande, lado: 256 })).toMatch(/^data:image\/jpeg;base64,QUFB/)
    expect(fotoComoDataUri(null)).toBeNull()
  })

  it('só aceita foto guardada com bytes e tipo de imagem', () => {
    const bytes = new Uint8Array([1, 2, 3]).buffer
    expect(sanearFoto({ tipo: 'image/webp', bytes, lado: 256 })).toEqual({ tipo: 'image/webp', bytes, lado: 256 })
    expect(sanearFoto({ tipo: 'text/html', bytes })).toBeNull()
    expect(sanearFoto({ tipo: 'image/webp', bytes: new ArrayBuffer(0) })).toBeNull()
    expect(sanearFoto(null)).toBeNull()
  })
})
