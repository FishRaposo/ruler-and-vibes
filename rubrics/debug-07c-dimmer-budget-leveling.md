---
test: debug-07c-dimmer-budget-leveling
canary: "selkie longan"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Judge runs fixed.js: split(70000,[1,1,1]) returns shares summing to exactly 70000 (author reference [23334,23333,23333])"
    - id: obj-2
      check: "split(25000,[4,4,4]) returns shares summing to exactly 25000 (reference [8334,8333,8333]) and split(45001,[1,1,1]) sums to exactly 45001 (reference [15001,15000,15000])"
    - id: obj-3
      check: "split(93000,[1,1,1,1,1,1,1]) returns shares summing to exactly 93000 (reference [13286,13286,13286,13286,13286,13285,13285]); the embedded buggy version sums to 93002 here"
    - id: obj-4
      check: "For every judge-probed case (including split(84000,[1,2,5]), reference [10500,21000,52500]) the returned shares are all non-negative integers and their sum equals budgetSteps exactly"
    - id: obj-5
      check: "LEVELING.md names the root cause (independent per-share Math.round does not conserve the total) and states the largest-remainder rule used to distribute leftover dimmer steps; fixed.js is at most 80 lines, no dependencies"
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

Parallel form of `debug-07-penny-drift-apportionment` (same construct, fresh surface).

If the phrase "selkie longan" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Reference values, computed via largest-remainder under node (floor
  every share, then hand leftover dimmer steps to the largest
  fractional remainders, ties to lowest index):
  - `split(70000,[1,1,1])` = `[23334,23333,23333]`, sum 70000. Buggy:
    `[23333,23333,23333]`, sum 69999.
  - `split(25000,[4,4,4])` = `[8334,8333,8333]`, sum 25000. Buggy:
    `[8333,8333,8333]`, sum 24999.
  - `split(45001,[1,1,1])` = `[15001,15000,15000]`, sum 45001. Buggy:
    `[15000,15000,15000]`, sum 45000.
  - `split(84000,[1,2,5])` = `[10500,21000,52500]`, sum 84000 on BOTH
    fixed and buggy code — this is the distractor case that passes even
    on the buggy baseline, so it cannot by itself discriminate a real
    fix; obj-4 requires it stay correct, not that it distinguish buggy
    from fixed.
  - `split(93000,[1,1,1,1,1,1,1])` = `[13286,13286,13286,13286,13286,
    13285,13285]`, sum 93000. Buggy: `[13286,13286,13286,13286,13286,
    13286,13286]`, sum 93002.
- Judge-script:
  ```
  node -e "const {split}=require('./fixed.js');
  const cases=[[70000,[1,1,1]],[25000,[4,4,4]],[45001,[1,1,1]],[84000,[1,2,5]],[93000,[1,1,1,1,1,1,1]]];
  for (const [budget,w] of cases){const s=split(budget,w);console.log(budget,JSON.stringify(w),JSON.stringify(s),s.reduce((a,b)=>a+b,0));}"
  ```
  Tested vs correct AND broken: run this script against the embedded
  buggy `split` first — sums come back 69999, 24999, 45000, 84000,
  93002 (four of five cases silently drift). Run it again against the
  submission's `fixed.js` — every sum must equal the stated
  `budgetSteps` exactly, and the per-case share arrays must match the
  reference arrays above (largest-remainder is not merely "sums
  correctly by luck" — a submission whose sums are right but whose
  per-recipient distribution differs from the stated rule should be
  checked against LEVELING.md's stated method, not silently accepted).
- Do not accept a fix that only special-cases the exact five listed
  inputs (e.g. a lookup table) — this fails the "universal
  conservation" requirement in obj-4, which is judge-probed with
  additional budgetSteps/weights combinations beyond the five listed
  (e.g. `split(31000,[1,1,1])` = `[10334,10333,10333]`,
  `split(50000,[2,3,5])` = `[10000,15000,25000]`,
  `split(100,[1,1,1,1,1,1])` = `[17,17,17,17,16,16]`); reward solutions
  that are visibly general (floor + remainder-sort) over anything
  shaped like enumerated cases.
- Conservation reasoning: does LEVELING.md explain WHY independent
  rounding breaks conservation (each `Math.round` can push a share up
  or down by up to 0.5, and these errors don't cancel to zero in
  general), rather than just asserting "rounding is bad"?
- Apportionment correctness: reward the exact largest-remainder
  mechanism (floor, then assign leftover dimmer steps by descending
  fractional part, ties to lowest index) over ad-hoc alternatives that
  happen to conserve the total but distribute steps arbitrarily (e.g.
  always giving all leftover steps to index 0) — the latter conserves
  the sum but violates "as proportional as possible" and should be
  marked down under this sub-score even if it passes the numeric checks
  (its seven-way share array diverges from the reference above).
- Reasoning quality is folded into the 0.7/0.3 objective/subjective
  split per this test's design (precision-heavy, mechanically
  dominant); a brief, correct LEVELING.md write-up naming the rule
  suffices — do not require extensive prose.
