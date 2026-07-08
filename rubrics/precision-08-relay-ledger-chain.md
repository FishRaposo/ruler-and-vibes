---
test: precision-08-relay-ledger-chain
canary: "birchbark thicket"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ledger.json parses as a JSON object with exactly the keys A, B, C, D, TOTAL and no others"
    - id: obj-2
      check: "Final balances are exactly A=25, B=90, C=125, D=210 (each an integer, matching the replayed chain)"
    - id: obj-3
      check: "TOTAL equals 450 and equals the arithmetic sum A+B+C+D within the same file (self-consistent)"
    - id: obj-4
      check: "The values reflect step 3's correct branch (C->D fired, giving D=210); a submission that took the ELSE branch produces a distinct wrong-branch result and fails this check"
    - id: obj-5
      check: "No extra top-level fields, no per-step trace embedded in the JSON, and all four balances are non-negative integers"
  subjective:
    - id: sub-quality
      name: "Chain applied in the exact stated order"
      weight: 0.4
    - id: sub-craft
      name: "State-tracking accuracy"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "birchbark thicket" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

There is exactly one correct final ledger. Verify by replaying the
chain in node, not by eyeballing arithmetic.

### Full step-by-step trace (answer key)

```
Start:      A=100  B=100  C=100  D=100
Step 1:     A-=30, B+=30        -> A=70   B=130  C=100  D=100
Step 2:     floor(130/2)=65, B-=65, C+=65 -> A=70 B=65  C=165 D=100
Step 3:     C=165 > 150, so C->D 40       -> A=70 B=65  C=125 D=140
Step 4:     max(140-70,0)=70, A->D 70     -> A=0  B=65  C=125 D=210
Step 5:     A(0)<100 -> +25, B(65)<100 -> +25; C,D unchanged
Final:      A=25  B=90  C=125  D=210   TOTAL=450
```

### Wrong-branch counterfactual (must be distinguishable)

A submission that evaluates step 3's branch against the ORIGINAL
balances (C=100, not >150) takes the ELSE branch instead and diverges:
D-=40, C+=40 at step 3, giving a different downstream trace entirely
(the sum stays 400 pre-step-5, not matching the correct chain's
post-step-4 state). Any final ledger where C is NOT 125 or D is NOT
210 indicates the branch (or an earlier step) was mishandled.

### Check script

Save the submitted `ledger.json` and run:

```
node -e "
const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('ledger.json', 'utf8'));
const keys = Object.keys(obj).sort();
console.log('obj-1 exactly keys A,B,C,D,TOTAL:', JSON.stringify(keys) === JSON.stringify(['A','B','C','D','TOTAL']));
console.log('obj-2 A=25 B=90 C=125 D=210, all ints:', obj.A===25 && obj.B===90 && obj.C===125 && obj.D===210 && [obj.A,obj.B,obj.C,obj.D].every(Number.isInteger));
console.log('obj-3 TOTAL=450 and equals sum:', obj.TOTAL===450 && obj.TOTAL === obj.A+obj.B+obj.C+obj.D);
console.log('obj-4 correct branch (C=125, D=210):', obj.C === 125 && obj.D === 210);
console.log('obj-5 no extra fields, non-negative ints:', keys.length===5 && [obj.A,obj.B,obj.C,obj.D].every(v => Number.isInteger(v) && v>=0));
"
```

Run this against the answer key above (all 5 lines print `true`) and
against the wrong-branch counterfactual `{"A":95,"B":90,"C":205,"D":85,"TOTAL":475}`
before trusting the result — the counterfactual must fail obj-2,
obj-3, and obj-4.

- **obj-1**: structural key check, independent of arithmetic
  correctness.
- **obj-2**: the four balances are recomputed from scratch by the
  trace above, not just string-matched against a submission's own
  claimed total.
- **obj-3**: catches internal inconsistency — a submission could get
  A/B/C/D right but botch TOTAL, or vice versa.
- **obj-4**: the branch check is the crux of the test; a model that
  reordered steps, mishandled the floor in step 2, or branched on
  stale balances lands on C != 125 or D != 210 here.
- **obj-5**: no per-step trace or extra keys should leak into the
  final JSON — the deliverable is the final state only.

No arithmetic is left to prose judgment; all five checks are
numeric/JSON-structural.

### Subjective guidance

- **Chain applied in the exact stated order**: does REASONING.md show
  the five steps applied in order 1 through 5, with each step reading
  the PRIOR step's output rather than the original balances?
- **State-tracking accuracy**: is the intermediate state after each
  step shown correctly (A=70/B=130 after step 1, B=65/C=165 after step
  2, etc.), or does the reasoning jump straight to a final answer
  without demonstrating the chain was actually tracked?
- **Reasoning quality**: does the reasoning explicitly note that step
  3's branch depends on C=165 (post-step-2), distinguishing it from
  the tempting original-balance evaluation (C=100) that would silently
  take the wrong branch?
