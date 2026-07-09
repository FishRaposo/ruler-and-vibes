---
test: ops-03b-node-pipeline-max
canary: "wasabi wain"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node pipeline.js prints 10"
    - id: obj-2
      check: "Uses the CSV (not a hardcode-only without reading file — judge checks fs read or presence of parse)"
    - id: obj-3
      check: "No deps"
    - id: obj-4
      check: "≤ 50 lines"
  subjective:
    - id: sub-quality
      name: "Fix quality"
      weight: 0.4
    - id: sub-craft
      name: "Operational clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Fix quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Operational clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "wasabi wain" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Max is 10.
