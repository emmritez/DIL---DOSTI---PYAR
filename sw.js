// Service Worker for DIL - DOSTI - PYAR PWA (GitHub Pages Subfolder Ready)
const CACHE_NAME = 'dil-dosti-pyar-v4';
const PRECACHE_ASSETS = [
  '/DIL---DOSTI---PYAR/',
  '/DIL---DOSTI---PYAR/index.html',
  '/DIL---DOSTI---PYAR/manifest.json',
  '/DIL---DOSTI---PYAR/icon-192.png',
  '/DIL---DOSTI---PYAR/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (
    request.method !== 'GET' ||
    request.url.includes('firestore.googleapis.com') ||
    request.url.includes('identitytoolkit.googleapis.com') ||
    request.url.includes('script.google.com')
  ) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put('/DIL---DOSTI---PYAR/index.html', copy));
          return res;
        })
        .catch(() => caches.match('/DIL---DOSTI---PYAR/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
