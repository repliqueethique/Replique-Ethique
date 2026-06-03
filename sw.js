const CACHE_NAME = 'replique-ethique-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './data.js',
  './manifest.json',
  './fonts/intro.otf',
  './fonts/Graphie Book.ttf',
  './fonts/Moon Flower Bold.ttf',
  './fonts/SF Sports Night NS.ttf',
  './images/logo-fixe.png',
  './images/logo-animation.gif',
  './images/icone-loupe.png',
  './images/icone-copier.png',
  './images/icone-partager.png',
  './images/icone-info.png',
  './images/icone-mail.png',
  './images/icone-mastodon.png',
  './images/icone-bluesky.png',
  './images/icone-discord.png',
  './images/icone-youtube.png',
  './images/icone-instagram.png',
  './images/rouage.png',
  './images/etoile.png',
  './images/etoile vide.png',
  './images/clés.png',
  './images/coeur.png',
  './images/volant.png',
  './images/machine.png',
];

// Ajoute toutes les vignettes
for (let i = 1; i <= 50; i++) {
  ASSETS.push(`./images/vignettes/VE2M ${i} vignette YT.jpg`);
}

// Installation : mise en cache de tous les assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation : supprime les anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch : sert depuis le cache, fallback réseau
self.addEventListener('fetch', (e) => {
  // Les URLs YouTube ne sont pas mises en cache
  if (e.request.url.includes('youtube.com') || e.request.url.includes('ytimg.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});