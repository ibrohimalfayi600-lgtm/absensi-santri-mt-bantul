/**
 * Service Worker — Absensi Santri (Ma'had Tahfizh)
 * Hanya meng-cache "app shell" (file statis: HTML/CSS/JS/ikon) supaya
 * aplikasi tetap bisa terbuka walau sinyal internet lemah/putus sesaat.
 * Data absensi (panggilan ke API_URL / Apps Script) TIDAK di-cache,
 * supaya selalu mengambil data terbaru dari Spreadsheet.
 */
const CACHE_NAME = 'absensi-santri-v1';
const APP_SHELL = [
  './',
  './index.html',
  './config.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-32.png'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL).catch(function () {
        /* diamkan jika salah satu aset gagal di-precache */
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);

  // Jangan pernah cache panggilan API (harus selalu data terbaru & live).
  if (url.origin !== self.location.origin) {
    return; // biarkan lewat ke network apa adanya (request ke Apps Script)
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
