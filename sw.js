const CACHE_NAME = `Bes\u00f8ksinfo`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      '/',
      '/script.js',
      '/styles.css'
    ]);
  })());
});
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (event.request.method === 'GET') {
      // Handle caching for GET requests
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      } else {
        try {
          const fetchResponse = await fetch(event.request);
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          console.error('Fetch failed:', e);
          return new Response('Offline fallback response');
        }
      }
    } else {
      // Handle 'POST' requests differently (custom logic or skip caching)
      // For example, you might choose not to cache 'POST' requests
      return fetch(event.request);
    }
  })());
});

/*
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Get the resource from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          // Save the resource in the cache and return it.
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
        
          // The network failed. Handle or log the error.
  console.error('Fetch failed:', e);
  // Optionally, return a custom offline fallback response
  return new Response('Offline fallback response');
        }
    }
  })());
}
);*/


