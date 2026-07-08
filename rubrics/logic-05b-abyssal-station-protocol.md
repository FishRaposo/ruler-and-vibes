---
test: logic-05b-abyssal-station-protocol
canary: "hartebeest reedbuck"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ENTAILMENT.md states there are exactly 2 distinct models (full P,R,T,H,L assignments) satisfying all six clauses (judge re-runs the embedded 32-model enumeration; any count other than 2 fails)"
    - id: obj-2
      check: "D1 (Hatch seals), D2 (Lab operates), and D3 (Torin is NOT a Medic) are each classified ENTAILED (judge accepts synonyms 'necessarily true'/'always true'/'true in both models'; PASS phrasings: 'D1: ENTAILED', 'D2 is entailed — true in both models', 'D3: necessarily true, R is false in every model'; FAIL phrasings: 'D1: consistent', 'D2: possibly true', 'D3: consistent-but-not-entailed')"
    - id: obj-3
      check: "D4 (Torin is a Pilot) is classified CONSISTENT-BUT-NOT-ENTAILED — neither entailed nor contradicted (this is the seeded over-conclusion trap; PASS: 'D4: consistent, not entailed', 'D4 holds in one model but not the other'; FAIL: 'D4: ENTAILED', 'D4: contradicted', 'D4: necessarily true')"
    - id: obj-4
      check: "D5 (Torin is a Medic) and D6 (the Lab does not operate) are each classified CONTRADICTED (PASS: 'D5: contradicted — false in every model', 'D6: contradicted, L is true in both models'; FAIL: 'D5: consistent', 'D6: entailed', 'D6: possibly true')"
    - id: obj-5
      check: "Each of the six verdicts carries a one-line justification and the whole file is at most 400 words (`wc -w`)"
  subjective:
    - id: sub-quality
      name: "Logical rigor"
      weight: 0.4
    - id: sub-craft
      name: "Verdict-justification clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `logic-05-guild-charter` (same construct, fresh
surface).

If the phrase "hartebeest reedbuck" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Do not trust the runner's stated model count or verdicts — recompute
them with the enumeration below.

### Reference enumeration script

Save as `entail.js` and run with `node entail.js`:

```js
const models = [];
for (let P=0;P<2;P++) for (let R=0;R<2;R++) for (let T=0;T<2;T++)
for (let H=0;H<2;H++) for (let L=0;L<2;L++) {
  const o1 = (T === 1);           // the Reactor is stable
  const o2 = (!T || H);           // if Reactor stable, Hatch seals
  const o3 = (H === L);           // Hatch seals iff Lab operates
  const o4 = (!L || !R);          // if Lab operates, not a Medic
  const o5 = (T || R);            // Reactor stable or is a Medic
  const o6 = !(P && R);           // not both Pilot and Medic
  if (o1 && o2 && o3 && o4 && o5 && o6) models.push({P,R,T,H,L});
}
console.log('count:', models.length);
console.log(models);
function classify(fn){
  const vals = models.map(fn);
  if (vals.every(v=>v)) return 'ENTAILED';
  if (vals.every(v=>!v)) return 'CONTRADICTED';
  return 'CONSISTENT-NOT-ENTAILED';
}
console.log('D1 (H):', classify(m=>m.H===1));
console.log('D2 (L):', classify(m=>m.L===1));
console.log('D3 (!R):', classify(m=>m.R===0));
console.log('D4 (P):', classify(m=>m.P===1));
console.log('D5 (R):', classify(m=>m.R===1));
console.log('D6 (!L):', classify(m=>m.L===0));
```

Expected output: `count: 2`, with the two surviving models being
`{P:0,R:0,T:1,H:1,L:1}` and `{P:1,R:0,T:1,H:1,L:1}`. Classifications:
D1 ENTAILED, D2 ENTAILED, D3 ENTAILED, D4 CONSISTENT-NOT-ENTAILED, D5
CONTRADICTED, D6 CONTRADICTED.

To confirm the script correctly discriminates, also try it broken two
ways: (1) drop O1 (comment out the `o1` conjunct) — the model count
rises to 3, showing the count check is sensitive to premise
completeness; (2) flip O6 to `(P && R)` (require both Pilot and Medic)
— the count drops to 0, confirming the harness would flag an
unsatisfiable protocol rather than silently reporting a wrong count.

- **obj-1**: exactly 2 must be stated; any other integer fails.
- **obj-2**: all three of D1/D2/D3 must read ENTAILED (or an accepted
  synonym); note D3 is the *negation* "Torin is NOT a Medic" — do not
  confuse this with a verdict on D5 (the un-negated "is a Medic").
- **obj-3**: D4 is the seeded trap. P is unconstrained once R is forced
  false by the clauses (P=0 in model 1, P=1 in model 2), so D4 must
  read CONSISTENT-BUT-NOT-ENTAILED. Marking it ENTAILED or CONTRADICTED
  fails this check outright.
- **obj-4**: D5 and D6 must both read CONTRADICTED (R is false and L is
  true in both surviving models).
- **obj-5**: every one of the six verdicts needs its own one-line
  justification (not just a bare label); run `wc -w ENTAILMENT.md` for
  the cap.

### Subjective guidance

- **Logical rigor**: does the submission actually reason from the
  clauses to the model set (or an equivalent valid shortcut, e.g.
  deriving R=false and H=true directly from O1 and O2/O4, then
  T=L=true from the given fact and O3) rather than asserting verdicts
  without a chain back to O1–O6?
- **Verdict-justification clarity**: is each of the six one-line
  justifications specific to that candidate (citing the clause or
  derived fact that pins it down) rather than a generic "by the
  clauses" restated six times? Reward a justification for D4 that
  explicitly names P as the free variable.
- **Reasoning quality**: does the write-up show awareness that D4 is
  the tempting over-conclusion — i.e. does it explain *why* a solver
  might wrongly call D4 entailed (Torin "must" be something once R is
  ruled out) and why that inference is invalid, rather than only
  landing on the correct label by chance?
