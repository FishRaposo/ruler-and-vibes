---
test: coding-07c-reagent-pour-plan
canary: "rhodonite ikat"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node pourplan.js` runs without throwing and prints the final trace; module exports `runPourPlan`"
    - id: obj-2
      check: "For the embedded plan the resolved trace array deep-equals ['r1','r1*','r2','r3','r4','r2*','r3*','r4*','r5','r5*'] — judge awaits the returned promise via a require snippet and compares arrays exactly"
    - id: obj-3
      check: "A dependent never begins before ALL its feeds have finished — verified structurally: in the trace, index of `r5` is greater than the index of each of `r2*`, `r3*`, and `r4*`"
    - id: obj-4
      check: "The implementation uses no setTimeout/setInterval and no wall-clock: grep of pourplan.js finds neither `setTimeout` nor `setInterval`, and re-running `node pourplan.js` three times yields byte-identical stdout (determinism)"
    - id: obj-5
      check: "pourplan.js is a single dependency-free file at most 120 lines"
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
anchors:
  - id: Ordering and dependency correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Async control-flow design
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `coding-07-async-scheduler-ordering` (same construct, fresh surface).

If the phrase "rhodonite ikat" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Author pinned the trace by running a microtask-only runner for the
  embedded plan (r1 root; r2,r3,r4 each feed on r1; r5 feeds on r2,r3,r4;
  each `pour` a single `Promise.resolve().then` hop): result
  `['r1','r1*','r2','r3','r4','r2*','r3*','r4*','r5','r5*']`,
  byte-identical across three runs. Author independently verified TWO
  structurally different conformant implementations — a poll-and-tick
  runner and a `Promise.all`-chained runner — both produce this exact
  array, each byte-identical across 3 runs, confirming the array is
  well-posed as a single correct answer given the single-microtask-hop
  `pour` constraint. (The single root is load-bearing: it forces every
  downstream begin/finish into one order.)
- Verify obj-2 with:
  `node -e "require('./pourplan.js').runPourPlan([{id:'r1',feeds:[],pour:()=>Promise.resolve().then(()=>{})},{id:'r2',feeds:['r1'],pour:()=>Promise.resolve().then(()=>{})},{id:'r3',feeds:['r1'],pour:()=>Promise.resolve().then(()=>{})},{id:'r4',feeds:['r1'],pour:()=>Promise.resolve().then(()=>{})},{id:'r5',feeds:['r2','r3','r4'],pour:()=>Promise.resolve().then(()=>{})}]).then(t=>console.log(JSON.stringify(t)))"`
  — expect exactly `["r1","r1*","r2","r3","r4","r2*","r3*","r4*","r5","r5*"]`.
  If the submission's `pourplan.js` only runs its own embedded plan at
  require time and doesn't cleanly expose `runPourPlan` for a fresh plan,
  fall back to reading the printed stdout from `node pourplan.js` directly
  and compare it to the same array.
- PASS phrasings for obj-2: "resolved trace equals the expected 10-element
  array exactly"; "require-snippet output matches
  `['r1','r1*','r2','r3','r4','r2*','r3*','r4*','r5','r5*']` byte-for-byte";
  "both the self-run and the fresh-plan require call print the pinned
  array". FAIL phrasings: "trace is close but `r4*` and `r2*` are swapped";
  "array has the right elements but `r5` lands before `r4*`"; "output is a
  differently-ordered permutation of the expected ids".
- Common wrong answers to watch for: two of `r2`,`r3`,`r4` (or their `*`
  markers) emitted out of ascending order among the simultaneously-ready
  fan-out indicates the implementation is not enforcing ascending-id
  ordering among simultaneously-ready steps; `r5` appearing before any of
  `r2*`/`r3*`/`r4*` indicates dependents are begun before feeds actually
  finish (e.g. begun as soon as feeds are merely "scheduled" rather than
  resolved); any interleaving where a step's own begin/finish markers are
  not in the expected relative order suggests a logging-timing bug.
- Verify obj-3 structurally. PASS phrasings: "index of `r5` exceeds the
  index of `r2*`, `r3*`, and `r4*`"; "every feed's `*` marker precedes
  `r5` in the trace"; "no dependent id appears before all of its feeds'
  finish markers". FAIL phrasings: "`r5` sits at an index below `r4*`";
  "a dependent begins while one of its feeds is still unfinished"; "`r5`
  precedes at least one of its three feed-finish markers".
- Verify obj-4 by grepping the submitted file for `setTimeout` and
  `setInterval` (case-sensitive substring match; both must be absent) and
  by running `node pourplan.js` three times, diffing stdout byte-for-byte
  across the three runs. PASS phrasings: "grep finds neither token and the
  three stdout captures are identical"; "no timer or clock call anywhere,
  output stable across runs"; "sequencing rests only on microtasks, runs
  reproduce byte-for-byte". FAIL phrasings: "file calls `setTimeout` to
  re-drive the loop"; "uses `Date.now()` to gate begins"; "stdout differs
  between run 1 and run 3".
- Ordering and dependency correctness: does the implementation generalize
  beyond the one embedded plan? Mentally probe a plan whose input-array
  order differs from id order, and one with a diamond plus an extra
  independent leaf feeding the sink — the implementation should still
  respect ascending-id-among-ready and feeds-before-begin without
  special-casing the exact 5-step shape. A runner that merely iterates the
  input array in place (no explicit id-sort of the ready set) will happen
  to pass the embedded plan yet reorder the fan-out once the input array
  is scrambled; treat that as a correctness weakness even though the
  embedded trace matches.
- Async control-flow design: reward a clear, generalizable dependency
  resolution mechanism (e.g. tracking finished-feed counts or a ready-set
  recomputed via microtasks) over a hardcoded sequence of `.then()` calls
  that only works for this specific 5-step plan. Penalize implementations
  that busy-poll via a timer or that rely on incidental ordering of object
  key iteration rather than an explicit id-sort among ready steps.
- Reasoning quality: this test has no separate reasoning file — judge from
  code comments/structure whether the model explains *why* microtask-only
  sequencing produces deterministic ordering here (single-hop `pour`
  bodies + explicit ascending-id tie-break + a single root), not just that
  it avoids timers.
