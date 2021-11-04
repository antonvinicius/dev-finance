const cacheName = "dev.finances:cache";

// Cache all the files to make a PWA
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      // Our application only has two files here index.html and manifest.json
      // but you can add more such as style.css as your app grows
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./style.css",
        "./script.js",
        "./models/Transaction.js",
        "./assets/expense.svg",
        "./assets/icon-192x192.png",
        "./assets/icon-256x256.png",
        "./assets/icon-384x384.png",
        "./assets/icon-512x512.png",
        "./assets/income.svg",
        "./assets/logo.svg",
        "./assets/minus.svg",
        "./assets/plus.svg",
        "./assets/total.svg",
      ]);
    })
  );
});

// Our service worker will intercept all fetch requests
// and check if we have cached the file
// if so it will serve the cached file
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .open(cacheName)
      .then((cache) => cache.match(event.request, { ignoreSearch: true }))
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
