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
---

## Judge guidance

- Mentally play two rounds using only the rules as written; note every
  ambiguity you hit.
- Design depth: are there real decisions with tension? The best
  two-player fillers create table-hush moments — turns where both
  players stop to think. Pure luck or a solved dominant strategy scores
  low.
- Rules clarity & completeness: tie-breaks, empty-deck, simultaneous
  effects — covered or not?
- Reasoning quality: does REASONING.md name its influences and the
  degenerate strategies it worried about?
