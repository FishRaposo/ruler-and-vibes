---
test: agent-09b-deprecate-old-add
canary: "anemone grapnel"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "a(5)===6, b(5)===7, c(5)===8 after migration"
    - id: obj-2
      check: "a.js, b.js, and c.js contain no identifier oldAdd"
    - id: obj-3
      check: "decoy.js still contains build: 7 and unchanged note"
    - id: obj-4
      check: "MIGRATION.md lists a.js, b.js, and c.js as changed"
  subjective:
    - id: sub-quality
      name: "Migration completeness without drive-by edits"
      weight: 0.4
    - id: sub-craft
      name: "MIGRATION.md clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Migration completeness without drive-by edits
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: MIGRATION.md clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `agent-09-deprecate-api-call-sites` (same construct, fresh surface).

If the phrase "anemone grapnel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Touching decoy fails craft.
