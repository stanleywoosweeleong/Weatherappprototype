/* 农友天气 disaster-map · service worker
   CACHE_VERSION follows WeatherNext convention: wnext-<namespace>-<timestamp> */
const CACHE_VERSION = 'wnext-disasterMap-202606161025';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './map.jpg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(ASSETS)).catch(()=>{}));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE_VERSION).then(c => c.put(e.request, copy)).catch(()=>{});
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
