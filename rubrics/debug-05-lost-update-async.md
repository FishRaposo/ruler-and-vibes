---
test: debug-05-lost-update-async
canary: "kelpwood tarn"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs without throwing and its self-test block prints a PASS line showing the final balance is exactly 150 after five concurrent deposits of 10 onto a start of 100"
    - id: obj-2
      check: "Judge independently requires fixed.js and runs five concurrent Promise.all deposits of 10 onto a fresh store starting at 100; the resulting balance is exactly 150 (the embedded buggy version yields 110)"
    - id: obj-3
      check: "Judge runs a second probe of ten concurrent deposits of 5 onto a start of 200; the result is exactly 250, confirming the fix serializes rather than coincidentally passing the five-deposit case (the embedded buggy version yields 205 here, last-write-wins)"
    - id: obj-4
      check: "RACE.md names the read-modify-write interleaving (all deposits read the balance across the await gap before any write completes) as the root cause, not merely 'a timing issue' or 'add async/await'"
    - id: obj-5
      check: "fixed.js is at most 90 lines, plain JavaScript, no dependencies, and preserves the store's async get/set interface (get/set remain async functions that each internally await, and run's Promise.all launch is unchanged)"
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

Codename for this test in judge chatter: kelpwood tarn.

- Reference values, independently recomputed under node with the
  pinned `setTimeout(0)` tick: on the embedded buggy code, `run(100,
  10, 5)` deterministically yields 110 (all five deposits read balance
  100 before any write lands; the last write wins) and `run(200, 5,
  10)` yields 205 (same last-write-wins pattern). A promise-chain
  mutex that serializes `deposit` per-store yields exactly 150 and 250
  respectively — verified by running the harness under node.
- Judge-script (run twice, once to confirm the buggy baseline if
  needed, once against the submission):
  ```
  node -e "(async()=>{const m=require('./fixed.js');console.log(await m.run(100,10,5));console.log(await m.run(200,5,10));})()"
  ```
  Tested: buggy embedded code -> `110` then `205`. Correct fix -> `150`
  then `250`. Any submission printing anything other than `150` then
  `250` fails obj-2/obj-3.
- The trap: a fix that merely deletes the internal `await tick()`
  inside `deposit` (collapsing the read-modify-write into one
  microtask turn) can pass the five-deposit case by accident under
  some schedulings but still races once `get`/`set` genuinely yield —
  it must fail the second probe (ten deposits of 5 onto 200) or be
  penalized under Serialization discipline if it also strips the
  store's genuine internal awaits (which obj-5 blocks outright).
  Legitimate fixes: a promise-chain mutex/queue per store, an
  async-lock wrapper around the read-modify-write, or a single
  serialized "apply" queue that store operations funnel through.
- Race diagnosis depth: does RACE.md show the actual interleaving (five
  `get()` calls all resolving to 100 before any `set()` lands), or does
  it just assert "a race condition" without the mechanism? Reward
  write-ups that name the await gap between the read and the write as
  the exploitable window.
  - PASS phrasings (2-3 examples to compare against): "all five
    deposits' `get()` resolve to 100 before any `set()` completes, so
    each computes 110 and the last write clobbers the rest"; "the
    await between reading balance and writing it back lets every
    concurrent deposit observe the same stale value"; "reads and
    writes interleave across the tick boundary so writes overwrite
    each other instead of accumulating".
  - FAIL phrasings (2-3 examples): "there's a race condition
    somewhere in the async code"; "the store just needs more awaits to
    be safe"; "the setTimeout(0) tick is too fast so updates collide".
- Serialization discipline: reward a minimal, general serialization
  mechanism (queue/mutex) that works for arbitrary n and arbitrary
  amounts, over ad-hoc fixes that hardcode the five- or ten-deposit
  case. Penalize approaches that fake serialization by awaiting
  sequentially in the driver instead of fixing `deposit`/the store
  (that would violate the "Promise.all launch is unchanged"
  constraint in obj-5).
- Reasoning quality: does RACE.md explain why the fix generalizes
  (works for the second probe, not just the first), rather than only
  describing the five-deposit case?
