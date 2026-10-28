import { Checkin } from '@/app/checkin/Checkin'
import { Crise } from '@/app/crise/Crise'
import { Dinheiro } from '@/app/dinheiro/Dinheiro'
import { Inicio } from '@/app/inicio/Inicio'
import { Sos } from '@/app/sos/Sos'
import { useRota } from '@/hooks/useRota'

function App() {
  const { rota, ir } = useRota()

  return (
    <>
      <header className="topo">
        <button type="button" className="topo__marca" onClick={() => ir('/')}>
          Guardião
        </button>
        {/* Saída para a crise a 1 toque de qualquer tela (skill seguranca-e-crise). */}
        {rota !== '/ajuda' && (
          <button type="button" className="topo__ajuda" onClick={() => ir('/ajuda')}>
            Preciso de ajuda agora
          </button>
        )}
      </header>
      <main className="conteudo">
        {rota === '/' && (
          <Inicio aoAbrirSos={() => ir('/sos')} aoApostar={() => ir('/checkin')} aoAbrirDinheiro={() => ir('/dinheiro')} />
        )}
        {rota === '/checkin' && <Checkin aoPedirAjuda={() => ir('/ajuda')} aoTerminar={() => ir('/')} />}
        {rota === '/dinheiro' && <Dinheiro aoVoltar={() => ir('/')} />}
        {rota === '/sos' && <Sos aoPedirAjuda={() => ir('/ajuda')} aoTerminar={() => ir('/')} />}
        {rota === '/ajuda' && <Crise aoVoltar={() => ir('/')} />}
      </main>
    </>
  )
}

export default App
