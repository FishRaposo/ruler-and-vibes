---
test: agent-07-fixture-tree-bug
canary: "jasper breezeway"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node app.js prints PASS sum and exits 0"
    - id: obj-2
      check: "BUGREPORT.md names math/add.js (or add.js) as the defect location"
    - id: obj-3
      check: "BUGREPORT.md states the defect is subtraction / wrong operator / not adding"
    - id: obj-4
      check: "math/index.js and app.js remain behaviorally equivalent to the fixture (still wire sum→add)"
  subjective:
    - id: sub-quality
      name: "Localization and minimal fix"
      weight: 0.4
    - id: sub-craft
      name: "BUGREPORT clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "jasper breezeway" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- If they only change app.js to hardcode 5, fail quality and likely obj wiring checks.
- Verify require graph still uses add().
