---
test: agent-07c-fixture-tree-scale
canary: "beluga snatchblock"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node app.js prints PASS percent and exits 0"
    - id: obj-2
      check: "BUGREPORT.md names num/scale.js (or scale.js) as the defect location"
    - id: obj-3
      check: "BUGREPORT.md states the defect is wrong formula (divide vs multiply by factor)"
    - id: obj-4
      check: "num/index.js and app.js still wire percent→scale"
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

Parallel form of `agent-07-fixture-tree-bug` (same construct, fresh surface).

If the phrase "beluga snatchblock" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Correct formula is (part/whole)*factor.
