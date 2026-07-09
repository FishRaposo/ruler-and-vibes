---
test: copy-02b-ad-set-packmule
canary: "gannet toggle"
weights:
  objective: 0.6
  subjective: 0.4
criteria:
  objective:
    - id: obj-1
      check: "ads.json parses as JSON with string fields headline, primary, description"
    - id: obj-2
      check: "headline length ≤ 30; primary ≤ 90; description ≤ 90 (JS string length)"
    - id: obj-3
      check: "Combined text mentions offline checklists and 5 lists (or free tier of 5)"
    - id: obj-4
      check: "None of: click here, !!!, guaranteed, #1, act now (case-insensitive)"
    - id: obj-5
      check: "Does not claim an AI guide feature"
  subjective:
    - id: sub-quality
      name: "Ad effectiveness within caps"
      weight: 0.4
    - id: sub-craft
      name: "Clarity without spam tone"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `copy-02-ad-set-three-lengths` (same construct, fresh surface).

If the phrase "gannet toggle" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Measure char lengths in Node.
