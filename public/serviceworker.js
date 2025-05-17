const CACHE_NAME = 'pwd-na-to-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
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
  self.skipWaiting(); // Ensure new service worker takes over immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => ![CACHE_NAME, PWD_DATA_CACHE, DYNAMIC_CACHE].includes(name))
            .map((name) => caches.delete(name))
        );
      }),
      self.clients.claim() // Take control of all clients immediately
    ])
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Handle PWD verification API requests
  if (event.request.url.includes('/api/pwd/verify')) {
    event.respondWith(handlePWDVerification(event.request));
    return;
  }

  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try network first for navigation
          const networkResponse = await fetch(event.request);
          // Cache successful navigation responses
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // If network fails, try cache
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If no cached version, try the root page
          const rootResponse = await caches.match('/');
          if (rootResponse) {
            return rootResponse;
          }
          // Last resort: offline page
          return caches.match('/offline.html');
        }
      })()
    );
    return;
  }

  // Handle static assets and other requests
  event.respondWith(
    (async () => {
      // Try cache first
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        // Update cache in background
        updateCache(event.request);
        return cachedResponse;
      }

      try {
        // If not in cache, try network
        const networkResponse = await fetch(event.request);
        // Cache successful responses
        if (networkResponse.ok && networkResponse.type === 'basic') {
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // Handle failed requests
        if (event.request.destination === 'image') {
          return caches.match('/images/offline-placeholder.png');
        }
        // For other resources, return a simple offline response
        return new Response('', {
          status: 499,
          statusText: 'offline'
        });
      }
    })()
  );
});

// Update cache in background
async function updateCache(request) {
  if (!navigator.onLine) return;
  
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
    // Try network first
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