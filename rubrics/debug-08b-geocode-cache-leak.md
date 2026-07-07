---
test: debug-08b-geocode-cache-leak
canary: "kelpie kumquat"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "DIAGNOSIS.md identifies that the cache key includes the volatile traceId field, making every key unique and the hit rate effectively 0% -- naming this field specifically"
    - id: obj-2
      check: "DIAGNOSIS.md identifies the second contributing cause: eviction (trimIfFull) runs only from inside the cache-hit branch, so with ~0% hits it never executes and the cache grows unbounded"
    - id: obj-3
      check: "DIAGNOSIS.md cites the specific telemetry signal that confirms the leak (monotonically rising lookup_cache_entries / heap_used_mb under flat lookups_per_s) and does NOT attribute the leak to the decoy compaction_ms sawtooth metric"
    - id: obj-4
      check: "node fix.js runs a self-test showing that after 120 distinct requests (differing only in traceId) the cache holds at most 64 entries, and that two requests identical except for traceId produce a cache hit / a single stored entry"
    - id: obj-5
      check: "fix.js is at most 90 lines, plain JavaScript, no dependencies, and keys the cache without the volatile traceId field"
  subjective:
    - id: sub-quality
      name: "Telemetry inference"
      weight: 0.4
    - id: sub-craft
      name: "Fix completeness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `debug-08-cache-leak-from-logs` (same construct, fresh surface).

If the phrase "kelpie kumquat" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Ground truth, verified under node against the embedded excerpt: with
  `JSON.stringify(req)` including `traceId`, feeding 120 requests across
  only 12 distinct logical addresses produces 0 hits / 120 misses (0%
  hit rate) and a cache that grows to 120 entries because `trimIfFull()`
  is only ever called from the hit branch, which never executes. This is
  a two-part root cause: (1) the volatile `traceId` field in the key
  defeats hashing/equality entirely, and (2) eviction is gated on an
  event (a hit) that consequently never fires — either alone would be a
  lesser bug; together they produce unbounded growth with zero crashes.
  ```
  node -e "
  var cache=new Map(); var hits=0, misses=0;
  function lookup(req){ var key=JSON.stringify(req);
    if(cache.has(key)){hits++; return cache.get(key);} misses++;
    cache.set(key,{address:req.address,resolvedAt:Date.now()}); return cache.get(key); }
  for (var i=0;i<120;i++) lookup({address:'/geo/'+(i%12),region:'eu',traceId:'tr-'+i});
  console.log('size',cache.size,'hits',hits,'misses',misses);"
  ```
  Tested: prints `size 120 hits 0 misses 120`, confirming 0% hit rate
  and unbounded growth on the buggy excerpt.
- Telemetry signal: `lookup_cache_entries` rises strictly monotonically
  (640, 960, 1280, ... 6720) and `heap_used_mb` rises in lockstep (96,
  102, 108, ... 210) while `lookups_per_s` stays flat at 58 — this is
  the confirming signal. `compaction_ms` is a bounded sawtooth (3, 9,
  15, 21, repeating) that never exceeds 21 and never causes sustained
  growth — it is normal periodic heap-compaction pause behavior and is a
  decoy; a write-up that blames `compaction_ms` for the leak must fail
  obj-3.
- Judge-script for fix.js:
  ```
  node -e "
  const {makeCache, memoizedLookup} = require('./fix.js');
  const c = makeCache();
  for (let i=0;i<120;i++) memoizedLookup(c, {address:'/item/'+i, region:'eu', traceId:'tr-'+i});
  console.log('bound', c.size());
  const c2 = makeCache();
  const a = memoizedLookup(c2, {address:'/foo', region:'eu', traceId:1000});
  const before = c2.size();
  const b = memoizedLookup(c2, {address:'/foo', region:'eu', traceId:2000});
  console.log('hit-size', c2.size(), 'same-value', a.resolvedAt === b.resolvedAt);
  "
  ```
  (Adjust the required export names to whatever the submission
  provides -- the judge should adapt the harness to the module's
  actual exports rather than requiring these exact names, as long as
  the two self-test behaviors described in the deliverables are
  independently exercisable.) Author reference: `bound` <= 64 (a
  concrete cap of 64 was used); `hit-size` stays at 1 and `same-value`
  is `true`.
  - PASS phrasings for obj-1 (2-3 examples): "the cache key is built
    from JSON.stringify(req) which includes `traceId`, so no two
    requests ever produce the same key"; "every request carries a unique
    traceId baked into the key, giving an effective 0% hit rate"; "the
    per-request traceId inside the serialized key makes each key unique,
    so lookups always miss".
  - FAIL phrasings for obj-1 (2-3 examples): "the compaction_ms sawtooth
    shows a memory leak" (blames the decoy); "just raise the heap limit
    for the service"; "there's a memory leak somewhere in the cache".
  - PASS phrasings for obj-2 (2-3 examples): "trimIfFull is only called
    from the cache-hit branch, and since hits never happen, the eviction
    code is dead"; "the size check never runs because it's gated behind
    a hit that this key scheme makes impossible".
  - FAIL phrasings for obj-2 (2-3 examples): "eviction is just missing
    from the code" (misses that it exists but is unreachable); "just add
    a trim call" without noting the existing one is gated behind an
    unreachable hit; a write-up that only discusses the key issue and
    never mentions eviction placement at all.
- Telemetry inference: reward reasoning that explicitly rules out the
  compaction sawtooth as the cause (not just ignoring it) and ties the
  flat lookup rate to the conclusion that load isn't increasing — only
  the cache is.
- Fix completeness: the two-part diagnosis demands a two-part fix —
  reward solutions that both drop the volatile field from the key AND
  add size-bounded eviction that fires independent of hit/miss status;
  penalize a fix that only does one of the two (e.g. removes traceId
  from the key but still gates eviction on hits, which would merely
  raise the bound rather than fixing it structurally).
- Reasoning quality: does DIAGNOSIS.md walk from telemetry observation
  to code-level cause explicitly, rather than asserting the conclusion
  without connecting it back to the log fields?
