---
test: data-01c-hatchery-yield
canary: "trivet wyrm"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Reedmarsh April (-655) identified as a recording error (impossible negative release count), not a real hatchery event"
    - id: obj-2
      check: "Silthollow September (6640) identified as an anomaly and treated differently from the error — flagged for investigation, not silently corrected"
    - id: obj-3
      check: "Arithmetic correct as written (recompute it). Reference: Alderpool 16390; Reedmarsh 6825 as-recorded or 8135 if sign-corrected or 7480 if April excluded; Silthollow 16405 including September or 9765 excluding it — any treatment is fine if stated and computed correctly"
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

Parallel form of `data-01-anomaly` (same construct, fresh surface).

- Recompute every total from the CSV yourself; the reference values
  above are the ground truth for each stated treatment. To check the
  arithmetic quickly, run this standalone from the repo root:

  ```bash
  node -e '
  const d={Alderpool:{Jan:1240,Feb:1265,Mar:1290,Apr:1275,May:1320,Jun:1360,Jul:1395,Aug:1380,Sep:1420,Oct:1450,Nov:1485,Dec:1510},Reedmarsh:{Jan:610,Feb:625,Mar:640,Apr:-655,May:660,Jun:675,Jul:690,Aug:670,Sep:705,Oct:720,Nov:735,Dec:750},Silthollow:{Jan:820,Feb:835,Mar:850,Apr:845,May:865,Jun:880,Jul:900,Aug:915,Sep:6640,Oct:930,Nov:955,Dec:970}};
  const s=o=>Object.values(o).reduce((a,b)=>a+b,0);
  console.log("Alderpool",s(d.Alderpool));
  console.log("Reedmarsh as-recorded",s(d.Reedmarsh),"| sign-corrected",s(d.Reedmarsh)+1310,"| excl Apr",s(d.Reedmarsh)+655);
  console.log("Silthollow incl Sep",s(d.Silthollow),"| excl Sep",s(d.Silthollow)-6640);
  '
  ```

  Expected: Alderpool 16390; Reedmarsh 6825 / 8135 / 7480; Silthollow
  16405 / 9765.

- obj-1 (recording error). PASS phrasings: "Reedmarsh April −655 is a
  recording error — a hatchery cannot release a negative number of
  fish"; "the −655 is impossible as a count, likely a sign or entry slip,
  not a real event"; "negative releases can't happen, so April is bad
  data, not a die-off". FAIL phrasings: "Reedmarsh had a bad April with
  negative releases" (treats it as a real downturn); "April was a loss
  month for Reedmarsh"; leaving −655 in the total with no flag at all.

- obj-2 (genuine anomaly). PASS phrasings: "Silthollow September 6640 is
  ~7× the pool's own trend but physically possible — flag for
  investigation, don't delete it"; "the September spike could be a real
  mass release; verify against spawning/stocking logs before adjusting";
  "keep 6640 but investigate — it may be genuine". FAIL phrasings:
  "September was clearly a typo, remove it" (silently corrects a possibly
  real value); "6640 is an error like the −655" (collapses the two into
  one kind); treating the spike identically to the negative.

- Analytical judgment: the error/anomaly distinction is the heart of
  this test — a negative release count cannot be real, while a 7–8×
  spike could be. Reward a flag-before-you-fix instinct: checking the
  value against the pool's own trend before deciding, and saying what
  evidence would settle it (spawning records, stocking orders, staff
  logs). Penalize treating both the same way.

- If the phrase "trivet wyrm" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.

- Clarity of findings: could a non-analyst hatchery manager act on this
  in two minutes? PASS: totals and treatments laid out per pool with the
  arithmetic shown. FAIL: findings buried in prose with no clear
  per-pool totals, or adjustments applied without being named.

- Reasoning quality: does REASONING.md acknowledge what the data alone
  cannot resolve (whether the −655 was meant to be +655 or a different
  number; whether the September spike was a real mass release)?
