import type { ButtonHTMLAttributes } from 'react'

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'principal' | 'secundario' | 'alerta'
  grande?: boolean
}

export function Botao({ variante = 'principal', grande = false, className, type = 'button', ...resto }: BotaoProps) {
  const classes = ['botao', `botao--${variante}`, grande ? 'botao--grande' : '', className ?? ''].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...resto} />
}
