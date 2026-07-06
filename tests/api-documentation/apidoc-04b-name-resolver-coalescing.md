---
id: apidoc-04b-name-resolver-coalescing
category: api-documentation
title: Document an async coalescing name resolver's concurrency contracts
deliverables:
  - REFERENCE.md
  - demo.js
---

## Task

Below is the complete, verified source of `createResolver(lookupFn, {
staleAfterMs })`, an async name resolver with a stale-after cache and
in-flight request coalescing. It has shipped internally but was never
documented. Read the source carefully — its concurrency and failure
behavior are not the first thing you'd guess from the name — and write
accurate reference documentation plus a runnable demo that exercises the
observable contracts.

```js
function createResolver(lookupFn, { staleAfterMs } = {}) {
  const cache = new Map();   // key -> { record, staleAt }
  const pending = new Map(); // key -> promise

  async function resolve(key) {
    const cached = cache.get(key);
    if (cached && cached.staleAt > Date.now()) {
      return cached.record;
    }
    if (pending.has(key)) {
      return pending.get(key);
    }
    const p = (async () => {
      try {
        const record = await lookupFn(key);
        cache.set(key, { record, staleAt: Date.now() + staleAfterMs });
        return record;
      } finally {
        pending.delete(key);
      }
    })();
    pending.set(key, p);
    return p;
  }

  function forget(key) {
    cache.delete(key);
  }

  return { resolve, forget };
}

module.exports = { createResolver };
```

## Deliverables

- `REFERENCE.md` — reference documentation for `createResolver` and the
  `{ resolve, forget }` object it returns, covering: the constructor
  arguments (`lookupFn`, `staleAfterMs`); the async return contract of
  `resolve` (what it resolves to, and how it behaves on failure — does
  it throw synchronously or return a rejecting promise?); the
  stale-after caching behavior (fresh hits within `staleAfterMs` vs.
  going stale); what happens when multiple callers call `resolve` for
  the SAME key before the first call has resolved; what happens when a
  lookup FAILS — is the failure cached, and what does the next call for
  that key do; and what `forget(key)` does.
- `demo.js` — a runnable script (`node demo.js`) using your OWN small
  counting `lookupFn` (or two) that empirically demonstrates, and prints
  observable output for:
  1. A concurrent-coalesce case: two `resolve(key)` calls issued before
     either resolves.
  2. A within-stale cache-hit case: a subsequent `resolve(key)` call
     issued soon after, before `staleAfterMs` has elapsed.
  3. A rejection-retry case: a resolver whose `lookupFn` always rejects,
     invoked with TWO sequential `await resolve(key)` calls, printing how
     many times `lookupFn` was actually invoked.
  - Catch every expected rejection in `demo.js` so the process exits
    cleanly (code 0, no unhandled rejection).
  - Keep timers small (e.g. `staleAfterMs` around 50ms, with any
    post-stale wait at least 60ms) so the script finishes quickly and
    reliably.

## Constraints

- `node demo.js` must run to completion without an unhandled rejection
  or thrown exception escaping the process.
- Do not modify the given `createResolver` source's behavior; you may
  paste it verbatim into `demo.js` or require a verbatim copy from
  another file you create.
