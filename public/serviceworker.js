const CACHE_NAME = 'pwd-na-to-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
  // Welcome page assets
  '/images/logow1.png',
  '/images/wppattern.png',
  '/images/wplettering.png',
  '/images/wpscan.png',
  '/images/wppeople.png'
];

const PWD_DATA_CACHE = 'pwd-data-cache-v1';
const DYNAMIC_CACHE = 'pwd-dynamic-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(PWD_DATA_CACHE),
      caches.open(DYNAMIC_CACHE)
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => ![CACHE_NAME, PWD_DATA_CACHE, DYNAMIC_CACHE].includes(name))
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Handle PWD verification API requests
  if (event.request.url.includes('/api/pwd/verify')) {
    event.respondWith(handlePWDVerification(event.request));
    return;
  }

  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request) || caches.match('/');
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response and update cache in background
        updateCache(event.request);
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.ok && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // For images, return a fallback if available
          if (event.request.destination === 'image') {
            return caches.match('/images/offline-placeholder.png');
          }
          return new Response('Offline content not available');
        });
    })
  );
});

// Update cache in background
async function updateCache(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response);
    }
  } catch (error) {
    console.log('Background cache update failed:', error);
  }
}

// Handle PWD verification requests
async function handlePWDVerification(request) {
  try {
    // Try to fetch from network first
    const response = await fetch(request);
    if (response.ok) {
      const pwdData = await response.clone().json();
      // Store the verification data in IndexedDB
      await storePWDData(pwdData);
      return response;
    }
  } catch (error) {
    console.log('Offline mode - checking local data');
  }

  // If offline or network request failed, check local data
  const hashid = new URL(request.url).searchParams.get('hashid');
  const offlineData = await getPWDData(hashid);
  
  if (offlineData) {
    return new Response(JSON.stringify(offlineData), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ error: 'No offline data available' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

// IndexedDB setup for PWD data
const dbName = 'PWDOfflineDB';
const storeName = 'pwdVerificationData';

// Store PWD verification data
async function storePWDData(data) {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  await store.put(data);
  await tx.complete;
}

// Retrieve PWD verification data
async function getPWDData(hashid) {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  return await store.get(hashid);
}

// Open IndexedDB connection
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'hashid' });
      }
    };
  });
}

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pwd-data') {
    event.waitUntil(syncPWDData());
  }
});

// Helper function for background sync
async function syncPWDData() {
  try {
    const response = await fetch('/api/pwd/sync-data');
    if (response.ok) {
      const data = await response.json();
      const db = await openDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      // Update local database with new data
      for (const item of data) {
        await store.put(item);
      }
      await tx.complete;
    }
  } catch (error) {
    console.error('PWD data sync failed:', error);
  }
} 