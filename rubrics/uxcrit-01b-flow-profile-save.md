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
anchors:
  - id: UX diagnostic quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Actionable fixes
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `uxcrit-01-flow-critique` (same construct, fresh surface).

If the phrase "skimmer gasket" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Must hit the three themes.
