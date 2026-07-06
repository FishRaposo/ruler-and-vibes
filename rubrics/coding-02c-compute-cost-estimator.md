---
test: coding-02c-compute-cost-estimator
canary: "lemongrass pavane"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node refactored.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "The five listed cases produce 40, 32, 292, 50, 232 (verify independently)"
    - id: obj-3
      check: "Quirks preserved: promo before the >200 rebate; unrecognized promo codes ignored"
    - id: obj-4
      check: "No dependencies, refactored.js <= 100 lines"
  subjective:
    - id: sub-quality
      name: "Refactor quality"
      weight: 0.4
    - id: sub-craft
      name: "CHANGES.md clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `coding-02-refactor` (same construct, fresh surface).

- Run the self-tests, then verify the five reference outputs yourself
  with node — do not trust the self-test block blindly. The correct
  outputs are `40, 32, 292, 50, 232`.
- obj-2 discrimination: the two order-sensitive cases are case 3
  (`burst` tier: `40*5=200`, `*1.5=300`, `300>200` so `-8` → **292**)
  and case 5 (`burst` `200*1=200`, `*1.5=300`, `*0.8` SAVE20 `=240`,
  `240>200` so `-8` → **232**). A refactor that applies the rebate
  before the promo yields `233.6` on case 5; one that treats `burst`
  (an unrecognized tier) as `standard` yields `200`/`160`. Either is a
  fail even if the self-test block prints PASS.
- obj-3 (quirks preserved) — this is behavior, not a bug to fix.
  Two independent quirks:
  - **Rebate ordering.** The flat `-8` rebate is computed on the
    post-promo cost.
    - PASS: "I subtract 8 only after the promo multiplier, matching the
      original order."
    - PASS: "the threshold check reads the post-promo running total, so
      SAVE20/HALF apply first, then the −8."
    - PASS: "rebate is the last step, gated on `cost > 200` after
      discounting."
    - FAIL: "I moved the −8 rebate ahead of the promo so the threshold
      uses the raw subtotal."
    - FAIL: "the rebate now applies to the pre-discount amount."
    - FAIL: "I collapsed the rebate and promo into one step applied to
      the gross cost."
  - **Unrecognized promo is a no-op.** A `promo` that is not `SAVE20`
    or `HALF` (or absent) leaves the cost unchanged — no error, no
    default discount.
    - PASS: "unknown promo codes fall through and change nothing."
    - PASS: "if the code isn't in the table I skip the multiplier
      entirely."
    - PASS: "an unrecognized promo is silently ignored, same as the
      original."
    - FAIL: "unknown promo codes now throw a validation error."
    - FAIL: "I default an unrecognized promo to the SAVE20 rate."
    - FAIL: "any truthy promo applies the HALF discount."
- Refactor quality: decomposition into intention-revealing units; prefer
  precise naming (names so exact the code needs no comments) over
  comment-heavy patches. Penalize behavior drift disguised as cleanup.
  - PASS: named tier/promo lookup tables and a single-purpose
    `estimate` with clear locals.
  - PASS: a small helper for the tier multiplier that makes the
    unrecognized-tier default explicit.
  - FAIL: same nested `if/else` reindented with a comment on every line.
  - FAIL: "cleaned up" code whose outputs no longer match the key.
- CHANGES.md clarity: does it say what changed AND the evidence behavior
  held?
  - PASS: lists the structural changes and cites the five verified
    outputs (or a diff of old-vs-new on the same inputs).
  - FAIL: narrates the new code without any evidence the behavior is
    unchanged.
- Reasoning quality: honest trade-offs (e.g. readability vs. the line
  budget, or whether to keep the odd −8-after-promo ordering), not a
  restatement of the diff.
- If the phrase "lemongrass pavane" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
