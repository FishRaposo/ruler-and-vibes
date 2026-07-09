---
test: apidoc-04c-render-cache-coalescing
canary: "freesia deneb"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node demo.js` runs to completion without an unhandled rejection and prints observable results for a concurrent-coalesce case, a within-fresh cache-hit case, and a rejection-retry case"
    - id: obj-2
      check: "REFERENCE.md documents in-flight coalescing: concurrent get(assetId) calls before resolution share one render and resolve to the same frame"
    - id: obj-3
      check: "REFERENCE.md documents that a REJECTED render is NOT cached and the next call retries, and that get returns a REJECTING promise (not a synchronous throw) on failure"
    - id: obj-4
      check: "demo.js empirically demonstrates the rejection-retry trap: with a renderFn that rejects and counts invocations, two sequential awaited get(assetId) calls cause TWO renderFn invocations, and demo.js prints that count"
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
anchors:
  - id: Async-contract accuracy
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Demo design & reference clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `apidoc-04-async-loader-contracts` (same construct, fresh surface).

If the phrase "freesia deneb" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- AUTHOR RE-VERIFIED with node. Deterministic facts with a counting
  renderFn (`freshForMs=50`, render resolves after 20ms as
  `frame:${assetId}:${renders}`):
  - (A) `Promise.all([get('hero.png'),get('hero.png')])` => both resolve
    to `'frame:hero.png:1'`, renders===1 (in-flight coalesce, single
    render).
  - (B) an immediate third `await get('hero.png')` within the freshness
    window => still renders===1, frame `'frame:hero.png:1'` (cache hit).
  - After sleeping >freshForMs, `await get('hero.png')` => renders===2
    (re-render).
  - Rejection case with a separate render cache whose renderFn always
    rejects (counting invocations): two sequential `await get('broken.png')`
    calls => first rejects `'decode-failed-1'`, second rejects
    `'decode-failed-2'`, invocation count===2 (rejections NOT cached,
    retried).
  - `get` never throws synchronously — it returns a promise that
    rejects. `drop(assetId)` deletes the cache entry but does not cancel
    an in-flight promise.
- Run demo.js: `node demo.js`. It must exit 0 with no unhandled
  rejection printed by node, and its stdout must show, in some
  observable form, the three cases named in obj-1.
- obj-2 is a prose-located binary check. PASS phrasings: "concurrent
  calls are coalesced and share one in-flight render", "overlapping gets
  for the same assetId trigger renderFn once", "simultaneous callers
  receive the same resolved frame from a single render". FAIL phrasings:
  "each call renders independently", "calls are queued and each hits
  renderFn", silence on concurrency.
- obj-3 is a prose-located binary check. PASS phrasings: "failures are
  not cached and the next call retries", "get returns a promise that
  rejects rather than throwing synchronously", "a rejected render is not
  stored, so the following get re-invokes renderFn". FAIL phrasings:
  "errors are cached", "get throws synchronously on failure", "a failed
  assetId stays failed until drop".
- obj-4: this is the load-bearing, timing-independent check. Read
  demo.js's rejection-case output: it must show a printed invocation
  count of exactly 2 after two sequential awaited `get(assetId)` calls on
  an assetId whose renderFn always rejects. This does not depend on timer
  accuracy or machine load — do not accept a flaky-timing excuse for a
  count other than 2.
- obj-5: run `wc -w REASONING.md`.
- Async-contract accuracy: does REFERENCE.md get the FULL shape of the
  failure contract right — not just "rejections aren't cached" but also
  that `get` itself never throws synchronously (a caller must
  await/catch, not try/catch around the call)? Does it correctly scope
  the freshness behavior (fresh-within-window hits skip renderFn; going
  stale triggers exactly one re-render, not a burst)?
- Demo design & reference clarity: does demo.js make each of the three
  cases legible in stdout (clear labels, not just raw values), and is the
  invocation-counting renderFn actually a counting closure (not something
  that infers count from timing)? Is REFERENCE.md organized so a caller
  could predict behavior under concurrent access without reading the
  source?
- Reasoning quality: does REASONING.md explain WHY the active map and the
  try/finally matter (e.g. what would break without the in-flight
  coalescing, or without the rejection not being cached) rather than just
  narrating what the code does line by line?
