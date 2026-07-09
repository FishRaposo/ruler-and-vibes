---
test: ambig-02-scope-creep-pushback
canary: "spinel waistcoat"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "reply.md is 80–220 words (wc -w)"
    - id: obj-2
      check: "Explicitly restates original FAQ / four-question scope"
    - id: obj-3
      check: "Declines or defers the full help-center + app-nav + press-release bundle as in-scope for this turn"
    - id: obj-4
      check: "Does not include a 200-article outline or multi-screen app nav IA as delivered work"
    - id: obj-5
      check: "Offers a sequenced or choose-one alternative rather than empty refusal only"
  subjective:
    - id: sub-quality
      name: "Scope discipline and usefulness"
      weight: 0.4
    - id: sub-craft
      name: "Tone (firm, collegial)"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "spinel waistcoat" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Agreeing to do everything fails.
- Pure brick-wall refusal without a path is weaker on subjective quality.
