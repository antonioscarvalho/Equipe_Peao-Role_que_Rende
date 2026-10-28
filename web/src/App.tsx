import { useEffect, useState } from 'react'
import { Checkin } from '@/app/checkin/Checkin'
import { Circulo } from '@/app/circulo/Circulo'
import { Crise } from '@/app/crise/Crise'
import { Dinheiro } from '@/app/dinheiro/Dinheiro'
import { Inicio } from '@/app/inicio/Inicio'
import { Plano } from '@/app/plano/Plano'
import { Sos } from '@/app/sos/Sos'
import { Decoracao } from '@/components/Decoracao'
import { useRota } from '@/hooks/useRota'

function App() {
  const { rota, ir } = useRota()
  // Gatilhos que chegam de outra tela (pós-lapso da 004) ficam só em memória, nunca na URL.
  const [gatilhosIniciais, setGatilhosIniciais] = useState<string[]>([])
  const [reduzir, setReduzir] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('reduzir-animacoes', reduzir)
  }, [reduzir])

  const abrirPlano = (gatilhos: string[] = []) => {
    setGatilhosIniciais(gatilhos)
    ir('/plano')
  }

  return (
    <div className="palco">
      <Decoracao />
      <div className="celular">
        <header className="topo">
          <button type="button" className="topo__marca" onClick={() => ir('/')}>
            Guardião
          </button>
          <label className="interruptor" title="Reduzir animações">
            <input
              type="checkbox"
              checked={reduzir}
              onChange={(e) => setReduzir(e.target.checked)}
              aria-label="Reduzir animações"
            />
            <span className="interruptor__trilho" aria-hidden="true" />
            <span className="interruptor__texto">Reduzir animações</span>
          </label>
          {/* Saída para a crise a 1 toque de qualquer tela (skill seguranca-e-crise). */}
          {rota !== '/ajuda' && (
            <button type="button" className="topo__ajuda" onClick={() => ir('/ajuda')}>
              Preciso de ajuda agora
            </button>
          )}
        </header>
        <main className="conteudo">
          {rota === '/' && (
            <Inicio
              aoAbrirSos={() => ir('/sos')}
              aoApostar={() => ir('/checkin')}
              aoAbrirDinheiro={() => ir('/dinheiro')}
              aoAbrirPlano={() => abrirPlano()}
              aoAbrirCirculo={() => ir('/circulo')}
              reduzir={reduzir}
            />
          )}
          {rota === '/checkin' && <Checkin aoPedirAjuda={() => ir('/ajuda')} aoTerminar={() => ir('/')} />}
          {rota === '/dinheiro' && <Dinheiro aoVoltar={() => ir('/')} aoAbrirCheckin={() => ir('/checkin')} />}
          {rota === '/plano' && (
            <Plano gatilhosIniciais={gatilhosIniciais} aoAbrirCirculo={() => ir('/circulo')} aoVoltar={() => ir('/')} />
          )}
          {rota === '/circulo' && <Circulo aoAbrirPlano={() => abrirPlano()} aoVoltar={() => ir('/')} />}
          {rota === '/sos' && <Sos aoPedirAjuda={() => ir('/ajuda')} aoTerminar={() => ir('/')} />}
          {rota === '/ajuda' && <Crise aoVoltar={() => ir('/')} />}
        </main>
      </div>
    </div>
  )
}

export default App
