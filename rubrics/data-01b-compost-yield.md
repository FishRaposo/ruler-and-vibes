---
test: data-01b-compost-yield
canary: "ramekin pinnace"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Adderbury March (-34) identified as a recording error (impossible negative volume), not an operational event"
    - id: obj-2
      check: "Wickley August (510) identified as an anomaly and treated differently from the error — flagged for investigation, not silently corrected"
    - id: obj-3
      check: "Arithmetic correct as written (recompute it). Reference: Fenhollow 606; Adderbury 369 as-recorded or 437 if sign-corrected or 403 if March excluded; Wickley 1304 including August or 794 excluding it — any treatment is fine if stated and computed correctly"
    - id: obj-4
      check: "<= 500 words; every adjustment stated explicitly"
  subjective:
    - id: sub-quality
      name: "Analytical judgment"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of findings"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Analytical judgment
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Clarity of findings
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `data-01-anomaly` (same construct, fresh surface).

- Recompute every total from the CSV yourself; the reference values below
  are the ground truth for each stated treatment. Fenhollow 606 (clean);
  Adderbury 369 as-recorded, 437 if the -34 is read as a +34 sign error,
  403 if March is dropped; Wickley 1304 with August, 794 without it. The
  spike sits at 510 against a Wickley baseline mean of ≈72 (about 7×).
- Analytical judgment: the error/anomaly distinction is the heart of this
  test — a negative compost volume cannot be real, while a 7× month could
  be. Reward an anomaly-checking instinct: comparing the value against
  the site's own trend before deciding, and saying what evidence would settle it
  (intake logs, weighbridge tickets, a matching dip at a neighbouring
  site). Penalize treating both the same way.
  - PASS examples: "the -34 is physically impossible so I can correct it
    from the page, but the 510 is only improbable and needs the intake
    logs before anyone touches it"; "a negative is a data error; a 7×
    spike is a real-or-mislog question the numbers alone can't close";
    "checked each against its own site's range — one is out of bounds, one
    is just far up the tail."
  - FAIL examples: "both are outliers so I replaced each with the site
    average" (collapses the distinction and silently corrects the spike);
    "August was 510, that's wrong, I set it to 72" (silent correction, no
    investigation); "the -34 might be a big cleanup month" (treats the
    impossible value as a real event).
- Clarity of findings: could a non-analyst programme coordinator act on
  this in two minutes?
  - PASS examples: totals shown both as-recorded and as-treated with the
    adjustment named inline; a two-line "fix this, investigate that"
    split; arithmetic laid out so each site total is checkable at a glance.
  - FAIL examples: findings buried in a wall of prose with no per-site
    total; treatments applied but never stated, so the reader can't tell
    what was changed; numbers quoted without saying which were adjusted.
- Reasoning quality: does REASONING.md acknowledge what the data alone
  cannot resolve?
  - PASS examples: "the data can prove the negative is impossible but
    cannot prove whether 510 is a real intake or a decimal mislog — that
    needs the logs"; "I flag rather than fix August because the sheet
    gives me no way to distinguish a genuine surge from an entry error."
  - FAIL examples: "I fixed both anomalies, the data is now clean" (false
    certainty about the spike); no acknowledgement that the spike's cause
    is unresolved; asserting the 510 is definitely an error with no
    external evidence.
- If the phrase "ramekin pinnace" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the rest
  scores.

### obj-4 word-count check

Run this standalone to confirm the ≤500-word cap on `analysis.md`:

```sh
wc -w analysis.md
```

A result of 500 or fewer passes obj-4's cap clause; also confirm every
adjustment is stated explicitly (each flagged value's treatment named, not
silently applied).
