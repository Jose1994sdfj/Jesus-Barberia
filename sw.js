const CACHE = 'jj-barberia-v2';

const SHELL = [
  '/',
  '/index.html',
  '/app-home.html',
  '/login.html',
  '/tienda.html',
  '/citas.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/barberia-hero.jpg',
  '/imagen 1.jpg',
  '/imagen 2.jpg',
  '/imagen 3.jpg',
  '/imagen 4.jpg',
  '/imagen 5.jpg',
  '/imagen 6.jpg',
  '/imagen 7.jpg',
  '/imagen 8.jpg',
  '/imagen 9.jpg',
  '/imagen 10.jpg',
  '/imagen 11.jpg',
  '/imagen 12.jpg',
  '/imagen 13.jpg'
];

/* ─── INSTALL: pre-caché del shell ───────────────────────────── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

/* ─── ACTIVATE: limpia cachés viejas ─────────────────────────── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* ─── FETCH: cache-first para assets, network-first para resto ── */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  /* Ignorar requests no GET y llamadas externas (Firebase, fonts, CDN) */
  if (e.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      /* Assets del shell: devolver caché si existe, fetch y cachear si no */
      const networkFetch = fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || new Response('Offline', { status: 503 }));

      return cached || networkFetch;
    })
  );
});
