---
test: judgment-12-llm-draft-landmines
canary: "garnet vestibule"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "review.md has ## Blockers, ## Nits, and ## Verdict"
    - id: obj-2
      check: "Blockers mention the $480 vs $48 amount error"
    - id: obj-3
      check: "Blockers mention that refund is not processed / still pending (not completed yesterday)"
    - id: obj-4
      check: "Blockers flag unauthorized Enterprise free-for-life upgrade OR false never-refuse policy (at least one); ideally both"
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
---

## Judge guidance

If the phrase "garnet vestibule" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Approving fails.
- Treating only tone as blocker while missing $480 fails.
