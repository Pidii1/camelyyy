// camelyyy offline cache
const V = 'camelyyy-1.2.1';
const FILES = ['./', 'index.html', 'css/app.css', 'js/app.js', 'js/engine.js', 'js/compose.js', 'js/cameras.js', 'js/store.js', 'js/native.js', 'vendor/gifenc.esm.js', 'manifest.webmanifest', 'img/icon-192.png', 'img/cams/classic.webp', 'img/cams/gold.webp', 'img/cams/grain.webp', 'img/cams/instw.webp', 'img/cams/instsq.webp', 'img/cams/disposa.webp', 'img/cams/half.webp', 'img/cams/slide.webp', 'img/cams/ccd.webp', 'img/cams/toy.webp', 'img/cams/medium.webp', 'img/cams/mono.webp', 'img/cams/fish.webp', 'img/cams/night.webp', 'img/cams/super8.webp', 'img/cams/vhs.webp', 'img/cams/dv.webp', 'img/cams/cine16.webp', 'img/cams/expired.webp', 'img/cams/pano.webp', 'img/cams/sepia.webp', 'img/cams/xpro.webp', 'img/cams/infra.webp', 'img/cams/hicon.webp', 'img/cams/soft.webp', 'img/cams/tungsten.webp', 'img/cams/redscale.webp', 'img/cams/lomo.webp', 'img/cams/pinhole.webp', 'img/cams/dream.webp', 'img/cams/print.webp', 'img/cams/cctv.webp', 'img/cams/original.webp', 'img/cams/collage.webp', 'img/cams/booth.webp', 'img/cams/mini.webp', 'img/cams/pola.webp', 'img/cams/toy120.webp', 'img/cams/pro67.webp', 'img/cams/wide22.webp', 'img/cams/pocket.webp'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('version.json') || u.pathname.endsWith('.apk')) return;
  if (e.request.mode === 'navigate') { e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(V).then((x) => x.put('index.html', c)); return r; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(e.request).then((m) => m || fetch(e.request).then((r) => { if (r.ok) { const c = r.clone(); caches.open(V).then((x) => x.put(e.request, c)); } return r; })));
});
