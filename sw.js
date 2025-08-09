// Placeholder service worker for Workbox build. At build-time you can generate a precache manifest.
self.addEventListener('install', (e)=>{ self.skipWaiting(); });
self.addEventListener('activate', (e)=>{ self.clients.claim(); });
self.addEventListener('fetch', (e)=>{ /* network-first for dynamic content, cache-first for assets can be added by workbox */ });
