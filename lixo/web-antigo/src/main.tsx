import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { carregarDemo } from '@/lib/demo'

function renderizar() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// Modo demo (`?demo`): dados sintéticos antes da primeira tela, para ela já abrir com eles.
if (new URLSearchParams(location.search).has('demo')) {
  history.replaceState(null, '', location.pathname)
  carregarDemo().catch(() => undefined).finally(renderizar)
} else {
  renderizar()
}

// Offline-first: o SOS e a crise precisam abrir sem internet (spec 001, CA-7).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}
