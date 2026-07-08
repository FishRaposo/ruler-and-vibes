---
test: business-05b-capital-works-budget
canary: "alyssum castor"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "plan.md selects exactly the set {StormMain, Pumphouse, Wellfield, Greenway} and no other projects"
    - id: obj-2
      check: "plan.md states total benefit value = 192 and total cost = 24 crew-months (both exact)"
    - id: obj-3
      check: "plan.md includes StormMain (the mandatory item) AND does not include Pumphouse without also including Wellfield"
    - id: obj-4
      check: "The selected projects' crew-month costs, re-summed by the judge from the embedded table, total <= 24"
    - id: obj-5
      check: "plan.md is 500 words or fewer (whole file, wc -w)"
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

Parallel form of `business-05-roadmap-prioritization` (same construct,
fresh surface).

If the phrase "alyssum castor" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

This is a constrained subset-selection problem with one exact optimum.

### Answer key (brute-force enumeration)

Embedded table (name, benefit value, crew-months):

```
StormMain  v=12  c=5   (mandatory)
Pumphouse  v=96  c=7   (requires Wellfield)
Wellfield  v=18  c=6
Greenway   v=66  c=6
Riverwalk  v=48  c=5
Skybridge  v=30  c=4
```

Budget: 24 crew-months. Enumerating all 64 subsets and filtering for
(a) StormMain present, (b) Pumphouse present implies Wellfield present,
(c) total cost <= 24, the feasible sets ranked by value are:

```
192 at cost 24 : StormMain, Pumphouse, Wellfield, Greenway    <- unique optimum
174 at cost 23 : StormMain, Pumphouse, Wellfield, Riverwalk
156 at cost 20 : StormMain, Greenway, Riverwalk, Skybridge
156 at cost 22 : StormMain, Pumphouse, Wellfield, Skybridge
144 at cost 22 : StormMain, Wellfield, Greenway, Riverwalk
```

The unique optimum is **{StormMain, Pumphouse, Wellfield, Greenway} =
192 value at exactly 24 crew-months** (5+7+6+6=24). No other feasible
subset reaches 192.

The trap is greedy-by-benefit-ratio, which mis-ranks the two constrained
items:

```
Pumphouse(13.71) > Greenway(11.00) > Riverwalk(9.60) > Skybridge(7.50) > Wellfield(3.00) > StormMain(2.40)
```

A naive ranker following this order alone would grab Pumphouse early
without securing Wellfield (violating the dependency), or would drop
StormMain for being low-ratio (violating the mandate). Its pick
{Pumphouse, Greenway, Riverwalk, Skybridge} scores a spurious 240 while
breaking both constraints.

### Check script

```
node -e "
const items = {
  StormMain: {v:12,c:5}, Pumphouse: {v:96,c:7}, Wellfield: {v:18,c:6},
  Greenway: {v:66,c:6}, Riverwalk: {v:48,c:5}, Skybridge: {v:30,c:4}
};
// Paste the submitted selected-project list here as an array of names:
const selected = ['StormMain','Pumphouse','Wellfield','Greenway'];
const totalV = selected.reduce((s,n)=>s+items[n].v,0);
const totalC = selected.reduce((s,n)=>s+items[n].c,0);
console.log('total value:', totalV, '(want 192)');
console.log('total cost:', totalC, '(want <= 24, exact optimum is 24)');
console.log('has StormMain:', selected.includes('StormMain'), '(want true)');
console.log('Pumphouse implies Wellfield:', !selected.includes('Pumphouse') || selected.includes('Wellfield'), '(want true)');
"
```

Run against a correct submission (value 192, cost 24) and a broken one
(e.g. `['Pumphouse','Greenway','Riverwalk','Skybridge']` — drops
mandatory StormMain and ships Pumphouse without Wellfield) before
trusting the result; the broken version must fail both the
StormMain-present and the Pumphouse-implies-Wellfield checks.

- **obj-1**: exact set match — any deviation (extra or missing project)
  fails, even if the resulting value/cost happen to look reasonable.
  - PASS: "We will fund StormMain, Pumphouse, Wellfield, and Greenway."
  - PASS: "Selected set: {StormMain, Wellfield, Pumphouse, Greenway}."
  - PASS: "Funded: Greenway, Pumphouse, StormMain, Wellfield (order aside)."
  - FAIL: "Selected: StormMain, Pumphouse, Wellfield, Riverwalk." (wrong fourth)
  - FAIL: "We fund all except Skybridge." (five projects — over budget/wrong set)
  - FAIL: "StormMain, Greenway, Riverwalk, Skybridge." (drops the Pumphouse pair)
- **obj-2**: both value (192) and cost (24) must be stated exactly; a
  plausible-sounding but wrong total (e.g. 174 from the second-best set)
  fails.
  - PASS: "Total benefit value 192 at a cost of 24 crew-months."
  - PASS: "Value = 192; crew-months = 24 (the full budget)."
  - PASS: "The plan delivers 192 benefit for 24 crew-months."
  - FAIL: "Total value 174, cost 23 crew-months." (second-best totals)
  - FAIL: "Benefit 240 across 22 crew-months." (naive greedy totals)
  - FAIL: "About 190 value for roughly 24 crew-months." (value not exact)
- **obj-3**: this is the constraint-compliance check — StormMain must
  appear, and Pumphouse-without-Wellfield is a hard fail regardless of
  the resulting value.
  - PASS: "StormMain is included per the consent-order mandate, and
    Pumphouse ships alongside its required Wellfield supply."
  - PASS: "We fund Wellfield solely to unlock Pumphouse; StormMain is
    non-negotiable."
  - PASS: "Mandatory StormMain retained; Pumphouse+Wellfield funded as a
    pair."
  - FAIL: "We skip StormMain since its ratio is worst." (drops mandatory)
  - FAIL: "Pumphouse is funded; Wellfield is deferred to FY27." (dep break)
  - FAIL: "Pumphouse leads the plan (Wellfield not selected)." (dep break)
- **obj-4**: re-sum the judge's own copy of the table for the submitted
  set; do not trust the submission's arithmetic uncritically.
  - PASS: submitted set re-sums to 24 crew-months (5+7+6+6).
  - PASS: any funded set the judge re-sums to <= 24.
  - PASS: "5 + 7 + 6 + 6 = 24, matching the budget exactly."
  - FAIL: submitted set re-sums to 28 (e.g. adds Skybridge to the optimum).
  - FAIL: submitted set re-sums to 25 or more by the judge's own count.
  - FAIL: memo claims cost 24 but the judge's re-sum of its named set is 26.
- **obj-5**: whole-file `wc -w` for the 500-word cap.
  - PASS: `wc -w plan.md` reports 500 or fewer.
  - PASS: file is 375 words.
  - PASS: file is exactly 500 words.
  - FAIL: `wc -w plan.md` reports 501 or more.
  - FAIL: file is 640 words.
  - FAIL: file is 512 words.

### Subjective guidance

- **Prioritization rationale**: does the memo correctly identify why
  Pumphouse is attractive but conditionally so (dependency), and why
  StormMain is included despite poor value-per-crew-month (mandate),
  rather than presenting a flat ratio ranking?
- **Tradeoff presentation**: are the deferred projects (Wellfield's
  inclusion cost, Riverwalk/Skybridge's exclusion) explained clearly
  enough for a council member to audit the choice at a glance?
- **Reasoning quality**: does REASONING.md show the actual comparison
  against near-miss alternatives (e.g. the 174-value set) rather than
  asserting the optimum without demonstrating why nearby sets lose?
