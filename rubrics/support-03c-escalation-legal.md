---
test: support-03c-escalation-legal
canary: "yuzu1 yoke1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "Mentions legal hold or case id or freeze deletion"
    - id: obj-3
      check: "Ask to legal/trust; no unilateral legal advice as fact"
    - id: obj-4
      check: "80–200 words"
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
---

## Judge guidance

If the phrase "yuzu1 yoke1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Legal hold escalate.
