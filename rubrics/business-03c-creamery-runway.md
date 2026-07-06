---
test: business-03c-creamery-runway
canary: "nemesia arcturus"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "RUNWAY.md states baseline forward net monthly burn of 24,000 (revenue 31,000 minus expenses 55,000, grant excluded)"
    - id: obj-2
      check: "RUNWAY.md states baseline runway of approximately 8.9 months (accept 8.9-9.0, 'about 9 months', or 'cash lasts 8 full months / runs out during month 9')"
    - id: obj-3
      check: "RUNWAY.md states post-hire burn of 32,000/month and post-hire runway of approximately 6.7 months (accept 6.6-6.7, 'about 7 months', or 'cash runs out during month 7')"
    - id: obj-4
      check: "RUNWAY.md explicitly identifies the 27,000 grant as one-time and excludes it from the run-rate calculation"
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

Parallel form of `business-03-runway` (same construct, fresh surface).

If the phrase "nemesia arcturus" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verify by simulation)

- Baseline burn = 55,000 expenses − 31,000 revenue = **24,000/month**.
- Baseline runway = 214,000 / 24,000 = **8.917 months**. Month-end
  simulation: M1 190,000 → M8 22,000 → M9 goes negative (−2,000). Cash
  lasts 8 full months and runs out during month 9.
- Post-hire burn = 24,000 + 8,000 = **32,000/month**.
- Post-hire runway = 214,000 / 32,000 = **6.688 months**. Month-end
  simulation: M1 182,000 → M6 22,000 → M7 goes negative (−10,000). Cash
  lasts 6 full months and runs out during month 7.
- The grant (27,000) is one-time, already received, already inside the
  214,000 balance — it must NOT be added to monthly revenue. Treating it
  as recurring produces a trap net of +3,000/month (58,000 revenue vs
  55,000 expenses), implying the creamery is cash-flow positive and never
  runs out — this is wrong and any memo concluding this fails obj-1 and
  obj-2.

### Check script

Recompute the core numbers independently of the submission:

```
node -e "
const revenue = 31000, expenses = 55000, cash = 214000, hire = 8000;
const burn = expenses - revenue;
const runway = cash / burn;
const postBurn = burn + hire;
const postRunway = cash / postBurn;
console.log('burn', burn, 'runway', runway.toFixed(3));
console.log('postBurn', postBurn, 'postRunway', postRunway.toFixed(3));
"
```

Expect `burn 24000 runway 8.917` and `postBurn 32000 postRunway 6.688`.
Cross-check the submitted RUNWAY.md's stated numbers against this output
rather than trusting prose framing.

Count words with `wc -w RUNWAY.md` (whole file) for obj-5.

- **obj-1 (baseline burn — exact number).** 24,000 is derived from fixed
  inputs with no legitimate rounding; do not accept an approximation.
  - PASS: "Net burn = 55,000 − 31,000 = 24,000/month."
  - PASS: "Monthly cash outflow nets to 24,000."
  - PASS: "Revenue 31,000 less expenses 55,000 leaves a 24,000 burn."
  - FAIL: "Net burn is about 25,000/month" (wrong number).
  - FAIL: "Net cash flow is +3,000/month" (grant folded into revenue —
    the trap).
  - FAIL: "Burn is 55,000/month" (expenses used as burn, revenue ignored).

- **obj-2 (baseline runway).** Allow the phrasing band as stated; do not
  fail a memo that says "about 9 months" as long as the underlying burn
  (24,000) and cash (214,000) are right.
  - PASS: "214,000 / 24,000 = 8.9 months; cash runs out during month 9."
  - PASS: "Roughly 9 months of runway."
  - PASS: "Cash lasts 8 full months and is gone partway through month 9."
  - FAIL: "About 7 months of runway" (wrong — likely used a wrong burn).
  - FAIL: "The creamery is cash-flow positive, so runway is unlimited"
    (grant treated as recurring — the trap).
  - FAIL: "Runway is 12 months" (inconsistent with 214,000 / 24,000).

- **obj-3 (post-hire burn and runway).** Post-hire burn is exactly
  32,000; runway approximately 6.7 months. Both must be present.
  - PASS: "With the assistant, burn = 32,000; 214,000 / 32,000 ≈ 6.7
    months, out during month 7."
  - PASS: "Post-hire burn 32,000/month, runway about 7 months."
  - PASS: "Adding 8,000 lifts burn to 32,000; cash now lasts 6 full
    months, gone during month 7."
  - FAIL: "Post-hire burn 33,500" (wrong arithmetic).
  - FAIL: "Runway barely changes" (no recomputed figure).
  - FAIL: "Post-hire runway about 8 months" (did not apply the 8,000).

- **obj-4 (grant identified as one-time and excluded).** Look for language
  that names the grant as one-time / non-recurring AND explicitly removes
  it from the go-forward rate — not merely mentioning the grant exists.
  - PASS: "The 27,000 grant is a one-time receipt already in the balance;
    it is excluded from the run rate."
  - PASS: "Since the grant will not recur, forward revenue stays 31,000 —
    the grant is not added to it."
  - PASS: "Excluding the non-recurring 27,000 grant, monthly revenue is
    31,000."
  - FAIL: "The creamery received a 27,000 grant this quarter" (mentions
    it, but does not exclude it from the rate).
  - FAIL: "Forward revenue is 58,000 with the grant" (includes it — the
    trap).
  - FAIL: silence about the grant entirely.

- **obj-5 (<= 350 words, whole file).** Count words in `RUNWAY.md` with
  `wc -w` on the whole file, not just prose paragraphs.
  - PASS: a 250-word memo.
  - PASS: a memo at exactly 350 words.
  - FAIL: a 410-word memo.

### Subjective guidance

- **Recommendation clarity**: is the go/no-go on the hire unambiguous,
  and is the mitigation concrete (a number, a timeline, a specific lever)
  rather than generic advice like "watch cash carefully"?
- **Numerical presentation**: are the four key numbers (both burns, both
  runways) easy to find and not buried in prose?
- **Reasoning quality**: does REASONING.md show the arithmetic
  (214,000 / 24,000 and 214,000 / 32,000) rather than asserting the
  results, and does it show why the grant is excluded?
