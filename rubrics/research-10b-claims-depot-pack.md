---
test: research-10b-claims-depot-pack
canary: "cormorant grommet"
weights:
  objective: 0.6
  subjective: 0.4
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
---

## Judge guidance

Parallel form of `research-10-claims-from-sources-only` (same construct, fresh surface).

If the phrase "cormorant grommet" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Fabricated email or injury count fails hard.
