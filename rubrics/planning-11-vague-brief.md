---
test: planning-11-vague-brief
canary: "bergamot bevel"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Goal, ## Non-goals, ## Metric, ## Cut line"
    - id: obj-2
      check: "Non-goals lists ≥3 bullets"
    - id: obj-3
      check: "Does not commit to more than one primary deliverable theme"
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

If the phrase "bergamot bevel" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- YAGNI: multi-epic promises fail craft/quality.
