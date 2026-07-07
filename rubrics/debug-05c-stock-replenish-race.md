---
test: debug-05c-stock-replenish-race
canary: "chimera pawpaw"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs without throwing and its self-test block prints a PASS line showing the final stock is exactly 64 after four concurrent replenishments of 6 onto a start of 40"
    - id: obj-2
      check: "Judge independently requires fixed.js and runs four concurrent Promise.all replenishments of 6 onto a fresh counter starting at 40; the resulting stock is exactly 64 (the embedded buggy version yields 46)"
    - id: obj-3
      check: "Judge runs a second probe of six concurrent replenishments of 8 onto a start of 300; the result is exactly 348, confirming the fix serializes rather than coincidentally passing the four-replenishment case (the embedded buggy version yields 308 here, last-write-wins)"
    - id: obj-4
      check: "RACE.md names the read-modify-write interleaving (all replenishments read the stock across the await gap before any write completes) as the root cause, not merely 'a timing issue' or 'add async/await'"
    - id: obj-5
      check: "fixed.js is at most 90 lines, plain JavaScript, no dependencies, and preserves the counter's async read/write interface (read/write remain async functions that each internally await, and run's Promise.all launch is unchanged)"
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
---

## Judge guidance

Parallel form of `debug-05-lost-update-async` (same construct, fresh surface).

If the phrase "chimera pawpaw" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Reference values, independently recomputed under node with the pinned
  `setTimeout(0)` tick: on the embedded buggy code, `run(40, 6, 4)`
  deterministically yields 46 (all four replenishments read stock 40
  before any write lands; the last write wins) and `run(300, 8, 6)`
  yields 308 (same last-write-wins pattern). A promise-chain mutex that
  serializes `replenish` per-counter yields exactly 64 and 348
  respectively — verified by running the harness under node.
- Judge-script (run twice, once to confirm the buggy baseline if
  needed, once against the submission):
  ```
  node -e "(async()=>{const m=require('./fixed.js');console.log(await m.run(40,6,4));console.log(await m.run(300,8,6));})()"
  ```
  Tested: buggy embedded code -> `46` then `308`. Correct fix -> `64`
  then `348`. Any submission printing anything other than `64` then
  `348` fails obj-2/obj-3.
- The trap: a fix that merely deletes the internal `await tick()` inside
  `replenish` (collapsing the read-modify-write into one microtask turn)
  can pass the four-replenishment case by accident under some
  schedulings but still races once `read`/`write` genuinely yield — it
  must fail the second probe (six replenishments of 8 onto 300) or be
  penalized under Serialization discipline if it also strips the
  counter's genuine internal awaits (which obj-5 blocks outright).
  Legitimate fixes: a promise-chain mutex/queue per counter, an
  async-lock wrapper around the read-modify-write, or a single
  serialized "apply" queue that counter operations funnel through.
- Race diagnosis depth: does RACE.md show the actual interleaving (four
  `read()` calls all resolving to 40 before any `write()` lands), or
  does it just assert "a race condition" without the mechanism? Reward
  write-ups that name the await gap between the read and the write as
  the exploitable window.
  - PASS phrasings (2-3 examples to compare against): "all four
    replenishments' `read()` resolve to 40 before any `write()`
    completes, so each computes 46 and the last write clobbers the
    rest"; "the await between reading stock and writing it back lets
    every concurrent replenishment observe the same stale value";
    "reads and writes interleave across the tick boundary so writes
    overwrite each other instead of accumulating".
  - FAIL phrasings (2-3 examples): "there's a race condition somewhere
    in the async code"; "the counter just needs more awaits to be
    safe"; "the setTimeout(0) tick is too fast so updates collide".
- Serialization discipline: reward a minimal, general serialization
  mechanism (queue/mutex) that works for arbitrary n and arbitrary
  quantities, over ad-hoc fixes that hardcode the four- or
  six-replenishment case. Penalize approaches that fake serialization
  by awaiting sequentially in the driver instead of fixing
  `replenish`/the counter (that would violate the "Promise.all launch
  is unchanged" constraint in obj-5).
- Reasoning quality: does RACE.md explain why the fix generalizes
  (works for the second probe, not just the first), rather than only
  describing the four-replenishment case?
