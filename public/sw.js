const CACHE = 'todo-v2'; // <--- Change le nom ici à chaque grosse modif

// On ne met en cache que les fichiers de base
const FICHIERS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './icone.svg'
];

self.addEventListener('install', e => {
  // Force le nouveau SW à prendre le contrôle immédiatement
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FICHIERS))
  );
});

self.addEventListener('fetch', e => {
  // Stratégie : Réseau d'abord, Cache sinon (meilleur pour le dev)
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});