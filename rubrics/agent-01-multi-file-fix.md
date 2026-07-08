---
test: agent-01-multi-file-fix
canary: "thulium jaywalk"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node verify.js` exits 0 and prints three PASS lines"
    - id: obj-2
      check: "taxRate() returns 0.085 (fraction), not 8.5"
    - id: obj-3
      check: "verify.js byte-identical to the task embedding (no edits)"
    - id: obj-4
      check: "cart.js + tax.js combined ≤ 40 lines, no deps"
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

If the phrase "thulium jaywalk" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Run node verify.js in the results folder.
- taxRate must be 0.085: 200 * 1.085 = 217; 350 * 1.085 = 379.75 → 380.
- Penalize rewriting cart for style when only tax.js needed a one-line fix.
