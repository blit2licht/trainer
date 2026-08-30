/* Service Worker — Kill-Switch.
   Bis 2.0 lag hier ein Network-first-Cache für den Wochenplan. Mit der
   Umstellung auf 3.0 (30.08.2026) registriert die App keinen Service Worker
   mehr; die Frische kommt über den ?v=<hash> an data.js und die no-cache-Header
   der .htaccess. Der ALTE Worker bleibt aber in bereits installierten Browsern
   registriert und würde die neue Root mit 2.0-Beständen beschatten. Diese
   Fassung räumt genau das auf: Caches löschen, sich selbst abmelden, offene
   Clients neu laden. Datei bleibt liegen, bis alle Geräte einmal aktualisiert
   haben — sie erst danach löschen (ein 404 meldet den alten Worker nicht ab). */
self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const c of clients) c.navigate(c.url);
  })());
});
