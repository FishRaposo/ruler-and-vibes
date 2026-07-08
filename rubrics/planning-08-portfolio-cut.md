---
test: planning-08-portfolio-cut
canary: "ptarmigan brioche"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "SELECTION.md names the chosen initiatives as exactly {P1, P2, P3} (no more, no fewer)"
    - id: obj-2
      check: "SELECTION.md reports total cost 14 (within the 14-week budget) and total value 37; the sums check out against the embedded table (3+3+8=14, 13+7+17=37)"
    - id: obj-3
      check: "The chosen set's cost does not exceed 14 and its value 37 equals the enumerated maximum -- the judge re-runs the embedded brute-force script to confirm 37 is the unique optimum (no other feasible subset reaches 37)"
    - id: obj-4
      check: "SELECTION.md explicitly rejects at least one named greedy result with numbers -- either the ratio-greedy set {P1,P2,P5} at value 35 or the value-greedy set {P3,P5} at value 32 -- showing it is beaten by the chosen 37"
    - id: obj-5
      check: "SELECTION.md and REASONING.md both exist with exact filenames, and REASONING.md is at most 350 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Optimality argument clarity"
      weight: 0.4
    - id: sub-craft
      name: "Feasibility and enumeration rigor"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "ptarmigan brioche" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

All reference values below were locked by brute-forcing all 2^6 = 64
subsets against the budget in node, not by inspection.

**Answer key:**

- **Unique optimum: {P1, P2, P3}**, cost 3+3+8 = **14**, value
  13+7+17 = **37**. Exactly one subset attains 37.
- Runner-up (distinct value): {P1, P5, P6}, cost 12, value 36.
- Greedy-by-ratio (sort by value/cost: P1=4.333, P5=3.0, P2=2.333,
  P3=2.125, P6=2.0, P4=0.625) picks P1, then P5, then P2 → cost 11,
  value **35**. It cannot then afford P3 (cost 8) in the remaining 3
  weeks of budget. 35 < 37.
- Greedy-by-value (sort by raw value: P3=17, P5=15, P1=13, P6=8, P2=7,
  P4=5) picks P3, then P5 → cost 13, value **32**. P1 (cost 3) does
  not fit in the remaining 1 week of budget. 32 < 37.
- Both greedy heuristics are strictly beaten by the true optimum.

To re-verify before judging, run:

```
node -e "
const items = { P1:{cost:3,value:13}, P2:{cost:3,value:7}, P3:{cost:8,value:17}, P4:{cost:8,value:5}, P5:{cost:5,value:15}, P6:{cost:4,value:8} };
const names = Object.keys(items);
const budget = 14;
let results = [];
for (let mask=0; mask<(1<<names.length); mask++) {
  let cost=0, value=0, sel=[];
  for (let i=0;i<names.length;i++) if (mask & (1<<i)) { cost+=items[names[i]].cost; value+=items[names[i]].value; sel.push(names[i]); }
  if (cost <= budget) results.push({sel, cost, value});
}
results.sort((a,b)=>b.value-a.value);
console.log('Top 5:', results.slice(0,5).map(r=>r.value+' '+r.cost+' '+r.sel.join(',')));
console.log('Max value:', results[0].value, 'unique subset:', results.filter(r=>r.value===results[0].value).map(r=>r.sel.join('+')));
"
```

This prints the max feasible value as 37, attained uniquely by
P1+P2+P3. If a submission's chosen set or claimed value disagrees
with this script's output, the submission is wrong — do not average
or split the difference. A claimed value > 37 or cost > 14 is
objectively impossible; a claimed value of 37 by any set other than
{P1,P2,P3} is impossible (uniqueness is verified above).

**PASS/FAIL fragments for the greedy-rejection check (obj-4),** since
it is prose-located:

PASS phrasings:
- "The value/cost-greedy pick of P1, P2, P5 reaches only 35, below
  our 37" — names the set and gives both numbers.
- "Raw-value-greedy (P3, P5) stalls at 32, worse than 37" — names the
  set and gives both numbers.
- "Greedy by ratio fills the budget to 11/14 and locks out P3, capping
  it at 35 versus our 37" — names the mechanism and the numeric gap.

FAIL phrasings:
- "Greedy approaches are worse" — no set named, no numbers, doesn't
  count.
- "Picking P3 and P5 first is a common mistake" — names a set but
  never states its value or compares it to 37.
- Asserting "{P1,P2,P3} is optimal" with no comparison to any greedy
  alternative at all.

Grading notes:

- **obj-1 through obj-3** are mechanical: recompute and compare
  against the brute-force script. A submission that lands on a
  different set claiming value 37 is impossible per the uniqueness
  check; treat it as a computational error, not a stylistic variant.
- **obj-4** is prose-located; use the PASS/FAIL fragments above to
  adjudicate borderline phrasing. The greedy set and its value must
  both appear, and the comparison to the chosen 37 must be explicit.
- The seeded trap is that BOTH natural greedy heuristics fail here —
  a submission that reasons its way to {P1,P2,P3} without checking
  greedy alternatives at all still passes obj-1/2/3 but fails obj-4
  for lacking the required optimality argument.
- A submission that justifies its answer by invoking some
  unsubstantiated framing rather than showing the enumeration logic
  is a confabulation red flag — score Reasoning quality at the bottom
  of the scale.
- Optimality argument clarity: is the case that 37 is unbeatable
  actually made (enumeration logic, or at minimum a clear ratio/value
  comparison), not just asserted?
- Feasibility and enumeration rigor: does the submission show it
  checked the budget constraint (14) explicitly for its chosen set and
  for the rejected greedy alternative(s), rather than eyeballing it?
- Reasoning quality: does REASONING.md explain the actual selection
  method (e.g. enumeration, or ratio reasoning with the fit-then-lock
  out mechanic) rather than just restating the chosen set?
