---
id: apidoc-04-async-loader-contracts
category: api-documentation
title: Document an async memoizing loader's concurrency contracts
deliverables:
  - REFERENCE.md
  - demo.js
---

## Task

Below is the complete, verified source of `createLoader(fetchFn, {
ttlMs })`, an async loader with a time-to-live cache and in-flight
request de-duplication. It has shipped internally but was never
documented. Read the source carefully — its concurrency and failure
behavior are not the first thing you'd guess from the name — and write
accurate reference documentation plus a runnable demo that exercises
the observable contracts.

```js
function createLoader(fetchFn, { ttlMs } = {}) {
  const cache = new Map(); // key -> { value, expiresAt }
  const inFlight = new Map(); // key -> promise

  async function load(key) {
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }
    if (inFlight.has(key)) {
      return inFlight.get(key);
    }
    const p = (async () => {
      try {
        const value = await fetchFn(key);
        cache.set(key, { value, expiresAt: Date.now() + ttlMs });
        return value;
      } finally {
        inFlight.delete(key);
      }
    })();
    inFlight.set(key, p);
    return p;
  }

  function invalidate(key) {
    cache.delete(key);
  }

  return { load, invalidate };
}

module.exports = { createLoader };
```

## Deliverables

- `REFERENCE.md` — reference documentation for `createLoader` and the
  `{ load, invalidate }` object it returns, covering: the constructor
  arguments (`fetchFn`, `ttlMs`); the async return contract of `load`
  (what it resolves to, and how it behaves on failure — does it throw
  synchronously or return a rejecting promise?); the TTL caching
  behavior (fresh hits within `ttlMs` vs. expiry); what happens when
  multiple callers call `load` for the SAME key before the first call
  has resolved; what happens when a fetch FAILS — is the failure
  cached, and what does the next call for that key do; and what
  `invalidate(key)` does.
- `demo.js` — a runnable script (`node demo.js`) using your OWN small
  counting `fetchFn` (or two) that empirically demonstrates, and
  prints observable output for:
  1. A concurrent-dedupe case: two `load(key)` calls issued before
     either resolves.
  2. A within-TTL cache-hit case: a subsequent `load(key)` call issued
     soon after, before `ttlMs` has elapsed.
  3. A rejection-retry case: a loader whose `fetchFn` always rejects,
     invoked with TWO sequential `await load(key)` calls, printing how
     many times `fetchFn` was actually invoked.
  - Catch every expected rejection in `demo.js` so the process exits
    cleanly (code 0, no unhandled rejection).
  - Keep timers small (e.g. `ttlMs` around 50ms, with any post-TTL wait
    at least 60ms) so the script finishes quickly and reliably.

## Constraints

- `node demo.js` must run to completion without an unhandled
  rejection or thrown exception escaping the process.
- Do not modify the given `createLoader` source's behavior; you may
  paste it verbatim into `demo.js` or require a verbatim copy from
  another file you create.
