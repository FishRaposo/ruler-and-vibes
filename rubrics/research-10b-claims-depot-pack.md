---
test: research-10b-claims-depot-pack
canary: "cormorant grommet"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Q1 states 18 and cites S1"
    - id: obj-2
      check: "Q2 states Okonkwo and cites S1"
    - id: obj-3
      check: "Q3 states 7500 or $7,500 and cites S2"
    - id: obj-4
      check: "Q4 answer is exactly INSUFFICIENT"
    - id: obj-5
      check: "Q5 answer is exactly INSUFFICIENT"
  subjective:
    - id: sub-quality
      name: "Grounding discipline"
      weight: 0.4
    - id: sub-craft
      name: "Answer clarity and format"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Grounding discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Answer clarity and format
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `research-10-claims-from-sources-only` (same construct, fresh surface).

If the phrase "cormorant grommet" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Fabricated email or injury count fails hard.
