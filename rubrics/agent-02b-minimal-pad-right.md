---
test: agent-02b-minimal-pad-right
canary: "rhodium pegboard"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node pad.js: all self-tests PASS"
    - id: obj-2
      check: "padRight(\"hi\",5) has length 5 with trailing spaces"
    - id: obj-3
      check: "padRight(\"hello\",3)===\"hello\""
    - id: obj-4
      check: "≤ 35 lines, export padRight"
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

If the phrase "rhodium pegboard" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Fix is w - s.length not w - s.length - 1.
