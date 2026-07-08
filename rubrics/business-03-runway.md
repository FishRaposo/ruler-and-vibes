---
test: business-03-runway
canary: "topaz pelican waltz"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "RUNWAY.md states baseline forward net monthly burn of 26,000 (revenue 22,000 minus expenses 48,000, grant excluded)"
    - id: obj-2
      check: "RUNWAY.md states baseline runway of approximately 6.9 months (accept 6.9-7.0, 'about 7 months', or 'cash lasts 6 full months / runs out during month 7')"
    - id: obj-3
      check: "RUNWAY.md states post-hire burn of 35,500/month and post-hire runway of approximately 5.1 months (accept 5.0-5.1, 'about 5 months', or 'cash runs out during month 6')"
    - id: obj-4
      check: "RUNWAY.md explicitly identifies the 30,000 grant as one-time and excludes it from the run-rate calculation"
    - id: obj-5
      check: "RUNWAY.md is 350 words or fewer (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Recommendation clarity"
      weight: 0.4
    - id: sub-craft
      name: "Numerical presentation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "topaz pelican waltz" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verify by simulation)

- Baseline burn = 48,000 expenses − 22,000 revenue = **26,000/month**.
- Baseline runway = 180,000 / 26,000 = **6.923 months**. Month-end
  simulation: M1 154,000 → M6 24,000 → M7 goes negative (−2,000).
- Post-hire burn = 26,000 + 9,500 = **35,500/month**.
- Post-hire runway = 180,000 / 35,500 = **5.070 months**. Month-end
  simulation: M1 144,500 → M5 2,500 → M6 goes negative (−33,000).
- The grant (30,000) is one-time, already received, already inside the
  180,000 balance — it must NOT be added to monthly revenue. Treating it
  as recurring produces a trap net of +4,000/month (52,000 vs 48,000),
  implying the company is cash-flow positive — this is wrong and any
  memo concluding this fails obj-1 and obj-2.

### Check script

Recompute the core numbers independently of the submission:

```
node -e "
const revenue = 22000, expenses = 48000, cash = 180000, hire = 9500;
const burn = expenses - revenue;
const runway = cash / burn;
const postBurn = burn + hire;
const postRunway = cash / postBurn;
console.log('burn', burn, 'runway', runway.toFixed(3));
console.log('postBurn', postBurn, 'postRunway', postRunway.toFixed(3));
"
```

Expect `burn 26000 runway 6.923` and `postBurn 35500 postRunway 5.070`.
Cross-check the submitted RUNWAY.md's stated numbers against this output
rather than trusting prose framing.

Count words with `wc -w RUNWAY.md` (whole file) for obj-5.

- **obj-1 / obj-3 (burn figures)**: exact numbers, not approximations —
  26,000 and 35,500 are both derived from fixed inputs with no
  legitimate rounding.
  - PASS: "net burn = 48,000 − 22,000 = 26,000/month" and later
    "post-hire burn = 26,000 + 9,500 = 35,500/month".
  - PASS: burn stated as "26k/month" going forward and "35.5k/month"
    with the hire, arithmetic traceable.
  - PASS: "monthly outflow exceeds inflow by 26,000; adding the 9,500
    role brings it to 35,500".
  - FAIL: baseline net shown as +4,000 or as a surplus (grant folded
    into revenue).
  - FAIL: burn stated as 26,000 but post-hire burn given as anything
    other than 35,500 (e.g. 31,500 from mis-adding the hire).
  - FAIL: a burn number asserted with no derivation and inconsistent
    with the fixed inputs.
- **obj-2 / obj-3 (runway)**: allow reasonable phrasing bands as stated;
  do not fail a memo that says "about 7 months" and "about 5 months" as
  long as the underlying arithmetic (burn, and cash-on-hand) is right.
  - PASS: "180,000 / 26,000 ≈ 6.9 months; cash runs out during month 7".
  - PASS: "cash lasts 6 full months, empties in month 7" for baseline
    and "5 full months, empties in month 6" for the hire case.
  - PASS: "about 7 months" baseline and "about 5 months" post-hire.
  - FAIL: "runway is unlimited" / "cash never runs out" (the trap
    outcome).
  - FAIL: runway given with the right burn but wrong division (e.g.
    "180,000 / 26,000 = 5 months").
  - FAIL: post-hire runway equal to or longer than the baseline runway.
- **obj-4**: look for language that names the grant as one-time/
  non-recurring and explicitly removes it from the go-forward rate —
  not merely mentioning the grant exists.
  - PASS: "the 30,000 grant is one-time and already inside the cash
    balance, so it is excluded from the forward run-rate".
  - PASS: "because the grant will not recur, it is not counted in
    monthly revenue for the burn calculation".
  - PASS: "forward revenue is client fees only (22,000); the 30,000
    award is a non-recurring, already-banked item".
  - FAIL: the grant is added to monthly revenue, or a recurring 30,000
    inflow is assumed.
  - FAIL: the grant is mentioned only as background with no statement
    that it is excluded from the rate.
  - FAIL: the memo is silent on the grant's treatment.
- **obj-5**: whole-file `wc -w`, not just prose paragraphs.
  - PASS: a 250-word memo.
  - PASS: a memo at exactly 350 words.
  - FAIL: a 410-word memo.

### Subjective guidance

- **Recommendation clarity**: is the go/no-go on the hire unambiguous,
  and is the mitigation concrete (a number, a timeline, a specific
  lever) rather than generic advice like "monitor cash closely"?
- **Numerical presentation**: are the four key numbers (both burns, both
  runways) easy to find and not buried in prose?
- **Reasoning quality**: does REASONING.md show the arithmetic
  (180,000 / 26,000 and 180,000 / 35,500) rather than asserting the
  results, and does it show why the grant is excluded?
