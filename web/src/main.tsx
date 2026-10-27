import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { DadosProvider } from '@/hooks/DadosContext'
import { criarRepositorioLocal } from '@/lib/armazenamento'
import { estadoDemo } from '@/lib/demo'
import { App } from '@/App'
import '@/theme/app.css'

registerSW({ immediate: true })

// Modo demonstração: `?demo` carrega dados sintéticos (substitui os dados deste aparelho).
if (new URLSearchParams(location.search).has('demo')) {
  criarRepositorioLocal().salvar(estadoDemo())
  history.replaceState(null, '', location.pathname)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DadosProvider>
        <App />
      </DadosProvider>
    </BrowserRouter>
  </StrictMode>,
)
