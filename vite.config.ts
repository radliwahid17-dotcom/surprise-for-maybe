import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHash } from "node:crypto";

let deploymentBase = "/";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "maybeverse-offline",
      apply: "build",
      configResolved(config) {
        deploymentBase = config.base;
      },
      generateBundle(_options, bundle) {
        const assetPath = (name: string) => `${deploymentBase}${name}`;
        const assets = Object.keys(bundle).map(assetPath);
        const version = createHash("sha256")
          .update(deploymentBase + JSON.stringify(bundle))
          .digest("hex")
          .slice(0, 12);
        const cachePrefix = `maybeverse-${encodeURIComponent(deploymentBase)}-`;
        this.emitFile({
          type: "asset",
          fileName: "sw.js",
          source: `const PREFIX = ${JSON.stringify(cachePrefix)};
const CACHE = PREFIX + '${version}';
const FILES = ${JSON.stringify([deploymentBase, assetPath("index.html"), assetPath("favicon.svg"), assetPath("manifest.webmanifest"), assetPath("icons/icon-192.png"), assetPath("icons/icon-512.png"), ...assets])};
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.open(CACHE).then(cache => cache.match(${JSON.stringify(assetPath("index.html"))}))));
    return;
  }
  event.respondWith(caches.open(CACHE).then(async cache => {
    // All cached files are public, same-origin assets. The preview server's
    // Vary: Origin header must not prevent an offline match for module requests.
    const hit = await cache.match(request, { ignoreVary: true });
    if (hit) return hit;
    return fetch(request);
  }));
});`,
        });
      },
    },
  ],
  server: { host: "0.0.0.0" },
});
