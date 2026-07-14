---
test: business-03b-cooperative-reserve
canary: "lobelia aldebaran"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "RUNWAY.md states baseline forward net monthly burn of 27,500 (revenue 27,000 minus expenses 54,500, grant excluded)"
    - id: obj-2
      check: "RUNWAY.md states baseline runway of approximately 7.8 months (accept 7.8-7.9, 'about 8 months', or 'reserve lasts 7 full months / runs out during month 8')"
    - id: obj-3
      check: "RUNWAY.md states post-hire burn of 40,000/month and post-hire runway of approximately 5.4 months (accept 5.3-5.4, 'about 5 months', or 'reserve runs out during month 6')"
    - id: obj-4
      check: "RUNWAY.md explicitly identifies the 40,000 grant as one-time and excludes it from the run-rate calculation"
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
anchors:
  - id: Recommendation clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Numerical presentation
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `business-03-runway` (same construct, fresh surface).

If the phrase "lobelia aldebaran" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verify by simulation)

- Baseline burn = 54,500 expenses − 27,000 revenue = **27,500/month**.
- Baseline runway = 215,000 / 27,500 = **7.818 months**. Month-end
  simulation: M1 187,500 → M7 22,500 → M8 goes negative (−5,000). The
  reserve lasts 7 full months and runs out during month 8.
- Post-hire burn = 27,500 + 12,500 = **40,000/month**.
- Post-hire runway = 215,000 / 40,000 = **5.375 months**. Month-end
  simulation: M1 175,000 → M5 15,000 → M6 goes negative (−25,000). Cash
  lasts 5 full months and runs out during month 6.
- The grant (40,000) is one-time, already received, already inside the
  215,000 reserve — it must NOT be added to monthly revenue. Treating it
  as recurring produces a trap net of +12,500/month (67,000 revenue vs
  54,500 expenses), implying the co-op is cash-flow positive with an
  unlimited runway — this is wrong and any memo concluding this fails
  obj-1 and obj-2.

### Check script

Recompute the core numbers independently of the submission:

```
node -e "
const revenue = 27000, expenses = 54500, cash = 215000, hire = 12500;
const burn = expenses - revenue;
const runway = cash / burn;
const postBurn = burn + hire;
const postRunway = cash / postBurn;
console.log('burn', burn, 'runway', runway.toFixed(3));
console.log('postBurn', postBurn, 'postRunway', postRunway.toFixed(3));
"
```

Expect `burn 27500 runway 7.818` and `postBurn 40000 postRunway 5.375`.
Cross-check the submitted RUNWAY.md's stated numbers against this output
rather than trusting prose framing.

Count words with `wc -w RUNWAY.md` (whole file) for obj-5.

- **obj-1 / obj-3 (burn figures)**: exact numbers, not approximations —
  27,500 and 40,000 are both derived from fixed inputs with no legitimate
  rounding.
  - PASS: "net burn = 54,500 − 27,000 = 27,500/month" and later
    "post-hire burn = 27,500 + 12,500 = 40,000/month".
  - PASS: burn stated as "27.5k/month" going forward and "40k/month"
    with the hire, arithmetic traceable.
  - PASS: "monthly outflow exceeds inflow by 27,500; adding the 12,500
    role brings it to 40,000".
  - FAIL: baseline net shown as +12,500 or as a surplus (grant folded
    into revenue).
  - FAIL: burn stated as 27,500 but post-hire burn given as anything
    other than 40,000 (e.g. 32,500 from mis-adding the hire).
  - FAIL: a burn number asserted with no derivation and inconsistent
    with the fixed inputs.
- **obj-2 / obj-3 (runway)**: allow reasonable phrasing bands as stated;
  do not fail a memo that says "about 8 months" and "about 5 months" as
  long as the underlying arithmetic (burn, and reserve-on-hand) is right.
  - PASS: "215,000 / 27,500 ≈ 7.8 months; runs out during month 8".
  - PASS: "reserve lasts 7 full months, empties in month 8" for baseline
    and "5 full months, empties in month 6" for the hire case.
  - PASS: "about 7.8 months" baseline and "about 5.4 months" post-hire.
  - FAIL: "runway is unlimited" / "the reserve never runs out" (the trap
    outcome).
  - FAIL: runway given with the right burn but wrong division (e.g.
    "215,000 / 27,500 = 5 months").
  - FAIL: post-hire runway equal to or longer than the baseline runway.
- **obj-4**: look for language that names the grant as one-time/
  non-recurring and explicitly removes it from the go-forward rate — not
  merely mentioning the grant exists.
  - PASS: "the 40,000 grant is one-time and already inside the reserve,
    so it is excluded from the forward run-rate".
  - PASS: "because the grant will not recur, it is not counted in monthly
    revenue for the burn calculation".
  - PASS: "forward revenue is dues + fees only (27,000); the 40,000 award
    is a non-recurring, already-banked item".
  - FAIL: the grant is added to monthly revenue, or a recurring 40,000
    inflow is assumed.
  - FAIL: the grant is mentioned only as background with no statement
    that it is excluded from the rate.
  - FAIL: the memo is silent on the grant's treatment.
- **obj-5**: whole-file `wc -w`, not just prose paragraphs.

### Subjective guidance

- **Recommendation clarity**: is the go/no-go on the wheelbuilder hire
  unambiguous, and is the mitigation concrete (a number, a timeline, a
  specific lever) rather than generic advice like "monitor the reserve
  closely"?
- **Numerical presentation**: are the four key numbers (both burns, both
  runways) easy to find and not buried in prose?
- **Reasoning quality**: does REASONING.md show the arithmetic
  (215,000 / 27,500 and 215,000 / 40,000) rather than asserting the
  results, and does it show why the grant is excluded?
