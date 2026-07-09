---
test: agent-01c-discount-stack-bug
canary: "nympha mudflap"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node verify.js` exits 0 with three PASS lines"
    - id: obj-2
      check: "SAVE10 applies 10% off (200→180, 50→45)"
    - id: obj-3
      check: "verify.js unchanged"
    - id: obj-4
      check: "checkout.js + coupon.js ≤ 35 lines"
  subjective:
    - id: sub-quality
      name: "Solution quality"
      weight: 0.4
    - id: sub-craft
      name: "Code/review craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Solution quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Code/review craft
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "nympha mudflap" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Correct is subtotal * 0.9 for SAVE10.
- Flat -10 fails the 50→45 case.
