// Service worker do Guardião: deixa o app, o SOS e a crise abrirem sem internet.
// Estratégia: navegação vai pra rede e cai no index.html do cache; demais arquivos do próprio site
// usam o cache primeiro e são guardados na primeira visita. Nada da pessoa passa por aqui
// (os registros ficam no IndexedDB), e requisições de outros domínios são ignoradas.
const CACHE = 'guardiao-v2'
const ESSENCIAIS = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg']

// Os arquivos do build têm hash no nome; lemos o index.html para guardar o JS e o CSS já na instalação,
// sem esperar a pessoa recarregar a página.
async function arquivosDoBuild() {
  const html = await (await fetch('/index.html', { cache: 'no-store' })).text()
  return [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1])
}

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      await cache.addAll(ESSENCIAIS)
      await cache.addAll(await arquivosDoBuild()).catch(() => undefined)
    })(),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((nome) => nome !== CACHE).map((nome) => caches.delete(nome))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (evento) => {
  const pedido = evento.request
  if (pedido.method !== 'GET' || new URL(pedido.url).origin !== self.location.origin) return

  if (pedido.mode === 'navigate') {
    evento.respondWith(fetch(pedido).catch(() => caches.match('/index.html')))
    return
  }

  evento.respondWith(
    caches.match(pedido).then(
      (guardado) =>
        guardado ??
        fetch(pedido).then((resposta) => {
          if (resposta.ok) {
            const copia = resposta.clone()
            caches.open(CACHE).then((cache) => cache.put(pedido, copia))
          }
          return resposta
        }),
    ),
  )
})
