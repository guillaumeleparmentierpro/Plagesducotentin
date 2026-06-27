const CACHE_NAME = 'plages-cotentin-v2';

// Liste des fichiers à mettre en cache
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './js/app.js',
  './js/moteur-calcul.js',
  // On ajoute tous nos nouveaux fichiers d'icônes
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './android-chrome-192x192.png',
  './android-chrome-512x512.jpg'
];

// 1. Événement d'INSTALLATION : On met les fichiers en cache
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des fichiers statiques');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Force le SW à devenir actif immédiatement
  );
});

// 2. Événement d'ACTIVATION : On nettoie les anciens caches si la version a changé
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation en cours...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l\'ancien cache :', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend le contrôle des pages immédiatement
  );
});

// 3. Événement FETCH : Intercepte les requêtes pour servir le cache si on est hors-ligne
self.addEventListener('fetch', (event) => {
  // On ne gère pas les requêtes vers les API externes de la même manière (météo/marées)
  // Pour l'instant, on gère l'App Shell statique
  event.respondWith(
    caches.match(event.getCacheKey ? event.getCacheKey(event.request) : event.request)
      .then((cachedResponse) => {
        // Si le fichier est dans le cache, on le renvoie, sinon on va le chercher sur le réseau
        return cachedResponse || fetch(event.request).catch(() => {
          // Optionnel : Ici on pourrait renvoyer une page d'erreur spécifique si le réseau échoue et que ce n'est pas caché
        });
      })
  );
});
