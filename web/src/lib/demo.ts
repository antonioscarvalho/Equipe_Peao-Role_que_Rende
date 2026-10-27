/**
 * Dados SINTÉTICOS para a demonstração à Banca (edital 8.5: só dados públicos ou sintéticos).
 * Ative abrindo o app com `?demo`. Nada aqui é de pessoa real.
 */
import { hojeISO } from '@/domain/datas'
import { estadoInicial, type Estado } from '@/domain/tipos'

function diasAtras(n: number, hoje: Date = new Date()): string {
  const d = new Date(hoje)
  d.setDate(d.getDate() - n)
  return hojeISO(d)
}

export function estadoDemo(hoje: Date = new Date()): Estado {
  const inicio = diasAtras(12, hoje)
  const lapso = diasAtras(4, hoje)
  return {
    ...estadoInicial(),
    onboarding: {
      concluidoEm: new Date(hoje.getTime() - 12 * 86_400_000).toISOString(),
      inicio,
      motivos: ['Minha família', 'Pagar minhas dívidas'],
      motivoTexto: 'Quero levar minha filha na praia em janeiro',
      importancia: 9,
      confianca: 6,
      gastoSemanal: 150,
      metaConcreta: 'a viagem de janeiro',
    },
    registros: [
      { data: diasAtras(6, hoje), apostou: false, humor: 3 },
      { data: diasAtras(5, hoje), apostou: false, humor: 4 },
      { data: lapso, apostou: true, humor: 2, posLapso: { antes: 'Recebi o salário e fiquei sozinho em casa', gatilho: 'Dia do pagamento', ajuste: 'pagar as contas primeiro e ligar pro meu irmão' } },
      { data: diasAtras(3, hoje), apostou: false, humor: 3 },
      { data: diasAtras(1, hoje), apostou: false, humor: 4 },
    ],
    plano: {
      gatilhos: ['Dia do pagamento', 'Jogo passando na TV', 'Ficar sozinho(a) à noite'],
      seEntao: [
        { se: 'o salário cair', entao: 'vou pagar as contas primeiro e deixar o resto com minha irmã' },
        { se: 'der vontade durante o jogo', entao: 'vou abrir o SOS e esperar a onda passar' },
      ],
    },
    contatos: [{ nome: 'Irmão (exemplo)', telefone: '61900000000' }],
    bloqueioFeitos: ['desinstalar', 'grupos', 'pix-noturno'],
    episodiosSos: [{ em: new Date(hoje.getTime() - 2 * 86_400_000).toISOString(), antes: 8, depois: 3 }],
  }
}
