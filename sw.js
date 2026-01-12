const cacheName = 'la-mafia-v1';

// Aqui você só coloca o básico (o que não muda)
const staticAssets = [
  '/',
  '/index.html'
];

// 1. Instalação básica
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(staticAssets))
  );
});

// 2. A MÁGICA: Captura automática da pasta /img/
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Se já está no cache, entrega imediatamente (rápido)
      if (cachedResponse) {
        return cachedResponse;
      }

      // Se não está no cache, busca na rede
      return fetch(e.request).then(networkResponse => {
        // Se o que ele buscou for um arquivo dentro da pasta /img/
        // ele salva no cache automaticamente para a próxima vez
        if (e.request.url.includes('/img/')) {
          const responseToCache = networkResponse.clone();
          caches.open(cacheName).then(cache => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});