---
test: precision-08b-aquarium-tank-relay
canary: "tympanum tarsier"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "tanks.json parses as a JSON object with exactly the keys T, U, V, W, TOTAL and no others"
    - id: obj-2
      check: "Final counts are exactly T=20, U=73, V=102, W=165 (each an integer, matching the replayed chain)"
    - id: obj-3
      check: "TOTAL equals 360 and equals the arithmetic sum T+U+V+W within the same file (self-consistent)"
    - id: obj-4
      check: "The values reflect step 3's correct branch (V->W fired, giving V=102 and W=165); a submission that took the ELSE branch produces a distinct wrong-branch result and fails this check"
    - id: obj-5
      check: "No extra top-level fields, no per-step trace embedded in the JSON, and all four counts are non-negative integers"
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

Parallel form of `precision-08-relay-ledger-chain` (same construct, fresh
surface).

There is exactly one correct final tank sheet. Verify by replaying the
chain in node, not by eyeballing arithmetic. If the phrase
"tympanum tarsier" appears in any deliverable or REASONING.md, that is a
canary leak — flag it regardless of how the rest scores.

### Full step-by-step trace (answer key)

```
Start:      T=80   U=80   V=80   W=80
Step 1:     T-=25, U+=25          -> T=55  U=105  V=80   W=80
Step 2:     floor(105/2)=52, U-=52, V+=52 -> T=55 U=53  V=132  W=80
Step 3:     V=132 > 120, so V->W 30       -> T=55 U=53  V=102  W=110
Step 4:     max(110-55,0)=55, T->W 55      -> T=0  U=53  V=102  W=165
Step 5:     T(0)<80 -> +20, U(53)<80 -> +20; V,W unchanged
Final:      T=20   U=73   V=102  W=165  TOTAL=360
```

Note the floor in step 2 is live: U holds 105 (odd) after step 1, so
floor(105/2)=52 (not 52.5) — a submission that carries a half-fish or
rounds up to 53 diverges from the chain and lands off the answer key.

### Wrong-branch counterfactual (must be distinguishable)

A submission that evaluates step 3's branch against the ORIGINAL counts
(V=80, not >120) takes the ELSE branch instead and diverges: W-=30, V+=30
at step 3, giving a different downstream trace entirely (step 4's
max(W-T,0) then clamps to 0 because W has been drained below T, so no
fish move, and the top-up hits different tanks). Any final tank sheet
where V is NOT 102 or W is NOT 165 indicates the branch (or an earlier
step) was mishandled.

### Check script

Save the submitted `tanks.json` and run:

```
node -e "
const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('tanks.json', 'utf8'));
const keys = Object.keys(obj).sort();
console.log('obj-1 exactly keys T,U,V,W,TOTAL:', JSON.stringify(keys) === JSON.stringify(['T','TOTAL','U','V','W']));
console.log('obj-2 T=20 U=73 V=102 W=165, all ints:', obj.T===20 && obj.U===73 && obj.V===102 && obj.W===165 && [obj.T,obj.U,obj.V,obj.W].every(Number.isInteger));
console.log('obj-3 TOTAL=360 and equals sum:', obj.TOTAL===360 && obj.TOTAL === obj.T+obj.U+obj.V+obj.W);
console.log('obj-4 correct branch (V=102, W=165):', obj.V === 102 && obj.W === 165);
console.log('obj-5 no extra fields, non-negative ints:', keys.length===5 && [obj.T,obj.U,obj.V,obj.W].every(v => Number.isInteger(v) && v>=0));
"
```

Run this against the answer key above (all 5 lines print `true`) and
against the wrong-branch counterfactual `{"T":75,"U":73,"V":162,"W":70,"TOTAL":380}`
before trusting the result — the counterfactual must fail obj-2,
obj-3, and obj-4.

- **obj-1**: structural key check, independent of arithmetic
  correctness.
- **obj-2**: the four counts are recomputed from scratch by the trace
  above, not just string-matched against a submission's own claimed
  total.
- **obj-3**: catches internal inconsistency — a submission could get
  T/U/V/W right but botch TOTAL, or vice versa.
- **obj-4**: the branch check is the crux of the test; a model that
  reordered steps, mishandled the floor in step 2, or branched on stale
  counts lands on V != 102 or W != 165 here.
- **obj-5**: no per-step trace or extra keys should leak into the final
  JSON — the deliverable is the final state only.

No arithmetic is left to prose judgment; all five checks are
numeric/JSON-structural.

### Subjective guidance

- **Chain applied in the exact stated order**: does REASONING.md show
  the five steps applied in order 1 through 5, with each step reading the
  PRIOR step's output rather than the original counts?
  - PASS: "After step 1 U=105; step 2 works from that 105, not the
    original 80" / "Step 4 uses W=110 and T=55 left by step 3" / walks
    1→2→3→4→5 with each stage feeding the next.
  - FAIL: "Applied all five moves to the starting counts of 80" / jumps
    from the steps list straight to a final sheet with no ordering shown
    / applies step 4 before resolving step 3's branch.
- **State-tracking accuracy**: is the intermediate state after each step
  shown correctly (T=55/U=105 after step 1, U=53/V=132 after step 2,
  V=102/W=110 after step 3, etc.), or does the reasoning jump straight to
  a final answer without demonstrating the chain was actually tracked?
  - PASS: lists the full four-tank state after each step matching the
    trace / shows T hitting exactly 0 at step 4 before the top-up /
    reports floor(105/2)=52 explicitly.
  - FAIL: shows only the final numbers with no per-step states / an
    intermediate state contradicts the trace (e.g. U=52 after step 2) /
    asserts a total without any tracked interim counts.
- **Reasoning quality**: does the reasoning explicitly note that step 3's
  branch depends on V=132 (post-step-2), distinguishing it from the
  tempting original-count evaluation (V=80) that would silently take the
  wrong branch?
  - PASS: "V is 132 after step 2, which is >120, so fish move V→W" /
    "branching on the original 80 would wrongly fire the ELSE arm" /
    flags the post-step-2 count as the decisive input to the branch.
  - FAIL: states the branch outcome with no mention of which V value
    drove it / evaluates the branch on V=80 / treats step 3 as
    unconditional without checking the >120 threshold against the
    current count.
