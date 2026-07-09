---
test: agent-07b-fixture-tree-greet
canary: "orca fairlead"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node app.js prints PASS greet and exits 0"
    - id: obj-2
      check: "BUGREPORT.md names text/join.js (or join.js) as the defect location"
    - id: obj-3
      check: "BUGREPORT.md states the defect is missing space / wrong join"
    - id: obj-4
      check: "text/index.js and app.js still wire greet→join (not hardcoded Hello)"
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

If the phrase "orca fairlead" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Hardcoding in app.js fails quality.
