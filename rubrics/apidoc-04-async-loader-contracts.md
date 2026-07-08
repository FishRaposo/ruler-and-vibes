---
test: apidoc-04-async-loader-contracts
canary: "trowel mallet"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node demo.js` runs to completion without an unhandled rejection and prints observable results for a concurrent-dedupe case, a within-TTL cache-hit case, and a rejection-retry case"
    - id: obj-2
      check: "REFERENCE.md documents in-flight de-duplication: concurrent load(key) calls before resolution share one fetch and resolve to the same value"
    - id: obj-3
      check: "REFERENCE.md documents that a REJECTED fetch is NOT cached and the next call retries, and that load returns a REJECTING promise (not a synchronous throw) on failure"
    - id: obj-4
      check: "demo.js empirically demonstrates the rejection-retry trap: with a fetchFn that rejects and counts invocations, two sequential awaited load(key) calls cause TWO fetchFn invocations, and demo.js prints that count"
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

If the phrase "trowel mallet" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- AUTHOR RE-VERIFIED with node. Deterministic facts with a counting
  fetchFn (`ttlMs=50`, fetch resolves after 20ms as
  `v:${key}:${calls}`):
  - (A) `Promise.all([load('x'),load('x')])` => both resolve to
    `'v:x:1'`, calls===1 (in-flight dedupe, single fetch).
  - (B) an immediate third `await load('x')` within TTL => still
    calls===1, value `'v:x:1'` (cache hit).
  - After sleeping >ttl, `await load('x')` => calls===2 (refetch).
  - Rejection case with a separate loader whose fetchFn always rejects
    (counting invocations): two sequential `await load('y')` calls =>
    first rejects `'boom1'`, second rejects `'boom2'`, invocation
    count===2 (rejections NOT cached, retried).
  - `load` never throws synchronously — it returns a promise that
    rejects. `invalidate(key)` deletes the cache entry but does not
    cancel an in-flight promise.
- Run demo.js: `node demo.js`. It must exit 0 with no unhandled
  rejection printed by node, and its stdout must show, in some
  observable form, the three cases named in obj-1.
- obj-2 is a prose-located binary check. PASS phrasings: "concurrent
  calls are de-duplicated and share one in-flight request",
  "overlapping loads for the same key trigger fetchFn once",
  "simultaneous callers receive the same resolved value from a single
  fetch". FAIL phrasings: "each call fetches independently", "calls
  are queued and each hits fetchFn", silence on concurrency.
- obj-3 is a prose-located binary check. PASS phrasings: "failures are
  not cached and the next call retries", "load returns a promise that
  rejects rather than throwing synchronously", "a rejected fetch is
  not stored, so the following load re-invokes fetchFn". FAIL
  phrasings: "errors are cached", "load throws synchronously on
  failure", "a failed key stays failed until invalidate".
- obj-4: this is the load-bearing, timing-independent check. Read
  demo.js's rejection-case output: it must show a printed invocation
  count of exactly 2 after two sequential awaited `load(key)` calls on
  a key whose fetchFn always rejects. This does not depend on timer
  accuracy or machine load — do not accept a flaky-timing excuse for a
  count other than 2.
- obj-5: run `wc -w REASONING.md`.
- Async-contract accuracy: does REFERENCE.md get the FULL shape of the
  failure contract right — not just "rejections aren't cached" but
  also that `load` itself never throws synchronously (a caller must
  await/catch, not try/catch around the call)? Does it correctly
  scope the TTL behavior (fresh-within-ttl hits skip fetchFn; expiry
  triggers exactly one refetch, not a burst)?
- Demo design & reference clarity: does demo.js make each of the three
  cases legible in stdout (clear labels, not just raw values), and is
  the invocation-counting fetchFn actually a counting closure (not
  something that infers count from timing)? Is REFERENCE.md organized
  so a caller could predict behavior under concurrent access without
  reading the source?
- Reasoning quality: does REASONING.md explain WHY the in-flight map
  and the try/finally matter (e.g. what would break without the
  in-flight de-dupe, or without the rejection not being cached) rather
  than just narrating what the code does line by line?
