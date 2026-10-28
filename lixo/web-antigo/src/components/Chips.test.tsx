import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Chips } from './Chips'

function ComEstado() {
  const [marcados, setMarcados] = useState<string[]>([])
  return <Chips legenda="O que aconteceu antes?" opcoes={['tédio', 'briga']} selecionados={marcados} aoMudar={setMarcados} />
}

describe('Chips', () => {
  it('marca e desmarca só pelo teclado', async () => {
    render(<ComEstado />)
    const tedio = screen.getByRole('button', { name: 'tédio' })
    expect(tedio).toHaveAttribute('aria-pressed', 'false')

    await userEvent.tab()
    expect(tedio).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(tedio).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard(' ')
    expect(tedio).toHaveAttribute('aria-pressed', 'false')
  })

  it('fica agrupado sob a legenda', () => {
    render(<ComEstado />)
    expect(screen.getByRole('group', { name: 'O que aconteceu antes?' })).toBeInTheDocument()
  })
})
