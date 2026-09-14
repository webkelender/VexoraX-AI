// VexoraX service worker
// Strategy: cache-first for the app shell (this file, index.html, manifest,
// icons) so the app opens instantly and works offline; everything else
// (Gemini/OpenAI calls, CDN scripts for p5/gsap/jsPDF, Google Fonts) is left
// to the network as normal — those are either live API calls that must never
// be served stale, or third-party resources the browser's own HTTP cache
// already handles well.

const CACHE_VERSION = 'vexorax-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((n) => n !== CACHE_VERSION).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only ever handle same-origin GET requests. Everything cross-origin
  // (AI provider APIs, CDN scripts, fonts) or non-GET passes straight
  // through untouched.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached); // offline and not cached: fail gracefully
      return cached || network;
    })
  );
});
