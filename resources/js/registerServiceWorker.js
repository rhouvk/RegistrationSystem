if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful:', registration.scope);

        // Register for background sync
        if ('sync' in registration) {
          registration.sync.register('sync-data');
        }
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
} 