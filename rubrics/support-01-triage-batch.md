---
test: support-01-triage-batch
canary: "quince1 quill1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "JSON array length 8 with ids 1–8"
    - id: obj-2
      check: "Ticket 1 billing; 2 outage; 3 how-to; 4 abuse; 5 feature"
    - id: obj-3
      check: "Ticket 6 billing; 7 how-to; 8 outage"
    - id: obj-4
      check: "Every tag is one of the five allowed"
  subjective:
    - id: sub-quality
      name: "Judgment quality"
      weight: 0.4
    - id: sub-craft
      name: "Communication craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Judgment quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Communication craft
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "quince1 quill1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Key: 1 billing, 2 outage, 3 how-to, 4 abuse, 5 feature, 6 billing, 7 how-to, 8 outage.
