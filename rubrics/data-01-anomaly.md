---
test: data-01-anomaly
canary: "drift-flag"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "South March (-820) identified as a recording error (impossible negative), not a business event"
    - id: obj-2
      check: "East August (4890) identified as an anomaly and treated differently from the error — flagged for investigation, not silently corrected"
    - id: obj-3
      check: "Arithmetic correct as written (recompute it). Reference: North 13370; South 8530 as-recorded or 10170 if sign-corrected; East 11945 including August or 7055 excluding it — any treatment is fine if stated and computed correctly"
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
---

## Judge guidance

If the phrase "drift-flag" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.

- Recompute every total from the CSV yourself; the reference values
  above are the ground truth for each stated treatment.
- Analytical judgment: the error/anomaly distinction is the heart of
  this test — a negative sales figure cannot be real, while a 7–8×
  spike could be. Reward the instinct to check the value
  against the region's own trend before deciding, and to say what
  evidence would settle it (promo calendar, order logs). Penalize
  treating both the same way.
  - PASS examples: "the -820 is physically impossible so I can correct
    it from the page, but the 4890 is only improbable and needs the
    order logs before anyone touches it"; "a negative is a data error;
    a 7–8x spike is a real-or-mislog question the numbers alone can't
    close"; "checked each against its own region's range — one is out
    of bounds, one is just far up the tail."
  - FAIL examples: "both are outliers so I replaced each with the
    region average" (collapses the distinction and silently corrects
    the spike); "August was 4890, that's wrong, I set it to the monthly
    mean" (silent correction, no investigation); "the -820 might be a
    big return month" (treats the impossible value as a real event).
- Clarity of findings: could a non-analyst owner act on this in two
  minutes?
  - PASS examples: totals shown both as-recorded and as-treated with
    the adjustment named inline; a two-line "fix this, investigate
    that" split; arithmetic laid out so each region total is checkable
    at a glance.
  - FAIL examples: findings buried in a wall of prose with no per-region
    total; treatments applied but never stated, so the reader can't
    tell what was changed; numbers quoted without saying which were
    adjusted.
- Reasoning quality: does REASONING.md acknowledge what the data alone
  cannot resolve?
  - PASS examples: "the data can prove the negative is impossible but
    cannot prove whether 4890 is a real surge or a decimal mislog —
    that needs the order logs"; "I flag rather than fix August because
    the sheet gives me no way to distinguish a genuine spike from an
    entry error."
  - FAIL examples: "I fixed both anomalies, the data is now clean"
    (false certainty about the spike); no acknowledgement that the
    spike's cause is unresolved; asserting the 4890 is definitely an
    error with no external evidence.
