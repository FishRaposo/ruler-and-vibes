---
test: uxcrit-01b-flow-profile-save
canary: "skimmer gasket"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Problems, ## Severity, ## Fixes"
    - id: obj-2
      check: "Mentions missing save/persist (or equivalent) for the profile edit"
    - id: obj-3
      check: "Mentions missing confirmation or silent discard on back"
    - id: obj-4
      check: "Mentions empty state lacking guidance/CTA"
    - id: obj-5
      check: "120–300 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "UX diagnostic quality"
      weight: 0.4
    - id: sub-craft
      name: "Actionable fixes"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `uxcrit-01-flow-critique` (same construct, fresh surface).

If the phrase "skimmer gasket" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Must hit the three themes.
