// LettrePro — Service Worker
// Version du cache : à incrémenter à chaque mise à jour
const CACHE_VERSION = 'lettrepro-v1';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const API_BASE      = 'https://lettrepro-production.up.railway.app';

// Fichiers à mettre en cache pour le mode offline
const STATIC_FILES = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/login.html',
  '/inscription.html',
  '/tarifs.html',
  '/legal.html',
  '/explorer.html',
  '/prof-dashboard.html',
  '/register-prof.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap'
];

// ── INSTALL : mise en cache des fichiers statiques ──
self.addEventListener('install', event => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_FILES.map(url => new Request(url, {cache: 'reload'}))))
      .then(() => {
        console.log('[SW] Fichiers statiques mis en cache');
        return self.skipWaiting();
      })
      .catch(err => console.warn('[SW] Erreur cache install:', err))
  );
});

// ── ACTIVATE : nettoyer les anciens caches ──
self.addEventListener('activate', event => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name.startsWith('lettrepro-') && name !== STATIC_CACHE)
          .map(name => {
            console.log('[SW] Suppression ancien cache:', name);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH : stratégie réseau/cache ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API Flask → toujours réseau, pas de cache
  if (url.origin === API_BASE || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'Pas de connexion au serveur' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // Fichiers statiques → cache en priorité, réseau en fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Mettre en cache les nouvelles ressources statiques
        if (response.ok && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      }).catch(() => {
        // Page offline de fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ── PUSH NOTIFICATIONS (optionnel) ──
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'LettrePro', {
      body: data.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});