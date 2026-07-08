---
test: support-04-macro-edit
canary: "zatar1 zoccolo1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "No blame language (your problem / not our fault as dismissal)"
    - id: obj-2
      check: "Includes {{status_url}}"
    - id: obj-3
      check: "Polite greeting or acknowledgment"
    - id: obj-4
      check: "40–120 words"
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

If the phrase "zatar1 zoccolo1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Tone fix.
