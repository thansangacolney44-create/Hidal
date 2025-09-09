// Choose a cache name
const CACHE_NAME = 'hidalwave-cache-v1';
// List the files to precache
const PRECACHE_ASSETS = [
  '/',
  // Other assets like CSS, JS, and key images can be added here
];

// When the service worker is installed, open a cache and add the precache assets
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_ASSETS);
  })());
});

// When there's a fetch request, try to respond with a cached resource
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);

        // Try to get the response from the cache
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // If it's not in the cache, try to fetch it from the network
        try {
            const networkResponse = await fetch(event.request);
            // If the fetch is successful, clone the response and store it in the cache
            if (networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                await cache.put(event.request, responseToCache);
            }
            return networkResponse;
        } catch (error) {
            // If the fetch fails (e.g., user is offline), you could return a fallback page
            // For now, we just let the browser handle the fetch failure
            console.error('Fetch failed:', error);
            throw error;
        }
    })());
});
