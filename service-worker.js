const CACHE_NAME = 'snake-v1';
const ASSETS = [
  './index.html',
  './style.css',
  './game.js',
  './manifest.json'
];

// Install: cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).catch(err => console.log('Install error:', err))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request).then(res => {
        // cache successful responses
        if (res && res.status === 200) {
          const cacheRes = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, cacheRes));
        }
        return res;
      }).catch(() => caches.match(e.request));
    })
  );
});
