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
      check: "For the embedded pour list the resolved log array deep-equals ['m1','m5','m1*','m5*','m2','m3','m2*','m3*','m4','m4*'] — judge awaits the returned promise via a require snippet and compares arrays exactly"
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

- Author pinned the log by running a microtask-only sequencer for the
  embedded pour list (m1; m2,m3 need m1; m4 needs m2,m3; m5 independent
  with no needs; each `pour` a single `Promise.resolve().then` hop):
  result `['m1','m5','m1*','m5*','m2','m3','m2*','m3*','m4','m4*']`,
  byte-identical across three runs. Author independently verified TWO
  structurally different conformant implementations — a poll-and-tick
  sequencer and a `Promise.all`-chained sequencer — both produce this
  exact array, each byte-identical across 3 runs, confirming the array
  is well-posed as a single correct answer given the single-microtask-hop
  `pour` constraint. Note the independent mold `m5` (no needs) starts in
  the very first ready batch alongside `m1` and, because both bodies are
  single-hop, `m5` finishes before the `m1`-dependents `m2`/`m3` begin —
  hence the leading `['m1','m5','m1*','m5*', …]`.

- Verify obj-2 with:
  `node -e "require('./caster.js').pourMolds([{id:'m1',needs:[],pour:()=>Promise.resolve().then(()=>{})},{id:'m2',needs:['m1'],pour:()=>Promise.resolve().then(()=>{})},{id:'m3',needs:['m1'],pour:()=>Promise.resolve().then(()=>{})},{id:'m4',needs:['m2','m3'],pour:()=>Promise.resolve().then(()=>{})},{id:'m5',needs:[],pour:()=>Promise.resolve().then(()=>{})}]).then(l=>console.log(JSON.stringify(l)))"`
  — expect exactly `["m1","m5","m1*","m5*","m2","m3","m2*","m3*","m4","m4*"]`.
  If the submission's `caster.js` only runs its own embedded pour list
  at require time and doesn't cleanly expose `pourMolds` for a fresh
  pour list, fall back to reading the printed stdout from
  `node caster.js` directly and compare it to the same array.
  - PASS phrasings: "resolved log deep-equals the expected 10-element
    array exactly"; "log matches `["m1","m5","m1*","m5*","m2","m3","m2*","m3*","m4","m4*"]` element for element";
    "array equality holds including the leading `m1,m5` pair and the
    trailing `m4,m4*`".
  - FAIL phrasings: "log is `["m1","m2","m3","m4","m5", …]` — molds
    logged in launch order, not microtask-completion order"; "`m3`
    precedes `m2` in the log, so ascending-id ordering among the ready
    `m1`-dependents was not enforced"; "`m5*` is missing or appears
    after `m4`, so the independent branch was not interleaved on the
    microtask queue".

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
