import { Navigate, Route, Routes, useLocation, Link } from 'react-router-dom'
import { BarraCrise } from '@/components/BarraCrise'
import { useDados } from '@/hooks/DadosContext'
import { Onboarding } from '@/app/Onboarding'
import { Inicio } from '@/app/Inicio'
import { Sos } from '@/app/Sos'
import { Registro } from '@/app/Registro'
import { Plano } from '@/app/Plano'
import { Bloqueio } from '@/app/Bloqueio'
import { Apoio } from '@/app/Apoio'
import { Crise } from '@/app/Crise'
import { Configuracoes } from '@/app/Configuracoes'

/** Rotas que funcionam mesmo antes do onboarding (crise nunca pode ficar atrás de um formulário). */
const LIVRES = ['/boas-vindas', '/crise']

export function App() {
  const { estado } = useDados()
  const { pathname } = useLocation()
  const precisaOnboarding = !estado.onboarding && !LIVRES.includes(pathname)

  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <BarraCrise />
      <header className="topo">
        <Link to="/" className="topo__marca">
          Guardião
        </Link>
      </header>
      {precisaOnboarding ? (
        <Navigate to="/boas-vindas" replace />
      ) : (
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/boas-vindas" element={estado.onboarding ? <Navigate to="/" replace /> : <Onboarding />} />
          <Route path="/sos" element={<Sos />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/plano" element={<Plano />} />
          <Route path="/bloqueio" element={<Bloqueio />} />
          <Route path="/apoio" element={<Apoio />} />
          <Route path="/crise" element={<Crise />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  )
}
