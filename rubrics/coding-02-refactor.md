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
anchors:
  - id: Refactor quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: CHANGES.md clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

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
