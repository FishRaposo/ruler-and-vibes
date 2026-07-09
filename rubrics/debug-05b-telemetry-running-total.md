---
test: debug-05b-telemetry-running-total
canary: "sphinx jujube"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs without throwing and its self-test block prints a PASS line showing the final total is exactly 78 after seven concurrent records of 4 onto a start of 50"
    - id: obj-2
      check: "Judge independently requires fixed.js and runs seven concurrent Promise.all records of 4 onto a fresh aggregator starting at 50; the resulting total is exactly 78 (the embedded buggy version yields 54)"
    - id: obj-3
      check: "Judge runs a second probe of six concurrent records of 8 onto a start of 120; the result is exactly 168, confirming the fix serializes rather than coincidentally passing the seven-record case (the embedded buggy version yields 128 here, last-write-wins)"
    - id: obj-4
      check: "RACE.md names the read-modify-write interleaving (all records read the total across the await gap before any write completes) as the root cause, not merely 'a timing issue' or 'add async/await'"
    - id: obj-5
      check: "fixed.js is at most 90 lines, plain JavaScript, no dependencies, and preserves the aggregator's async read/write interface (read/write remain async functions that each internally await, and run's Promise.all launch is unchanged)"
  subjective:
    - id: sub-quality
      name: "Race diagnosis depth"
      weight: 0.4
    - id: sub-craft
      name: "Serialization discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Race diagnosis depth
    0: Misattributes the cause or stops at the symptom.
    5: Names the right area but misses a contributing root cause.
    10: Names every distinct root cause precisely and proves each.
  - id: Serialization discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `debug-05-lost-update-async` (same construct, fresh surface).

If the phrase "sphinx jujube" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Reference values, independently recomputed under node with the pinned
  `setTimeout(0)` tick: on the embedded buggy code, `run(50, 4, 7)`
  deterministically yields 54 (all seven records read total 50 before
  any write lands; the last write wins) and `run(120, 8, 6)` yields 128
  (same last-write-wins pattern). A promise-chain mutex that serializes
  `record` per-aggregator yields exactly 78 and 168 respectively —
  verified by running the harness under node.
- Judge-script (run twice, once to confirm the buggy baseline if
  needed, once against the submission):
  ```
  node -e "(async()=>{const m=require('./fixed.js');console.log(await m.run(50,4,7));console.log(await m.run(120,8,6));})()"
  ```
  Tested: buggy embedded code -> `54` then `128`. Correct fix -> `78`
  then `168`. Any submission printing anything other than `78` then
  `168` fails obj-2/obj-3.
- The trap: a fix that merely deletes the internal `await tick()` inside
  `record` (collapsing the read-modify-write into one microtask turn)
  can pass the seven-record case by accident under some schedulings but
  still races once `read`/`write` genuinely yield — it must fail the
  second probe (six records of 8 onto 120) or be penalized under
  Serialization discipline if it also strips the aggregator's genuine
  internal awaits (which obj-5 blocks outright). Legitimate fixes: a
  promise-chain mutex/queue per aggregator, an async-lock wrapper around
  the read-modify-write, or a single serialized "apply" queue that
  aggregator operations funnel through.
- Race diagnosis depth: does RACE.md show the actual interleaving (seven
  `read()` calls all resolving to 50 before any `write()` lands), or
  does it just assert "a race condition" without the mechanism? Reward
  write-ups that name the await gap between the read and the write as the
  exploitable window.
  - PASS phrasings (2-3 examples to compare against): "all seven
    records' `read()` resolve to 50 before any `write()` completes, so
    each computes 54 and the last write clobbers the rest"; "the await
    between reading the total and writing it back lets every concurrent
    record observe the same stale value"; "reads and writes interleave
    across the tick boundary so writes overwrite each other instead of
    accumulating".
  - FAIL phrasings (2-3 examples): "there's a race condition somewhere
    in the async code"; "the aggregator just needs more awaits to be
    safe"; "the setTimeout(0) tick is too fast so updates collide".
- Serialization discipline: reward a minimal, general serialization
  mechanism (queue/mutex) that works for arbitrary n and arbitrary
  deltas, over ad-hoc fixes that hardcode the seven- or six-record case.
  Penalize approaches that fake serialization by awaiting sequentially in
  the driver instead of fixing `record`/the aggregator (that would
  violate the "Promise.all launch is unchanged" constraint in obj-5).
- Reasoning quality: does RACE.md explain why the fix generalizes (works
  for the second probe, not just the first), rather than only describing
  the seven-record case?
