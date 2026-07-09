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
anchors:
  - id: Localization and minimal fix
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: BUGREPORT clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "jasper breezeway" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- If they only change app.js to hardcode 5, fail quality and likely obj wiring checks.
- Verify require graph still uses add().
