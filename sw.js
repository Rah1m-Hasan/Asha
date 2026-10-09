// Model paths are stable across releases. Prefer the network so a deployed
// model and the current JavaScript cannot drift apart, while retaining the
// last verified copy for offline use.
const CACHE = "asha-live-models-v4";
const CACHE_PREFIX = "asha-live-models-";
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(["./app/style.css", "./app/blue-theme.css", "./assets/brand/asha-icon-192.png"]))
      .catch(() => {}),
  );
});
self.addEventListener("activate", (event) =>
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      ),
    ]),
  ),
);
// Only immutable model assets are cached. Private API responses are never cached.
self.addEventListener("fetch", (event) => {
  const u = new URL(event.request.url);
  if (
    event.request.method === "GET" &&
    u.origin === self.location.origin &&
    /\.(task|onnx|wasm)$/.test(u.pathname)
  ) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        try {
          const response = await fetch(event.request);
          if (response.ok) await cache.put(event.request, response.clone());
          return response;
        } catch {
          return (await cache.match(event.request)) || Response.error();
        }
      }),
    );
  }
});
self.addEventListener("push", (event) => {
  let d = {};
  try {
    d = event.data?.json() || {};
  } catch {}
  event.waitUntil(
    self.registration.showNotification(d.title || "Asha · new request", {
      body: d.body || "Open your caregiver dashboard.",
      tag: d.tag,
      icon: "./assets/brand/asha-icon-192.png",
      badge: "./assets/brand/asha-favicon-48.png",
      data: { url: "./?role=caregiver" },
    }),
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (list) => {
        const url = new URL("./?role=caregiver", self.registration.scope).href;
        for (const c of list)
          if (c.url.startsWith(self.registration.scope)) {
            await c.navigate(url);
            return c.focus();
          }
        return self.clients.openWindow(url);
      }),
  );
});
