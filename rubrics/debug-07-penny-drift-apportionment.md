---
test: debug-07-penny-drift-apportionment
canary: "harbor thimble"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Judge runs fixed.js: allocate(100000,[1,1,1]) returns shares summing to exactly 100000 (author reference [33334,33333,33333])"
    - id: obj-2
      check: "allocate(10000,[3,3,3]) returns shares summing to exactly 10000 (reference [3334,3333,3333]) and allocate(100003,[1,1,1]) sums to exactly 100003 (reference [33335,33334,33334])"
    - id: obj-3
      check: "allocate(100000,[1,1,1,1,1,1,1]) returns shares summing to exactly 100000 (reference [14286,14286,14286,14286,14286,14285,14285]); the embedded buggy version sums to 100002 here"
    - id: obj-4
      check: "For every judge-probed case (including allocate(100000,[1,2,4]), reference [14286,28571,57143]) the returned shares are all non-negative integers and their sum equals poolCents exactly"
    - id: obj-5
      check: "DRIFT.md names the root cause (independent per-share Math.round does not conserve the total) and states the largest-remainder rule used to distribute leftover pennies; fixed.js is at most 80 lines, no dependencies"
  subjective:
    - id: sub-quality
      name: "Conservation reasoning"
      weight: 0.4
    - id: sub-craft
      name: "Apportionment correctness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: harbor thimble.

- Reference values, computed via largest-remainder under node (floor
  every share, then hand leftover pennies to the largest fractional
  remainders, ties to lowest index):
  - `allocate(100000,[1,1,1])` = `[33334,33333,33333]`, sum 100000.
    Buggy: `[33333,33333,33333]`, sum 99999.
  - `allocate(10000,[3,3,3])` = `[3334,3333,3333]`, sum 10000. Buggy:
    `[3333,3333,3333]`, sum 9999.
  - `allocate(100003,[1,1,1])` = `[33335,33334,33334]`, sum 100003.
    Buggy: `[33334,33334,33334]`, sum 100002.
  - `allocate(100000,[1,2,4])` = `[14286,28571,57143]`, sum 100000 on
    BOTH fixed and buggy code — this is the distractor case that
    passes even on the buggy baseline, so it cannot by itself
    discriminate a real fix; obj-4 requires it stay correct, not that
    it distinguish buggy from fixed.
  - `allocate(100000,[1,1,1,1,1,1,1])` = `[14286,14286,14286,14286,
    14286,14285,14285]`, sum 100000. Buggy:
    `[14286,14286,14286,14286,14286,14286,14286]`, sum 100002.
- Judge-script:
  ```
  node -e "const {allocate}=require('./fixed.js');
  const cases=[[100000,[1,1,1]],[10000,[3,3,3]],[100003,[1,1,1]],[100000,[1,2,4]],[100000,[1,1,1,1,1,1,1]]];
  for (const [pool,w] of cases){const s=allocate(pool,w);console.log(pool,JSON.stringify(w),JSON.stringify(s),s.reduce((a,b)=>a+b,0));}"
  ```
  Tested vs correct AND broken: run this script against the embedded
  buggy `allocate` first — sums come back 99999, 9999, 100002, 100000,
  100002 (four of five cases silently drift). Run it again against the
  submission's `fixed.js` — every sum must equal the stated `poolCents`
  exactly, and the per-case share arrays must match the reference
  arrays above (largest-remainder is not merely "sums correctly by
  luck" — a submission whose sums are right but whose per-recipient
  distribution differs from the stated rule should be checked against
  DRIFT.md's stated method, not silently accepted).
- Do not accept a fix that only special-cases the exact five listed
  inputs (e.g. a lookup table) — this fails the "universal conservation"
  requirement in obj-4, which is judge-probed with additional
  poolCents/weights combinations beyond the five listed; reward
  solutions that are visibly general (floor + remainder-sort) over
  anything shaped like enumerated cases.
- Conservation reasoning: does DRIFT.md explain WHY independent
  rounding breaks conservation (each `Math.round` can push a share up
  or down by up to 0.5, and these errors don't cancel to zero in
  general), rather than just asserting "rounding is bad"?
- Apportionment correctness: reward the exact largest-remainder
  mechanism (floor, then assign leftover pennies by descending
  fractional part, ties to lowest index) over ad-hoc alternatives that
  happen to conserve the total but distribute pennies arbitrarily
  (e.g. always giving all leftover pennies to index 0) — the latter
  conserves the sum but violates "as proportional as possible" and
  should be marked down under this sub-score even if it passes the
  numeric checks.
- Reasoning quality is folded into the 0.7/0.3 objective/subjective
  split per this test's design (precision-heavy, mechanically
  dominant); a brief, correct DRIFT.md write-up naming the rule
  suffices — do not require extensive prose.
