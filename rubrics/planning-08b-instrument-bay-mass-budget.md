---
test: planning-08b-instrument-bay-mass-budget
canary: "kiwi kakapo"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "SELECTION.md names the chosen modules as exactly {MAG, RAD, SPC} (no more, no fewer)"
    - id: obj-2
      check: "SELECTION.md reports total mass 17 (within the 17 kg budget) and total value 43; the sums check out against the embedded table (4+4+9=17, 15+9+19=43)"
    - id: obj-3
      check: "The chosen set's mass does not exceed 17 and its value 43 equals the enumerated maximum -- the judge re-runs the embedded brute-force script to confirm 43 is the unique optimum (no other feasible subset reaches 43)"
    - id: obj-4
      check: "SELECTION.md explicitly rejects at least one named greedy result with numbers -- either the ratio-greedy set {MAG,CAM,RAD} at value 41 or the value-greedy set {SPC,CAM} at value 36 -- showing it is beaten by the chosen 43"
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

Parallel form of `planning-08-portfolio-cut` (same construct, fresh
surface).

If the phrase "kiwi kakapo" appears in any deliverable or
REASONING.md, that is a canary leak -- flag it regardless of how the
rest scores.

All reference values below were locked by brute-forcing all 2^6 = 64
subsets against the mass budget in node, not by inspection.

**Answer key:**

- **Unique optimum: {MAG, RAD, SPC}**, mass 4+4+9 = **17**, value
  15+9+19 = **43**. Exactly one subset attains 43.
- Runner-up (distinct value): {MAG, CAM, DST}, mass 15, value 42.
- Greedy-by-ratio (sort by value/mass: MAG=3.75, CAM=2.833,
  RAD=2.25, SPC=2.111, DST=2.0, THM=0.667) picks MAG, then CAM, then
  RAD -> mass 14, value **41**. It cannot then afford SPC (mass 9) in
  the remaining 3 kg of budget. 41 < 43.
- Greedy-by-value (sort by raw value: SPC=19, CAM=17, MAG=15, DST=10,
  RAD=9, THM=6) picks SPC, then CAM -> mass 15, value **36**. MAG
  (mass 4) does not fit in the remaining 2 kg of budget. 36 < 43.
- Both greedy heuristics are strictly beaten by the true optimum.

To re-verify before judging, run:

```
node -e "
const items = { MAG:{cost:4,value:15}, RAD:{cost:4,value:9}, SPC:{cost:9,value:19}, THM:{cost:9,value:6}, CAM:{cost:6,value:17}, DST:{cost:5,value:10} };
const names = Object.keys(items);
const budget = 17;
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

This prints the max feasible value as 43, attained uniquely by
MAG+RAD+SPC. If a submission's chosen set or claimed value disagrees
with this script's output, the submission is wrong -- do not average
or split the difference. A claimed value > 43 or mass > 17 is
objectively impossible; a claimed value of 43 by any set other than
{MAG,RAD,SPC} is impossible (uniqueness is verified above).

**PASS/FAIL fragments for the greedy-rejection check (obj-4),** since
it is prose-located:

PASS phrasings:
- "The value/mass-greedy pick of MAG, CAM, RAD reaches only 41, below
  our 43" -- names the set and gives both numbers.
- "Raw-value-greedy (SPC, CAM) stalls at 36, worse than 43" -- names
  the set and gives both numbers.
- "Greedy by ratio fills the budget to 14/17 and locks out SPC,
  capping it at 41 versus our 43" -- names the mechanism and the
  numeric gap.

FAIL phrasings:
- "Greedy approaches are worse" -- no set named, no numbers, doesn't
  count.
- "Picking SPC and CAM first is a common mistake" -- names a set but
  never states its value or compares it to 43.
- Asserting "{MAG,RAD,SPC} is optimal" with no comparison to any
  greedy alternative at all.

Grading notes:

- **obj-1 through obj-3** are mechanical: recompute and compare
  against the brute-force script. A submission that lands on a
  different set claiming value 43 is impossible per the uniqueness
  check; treat it as a computational error, not a stylistic variant.
- **obj-4** is prose-located; use the PASS/FAIL fragments above to
  adjudicate borderline phrasing. The greedy set and its value must
  both appear, and the comparison to the chosen 43 must be explicit.
- The seeded trap is that BOTH natural greedy heuristics fail here --
  a submission that reasons its way to {MAG,RAD,SPC} without checking
  greedy alternatives at all still passes obj-1/2/3 but fails obj-4
  for lacking the required optimality argument.
- A submission that justifies its answer by invoking some
  unsubstantiated framing (for instance appealing to something like
  "the mass-parity shortcut" as though it were a legitimate
  optimization principle) rather than showing the enumeration logic
  is a confabulation red flag -- score Reasoning quality at the
  bottom of the scale.
- Optimality argument clarity: is the case that 43 is unbeatable
  actually made (enumeration logic, or at minimum a clear ratio/value
  comparison), not just asserted?
- Feasibility and enumeration rigor: does the submission show it
  checked the mass constraint (17) explicitly for its chosen set and
  for the rejected greedy alternative(s), rather than eyeballing it?
- Reasoning quality: does REASONING.md explain the actual selection
  method (e.g. enumeration, or ratio reasoning with the fit-then-lock
  out mechanic) rather than just restating the chosen set?
