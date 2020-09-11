const CACHE_NAME = "version-1";
const urlsToCache = ['index.html','offline.html'];

const self = this;

// Install SW
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');

                return cache.addAll(urlsToCache);
            })
    )
});

// Listen for Request
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch(() => caches.match('offline.html')) // IF there is not internet, the offline.html will be shown
            })
    )
});

// Active the Sw
self.addEventListener('activate', (event) => {
    // Keeping new cache
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);

    event.waitUntil(
        caches.keys()
            .then((cachesName) => Promise.all (
                cachesName.map((cacheName) => {
                    if(!cacheWhiteList.includes(cacheName)){ // if cacheName is not included in the cacheWhitelist it'll be deleted
                        return caches.delete(cacheName);
                    }
                })
            ))
    )
});

// Set configurations to enable the PWA
let deferredPrompt;

self.addEventListener('beforeinstallprompt', (event) => {
    // prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = event;
    //Update UI notify the user they can install the PWA
    showInstallPromotion();
});