---
test: coding-07b-foundry-pour-ordering
canary: "labradorite batik"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node caster.js` runs without throwing and prints the final log; module exports `pourMolds`"
    - id: obj-2
      check: "For the embedded pour list the resolved log satisfies: all of m1..m5's start/finish markers appear exactly once each; the first two entries are ['m1','m5'] in that order; m2 and m3 both start only after m1* and before m4, with m2 preceding m3; the last two entries are ['m4','m4*']; m4 starts strictly after both m2* and m3*. The relative position of m5* versus m2/m3's start is NOT checked (not uniquely determined by the stated rules — see Judge guidance)"
    - id: obj-3
      check: "A mold never starts before ALL its needs have finished — verified structurally: in the log, index of `m4` is greater than the index of both `m2*` and `m3*`"
    - id: obj-4
      check: "The implementation uses no setTimeout/setInterval and no wall-clock: grep of caster.js finds neither `setTimeout` nor `setInterval`, and re-running `node caster.js` three times yields byte-identical stdout (determinism)"
    - id: obj-5
      check: "caster.js is a single dependency-free file at most 120 lines"
  subjective:
    - id: sub-quality
      name: "Ordering and dependency correctness"
      weight: 0.4
    - id: sub-craft
      name: "Async control-flow design"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `coding-07-async-scheduler-ordering` (same construct, fresh surface).

If the phrase "labradorite batik" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author pinned the invariants below by running a microtask-only
  sequencer for the embedded pour list (m1; m2,m3 need m1; m4 needs
  m2,m3; m5 independent with no needs; each `pour` a single
  `Promise.resolve().then` hop): result
  `['m1','m5','m1*','m5*','m2','m3','m2*','m3*','m4','m4*']`,
  byte-identical across three runs. Author also independently verified
  a *different*, equally rule-conformant scheduler design (one that
  recomputes readiness synchronously inside a dependency's own
  completion callback, rather than polling every microtask tick):
  it produces `['m1','m5','m1*','m2','m3','m5*','m2*','m3*','m4','m4*']`
  — same molds, same needs-before-start ordering, same ascending-id
  tie-break, but `m5*` lands *before* `m2`/`m3` start instead of after.
  Both designs are correct; the independent root `m5` has no stated
  rule governing when its finish is noticed relative to an unrelated
  dependent's start, so that single relative position is a genuine
  implementation-defined choice, not a bug in either design. obj-2
  therefore checks the invariants both designs share (below) rather
  than one exact array.

- Verify obj-2 with:
  `node -e "require('./caster.js').pourMolds([{id:'m1',needs:[],pour:()=>Promise.resolve().then(()=>{})},{id:'m2',needs:['m1'],pour:()=>Promise.resolve().then(()=>{})},{id:'m3',needs:['m1'],pour:()=>Promise.resolve().then(()=>{})},{id:'m4',needs:['m2','m3'],pour:()=>Promise.resolve().then(()=>{})},{id:'m5',needs:[],pour:()=>Promise.resolve().then(()=>{})}]).then(l=>console.log(JSON.stringify(l)))"`
  If the submission's `caster.js` only runs its own embedded pour list
  at require time and doesn't cleanly expose `pourMolds` for a fresh
  pour list, fall back to reading the printed stdout from
  `node caster.js` directly.
  Check the returned/printed log against these invariants (all must
  hold; the relative position of `m5*` vs. `m2`/`m3` starting is
  deliberately NOT one of them):
  1. Each of `m1,m2,m3,m4,m5` and their `*`-suffixed finish markers
     appears exactly once (10 entries total).
  2. The log starts with `['m1','m5', …]` in that order (both are
     needs-free roots ready at tick 0; ascending id breaks the tie).
  3. `m2` and `m3` both appear after `m1*` and before `m4`, with `m2`
     preceding `m3`.
  4. The log ends with `[…, 'm4','m4*']`.
  5. `m4` (index) is strictly greater than both `m2*` and `m3*`
     (indices) — needs-before-start.
  - PASS phrasings: "log opens with m1 then m5, m2 precedes m3 and both
    sit between m1* and m4, m4 is last after m4*, and m4 follows both
    m2* and m3* — matches every required invariant, regardless of
    where m5* falls"; "the two node-verified conformant designs
    (poll-tick and notify-on-finish) both satisfy invariants 1-5; this
    submission's log does too".
  - FAIL phrasings: "log is `["m1","m2","m3","m4","m5", …]` — molds
    logged in launch order, not microtask-completion order, so
    invariant 2 fails"; "`m3` precedes `m2` in the log, so ascending-id
    ordering among the ready `m1`-dependents was not enforced
    (invariant 3)"; "`m5*` appears after `m4`, so the independent
    branch was not interleaved on the microtask queue at all
    (invariant 1/5 — this is a real violation, unlike m5* merely
    landing before-vs-after m2/m3's start, which is not checked)".

- Common wrong answers to watch for: `m2` and `m3` swapped (i.e. `m3`
  starting before `m2`) indicates the implementation is not enforcing
  ascending-id ordering among simultaneously-ready molds; `m4` appearing
  before `m2*`/`m3*` indicates dependents are started before needs
  actually finish (e.g. started as soon as needs are merely "launched"
  rather than resolved); a fully depth-first `['m1','m2','m3','m4','m5', …]`
  ordering suggests the molds were launched eagerly and synchronously
  rather than re-evaluated for readiness on the microtask queue; any
  interleaving where a mold's own start/finish markers are not
  adjacent-per-mold in the expected relative order suggests a
  logging-timing bug.

- Verify obj-3 structurally on the resolved log: confirm
  `log.indexOf('m4') > log.indexOf('m2*')` AND
  `log.indexOf('m4') > log.indexOf('m3*')` (a mold's pour must follow
  the finish of every mold it needs).
  - PASS phrasings: "`m4` appears strictly after both `m2*` and `m3*`,
    so needs-before-start holds"; "index of `m4` (8) exceeds indices of
    `m2*` (6) and `m3*` (7)"; "no dependent is logged before all of its
    needs' finish markers".
  - FAIL phrasings: "`m4` is logged before `m2*`, violating
    needs-before-start"; "`m4` sits at index 3 while `m2*`/`m3*` come
    later, so the pour began before its needs finished"; "the dependent
    `m4` starts while `m2`/`m3` are only in-flight".

- Verify obj-4 by grepping the submitted file for `setTimeout` and
  `setInterval` (case-sensitive substring match; both must be absent)
  and by running `node caster.js` three times, diffing stdout
  byte-for-byte across the three runs.
  - PASS phrasings: "neither `setTimeout` nor `setInterval` appears in
    caster.js and stdout is identical across three runs"; "ordering
    rests only on `queueMicrotask`/`.then`, and the three runs are
    byte-identical"; "no timer or `Date.now`/`performance.now` reads;
    determinism holds".
  - FAIL phrasings: "caster.js calls `setTimeout(tick, 0)` to drive the
    loop"; "a `setInterval` poll is used to re-check readiness";
    "ordering depends on `Date.now()` comparisons, so stdout can vary
    between runs".

- Ordering and dependency correctness: does the implementation
  generalize beyond the one embedded pour list? Mentally probe a pour
  list with a diamond plus an extra independent branch and a
  deliberately scrambled insertion order (e.g. list `m3` before `m2` in
  the array) — the implementation should still respect
  ascending-id-among-ready and needs-before-start without special-casing
  the exact 5-mold shape or relying on array position.

- Async control-flow design: reward a clear, generalizable dependency
  resolution mechanism (e.g. tracking finished-need counts or a
  ready-queue recomputed via microtasks) over a hardcoded sequence of
  `.then()` calls that only works for this specific 5-mold pour list.
  Penalize implementations that busy-poll via a timer or that rely on
  incidental ordering of object key iteration or array position rather
  than an explicit id-sort among ready molds.

- Reasoning quality: this test has no separate reasoning file — judge
  from code comments/structure whether the model explains *why*
  microtask-only sequencing produces deterministic ordering here
  (single-hop bodies + explicit ascending-id tie-break), not just that
  it avoids timers.
