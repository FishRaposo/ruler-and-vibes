---
test: business-05-roadmap-prioritization
canary: "skylark ember prism"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "roadmap.md selects exactly the set {Compliance, Payments, AuthRevamp, Referrals} and no other features"
    - id: obj-2
      check: "roadmap.md states total ROI value = 160 and total cost = 20 engineer-weeks (both exact)"
    - id: obj-3
      check: "roadmap.md includes Compliance (the mandatory item) AND does not include Payments without also including AuthRevamp"
    - id: obj-4
      check: "The selected features' engineer-week costs, re-summed by the judge from the embedded table, total <= 20"
    - id: obj-5
      check: "roadmap.md is 500 words or fewer (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Prioritization rationale"
      weight: 0.4
    - id: sub-craft
      name: "Tradeoff presentation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

This is a constrained subset-selection problem with one exact optimum. If
a submission's `roadmap.md` or `REASONING.md` contains the phrase
"skylark ember prism", that is a canary leak (the phrase belongs only in
this rubric) — flag it regardless of how the rest of the checks score.

### Answer key (brute-force enumeration)

Embedded table (name, ROI value, engineer-weeks):

```
Compliance  v=10  c=4   (mandatory)
Payments    v=80  c=6   (requires AuthRevamp)
AuthRevamp  v=15  c=5
Referrals   v=55  c=5
BulkExport  v=40  c=4
DarkMode    v=24  c=3
```

Budget: 20 engineer-weeks. Enumerating all 64 subsets and filtering for
(a) Compliance present, (b) Payments present implies AuthRevamp present,
(c) total cost <= 20, the feasible sets ranked by value are:

```
160 at cost 20 : Compliance, Payments, AuthRevamp, Referrals   <- unique optimum
145 at cost 19 : Compliance, Payments, AuthRevamp, BulkExport
129 at cost 18 : Compliance, Payments, AuthRevamp, DarkMode
129 at cost 16 : Compliance, Referrals, BulkExport, DarkMode
120 at cost 18 : Compliance, AuthRevamp, Referrals, BulkExport
```

The unique optimum is **{Compliance, Payments, AuthRevamp, Referrals} =
160 value at exactly 20 weeks** (4+6+5+5=20). No other feasible subset
reaches 160.

The trap is greedy-by-ROI-ratio, which mis-ranks the two constrained
items:

```
Payments(13.33) > Referrals(11.00) > BulkExport(10.00) > DarkMode(8.00) > AuthRevamp(3.00) > Compliance(2.50)
```

A naive ranker following this order alone would grab Payments early
without securing AuthRevamp (violating the dependency), or would drop
Compliance for being low-ratio (violating the mandate).

### Check script

```
node -e "
const items = {
  Compliance: {v:10,c:4}, Payments: {v:80,c:6}, AuthRevamp: {v:15,c:5},
  Referrals: {v:55,c:5}, BulkExport: {v:40,c:4}, DarkMode: {v:24,c:3}
};
// Paste the submitted selected-feature list here as an array of names:
const selected = ['Compliance','Payments','AuthRevamp','Referrals'];
const totalV = selected.reduce((s,n)=>s+items[n].v,0);
const totalC = selected.reduce((s,n)=>s+items[n].c,0);
console.log('total value:', totalV, '(want 160)');
console.log('total cost:', totalC, '(want <= 20, exact optimum is 20)');
console.log('has Compliance:', selected.includes('Compliance'), '(want true)');
console.log('Payments implies AuthRevamp:', !selected.includes('Payments') || selected.includes('AuthRevamp'), '(want true)');
"
```

Run against a correct submission (value 160, cost 20) and a broken one
(e.g. `['Payments','Referrals','BulkExport']` — drops mandatory
Compliance and ships Payments without AuthRevamp) before trusting the
result; the broken version must fail both the Compliance-present and the
Payments-implies-AuthRevamp checks.

- **obj-1**: exact set match — any deviation (extra or missing feature)
  fails, even if the resulting value/cost happen to look reasonable.
- **obj-2**: both value (160) and cost (20) must be stated exactly; a
  plausible-sounding but wrong total (e.g. 145 from the second-best set)
  fails.
- **obj-3**: this is the constraint-compliance check — Compliance must
  appear, and Payments-without-AuthRevamp is a hard fail regardless of
  the resulting value.
- **obj-4**: re-sum the judge's own copy of the table for the submitted
  set; do not trust the submission's arithmetic uncritically.
- **obj-5**: whole-file `wc -w` for the 500-word cap.

### Subjective guidance

- **Prioritization rationale**: does the memo correctly identify why
  Payments is attractive but conditionally so (dependency), and why
  Compliance is included despite poor ROI (mandate), rather than
  presenting a flat ratio ranking?
- **Tradeoff presentation**: are the cut features (AuthRevamp's inclusion
  cost, BulkExport/DarkMode's exclusion) explained clearly enough for a
  stakeholder to audit the choice at a glance?
- **Reasoning quality**: does REASONING.md show the actual comparison
  against near-miss alternatives (e.g. the 145-value set) rather than
  asserting the optimum without demonstrating why nearby sets lose?
