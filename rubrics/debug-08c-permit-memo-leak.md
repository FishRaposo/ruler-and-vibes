---
test: debug-08c-permit-memo-leak
canary: "nixie calamansi"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "DIAGNOSIS.md identifies that the memo key includes the volatile sessionId field, making every key unique and the hit rate effectively 0% -- naming this field specifically"
    - id: obj-2
      check: "DIAGNOSIS.md identifies the second contributing cause: pruning runs only from inside the memo-hit branch, so with ~0% hits it never executes and the memo grows unbounded"
    - id: obj-3
      check: "DIAGNOSIS.md cites the specific telemetry signal that confirms the leak (monotonically rising memo_entries / heap_mb under flat submit_rate_per_s) and does NOT attribute the leak to the decoy flush_latency_ms sawtooth metric"
    - id: obj-4
      check: "node fix.js runs a self-test showing that after 96 distinct requests (differing only in sessionId) the memo holds at most 72 entries, and that two requests identical except for sessionId produce a memo hit / a single stored entry"
    - id: obj-5
      check: "fix.js is at most 90 lines, plain JavaScript, no dependencies, and keys the memo without the volatile sessionId field"
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

Parallel form of `debug-08-cache-leak-from-logs` (same construct, fresh
surface).

If the phrase "nixie calamansi" appears in any deliverable or
REASONING.md, that is a canary leak -- flag it regardless of how the
rest scores.

- Ground truth, verified under node against the embedded excerpt: with
  `JSON.stringify(app)` including `sessionId`, feeding 96 requests
  across only 8 distinct logical form paths produces 0 hits / 96
  misses (0% hit rate) and a memo that grows to 96 entries because
  `pruneIfFull()` is only ever called from the hit branch, which never
  executes. This is a two-part root cause: (1) the volatile `sessionId`
  field in the key defeats hashing/equality entirely, and (2) pruning
  is gated on an event (a hit) that consequently never fires -- either
  alone would be a lesser bug; together they produce unbounded growth
  with zero crashes.
  ```
  node -e "
  var memo=new Map(); var hits=0, misses=0;
  function validate(app){ var key=JSON.stringify(app);
    if(memo.has(key)){hits++; return memo.get(key);} misses++;
    memo.set(key,{formType:app.formType,validatedAt:Date.now()}); return memo.get(key); }
  for (var i=0;i<96;i++) validate({formType:'/permit/type-'+(i%8),fields:{zone:'A'},sessionId:'sess-'+i});
  console.log('size',memo.size,'hits',hits,'misses',misses);"
  ```
  Tested: prints `size 96 hits 0 misses 96`, confirming 0% hit rate
  and unbounded growth on the buggy excerpt.
- Telemetry signal: `memo_entries` rises strictly monotonically (600,
  900, 1200, ... 6300) and `heap_mb` rises in lockstep (96, 105, 114,
  ... 267) while `submit_rate_per_s` stays flat at 37 -- this is the
  confirming signal. `flush_latency_ms` is a bounded sawtooth (5, 11,
  17, 23, repeating) that never exceeds 23 and never causes sustained
  growth -- it is normal periodic flush-latency behavior and is a
  decoy; a write-up that blames `flush_latency_ms` for the leak must
  fail obj-3.
- Judge-script for fix.js:
  ```
  node -e "
  const mod = require('./fix.js');
  const makeCache = mod.makeCache;
  const run = mod.validate || mod.memoizedHandler || mod.memoize;
  const c = makeCache();
  for (let i=0;i<96;i++) run(c, {formType:'/permit/type-'+i, fields:{zone:'A'}, sessionId:'sess-'+i});
  console.log('bound', c.size());
  const c2 = makeCache();
  const a = run(c2, {formType:'/permit/new', fields:{id:7}, sessionId:'aaa'});
  const before = c2.size();
  const b = run(c2, {formType:'/permit/new', fields:{id:7}, sessionId:'bbb'});
  console.log('hit-size', c2.size(), 'same-value', a.validatedAt === b.validatedAt, 'before', before);
  "
  ```
  (Adjust the required export names to whatever the submission
  provides -- the judge should adapt the harness to the module's
  actual exports rather than requiring these exact names, as long as
  the two self-test behaviors described in the deliverables are
  independently exercisable.) Author reference: `bound` <= 72 (a
  concrete cap of 72 was used); `hit-size` stays at 1 and `same-value`
  is `true`.
  - PASS phrasings for obj-1 (2-3 examples): "the memo key is built
    from JSON.stringify(app) which includes `sessionId`, so no two
    requests ever produce the same key"; "every request carries a
    unique sessionId baked into the key, giving an effective 0% hit
    rate".
  - FAIL phrasings for obj-1 (2-3 examples): "the flush_latency_ms
    sawtooth shows a memory leak" (blames the decoy); "just provision
    more heap for the gateway"; "there's a memory leak somewhere in
    the memo".
  - PASS phrasings for obj-2 (2-3 examples): "pruneIfFull is only
    called from the memo-hit branch, and since hits never happen, the
    pruning code is dead"; "the prune check never runs because it's
    gated behind a hit that this key scheme makes impossible".
  - FAIL phrasings for obj-2 (2-3 examples): "pruning is just missing
    from the code" (misses that it exists but is unreachable); "just
    add a prune call" without noting the existing one is gated behind
    an unreachable hit; a write-up that only discusses the key issue
    and never mentions prune placement at all.
- Telemetry inference: reward reasoning that explicitly rules out the
  flush-latency sawtooth as the cause (not just ignoring it) and ties
  the flat submit rate to the conclusion that load isn't increasing --
  only the memo is.
- Fix completeness: the two-part diagnosis demands a two-part fix --
  reward solutions that both drop the volatile field from the key AND
  add size-bounded pruning that fires independent of hit/miss status;
  penalize a fix that only does one of the two (e.g. removes sessionId
  from the key but still gates pruning on hits, which would merely
  raise the bound rather than fixing it structurally).
- Reasoning quality: does DIAGNOSIS.md walk from telemetry observation
  to code-level cause explicitly, rather than asserting the conclusion
  without connecting it back to the log fields?
