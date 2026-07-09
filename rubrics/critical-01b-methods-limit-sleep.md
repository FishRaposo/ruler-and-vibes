---
test: critical-01b-methods-limit-sleep
canary: "anatase zulu"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "Mentions small sample or n=12"
    - id: obj-3
      check: "Mentions self-report or no baseline or founder conflict"
    - id: obj-4
      check: "Challenges clinically proven claim"
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

If the phrase "anatase zulu" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Same skill.
