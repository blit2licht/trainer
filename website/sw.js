/* Service Worker — Trainer 3.0 (Paket 3, Strang 2).
   Hält die SCHALE offline, ohne je einen alten Plan auszuliefern:

   - Schale (index.html, Icons, Manifest, Schriften) versioniert im Cache.
     Die Version ist der Cache-Stempel, den scripts/build_payload.py als
     ?v=<hash> an data.js in index.html schreibt; die Seite registriert
     diesen Worker als sw.js?v=<hash>. Neuer Plan → neue Registrier-URL →
     neuer Worker → neuer Cache, der alte wird im activate gelöscht.
   - data.js strikt network-first: aus dem Cache nur, wenn das Netz nicht
     antwortet. Die Kopfschiene zeigt dann Gerätestand, weil auch die
     get_*-Fetches der Seite scheitern (linkFetch → stale).
   - Navigationen network-first: online kommt immer der Serverstand
     (neuer Plan erscheint sofort), offline die gecachte Schale.
   - PHP-Endpunkte werden NIE angefasst — kein respondWith, kein Cache.

   Übergang vom Kill-Switch (30.08.2026): Geräte, auf denen er lief, haben
   keinen Worker mehr — die Seite registriert bei jedem Laden neu, das
   genügt. Geräte, die noch den 2.0-Worker tragen, bekommen beim nächsten
   Update-Check direkt diese Datei; das activate unten löscht ALLE fremden
   Caches (auch die 2.0-Bestände, deren Namen hier niemand mehr kennt) und
   übernimmt die offenen Clients. Der Kill-Switch ist damit vollständig
   ersetzt und kann nach einer Übergangszeit nicht mehr angefragt werden. */

const STAMP = new URL(self.location.href).searchParams.get('v') || 'dev';
const SHELL = 'shell-' + STAMP;

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './icons/favicon-16.png',
  './icons/favicon-32.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './fonts/archivo-var.woff2',
  './fonts/spline-sans-mono-var.woff2',
  /* data.js gehört nicht zur Schale, wird aber beim Install einmal
     mitgeladen: sonst bliebe ein Gerät, das nach genau einem Besuch ins
     Funkloch gerät, ohne Plan (der erste data.js-Load läuft am Worker
     vorbei, weil die Seite ihn vor dem Claim angefordert hat). */
  './data.js?v=' + STAMP
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    await c.addAll(SHELL_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== SHELL).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* Netz zuerst; die erfolgreiche Antwort wandert als Kopie in den Cache,
   damit der Offline-Rückfall immer den letzten bekannten Stand trägt.
   cacheMode 'no-store' (data.js) bzw. 'no-cache' (Navigation) schaltet den
   HTTP-Cache des Browsers aus dem Weg — sonst beantwortet dessen Heuristik
   den Fetch mit einer „frischen" alten Kopie, und genau das war der Grund
   für den Kill-Switch. */
async function networkFirst(req, fallbackUrl, cacheMode){
  const c = await caches.open(SHELL);
  try {
    const r = await fetch(req, cacheMode ? { cache: cacheMode } : undefined);
    if (r && r.ok) c.put(req, r.clone());
    return r;
  } catch (err){
    const hit = await c.match(req, { ignoreSearch: true })
             || (fallbackUrl ? await c.match(fallbackUrl) : null);
    if (hit) return hit;
    throw err;
  }
}

/* Schale: Cache zuerst — die Dateien sind über SHELL versioniert, ein
   neuer Stempel bringt automatisch frische Kopien. */
async function cacheFirst(req){
  const c = await caches.open(SHELL);
  const hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (r && r.ok) c.put(req, r.clone());
  return r;
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  /* save_verdict, get_verdicts, save_note, get_notes & Co: immer ins Netz —
     der Rückkanal wird nie aus dem Cache beantwortet, ein Scheitern gehört
     der Seite (linkFetch zeigt es in der Schiene). */
  if (url.pathname.endsWith('.php')) return;

  if (e.request.mode === 'navigate'){
    e.respondWith(networkFirst(e.request, './index.html', 'no-cache'));
    return;
  }
  if (url.pathname.endsWith('/data.js')){
    e.respondWith(networkFirst(e.request, null, 'no-store'));
    return;
  }
  e.respondWith(cacheFirst(e.request));
});
