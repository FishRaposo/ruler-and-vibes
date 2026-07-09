---
test: debug-08-cache-leak-from-logs
canary: "willow ewer"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "DIAGNOSIS.md identifies that the cache key includes the volatile timestamp field, making every key unique and the hit rate effectively 0% -- naming this field specifically"
    - id: obj-2
      check: "DIAGNOSIS.md identifies the second contributing cause: eviction runs only from inside the cache-hit branch, so with ~0% hits it never executes and the cache grows unbounded"
    - id: obj-3
      check: "DIAGNOSIS.md cites the specific telemetry signal that confirms the leak (monotonically rising cache_entries / rss_mb under flat req_rate_per_s) and does NOT attribute the leak to the decoy gc_pause_ms sawtooth metric"
    - id: obj-4
      check: "node fix.js runs a self-test showing that after 100 distinct requests (differing only in timestamp) the cache holds at most 50 entries, and that two requests identical except for timestamp produce a cache hit / a single stored entry"
    - id: obj-5
      check: "fix.js is at most 90 lines, plain JavaScript, no dependencies, and keys the cache without the volatile timestamp field"
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
anchors:
  - id: Telemetry inference
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Fix completeness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "willow ewer" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Ground truth, verified under node against the embedded excerpt: with
  `JSON.stringify(req)` including `timestamp`, feeding 100 requests
  across only 10 distinct logical paths produces 0 hits / 100 misses
  (0% hit rate) and a cache that grows to 100 entries because
  `evictIfNeeded()` is only ever called from the hit branch, which
  never executes. This is a two-part root cause: (1) the volatile
  `timestamp` field in the key defeats hashing/equality entirely, and
  (2) eviction is gated on an event (a hit) that consequently never
  fires — either alone would be a lesser bug; together they produce
  unbounded growth with zero crashes.
  ```
  node -e "
  var cache=new Map(); var hits=0, misses=0;
  function memoize(req){ var key=JSON.stringify(req);
    if(cache.has(key)){hits++; return cache.get(key);} misses++;
    cache.set(key,{path:req.path,computedAt:Date.now()}); return cache.get(key); }
  for (var i=0;i<100;i++) memoize({path:'/item/'+(i%10),params:{},timestamp:Date.now()+i});
  console.log('size',cache.size,'hits',hits,'misses',misses);"
  ```
  Tested: prints `size 100 hits 0 misses 100`, confirming 0% hit rate
  and unbounded growth on the buggy excerpt.
- Telemetry signal: `cache_entries` rises strictly monotonically (500,
  750, 1000, ... 5250) and `rss_mb` rises in lockstep (120, 128, 136,
  ... 272) while `req_rate_per_s` stays flat at 42 — this is the
  confirming signal. `gc_pause_ms` is a bounded sawtooth (4, 10, 16,
  22, 28, repeating) that never exceeds 28 and never causes sustained
  growth — it is normal periodic GC pause behavior and is a decoy; a
  write-up that blames `gc_pause_ms` for the leak must fail obj-3.
- Judge-script for fix.js:
  ```
  node -e "
  const {makeCache, memoizedHandler} = require('./fix.js');
  const c = makeCache();
  for (let i=0;i<100;i++) memoizedHandler(c, {path:'/item/'+i, params:{}, timestamp:Date.now()+i});
  console.log('bound', c.size());
  const c2 = makeCache();
  const a = memoizedHandler(c2, {path:'/foo', params:{id:1}, timestamp:1000});
  const before = c2.size();
  const b = memoizedHandler(c2, {path:'/foo', params:{id:1}, timestamp:2000});
  console.log('hit-size', c2.size(), 'same-value', a.computedAt === b.computedAt);
  "
  ```
  (Adjust the required export names to whatever the submission
  provides -- the judge should adapt the harness to the module's
  actual exports rather than requiring these exact names, as long as
  the two self-test behaviors described in the deliverables are
  independently exercisable.) Author reference: `bound` <= 50 (a
  concrete cap of 50 was used); `hit-size` stays at 1 and
  `same-value` is `true`.
  - PASS phrasings for obj-1 (2-3 examples): "the cache key is built
    from JSON.stringify(req) which includes `timestamp`, so no two
    requests ever produce the same key"; "every request has a unique
    timestamp baked into the key, giving an effective 0% hit rate".
  - FAIL phrasings for obj-1 (2-3 examples): "the gc_pause_ms sawtooth
    shows a memory leak" (blames the decoy); "just add more memory to
    the service"; "there's a memory leak somewhere in the cache".
  - PASS phrasings for obj-2 (2-3 examples): "evictIfNeeded is only
    called from the cache-hit branch, and since hits never happen,
    eviction code is dead"; "the eviction check never runs because
    it's gated behind a hit that this key scheme makes impossible".
  - FAIL phrasings for obj-2 (2-3 examples): "eviction is just
    missing from the code" (misses that it exists but is unreachable);
    "just add an eviction call" without noting the existing one is
    gated behind an unreachable hit; a write-up that only discusses the
    key issue and never mentions eviction placement at all.
- Telemetry inference: reward reasoning that explicitly rules out the
  GC sawtooth as the cause (not just ignoring it) and ties the flat
  request rate to the conclusion that load isn't increasing — only the
  cache is.
- Fix completeness: the two-part diagnosis demands a two-part fix —
  reward solutions that both drop the volatile field from the key AND
  add size-bounded eviction that fires independent of hit/miss status;
  penalize a fix that only does one of the two (e.g. removes timestamp
  from the key but still gates eviction on hits, which would merely
  raise the bound rather than fixing it structurally).
- Reasoning quality: does DIAGNOSIS.md walk from telemetry observation
  to code-level cause explicitly, rather than asserting the conclusion
  without connecting it back to the log fields?
