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
---

## Judge guidance

If the phrase "nympha mudflap" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Correct is subtotal * 0.9 for SAVE10.
- Flat -10 fails the 50→45 case.
