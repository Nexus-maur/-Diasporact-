const V = 'dp-v24';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './logo.png', './logo-large.png', './apple-touch-icon.png', './vendor/supabase.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);

  // Pages : réseau d'abord, puis copie hors ligne
  if (r.mode === 'navigate' && u.origin === location.origin && !/^\/(index\.html)?$/.test(u.pathname)) return; // ex. confidentialite.html : réseau normal, sans toucher à la copie de l'app
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r)
        .then(res => { const cp = res.clone(); caches.open(V).then(c => c.put('./index.html', cp)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Configuration : toujours le réseau d'abord, pour qu'un changement de clés soit pris en compte tout de suite
  if (u.origin === location.origin && u.pathname.endsWith('/config.js')) {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; }).catch(() => caches.match(r)));
    return;
  }

  // Fichiers de l'app et polices : copie en cache, mise à jour en arrière-plan
  if (u.origin === location.origin || u.host === 'fonts.googleapis.com' ||  u.host === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(r).then(hit => {
        const net = fetch(r)
          .then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; })
          .catch(() => hit);
        return hit || net;
      })
    );
  }
});
