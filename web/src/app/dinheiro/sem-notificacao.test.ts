import { describe, expect, it } from 'vitest'
import sw from '../../../public/sw.js?raw'

const fontes = import.meta.glob<string>('/src/**/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true })

/**
 * CA-7 da spec 004: valor em dinheiro nunca aparece em notificação nem na tela de bloqueio.
 * Hoje o app não notifica nada. Quem for criar notificação vai cair aqui e decidir o texto com o CA-7 na mão.
 */
describe('CA-7: nada sai do app como notificação', () => {
  const API = /\b(new Notification|showNotification|Notification\.requestPermission|setAppBadge|PushManager)\b|addEventListener\(\s*['"]push['"]/

  it('o service worker não trata push nem mostra notificação', () => {
    expect(sw).not.toMatch(API)
  })

  it('nenhum arquivo do app usa a API de notificação', () => {
    expect(Object.keys(fontes).length).toBeGreaterThan(20)
    const usando = Object.entries(fontes)
      .filter(([caminho, codigo]) => !caminho.endsWith('sem-notificacao.test.ts') && API.test(codigo))
      .map(([caminho]) => caminho)
    expect(usando).toEqual([])
  })
})
