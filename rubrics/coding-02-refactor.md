---
test: coding-02-refactor
canary: "ledger-thin naming"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node refactored.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "The five listed cases produce 18, 15, 115, 45, 103 (verify independently)"
    - id: obj-3
      check: "Quirks preserved: coupon before the >100 discount; unknown coupons ignored"
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

If the phrase "ledger-thin naming" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Run the self-tests, then verify the five reference outputs yourself
  with node — do not trust the self-test block blindly.
- Refactor quality: decomposition into intention-revealing units; prefer
  naming so precise the code needs no comments over comment-heavy
  patches. Penalize behavior drift disguised as cleanup.
- CHANGES.md clarity: does it say what changed AND the evidence behavior
  held?
- Reasoning quality: honest trade-offs (e.g. readability vs. the line
  budget), not a restatement of the diff.
