import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

async function workerHarness() {
  const listeners = new Map();
  const buckets = new Map();
  const deleted = [];
  let network = async () => new Response("network", { status: 200 });
  const cacheFor = (name) => {
    if (!buckets.has(name)) buckets.set(name, new Map());
    const entries = buckets.get(name);
    return {
      async addAll() {},
      async match(request) {
        return entries.get(request.url)?.clone();
      },
      async put(request, response) {
        entries.set(request.url, response.clone());
      },
    };
  };
  const context = {
    Response,
    URL,
    Promise,
    caches: {
      open: async (name) => cacheFor(name),
      keys: async () => [...buckets.keys()],
      delete: async (name) => {
        deleted.push(name);
        return buckets.delete(name);
      },
    },
    fetch: (...args) => network(...args),
    self: {
      location: { origin: "https://asha.test", href: "https://asha.test/sw.js" },
      clients: { claim: async () => {}, matchAll: async () => [], openWindow: async () => {} },
      registration: { scope: "https://asha.test/", showNotification: async () => {} },
      skipWaiting() {},
      addEventListener(type, listener) {
        listeners.set(type, listener);
      },
    },
  };
  vm.runInNewContext(await fs.readFile(new URL("../sw.js", import.meta.url), "utf8"), context);
  return {
    buckets,
    deleted,
    setNetwork(fn) {
      network = fn;
    },
    async activate() {
      let pending;
      listeners.get("activate")({ waitUntil: (promise) => (pending = promise) });
      await pending;
    },
    async fetch(request) {
      let response;
      listeners.get("fetch")({ request, respondWith: (promise) => (response = promise) });
      return response && (await response);
    },
  };
}

test("service worker removes old model caches and refreshes models before offline fallback", async () => {
  const worker = await workerHarness();
  worker.buckets.set("asha-live-models-v1", new Map());
  worker.buckets.set("unrelated-cache", new Map());
  await worker.activate();
  assert.deepEqual(worker.deleted, ["asha-live-models-v1"]);
  assert.equal(worker.buckets.has("unrelated-cache"), true);

  const request = new Request("https://asha.test/models/pose.task");
  worker.setNetwork(async () => new Response("fresh", { status: 200 }));
  assert.equal(await (await worker.fetch(request)).text(), "fresh");

  worker.setNetwork(async () => {
    throw Error("offline");
  });
  assert.equal(await (await worker.fetch(request)).text(), "fresh");
});
