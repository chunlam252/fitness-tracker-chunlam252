// FitTrack service worker — network-first so updates always arrive immediately,
// with a cache fallback so the app still opens offline (e.g. in the gym basement).
const CACHE = 'fittrack-v2';

// Everything the app needs to start. Cached on install so the very first
// offline open works, not only pages that happened to be visited online.
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
// Third-party scripts/styles loaded by index.html. Plain <script>/<link> tags get
// "opaque" responses (status 0) from other sites — those must be cached too,
// otherwise Tailwind and Babel are missing offline and the app is a blank page.
const CDN = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@babel/standalone@7.24.7/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
];

const cacheable = (res) => res && (res.status === 200 || res.type === 'opaque');

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all([
      ...CORE.map(u => fetch(u, { cache: 'reload' }).then(r => cacheable(r) && c.put(u, r)).catch(() => {})),
      ...CDN.map(u => fetch(u, { mode: 'no-cors' }).then(r => cacheable(r) && c.put(u, r)).catch(() => {})),
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  // Live data / AI / auth calls must never be cached or intercepted
  // (fonts.googleapis.com is only a stylesheet, so it is allowed through to the cache)
  if (url.hostname !== 'fonts.googleapis.com' &&
      /googleapis\.com|firestore|firebaseio|identitytoolkit|securetoken|firebaseapp\.com/.test(url.hostname)) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (cacheable(res)) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(req, { ignoreVary: true });
        if (hit) return hit;
        if (req.mode === 'navigate') return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
        return Response.error();
      })
  );
});
