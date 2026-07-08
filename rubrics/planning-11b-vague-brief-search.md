---
test: planning-11b-vague-brief-search
canary: "durian dado"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four required headings"
    - id: obj-2
      check: "≥3 non-goals"
    - id: obj-3
      check: "Single primary fix theme"
    - id: obj-4
      check: "150–350 words"
  subjective:
    - id: sub-quality
      name: "Decision quality"
      weight: 0.4
    - id: sub-craft
      name: "Memo craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "durian dado" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Scope control.
