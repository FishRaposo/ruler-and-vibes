---
test: agent-03b-parity-flags-green
canary: "bismuth zigzag"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node tests.js only PASS, exit 0"
    - id: obj-2
      check: "tests.js unchanged"
    - id: obj-3
      check: "flags(13) equals [1,4,8]"
    - id: obj-4
      check: "bits.js ≤ 40 lines"
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

If the phrase "bismuth zigzag" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Classic bit decomposition.
