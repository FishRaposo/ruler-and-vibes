---
test: judgment-12c-llm-draft-access
canary: "puffin marlinspike"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "review.md has ## Blockers, ## Nits, and ## Verdict"
    - id: obj-2
      check: "Blockers mention org-admin vs read-only (wrong access level)"
    - id: obj-3
      check: "Blockers mention access not yet granted / still pending"
    - id: obj-4
      check: "Blockers flag false 1-hour policy OR plaintext password to CC (at least one)"
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

Parallel form of `judgment-12-llm-draft-landmines` (same construct, fresh surface).

If the phrase "puffin marlinspike" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Security landmines must be blockers.
