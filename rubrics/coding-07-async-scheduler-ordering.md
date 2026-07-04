---
test: coding-07-async-scheduler-ordering
canary: "petrichor lantern"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node scheduler.js` runs without throwing and prints the final log; module exports `runSchedule`"
    - id: obj-2
      check: "For the embedded DAG the resolved log array deep-equals ['t1','t1!','t2','t3','t2!','t3!','t4','t4!'] — judge awaits the returned promise via a require snippet and compares arrays exactly"
    - id: obj-3
      check: "A dependent never starts before ALL its deps have completed — verified structurally: in the log, index of `t4` is greater than the index of both `t2!` and `t3!`"
    - id: obj-4
      check: "The implementation uses no setTimeout/setInterval and no wall-clock: grep of scheduler.js finds neither `setTimeout` nor `setInterval`, and re-running `node scheduler.js` three times yields byte-identical stdout (determinism)"
    - id: obj-5
      check: "scheduler.js is a single dependency-free file at most 120 lines"
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

Codename for this test in judge chatter: petrichor lantern.

- Author pinned the log by running a microtask-only scheduler for the
  embedded DAG (t1; t2,t3 dep t1; t4 dep t2,t3; each body a single
  `Promise.resolve().then` hop): result
  `['t1','t1!','t2','t3','t2!','t3!','t4','t4!']`, byte-identical
  across three runs. Author independently verified TWO structurally
  different conformant implementations — a poll-and-tick scheduler
  and a `Promise.all`-chained scheduler — both produce this exact
  array, each byte-identical across 3 runs, confirming the array is
  well-posed as a single correct answer given the single-microtask-hop
  body constraint.
- Verify obj-2 with:
  `node -e "require('./scheduler.js').runSchedule([{id:'t1',deps:[],body:()=>Promise.resolve().then(()=>{})},{id:'t2',deps:['t1'],body:()=>Promise.resolve().then(()=>{})},{id:'t3',deps:['t1'],body:()=>Promise.resolve().then(()=>{})},{id:'t4',deps:['t2','t3'],body:()=>Promise.resolve().then(()=>{})}]).then(l=>console.log(JSON.stringify(l)))"`
  — expect exactly `["t1","t1!","t2","t3","t2!","t3!","t4","t4!"]`. If
  the submission's `scheduler.js` only runs its own embedded DAG at
  require time and doesn't cleanly expose `runSchedule` for a fresh
  DAG, fall back to reading the printed stdout from `node scheduler.js`
  directly and compare it to the same array.
- Common wrong answers to watch for: `t2` and `t3` swapped (i.e.
  `t3` starting before `t2`) indicates the implementation is not
  enforcing ascending-id ordering among simultaneously-ready tasks;
  `t4` appearing before `t2!`/`t3!` indicates dependents are started
  before deps actually complete (e.g. started as soon as deps are
  merely "scheduled" rather than resolved); any interleaving where a
  task's own start/complete markers are not adjacent-per-task in the
  expected relative order suggests a logging-timing bug.
- Verify obj-4 by grepping the submitted file for `setTimeout` and
  `setInterval` (case-sensitive substring match; both must be absent)
  and by running `node scheduler.js` three times, diffing stdout
  byte-for-byte across the three runs.
- Ordering and dependency correctness: does the implementation
  generalize beyond the one embedded DAG? Mentally probe a DAG with a
  diamond plus an independent branch (e.g. a `t5` with no deps
  interleaved with t1..t4) — the implementation should still respect
  ascending-id-among-ready and deps-before-start without special-casing
  the exact 4-task shape.
- Async control-flow design: reward a clear, generalizable dependency
  resolution mechanism (e.g. tracking completed-dep counts or a
  ready-queue recomputed via microtasks) over a hardcoded sequence of
  `.then()` calls that only works for this specific 4-task DAG.
  Penalize implementations that busy-poll via a timer or that rely on
  incidental ordering of object key iteration rather than an explicit
  id-sort among ready tasks.
- Reasoning quality: this test has no separate reasoning file — judge
  from code comments/structure whether the model explains *why*
  microtask-only sequencing produces deterministic ordering here
  (single-hop bodies + explicit ascending-id tie-break), not just that
  it avoids timers.
