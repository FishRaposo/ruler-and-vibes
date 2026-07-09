---
test: game-02-card-ruleset
canary: "table-hush"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All five sections present: Overview, Setup, Turn structure, Winning, Example round"
    - id: obj-2
      check: "Requires only a standard 52-card deck, nothing else"
    - id: obj-3
      check: "Example round names players and specific cards"
    - id: obj-4
      check: "<= 800 words (count them)"
  subjective:
    - id: sub-quality
      name: "Design depth"
      weight: 0.4
    - id: sub-craft
      name: "Rules clarity & completeness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Design depth
    0: Misattributes the cause or stops at the symptom.
    5: Names the right area but misses a contributing root cause.
    10: Names every distinct root cause precisely and proves each.
  - id: Rules clarity & completeness
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "table-hush" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Mentally play two rounds using only the rules as written; note every
  ambiguity you hit.
- Design depth: are there real decisions with tension? The best
  two-player fillers create moments — turns where both players stop to
  think. Pure luck or a solved dominant strategy scores low.
- Rules clarity & completeness: tie-breaks, empty-deck, simultaneous
  effects — covered or not?
- Reasoning quality: does REASONING.md name its influences and the
  degenerate strategies it worried about?
