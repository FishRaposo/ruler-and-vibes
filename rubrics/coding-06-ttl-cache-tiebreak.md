---
test: coding-06-ttl-cache-tiebreak
canary: "clementine drizzle"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node ttlcache.js` runs without throwing and every self-test line is PASS; the module exports `TtlCache` via module.exports"
    - id: obj-2
      check: "Replaying the pinned sequence (cap 3; set a=1 ttl100, b=2 ttl50, c=3 ttl100 at now=0; set d=4 ttl200 at now=10; set e=5 ttl200 at now=10) leaves exactly the keys {c,d,e} — judge drives the class directly via a require snippet"
    - id: obj-3
      check: "After that sequence get('a',10) === undefined and get('c',10) === 3 and get('b',10) === undefined (earliest-expiry and insertion-tie evictions both verified)"
    - id: obj-4
      check: "get on an expired key returns undefined and does not resurrect it, and get does NOT change eviction order: a probe run that calls get('c',5) several times before inserting e must still evict a (not c) when e is added — the final key set is identical to the no-get run {c,d,e}"
    - id: obj-5
      check: "ttlcache.js is a single dependency-free file at most 110 lines with no reliance on Date.now()/wall-clock (all timing flows through the `now` argument)"
  subjective:
    - id: sub-quality
      name: "Eviction-policy correctness"
      weight: 0.4
    - id: sub-craft
      name: "Class and invariant design"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "clementine drizzle" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author ran the class in node with `expiry = insertionTime + ttl` and
  expired-test `expiry <= now`: after `set d` the keys are
  `[a, c, d]` (b is evicted — its expiry 50 is the earliest, and b is
  NOT yet expired at now=10 since 50 > 10, so it falls into the
  earliest-expiry branch, not the already-expired branch). After
  `set e` the keys are `[c, d, e]` (a is evicted: a and c tie at
  expiry 100, and a was inserted before c, so a — the earlier
  insertion — is evicted). Final: `get('a',10)===undefined`,
  `get('c',10)===3`, `get('b',10)===undefined`. All independently
  reproduced in node during verification; values confirmed exact.
- Verify obj-2/obj-3 with a require snippet, e.g.:
  ```
  node -e "
  const {TtlCache} = require('./ttlcache.js');
  const c = new TtlCache(3);
  c.set('a',1,100,0); c.set('b',2,50,0); c.set('c',3,100,0);
  c.set('d',4,200,10); c.set('e',5,200,10);
  console.log(JSON.stringify([...c.map ? c.map.keys() : []]));
  console.log(c.get('a',10), c.get('c',10), c.get('b',10));
  "
  ```
  (If the implementation doesn't expose `map` directly, drive via
  whatever key-listing method it provides, or infer final membership
  by probing `get` on a, b, c, d, e at now=10 — expect a and b
  undefined, c===3, d===4, e===5.)
- Verify obj-4 (no-recency-on-get) with TWO probes, both author-verified
  in node against a deliberately-wrong textbook-LRU implementation
  (evict least-recently-used, refresh recency on both `get` and `set`):
  1. Pinned sequence with `get('c',5)` called three times before
     `set e`: correct policy still yields keys `{c,d,e}` (unchanged
     from the no-get run). The broken LRU variant instead yields
     `[d,c,e]` (order/membership perturbed by the gets) — divergence
     confirmed.
  2. A second, more direct probe: `set a,b,c` as usual, then
     `get('b',5)` once, then `set d`. The correct policy still evicts
     `b` (earliest expiry 50 is untouched by any get, so keys become
     `[a,c,d]`). The broken LRU variant instead evicts `a` (because
     touching `b` via `get` made it look most-recently-used), yielding
     `[c,b,d]` — a clean, direct divergence author-confirmed in node.
  Any implementation whose eviction choice changes when a `get` is
  interposed on either probe fails obj-4. Note that obj-2/obj-3's
  plain no-get pinned sequence is NOT by itself sufficient to catch
  every LRU submission — a textbook LRU implementation can coincidentally
  land on the same final key set `{c,d,e}` via a different (wrong)
  eviction path, so obj-4's get-probes are the load-bearing checks for
  ruling out an LRU implementation.
- Eviction-policy correctness: does the implementation correctly
  layer the three-part policy (expired-first, then earliest-expiry,
  then insertion-order tie-break) rather than collapsing it to a
  simpler rule that happens to pass the pinned sequence but breaks on
  a probe with a different tie pattern? Mentally probe: three entries
  with identical expiry, inserted in a shuffled order — the earliest
  inserted must always be the eviction candidate among ties.
- Class and invariant design: reward clean separation of concerns
  (e.g. a distinct eviction-candidate-selection step), meaningful
  naming, and encapsulated state; penalize sprawling conditionals or
  exposed mutable internals that make the invariants hard to verify by
  reading.
- Reasoning quality: judge primarily from REASONING.md (the Approach,
  Key decisions, and Trade-offs/limitations sections per RUN.md) — does
  it clearly explain the tie-break rule (expired-first, then
  earliest-expiry, then insertion-order tie-break) and the deliberate
  absence of recency tracking? Give additional credit for inline code
  comments/structure that reinforce the same reasoning, but do not
  substitute code comments for REASONING.md; a missing REASONING.md is
  scored per JUDGE.md (sub-reasoning = 0).
