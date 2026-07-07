---
test: logic-05c-blackfen-curling-club
canary: "waterbuck kob"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ENTAILMENT.md states there are exactly 2 distinct models (full K,V,P,H,O assignments) satisfying all six rules (judge re-runs the embedded 32-model enumeration; any count other than 2 fails)"
    - id: obj-2
      check: "E1 (Ice is pebbled), E2 (Hack is set), and E3 (Corin is NOT the Vice) are each classified ENTAILED (judge accepts synonyms 'necessarily true'/'always true'/'true in both models'; PASS phrasings: 'E1: ENTAILED', 'E2 is entailed — true in both models', 'E3: necessarily true, V is false in every model'; FAIL phrasings: 'E1: consistent', 'E2: possibly true', 'E3: consistent-but-not-entailed')"
    - id: obj-3
      check: "E4 (Corin is the Skip) is classified CONSISTENT-BUT-NOT-ENTAILED — neither entailed nor contradicted (this is the seeded over-conclusion trap; PASS: 'E4: consistent, not entailed', 'E4 holds in one model but not the other'; FAIL: 'E4: ENTAILED', 'E4: contradicted', 'E4: necessarily true')"
    - id: obj-4
      check: "E5 (Corin is the Vice) and E6 (the Hack is not set) are each classified CONTRADICTED (PASS: 'E5: contradicted — false in every model', 'E6: contradicted, H is true in both models'; FAIL: 'E5: consistent', 'E6: entailed', 'E6: possibly true')"
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

If a submission's ENTAILMENT.md contains the phrase "waterbuck kob",
that is a canary leak — flag it regardless of how the rest of the
checks score.

Do not trust the runner's stated model count or verdicts — recompute
them with the enumeration below.

### Reference enumeration script

Save as `entail.js` and run with `node entail.js`:

```js
const models = [];
for (let K=0;K<2;K++) for (let V=0;V<2;V++) for (let P=0;P<2;P++)
for (let H=0;H<2;H++) for (let O=0;O<2;O++) {
  const r1 = (!O || P);          // if Clubhouse opens, Ice is pebbled
  const r2 = (H === P);          // Hack is set iff Ice is pebbled
  const r3 = (O || V);           // Clubhouse opens or Corin is the Vice
  const r4 = !(K && V);          // not both Skip and Vice
  const r5 = (!V || !H);         // if Vice, Hack is not set
  const r6 = (O === 1);          // Clubhouse opens
  if (r1 && r2 && r3 && r4 && r5 && r6) models.push({K,V,P,H,O});
}
console.log('count:', models.length);
console.log(models);
function classify(fn){
  const vals = models.map(fn);
  if (vals.every(v=>v)) return 'ENTAILED';
  if (vals.every(v=>!v)) return 'CONTRADICTED';
  return 'CONSISTENT-NOT-ENTAILED';
}
console.log('E1 (P):', classify(m=>m.P===1));
console.log('E2 (H):', classify(m=>m.H===1));
console.log('E3 (!V):', classify(m=>m.V===0));
console.log('E4 (K):', classify(m=>m.K===1));
console.log('E5 (V):', classify(m=>m.V===1));
console.log('E6 (!H):', classify(m=>m.H===0));
```

Expected output: `count: 2`, with the two surviving models being
`{K:0,V:0,P:1,H:1,O:1}` and `{K:1,V:0,P:1,H:1,O:1}`. Classifications:
E1 ENTAILED, E2 ENTAILED, E3 ENTAILED, E4 CONSISTENT-NOT-ENTAILED, E5
CONTRADICTED, E6 CONTRADICTED.

To confirm the script correctly discriminates, also try it broken two
ways: (1) drop R6 (comment out the `r6` conjunct) — the model count
rises to 3, showing the count check is sensitive to rule completeness;
(2) flip R4 to `(K && V)` (require both Skip and Vice) — the count
drops to 0, confirming the harness would flag an unsatisfiable rule set
rather than silently reporting a wrong count.

- **obj-1**: exactly 2 must be stated; any other integer fails.
- **obj-2**: all three of E1/E2/E3 must read ENTAILED (or an accepted
  synonym); note E3 is the *negation* "Corin is NOT the Vice" — do not
  confuse this with a verdict on E5 (the un-negated "is the Vice").
- **obj-3**: E4 is the seeded trap. K is unconstrained once V is forced
  false by the rules (K=0 in model 1, K=1 in model 2), so E4 must read
  CONSISTENT-BUT-NOT-ENTAILED. Marking it ENTAILED or CONTRADICTED
  fails this check outright.
- **obj-4**: E5 and E6 must both read CONTRADICTED (V is false and H is
  true in both surviving models).
- **obj-5**: every one of the six verdicts needs its own one-line
  justification (not just a bare label); run `wc -w ENTAILMENT.md` for
  the cap.

### Subjective guidance

- **Logical rigor**: does the submission actually reason from the
  rules to the model set (or an equivalent valid shortcut, e.g. deriving
  P=H=true directly from R6 and R1/R2, then V=false from R5) rather
  than asserting verdicts without a chain back to R1–R6?
- **Verdict-justification clarity**: is each of the six one-line
  justifications specific to that candidate (citing the rule or derived
  fact that pins it down) rather than a generic "by the rules" restated
  six times? Reward a justification for E4 that explicitly names K as
  the free variable.
- **Reasoning quality**: does the write-up show awareness that E4 is
  the tempting over-conclusion — i.e. does it explain *why* a solver
  might wrongly call E4 entailed (Corin "must" be something once V is
  ruled out) and why that inference is invalid, rather than only
  landing on the correct label by chance?
