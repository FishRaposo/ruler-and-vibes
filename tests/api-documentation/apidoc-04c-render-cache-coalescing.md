---
id: apidoc-04c-render-cache-coalescing
category: api-documentation
title: Document an async memoizing render cache's concurrency contracts
deliverables:
  - REFERENCE.md
  - demo.js
---

## Task

Below is the complete, verified source of `createRenderCache(renderFn, {
freshForMs })`, an async thumbnail render cache with a freshness window
and in-flight request coalescing. It has shipped internally but was
never documented. Read the source carefully — its concurrency and
failure behavior are not the first thing you'd guess from the name — and
write accurate reference documentation plus a runnable demo that
exercises the observable contracts.

```js
function createRenderCache(renderFn, { freshForMs } = {}) {
  const rendered = new Map(); // assetId -> { frame, freshUntil }
  const active = new Map();   // assetId -> promise

  async function get(assetId) {
    const hit = rendered.get(assetId);
    if (hit && hit.freshUntil > Date.now()) {
      return hit.frame;
    }
    if (active.has(assetId)) {
      return active.get(assetId);
    }
    const p = (async () => {
      try {
        const frame = await renderFn(assetId);
        rendered.set(assetId, { frame, freshUntil: Date.now() + freshForMs });
        return frame;
      } finally {
        active.delete(assetId);
      }
    })();
    active.set(assetId, p);
    return p;
  }

  function drop(assetId) {
    rendered.delete(assetId);
  }

  return { get, drop };
}

module.exports = { createRenderCache };
```

## Deliverables

- `REFERENCE.md` — reference documentation for `createRenderCache` and
  the `{ get, drop }` object it returns, covering: the constructor
  arguments (`renderFn`, `freshForMs`); the async return contract of
  `get` (what it resolves to, and how it behaves on failure — does it
  throw synchronously or return a rejecting promise?); the freshness
  caching behavior (fresh hits within `freshForMs` vs. going stale); what
  happens when multiple callers call `get` for the SAME assetId before
  the first call has resolved; what happens when a render FAILS — is the
  failure cached, and what does the next call for that assetId do; and
  what `drop(assetId)` does.
- `demo.js` — a runnable script (`node demo.js`) using your OWN small
  counting `renderFn` (or two) that empirically demonstrates, and prints
  observable output for:
  1. A concurrent-coalesce case: two `get(assetId)` calls issued before
     either resolves.
  2. A within-fresh cache-hit case: a subsequent `get(assetId)` call
     issued soon after, before `freshForMs` has elapsed.
  3. A rejection-retry case: a render cache whose `renderFn` always
     rejects, invoked with TWO sequential `await get(assetId)` calls,
     printing how many times `renderFn` was actually invoked.
  - Catch every expected rejection in `demo.js` so the process exits
    cleanly (code 0, no unhandled rejection).
  - Keep timers small (e.g. `freshForMs` around 50ms, with any
    post-fresh wait at least 60ms) so the script finishes quickly and
    reliably.

## Constraints

- `node demo.js` must run to completion without an unhandled rejection
  or thrown exception escaping the process.
- Do not modify the given `createRenderCache` source's behavior; you may
  paste it verbatim into `demo.js` or require a verbatim copy from
  another file you create.
