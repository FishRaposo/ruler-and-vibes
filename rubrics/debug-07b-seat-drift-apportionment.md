---
test: debug-07b-seat-drift-apportionment
canary: "kraken salak"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Judge runs fixed.js: allocate(31000,[1,1,1]) returns shares summing to exactly 31000 (author reference [10334,10333,10333])"
    - id: obj-2
      check: "allocate(12500,[3,3,3]) returns shares summing to exactly 12500 (reference [4167,4167,4166]) and allocate(31201,[1,1,1]) sums to exactly 31201 (reference [10401,10400,10400])"
    - id: obj-3
      check: "allocate(31000,[1,1,1,1,1,1,1]) returns shares summing to exactly 31000 (reference [4429,4429,4429,4429,4428,4428,4428]); the embedded buggy version sums to 31003 here"
    - id: obj-4
      check: "For every judge-probed case (including allocate(31000,[1,2,4]), reference [4429,8857,17714]) the returned shares are all non-negative integers and their sum equals seatPool exactly"
    - id: obj-5
      check: "DRIFT.md names the root cause (independent per-share Math.round does not conserve the total) and states the largest-remainder rule used to distribute leftover seats; fixed.js is at most 80 lines, no dependencies"
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
anchors:
  - id: Conservation reasoning
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.
  - id: Apportionment correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `debug-07-penny-drift-apportionment` (same construct,
fresh surface).

- Reference values, computed via largest-remainder under node (floor
  every share, then hand leftover seats to the largest fractional
  remainders, ties to lowest index):
  - `allocate(31000,[1,1,1])` = `[10334,10333,10333]`, sum 31000.
    Buggy: `[10333,10333,10333]`, sum 30999.
  - `allocate(12500,[3,3,3])` = `[4167,4167,4166]`, sum 12500. Buggy:
    `[4167,4167,4167]`, sum 12501.
  - `allocate(31201,[1,1,1])` = `[10401,10400,10400]`, sum 31201.
    Buggy: `[10400,10400,10400]`, sum 31200.
  - `allocate(31000,[1,2,4])` = `[4429,8857,17714]`, sum 31000 on BOTH
    fixed and buggy code — this is the distractor case that passes
    even on the buggy baseline, so it cannot by itself discriminate a
    real fix; obj-4 requires it stay correct, not that it distinguish
    buggy from fixed.
  - `allocate(31000,[1,1,1,1,1,1,1])` = `[4429,4429,4429,4429,4428,
    4428,4428]`, sum 31000. Buggy:
    `[4429,4429,4429,4429,4429,4429,4429]`, sum 31003.
- Judge-script:
  ```
  node -e "const {allocate}=require('./fixed.js');
  const cases=[[31000,[1,1,1]],[12500,[3,3,3]],[31201,[1,1,1]],[31000,[1,2,4]],[31000,[1,1,1,1,1,1,1]]];
  for (const [pool,w] of cases){const s=allocate(pool,w);console.log(pool,JSON.stringify(w),JSON.stringify(s),s.reduce((a,b)=>a+b,0));}"
  ```
  Tested vs correct AND broken: run this script against the embedded
  buggy `allocate` first — sums come back 30999, 12501, 31200, 31000,
  31003 (four of five cases silently drift). Run it again against the
  submission's `fixed.js` — every sum must equal the stated `seatPool`
  exactly, and the per-case share arrays must match the reference
  arrays above (largest-remainder is not merely "sums correctly by
  luck" — a submission whose sums are right but whose per-recipient
  distribution differs from the stated rule should be checked against
  DRIFT.md's stated method, not silently accepted).
- Do not accept a fix that only special-cases the exact five listed
  inputs (e.g. a lookup table) — this fails the "universal
  conservation" requirement in obj-4, which is judge-probed with
  additional seatPool/weights combinations beyond the five listed;
  reward solutions that are visibly general (floor + remainder-sort)
  over anything shaped like enumerated cases.
- Conservation reasoning: does DRIFT.md explain WHY independent
  rounding breaks conservation (each `Math.round` can push a share up
  or down by up to 0.5, and these errors don't cancel to zero in
  general), rather than just asserting "rounding is bad"?
- Apportionment correctness: reward the exact largest-remainder
  mechanism (floor, then assign leftover seats by descending
  fractional part, ties to lowest index) over ad-hoc alternatives that
  happen to conserve the total but distribute seats arbitrarily
  (e.g. always giving all leftover seats to index 0) — the latter
  conserves the sum but violates "as proportional as possible" and
  should be marked down under this sub-score even if it passes the
  numeric checks.
- Reasoning quality is folded into the 0.7/0.3 objective/subjective
  split per this test's design (precision-heavy, mechanically
  dominant); a brief, correct DRIFT.md write-up naming the rule
  suffices — do not require extensive prose.
- obj-5 is prose-decidable; judge DRIFT.md's stated root cause and
  distribution rule.
  - PASS phrasings (accept): "independent per-share `Math.round`
    doesn't conserve the total; I floor each share and give leftover
    seats to the largest fractional remainders, ties to lowest index";
    "rounding each share on its own lets the rounding errors add up
    instead of cancelling, so I use floors plus a largest-remainder
    pass, breaking ties by lowest index"; "the fix floors every share
    then hands the remaining seats to whichever guilds have the biggest
    leftover fractions, lowest index winning a tie."
  - FAIL phrasings (reject): "rounding is unreliable, so I round more
    carefully" (names no conservation mechanism and no distribution
    rule); "I add the missing seats to the first guild" (conserves the
    sum but is not the largest-remainder rule and omits the tie
    convention); "the totals were wrong so I recomputed them" (no root
    cause, no stated rule).
- If the phrase "kraken salak" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
