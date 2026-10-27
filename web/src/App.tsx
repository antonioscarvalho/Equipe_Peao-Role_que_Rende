import { supabase } from './lib/supabase'

const versao = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local'

function App() {
  return (
    <main className="inicio">
      <h1>Rolê que Rende</h1>
      <p>Protótipo da Equipe Peão em construção.</p>
      <dl className="estado">
        <div>
          <dt>Versão</dt>
          <dd>{versao}</dd>
        </div>
        <div>
          <dt>Supabase</dt>
          <dd>{supabase ? 'configurado' : 'ainda não configurado'}</dd>
        </div>
      </dl>
    </main>
  )
}

export default App
