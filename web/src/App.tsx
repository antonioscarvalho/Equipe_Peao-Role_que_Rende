import { useEffect, useState } from 'react'
import { Checkin } from '@/app/checkin/Checkin'
import { Circulo } from '@/app/circulo/Circulo'
import { Crise } from '@/app/crise/Crise'
import { Dinheiro } from '@/app/dinheiro/Dinheiro'
import { type AbaInicio, Inicio } from '@/app/inicio/Inicio'
import { Pausas } from '@/app/pausas/Pausas'
import { Plano } from '@/app/plano/Plano'
import { Sos } from '@/app/sos/Sos'
import { Decoracao } from '@/components/Decoracao'
import { Icone } from '@/components/Icone'
import { Respiracao } from '@/components/Respiracao'
import { ligarSons, tocar } from '@/components/sons'
import { conteudoPrevencao } from '@/content/conteudo'
import { useRota } from '@/hooks/useRota'

function App() {
  const { rota, ir } = useRota()
  // Gatilhos que chegam de outra tela (pós-lapso da 004) ficam só em memória, nunca na URL.
  const [gatilhosIniciais, setGatilhosIniciais] = useState<string[]>([])
  const [reduzir, setReduzir] = useState(false)
  const [sons, setSons] = useState(false)
  const [abaInicio, setAbaInicio] = useState<AbaInicio>('role')
  const [respirandoCrise, setRespirandoCrise] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('reduzir-animacoes', reduzir)
  }, [reduzir])

  const abrirPlano = (gatilhos: string[] = []) => {
    setGatilhosIniciais(gatilhos)
    ir('/plano')
  }

  const irParaRole = () => {
    setAbaInicio('role')
    ir('/')
  }

  const irParaDiario = () => {
    setAbaInicio('diario')
    ir('/')
  }

  const emRole = rota === '/' && abaInicio === 'role'
  const emDiario = (rota === '/' && abaInicio === 'diario') || rota === '/checkin'
  const emCofre = rota === '/dinheiro'
  const emApoio = rota === '/plano' || rota === '/circulo' || rota === '/pausas'

  return (
    <div className="palco">
      <Decoracao />
      <div className="celular">
        <header className="topo">
          <button type="button" className="topo__marca" onClick={irParaRole}>
            Guardião
          </button>
          <div className="interruptores">
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
            <label className="interruptor" title="Sons">
              <input
                type="checkbox"
                checked={sons}
                onChange={(e) => {
                  const ativo = e.target.checked
                  setSons(ativo)
                  ligarSons(ativo)
                  if (ativo) tocar('clique')
                }}
                aria-label="Sons"
              />
              <span className="interruptor__trilho" aria-hidden="true" />
              <span className="interruptor__texto">Sons</span>
            </label>
          </div>
          {/* Saída para a crise a 1 toque de qualquer tela (skill seguranca-e-crise). */}
          {rota !== '/ajuda' && (
            <button type="button" className="topo__ajuda" onClick={() => ir('/ajuda')}>
              Preciso de ajuda agora
            </button>
          )}
        </header>

        <main className="conteudo">
          {emApoio && (
            <div className="apoio-abas apoio-abas--3" role="tablist" aria-label="Opções de apoio">
              <button
                type="button"
                className={`apoio-aba ${rota === '/plano' ? 'is-on' : ''}`}
                aria-current={rota === '/plano' ? 'page' : undefined}
                onClick={() => abrirPlano()}
              >
                {conteudoPrevencao.atalhos.plano}
              </button>
              <button
                type="button"
                className={`apoio-aba ${rota === '/circulo' ? 'is-on' : ''}`}
                aria-current={rota === '/circulo' ? 'page' : undefined}
                onClick={() => ir('/circulo')}
              >
                {conteudoPrevencao.atalhos.circulo}
              </button>
              <button
                type="button"
                className={`apoio-aba ${rota === '/pausas' ? 'is-on' : ''}`}
                aria-current={rota === '/pausas' ? 'page' : undefined}
                onClick={() => ir('/pausas')}
              >
                Pausas pra cabeça
              </button>
            </div>
          )}

          {rota === '/' && (
            <Inicio
              abaAtiva={abaInicio}
              aoMudarAba={setAbaInicio}
              aoAbrirSos={() => ir('/sos')}
              aoApostar={() => ir('/checkin')}
              aoAbrirDinheiro={() => ir('/dinheiro')}
              aoAbrirPlano={() => abrirPlano()}
              aoAbrirCirculo={() => ir('/circulo')}
              aoAbrirPausas={() => ir('/pausas')}
              reduzir={reduzir}
            />
          )}
          {rota === '/checkin' && <Checkin aoPedirAjuda={() => ir('/ajuda')} aoTerminar={irParaRole} />}
          {rota === '/dinheiro' && <Dinheiro aoVoltar={irParaRole} aoAbrirCheckin={() => ir('/checkin')} />}
          {rota === '/plano' && (
            <Plano gatilhosIniciais={gatilhosIniciais} aoAbrirCirculo={() => ir('/circulo')} aoVoltar={irParaRole} />
          )}
          {rota === '/circulo' && <Circulo aoAbrirPlano={() => abrirPlano()} aoVoltar={irParaRole} />}
          {rota === '/pausas' && <Pausas aoVoltar={irParaRole} />}
          {rota === '/sos' && <Sos aoPedirAjuda={() => ir('/ajuda')} aoTerminar={irParaRole} />}
          {rota === '/ajuda' && <Crise aoVoltar={irParaRole} />}
        </main>

        {/* Bottom Tab Bar Fixa (5 Abas — Estilo App Nativo) */}
        <nav className="tabbar" aria-label="Navegação principal">
          <button
            type="button"
            className={`tabbar__item ${emRole ? 'is-active' : ''}`}
            aria-current={emRole ? 'page' : undefined}
            onClick={irParaRole}
          >
            <Icone nome="house" tamanho={20} />
            <span>Rolê</span>
          </button>

          <button
            type="button"
            className={`tabbar__item ${emDiario ? 'is-active' : ''}`}
            aria-current={emDiario ? 'page' : undefined}
            onClick={irParaDiario}
          >
            <Icone nome="check" tamanho={20} />
            <span>Check-in</span>
          </button>

          <button
            type="button"
            className={`tabbar__sos rqr-anim-on ${rota === '/sos' ? 'is-active' : ''}`}
            onClick={() => setRespirandoCrise(true)}
          >
            <span className="tabbar__sos-circulo">
              <Icone nome="wind" tamanho={22} />
            </span>
            <span>Deu vontade</span>
          </button>

          <button
            type="button"
            className={`tabbar__item ${emCofre ? 'is-active' : ''}`}
            aria-current={emCofre ? 'page' : undefined}
            onClick={() => ir('/dinheiro')}
          >
            <Icone nome="piggyBank" tamanho={20} />
            <span>Cofre</span>
          </button>

          <button
            type="button"
            className={`tabbar__item ${emApoio ? 'is-active' : ''}`}
            aria-current={emApoio ? 'page' : undefined}
            onClick={() => abrirPlano()}
          >
            <Icone nome="shieldCheck" tamanho={20} />
            <span>Apoio</span>
          </button>
        </nav>

        {respirandoCrise && (
          <Respiracao
            aoFechar={() => setRespirandoCrise(false)}
            aoIrParaSos={() => {
              setRespirandoCrise(false)
              ir('/sos')
            }}
            reduzir={reduzir}
          />
        )}
      </div>
    </div>
  )
}

export default App
