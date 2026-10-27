import { Crise } from '@/app/crise/Crise'
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
        {rota === '/' && <Inicio aoAbrirSos={() => ir('/sos')} />}
        {rota === '/sos' && <Sos aoPedirAjuda={() => ir('/ajuda')} aoTerminar={() => ir('/')} />}
        {rota === '/ajuda' && <Crise aoVoltar={() => ir('/')} />}
      </main>
    </>
  )
}

export default App
