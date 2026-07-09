---
test: precision-08c-tincture-phial-relay
canary: "voussoir indri"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "phials.json parses as a JSON object with exactly the keys P, Q, R, S, TOTAL and no others"
    - id: obj-2
      check: "Final volumes are exactly P=30, Q=114, R=171, S=237 (each an integer, matching the replayed chain)"
    - id: obj-3
      check: "TOTAL equals 552 and equals the arithmetic sum P+Q+R+S within the same file (self-consistent)"
    - id: obj-4
      check: "The values reflect step 3's correct branch (R->S fired, giving R=171 and S=237); a submission that took the ELSE branch produces a distinct wrong-branch result and fails this check"
    - id: obj-5
      check: "No extra top-level fields, no per-step trace embedded in the JSON, and all four volumes are non-negative integers"
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
anchors:
  - id: Chain applied in the exact stated order
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: State-tracking accuracy
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `precision-08-relay-ledger-chain` (same construct, fresh surface).

If the phrase "voussoir indri" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

There is exactly one correct final set of phial volumes. Verify by
replaying the chain in node, not by eyeballing arithmetic.

### Full step-by-step trace (answer key)

```
Start:      P=123  Q=123  R=123  S=123
Step 1:     P-=44, Q+=44        -> P=79   Q=167  R=123  S=123
Step 2:     floor(167/2)=83, Q-=83, R+=83 -> P=79 Q=84  R=206 S=123
Step 3:     R=206 > 170, so R->S 35       -> P=79 Q=84  R=171 S=158
Step 4:     max(158-79,0)=79, P->S 79     -> P=0  Q=84  R=171 S=237
Step 5:     P(0)<123 -> +30, Q(84)<123 -> +30; R,S unchanged
Final:      P=30  Q=114  R=171  S=237   TOTAL=552
```

### Wrong-branch counterfactual (must be distinguishable)

A submission that evaluates step 3's branch against the ORIGINAL
volumes (R=123, not >170) takes the ELSE branch instead and diverges:
S-=35, R+=35 at step 3, giving a different downstream trace entirely
(the step-4 clamp then transfers only 9 rather than 79, and step 5 tops
up three phials rather than two). Any final set where R is NOT 171 or S
is NOT 237 indicates the branch (or an earlier step) was mishandled.

### Check script

Save the submitted `phials.json` and run:

```
node -e "
const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('phials.json', 'utf8'));
const keys = Object.keys(obj).sort();
console.log('obj-1 exactly keys P,Q,R,S,TOTAL:', JSON.stringify(keys) === JSON.stringify(['P','Q','R','S','TOTAL']));
console.log('obj-2 P=30 Q=114 R=171 S=237, all ints:', obj.P===30 && obj.Q===114 && obj.R===171 && obj.S===237 && [obj.P,obj.Q,obj.R,obj.S].every(Number.isInteger));
console.log('obj-3 TOTAL=552 and equals sum:', obj.TOTAL===552 && obj.TOTAL === obj.P+obj.Q+obj.R+obj.S);
console.log('obj-4 correct branch (R=171, S=237):', obj.R === 171 && obj.S === 237);
console.log('obj-5 no extra fields, non-negative ints:', keys.length===5 && [obj.P,obj.Q,obj.R,obj.S].every(v => Number.isInteger(v) && v>=0));
"
```

Run this against the answer key above (all 5 lines print `true`) and
against the wrong-branch counterfactual `{"P":100,"Q":114,"R":241,"S":127,"TOTAL":582}`
before trusting the result — the counterfactual must fail obj-2,
obj-3, and obj-4.

- **obj-1**: structural key check, independent of arithmetic
  correctness.
- **obj-2**: the four volumes are recomputed from scratch by the
  trace above, not just string-matched against a submission's own
  claimed total.
- **obj-3**: catches internal inconsistency — a submission could get
  P/Q/R/S right but botch TOTAL, or vice versa.
- **obj-4**: the branch check is the crux of the test; a model that
  reordered steps, mishandled the floor in step 2, or branched on
  stale volumes lands on R != 171 or S != 237 here.
- **obj-5**: no per-step trace or extra keys should leak into the
  final JSON — the deliverable is the final state only.

No arithmetic is left to prose judgment; all five checks are
numeric/JSON-structural.

### Subjective guidance

- **Chain applied in the exact stated order**: does REASONING.md show
  the five steps applied in order 1 through 5, with each step reading
  the PRIOR step's output rather than the original volumes?
- **State-tracking accuracy**: is the intermediate state after each
  step shown correctly (P=79/Q=167 after step 1, Q=84/R=206 after step
  2, etc.), or does the reasoning jump straight to a final answer
  without demonstrating the chain was actually tracked?
- **Reasoning quality**: does the reasoning explicitly note that step
  3's branch depends on R=206 (post-step-2), distinguishing it from
  the tempting original-volume evaluation (R=123) that would silently
  take the wrong branch?
