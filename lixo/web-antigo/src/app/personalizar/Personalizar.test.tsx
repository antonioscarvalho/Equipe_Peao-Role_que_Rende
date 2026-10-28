import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { aparencia } from '@/lib/aparencia'
import { checkins } from '@/lib/checkins'
import { apagarBanco } from '@/lib/db'
import { Personalizar } from './Personalizar'

describe('Personalizar bichinho', () => {
  beforeEach(() => apagarBanco())

  it('troca cor e roupa, mostra no bichinho e guarda no aparelho', async () => {
    render(<Personalizar aoVoltar={vi.fn()} hoje="2026-10-27" reduzir />)
    expect(screen.getByRole('heading', { name: 'Deixe o bichinho com a sua cara' })).toHaveFocus()

    const rosa = screen.getByRole('radio', { name: 'Rosa' })
    await waitFor(() => expect(rosa).toBeEnabled())
    await userEvent.click(rosa)
    await userEvent.click(screen.getByRole('radio', { name: 'Moletom' }))

    expect(screen.getByRole('img', { name: /corpo rosa, de moletom rosa-forte/ })).toBeInTheDocument()
    await waitFor(async () => expect(await aparencia.ler()).toMatchObject({ cor: 'rosa', roupa: 'moletom' }))
  })

  it('item de marco aparece antes, bloqueado, com quantos dias faltam (CA-9)', async () => {
    await checkins.registrar(false, undefined, new Date(2026, 9, 25, 21))
    await checkins.registrar(false, undefined, new Date(2026, 9, 26, 21))
    render(<Personalizar aoVoltar={vi.fn()} hoje="2026-10-27" reduzir />)

    expect(await screen.findByText('Com 7 dias · faltam 5 dias')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Cachecol/ })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('Próximo marco: Cachecol com 7 dias sem apostar. Faltam 5 dias.')
  })

  it('com 7 dias o cachecol fica livre e um lapso depois não tira ele (CA-10)', async () => {
    for (const dia of [18, 19, 20, 21, 22, 23, 24]) await checkins.registrar(false, undefined, new Date(2026, 9, dia, 21))
    await checkins.registrar(true, undefined, new Date(2026, 9, 25, 21))
    await aparencia.salvar({ cor: 'azul', corRoupa: 'rosa', roupa: 'cachecol', cabeca: 'nenhum', rosto: 'nenhum', peito: 'nenhum' })
    render(<Personalizar aoVoltar={vi.fn()} hoje="2026-10-27" reduzir />)

    await waitFor(() => expect(screen.getByRole('radio', { name: 'Cachecol' })).toBeChecked())
    expect(screen.getByRole('img', { name: /de cachecol/ })).toBeInTheDocument()
  })

  it('volta ao visual original e sai com Pronto', async () => {
    const aoVoltar = vi.fn()
    await aparencia.salvar({ cor: 'lilas', corRoupa: 'azul', roupa: 'camiseta', cabeca: 'bone', rosto: 'oculos', peito: 'coracao' })
    render(<Personalizar aoVoltar={aoVoltar} hoje="2026-10-27" reduzir />)
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Lilás' })).toBeChecked())

    await userEvent.click(screen.getByRole('button', { name: 'Voltar ao visual original' }))
    expect(screen.getByRole('radio', { name: 'Azul-céu' })).toBeChecked()
    await userEvent.click(screen.getByRole('button', { name: 'Pronto' }))
    expect(aoVoltar).toHaveBeenCalled()
  })
})
