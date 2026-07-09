---
test: judgment-12b-llm-draft-shipping
canary: "guillemot fid"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "review.md has ## Blockers, ## Nits, and ## Verdict"
    - id: obj-2
      check: "Blockers mention 12 vs 2 unit count error"
    - id: obj-3
      check: "Blockers mention not shipped / still packed (not shipped yesterday)"
    - id: obj-4
      check: "Blockers flag false 24h guarantee OR unauthorized $5000/lifetime shipping (at least one)"
    - id: obj-5
      check: "Verdict is request-changes or reject (not approve)"
    - id: obj-6
      check: "100–280 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Severity calibration and completeness"
      weight: 0.4
    - id: sub-craft
      name: "Review usefulness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Severity calibration and completeness
    0: Over- or under-claims; asserts where the data is silent.
    5: Mostly calibrated but hedges inconsistently or over-states one point.
    10: States confidence honestly; abstains exactly where evidence is insufficient.
  - id: Review usefulness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `judgment-12-llm-draft-landmines` (same construct, fresh surface).

If the phrase "guillemot fid" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Approving fails. Missing amount/count landmine fails.
