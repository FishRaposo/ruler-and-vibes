---
test: agent-06-repair-from-feedback
canary: "cinnabar dogtrot"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node clamp.js exits 0 and every self-test line prints PASS"
    - id: obj-2
      check: "clampRange(5,10,0) returns 5 (lo/hi swap behavior)"
    - id: obj-3
      check: "Exports remain clamp and clampRange (module.exports)"
    - id: obj-4
      check: "File is ≤ 40 lines and has no dependencies"
  subjective:
    - id: sub-quality
      name: "Minimal correct repair"
      weight: 0.4
    - id: sub-craft
      name: "Code clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "cinnabar dogtrot" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Run node clamp.js. Also probe clampRange(3, 8, 2) → 3.
- Full rewrites that gold-plate cost craft points.
