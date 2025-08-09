self.addEventListener('install', (event)=>{
  self.skipWaiting()
})
self.addEventListener('activate', (event)=>{
  self.clients.claim()
})
self.addEventListener('fetch', (event)=>{
  // Very small sw: fallback to network; enhance later with caching strategies.
})
