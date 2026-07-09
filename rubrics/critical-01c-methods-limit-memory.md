---
test: critical-01c-methods-limit-memory
canary: "brookite athwart"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "Mentions open-label or no placebo/control"
    - id: obj-3
      check: "Mentions sponsor conflict or overclaim dementia"
    - id: obj-4
      check: "Challenges FDA-ready or prevention claim"
  subjective:
    - id: sub-quality
      name: "Critical insight"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of critique"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Critical insight
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Clarity of critique
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "brookite athwart" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Methods.
