const PREFIX = "maybeverse-%2Fsurprise-for-maybe%2F-";
const CACHE = PREFIX + '969e66ab12dd';
const FILES = ["/surprise-for-maybe/","/surprise-for-maybe/index.html","/surprise-for-maybe/favicon.svg","/surprise-for-maybe/manifest.webmanifest","/surprise-for-maybe/icons/icon-192.png","/surprise-for-maybe/icons/icon-512.png","/surprise-for-maybe/assets/dm-sans-latin-wght-normal-Xz1IZZA0.woff2","/surprise-for-maybe/assets/fraunces-latin-wght-normal-ukD16Tqj.woff2","/surprise-for-maybe/assets/fraunces-latin-wght-italic-Py8at3oI.woff2","/surprise-for-maybe/assets/index-BCgJjzNK.css","/surprise-for-maybe/assets/index-CLZS9F5m.js"];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.open(CACHE).then(cache => cache.match("/surprise-for-maybe/index.html"))));
    return;
  }
  event.respondWith(caches.open(CACHE).then(async cache => {
    // All cached files are public, same-origin assets. The preview server's
    // Vary: Origin header must not prevent an offline match for module requests.
    const hit = await cache.match(request, { ignoreVary: true });
    if (hit) return hit;
    return fetch(request);
  }));
});