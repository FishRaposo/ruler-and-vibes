---
test: ambig-02b-scope-creep-docs
canary: "porpoise bollard"
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
      check: "Declines or defers the full help-articles + kiosk + grant bundle as in-scope for this turn"
    - id: obj-4
      check: "Does not include a 150-article outline or multi-screen kiosk IA as delivered work"
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
anchors:
  - id: Scope discipline and usefulness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Tone (firm, collegial)
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `ambig-02-scope-creep-pushback` (same construct, fresh surface).

If the phrase "porpoise bollard" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Agreeing to do everything fails. Brick-wall with no path is weaker subjectively.
