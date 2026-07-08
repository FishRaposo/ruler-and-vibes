---
test: logic-05-guild-charter
canary: "tideflat cartwheel"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ENTAILMENT.md states there are exactly 2 distinct models (full A,B,S,F,M assignments) satisfying all six premises (judge re-runs the embedded 32-model enumeration; any count other than 2 fails)"
    - id: obj-2
      check: "C1 (Seal issued), C2 (Market opens), and C3 (Ansa is NOT a Scribe) are each classified ENTAILED (judge accepts synonyms 'necessarily true'/'always true'/'true in both models'; PASS phrasings: 'C1: ENTAILED', 'C2 is entailed — true in both models', 'C3: necessarily true, B is false in every model'; FAIL phrasings: 'C1: consistent', 'C2: possibly true', 'C3: consistent-but-not-entailed')"
    - id: obj-3
      check: "C4 (Ansa is a Warden) is classified CONSISTENT-BUT-NOT-ENTAILED — neither entailed nor contradicted (this is the seeded over-conclusion trap; PASS: 'C4: consistent, not entailed', 'C4 holds in one model but not the other'; FAIL: 'C4: ENTAILED', 'C4: contradicted', 'C4: necessarily true')"
    - id: obj-4
      check: "C5 (Ansa is a Scribe) and C6 (Market does not open) are each classified CONTRADICTED (PASS: 'C5: contradicted — false in every model', 'C6: contradicted, M is true in both models'; FAIL: 'C5: consistent', 'C6: entailed', 'C6: possibly true')"
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

If the phrase "tideflat cartwheel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Do not trust the runner's stated model count or verdicts — recompute
them with the enumeration below.

### Reference enumeration script

Save as `entail.js` and run with `node entail.js`:

```js
const models = [];
for (let A=0;A<2;A++) for (let B=0;B<2;B++) for (let S=0;S<2;S++)
for (let F=0;F<2;F++) for (let M=0;M<2;M++) {
  const p1 = (!F || S);          // if Forge runs, Seal issued
  const p2 = (M === S);          // Market opens iff Seal issued
  const p3 = (F || B);           // Forge runs or Ansa is Scribe
  const p4 = !(A && B);          // not both Warden and Scribe
  const p5 = (!B || !M);         // if Scribe, Market does not open
  const p6 = (F === 1);          // Forge runs
  if (p1 && p2 && p3 && p4 && p5 && p6) models.push({A,B,S,F,M});
}
console.log('count:', models.length);
console.log(models);
function classify(fn){
  const vals = models.map(fn);
  if (vals.every(v=>v)) return 'ENTAILED';
  if (vals.every(v=>!v)) return 'CONTRADICTED';
  return 'CONSISTENT-NOT-ENTAILED';
}
console.log('C1 (S):', classify(m=>m.S===1));
console.log('C2 (M):', classify(m=>m.M===1));
console.log('C3 (!B):', classify(m=>m.B===0));
console.log('C4 (A):', classify(m=>m.A===1));
console.log('C5 (B):', classify(m=>m.B===1));
console.log('C6 (!M):', classify(m=>m.M===0));
```

Expected output: `count: 2`, with the two surviving models being
`{A:0,B:0,S:1,F:1,M:1}` and `{A:1,B:0,S:1,F:1,M:1}`. Classifications:
C1 ENTAILED, C2 ENTAILED, C3 ENTAILED, C4 CONSISTENT-NOT-ENTAILED, C5
CONTRADICTED, C6 CONTRADICTED.

To confirm the script correctly discriminates, also try it broken two
ways: (1) drop P6 (comment out the `p6` conjunct) — the model count
rises to 3, showing the count check is sensitive to premise
completeness; (2) flip P4 to `(A && B)` (require both Warden and
Scribe) — the count drops to 0, confirming the harness would flag an
unsatisfiable charter rather than silently reporting a wrong count.

- **obj-1**: exactly 2 must be stated; any other integer fails.
- **obj-2**: all three of C1/C2/C3 must read ENTAILED (or an accepted
  synonym); note C3 is the *negation* "Ansa is NOT a Scribe" — do not
  confuse this with a verdict on C5 (the un-negated "is a Scribe").
- **obj-3**: C4 is the seeded trap. A is unconstrained once B is forced
  false by the premises (A=0 in model 1, A=1 in model 2), so C4 must
  read CONSISTENT-BUT-NOT-ENTAILED. Marking it ENTAILED or CONTRADICTED
  fails this check outright.
- **obj-4**: C5 and C6 must both read CONTRADICTED (B is false and M is
  true in both surviving models).
- **obj-5**: every one of the six verdicts needs its own one-line
  justification (not just a bare label); run `wc -w ENTAILMENT.md` for
  the cap.

### Subjective guidance

- **Logical rigor**: does the submission actually reason from the
  premises to the model set (or an equivalent valid shortcut, e.g.
  deriving B=false and F=true directly from P6 and P4/P3, then S=M=true
  from P1/P2) rather than asserting verdicts without a chain back to
  P1–P6?
- **Verdict-justification clarity**: is each of the six one-line
  justifications specific to that candidate (citing the premise or
  derived fact that pins it down) rather than a generic "by the
  premises" restated six times? Reward a justification for C4 that
  explicitly names A as the free variable.
- **Reasoning quality**: does the write-up show awareness that C4 is
  the tempting over-conclusion — i.e. does it explain *why* a solver
  might wrongly call C4 entailed (Ansa "must" be something once B is
  ruled out) and why that inference is invalid, rather than only
  landing on the correct label by chance?
