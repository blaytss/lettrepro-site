const CACHE = 'lettrepro-v2';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // On ne gère que les pages du site (on laisse passer l'API Railway)
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);              // toujours essayer le réseau d'abord
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());               // garder une copie pour le hors-ligne
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);      // hors-ligne : servir la copie
      return cached || (await caches.match('index.html')) || Response.error();
    }
  })());
});