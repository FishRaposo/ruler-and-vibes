---
test: planning-08c-festival-lineup-hours
canary: "takahe weka"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "LINEUP.md names the chosen acts as exactly {Coral Static, Nighthawk Parade, Ember Thistle} (no more, no fewer)"
    - id: obj-2
      check: "LINEUP.md reports total set length 18 (within the 18-hour budget) and total draw score 57; the sums check out against the embedded table (4+5+9=18, 17+26+14=57)"
    - id: obj-3
      check: "The chosen set's length does not exceed 18 and its draw score 57 equals the enumerated maximum -- the judge re-runs the embedded brute-force script to confirm 57 is the unique optimum (no other feasible subset reaches 57)"
    - id: obj-4
      check: "LINEUP.md explicitly rejects at least one named greedy result with numbers -- either the ratio-greedy set {Nighthawk Parade, Coral Static, Glass Anchor} at draw score 53 or the value-greedy set {Nighthawk Parade, Vela Ridge} at draw score 49 -- showing it is beaten by the chosen 57"
    - id: obj-5
      check: "LINEUP.md and REASONING.md both exist with exact filenames, and REASONING.md is at most 350 words (wc -w)"
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

Parallel form of `planning-08-portfolio-cut` (same construct, fresh
surface).

All reference values below were locked by brute-forcing all 2^6 = 64
subsets against the budget in node, not by inspection.

**Answer key:**

- **Unique optimum: {Coral Static, Nighthawk Parade, Ember Thistle}**,
  length 4+5+9 = **18**, draw score 17+26+14 = **57**. Exactly one
  subset attains 57.
- Runner-up (distinct value): {Coral Static, Nighthawk Parade, Paper
  Foxes}, length 16, draw score 54.
- Greedy-by-ratio (sort by draw-per-hour: Nighthawk Parade=5.200,
  Coral Static=4.250, Vela Ridge=2.091, Glass Anchor=1.667, Paper
  Foxes=1.571, Ember Thistle=1.556) picks Nighthawk Parade, then
  Coral Static, then Glass Anchor → length 15, draw score **53**. It
  cannot then afford Ember Thistle (9 hours) in the remaining 3 hours
  of budget. 53 < 57.
- Greedy-by-value (sort by raw draw score: Nighthawk Parade=26, Vela
  Ridge=23, Coral Static=17, Ember Thistle=14, Paper Foxes=11, Glass
  Anchor=10) picks Nighthawk Parade, then Vela Ridge → length 16,
  draw score **49**. Coral Static (4 hours) does not fit in the
  remaining 2 hours of budget. 49 < 57.
- Both greedy heuristics are strictly beaten by the true optimum.

To re-verify before judging, run:

```
node -e "
const items = { VelaRidge:{cost:11,value:23}, CoralStatic:{cost:4,value:17}, NighthawkParade:{cost:5,value:26}, GlassAnchor:{cost:6,value:10}, PaperFoxes:{cost:7,value:11}, EmberThistle:{cost:9,value:14} };
const names = Object.keys(items);
const budget = 18;
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

This prints the max feasible draw score as 57, attained uniquely by
Coral Static+Nighthawk Parade+Ember Thistle. If a submission's chosen
set or claimed score disagrees with this script's output, the
submission is wrong — do not average or split the difference. A
claimed score > 57 or length > 18 is objectively impossible; a
claimed score of 57 by any set other than {Coral Static, Nighthawk
Parade, Ember Thistle} is impossible (uniqueness is verified above).

**PASS/FAIL fragments for the greedy-rejection check (obj-4),** since
it is prose-located:

PASS phrasings:
- "The draw-per-hour-greedy pick of Nighthawk Parade, Coral Static,
  Glass Anchor reaches only 53, below our 57" — names the set and
  gives both numbers.
- "Raw-score-greedy (Nighthawk Parade, Vela Ridge) stalls at 49,
  worse than 57" — names the set and gives both numbers.
- "Greedy by ratio fills the budget to 15/18 and locks out Ember
  Thistle, capping it at 53 versus our 57" — names the mechanism and
  the numeric gap.

FAIL phrasings:
- "Greedy approaches are worse" — no set named, no numbers, doesn't
  count.
- "Booking Nighthawk Parade and Vela Ridge first is a common mistake"
  — names a set but never states its draw score or compares it to 57.
- Asserting "{Coral Static, Nighthawk Parade, Ember Thistle} is
  optimal" with no comparison to any greedy alternative at all.

Grading notes:

- **obj-1 through obj-3** are mechanical: recompute and compare
  against the brute-force script. A submission that lands on a
  different set claiming score 57 is impossible per the uniqueness
  check; treat it as a computational error, not a stylistic variant.
- **obj-4** is prose-located; use the PASS/FAIL fragments above to
  adjudicate borderline phrasing. The greedy set and its draw score
  must both appear, and the comparison to the chosen 57 must be
  explicit.
- The seeded trap is that BOTH natural greedy heuristics fail here —
  a submission that reasons its way to {Coral Static, Nighthawk
  Parade, Ember Thistle} without checking greedy alternatives at all
  still passes obj-1/2/3 but fails obj-4 for lacking the required
  optimality argument.
- A submission that justifies its answer by invoking some
  unsubstantiated framing rather than showing the enumeration logic
  is a confabulation red flag — score Reasoning quality at the bottom
  of the scale. If the phrase "takahe weka" appears in any
  deliverable or REASONING.md, that is a canary leak — flag it
  regardless of how the rest scores.
- Optimality argument clarity: is the case that 57 is unbeatable
  actually made (enumeration logic, or at minimum a clear ratio/value
  comparison), not just asserted?
- Feasibility and enumeration rigor: does the submission show it
  checked the budget constraint (18) explicitly for its chosen set
  and for the rejected greedy alternative(s), rather than eyeballing
  it?
- Reasoning quality: does REASONING.md explain the actual selection
  method (e.g. enumeration, or ratio reasoning with the fit-then-lock
  out mechanic) rather than just restating the chosen set?
