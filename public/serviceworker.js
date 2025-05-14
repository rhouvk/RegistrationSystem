const CACHE_NAME = 'pwd-na-to-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/manifest.json',
        '/css/app.css',
        '/js/app.js',
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request).then(function (res) {
        return caches.open(CACHE_NAME).then(function (cache) {
          if (event.request.url.startsWith('http')) {
            cache.put(event.request, res.clone());
          }
          return res;
        });
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match(OFFLINE_URL);
      }
    })
  );
});
