import { Head, Link } from '@inertiajs/react';
import Scanner from '@/Components/Scanner';
import { useState, useEffect } from 'react';

export default function ScanPage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(null);
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);

  useEffect(() => {
    // Update online status
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineWarning(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Only show warning if offline for more than 2 seconds
      setTimeout(() => {
        if (!navigator.onLine) {
          setShowOfflineWarning(true);
        }
      }, 2000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check last sync time
    const checkLastSync = async () => {
      try {
        const db = await openDB();
        const tx = db.transaction('pwdVerificationData', 'readonly');
        const store = tx.objectStore('pwdVerificationData');
        const lastSyncTime = await store.get('lastSyncTime');
        setLastSync(lastSyncTime?.timestamp);
      } catch (error) {
        console.log('Error checking last sync:', error);
      }
    };

    checkLastSync();

    // Trigger sync when online
    if (navigator.onLine && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('sync-pwd-data');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper function to open IndexedDB
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PWDOfflineDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('pwdVerificationData')) {
          db.createObjectStore('pwdVerificationData', { keyPath: 'hashid' });
        }
      };
    });
  };

  return (
    <>
      <Head title="Scan PWD Card" />

      <div className="relative min-h-screen text-white overflow-hidden">
        {/* Radial Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_#E0FFFF_10%,_#0093AF)] z-0" />

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/images/wppattern.png')] bg-cover bg-center opacity-30 pointer-events-none z-0" />

        {/* Offline Warning */}
        {showOfflineWarning && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-100 text-yellow-800 px-4 py-2 text-center z-50">
            You're offline. Verification will use cached data.
            <button 
              onClick={() => setShowOfflineWarning(false)}
              className="ml-4 text-yellow-600 hover:text-yellow-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Foreground Content */}
        <div className={`relative min-h-screen flex items-center justify-center px-4 py-10 z-10 ${showOfflineWarning ? 'mt-12' : ''}`}>
          <div className="bg-white shadow rounded-xl w-full max-w-xl p-6">
            {/* Connection Status */}
            <div className={`mb-4 p-2 rounded text-center ${isOnline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {isOnline ? 'Online Mode' : 'Offline Mode'}
              {!isOnline && lastSync && (
                <div className="text-sm mt-1">
                  Last synced: {new Date(lastSync).toLocaleString()}
                </div>
              )}
            </div>

            <Scanner />

            {/* Back Button */}
            <div className="mt-3 text-center">
              <Link
                href={route('welcome')}
                className="block w-full sm:w-auto max-w-md mx-auto px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-center transition-colors duration-200"
              >
                Back to Welcome
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
