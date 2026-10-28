import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { APARENCIA_PADRAO } from '@/domain/aparencia'
import { Bichinho } from './Bichinho'

describe('Bichinho', () => {
  it('dois bichinhos na mesma página não repetem ids de filtro, brilho e recorte', () => {
    const { container } = render(
      <>
        <Bichinho humor="calmo" nivel={0} reduzir />
        <Bichinho humor="feliz" nivel={0} reduzir />
      </>,
    )
    const ids = [...container.querySelectorAll('[id]')].map((n) => n.id)
    expect(ids).toHaveLength(6)
    expect(new Set(ids).size).toBe(6)
  })

  it('desenha só as camadas escolhidas e aplica a cor do corpo', () => {
    const { container } = render(
      <Bichinho humor="calmo" nivel={0} reduzir aparencia={{ ...APARENCIA_PADRAO, cor: 'rosa', roupa: 'jardineira', rosto: 'oculos' }} />,
    )
    const itens = [...container.querySelectorAll('[data-item]')].map((n) => n.getAttribute('data-item'))
    expect(itens).toEqual(['jardineira', 'oculos'])
    expect((container.querySelector('.bicho') as HTMLElement).style.getPropertyValue('--corpo-base')).toBe('#FFA7D3')
  })
})
