// no-cache simple service worker for PWA browser compatibility
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
