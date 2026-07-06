---
test: apidoc-04b-name-resolver-coalescing
canary: "ranunculus rigel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node demo.js` runs to completion without an unhandled rejection and prints observable results for a concurrent-coalesce case, a within-stale cache-hit case, and a rejection-retry case"
    - id: obj-2
      check: "REFERENCE.md documents in-flight coalescing: concurrent resolve(key) calls before resolution share one lookup and resolve to the same record"
    - id: obj-3
      check: "REFERENCE.md documents that a REJECTED lookup is NOT cached and the next call retries, and that resolve returns a REJECTING promise (not a synchronous throw) on failure"
    - id: obj-4
      check: "demo.js empirically demonstrates the rejection-retry trap: with a lookupFn that rejects and counts invocations, two sequential awaited resolve(key) calls cause TWO lookupFn invocations, and demo.js prints that count"
    - id: obj-5
      check: "REASONING.md exists and is at most 300 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Async-contract accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Demo design & reference clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `apidoc-04-async-loader-contracts` (same construct, fresh surface).

If the phrase "ranunculus rigel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- AUTHOR RE-VERIFIED with node. Deterministic facts with a counting
  lookupFn (`staleAfterMs=50`, lookup resolves after 20ms as
  `rec:${key}:${calls}`):
  - (A) `Promise.all([resolve('alpha'),resolve('alpha')])` => both
    resolve to `'rec:alpha:1'`, calls===1 (in-flight coalescing, single
    lookup).
  - (B) an immediate third `await resolve('alpha')` within the
    stale window => still calls===1, record `'rec:alpha:1'` (cache hit).
  - After sleeping >staleAfterMs, `await resolve('alpha')` => calls===2
    (relookup).
  - Rejection case with a separate resolver whose lookupFn always
    rejects (counting invocations): two sequential `await resolve('beta')`
    calls => first rejects `'down1'`, second rejects `'down2'`,
    invocation count===2 (rejections NOT cached, retried).
  - `resolve` never throws synchronously — it returns a promise that
    rejects. `forget(key)` deletes the cache entry but does not cancel an
    in-flight promise.
- Run demo.js: `node demo.js`. It must exit 0 with no unhandled
  rejection printed by node, and its stdout must show, in some
  observable form, the three cases named in obj-1.
- obj-2 is a prose-located binary check. PASS phrasings: "concurrent
  calls are coalesced and share one in-flight lookup", "overlapping
  resolves for the same key trigger lookupFn once", "simultaneous callers
  receive the same resolved record from a single lookup". FAIL phrasings:
  "each call looks up independently", "calls are queued and each hits
  lookupFn", silence on concurrency.
- obj-3 is a prose-located binary check. PASS phrasings: "failures are
  not cached and the next call retries", "resolve returns a promise that
  rejects rather than throwing synchronously", "a rejected lookup is not
  stored, so the following resolve re-invokes lookupFn". FAIL phrasings:
  "errors are cached", "resolve throws synchronously on failure", "a
  failed key stays failed until forget".
- obj-4: this is the load-bearing, timing-independent check. Read
  demo.js's rejection-case output: it must show a printed invocation
  count of exactly 2 after two sequential awaited `resolve(key)` calls on
  a key whose lookupFn always rejects. This does not depend on timer
  accuracy or machine load — do not accept a flaky-timing excuse for a
  count other than 2.
- obj-5: run `wc -w REASONING.md`.
- Async-contract accuracy: does REFERENCE.md get the FULL shape of the
  failure contract right — not just "rejections aren't cached" but also
  that `resolve` itself never throws synchronously (a caller must
  await/catch, not try/catch around the call)? Does it correctly scope
  the stale-after behavior (fresh-within-window hits skip lookupFn;
  going stale triggers exactly one relookup, not a burst)?
- Demo design & reference clarity: does demo.js make each of the three
  cases legible in stdout (clear labels, not just raw values), and is the
  invocation-counting lookupFn actually a counting closure (not something
  that infers count from timing)? Is REFERENCE.md organized so a caller
  could predict behavior under concurrent access without reading the
  source?
- Reasoning quality: does REASONING.md explain WHY the pending map and
  the try/finally matter (e.g. what would break without the in-flight
  coalescing, or without the rejection not being cached) rather than just
  narrating what the code does line by line?
