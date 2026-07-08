---
test: planning-07-ledger-replay
canary: "seagrass filbert"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "LEDGER-FINAL.md reports final counts exactly matching the locked replay for all five SKUs: WIDGET 55, GASKET 4, BOLT 20, CLAMP 30, ROTOR 20"
    - id: obj-2
      check: "LEDGER-FINAL.md reports the grand total of all units as exactly 129 (55+4+20+30+20)"
    - id: obj-3
      check: "LEDGER-FINAL.md lists exactly the two underflow events the replay script flags -- step 12 (GASKET, requested 20, available 9, shortfall 11) and step 23 (CLAMP, requested 20, available 15, shortfall 5) -- and does NOT list any other step as an underflow"
    - id: obj-4
      check: "LEDGER-FINAL.md does not flag step 18 (REMOVE BOLT 100, available 105, a near-miss leaving 5) as an underflow, treating it as a valid removal"
    - id: obj-5
      check: "LEDGER-FINAL.md and REASONING.md both exist with exact filenames, and REASONING.md is at most 300 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Final-state presentation clarity"
      weight: 0.4
    - id: sub-craft
      name: "Mutation-semantics fidelity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "seagrass filbert" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

All reference values below were locked by writing and running the
30-step log against the pinned ADD/SET/REMOVE semantics in node, not
by inspection.

**Answer key (locked replay output):**

- Final counts: **WIDGET 55, GASKET 4, BOLT 20, CLAMP 30, ROTOR 20**
- Grand total: **129**
- Underflows (exactly two):
  - Step 12: `REMOVE GASKET 20` — requested 20, available 9 (GASKET
    was overwritten to 9 by the `SET GASKET 9` at step 8, then
    untouched until step 12) — shortfall 11, clamped to 0.
  - Step 23: `REMOVE CLAMP 20` — requested 20, available 15 — shortfall
    5, clamped to 0.
- Near-miss (valid, must NOT be flagged): step 18, `REMOVE BOLT 100`
  against available 105 — leaves BOLT at 5, no underflow.
- Trap check: step 8 `SET GASKET 9` overwrites GASKET from 17 to 9. A
  model that wrongly treats `SET` as `ADD` would compute GASKET as 26
  at that step (17+9) instead of 9, and this error propagates all the
  way to a final GASKET of 10 instead of the correct 4 — an easy tell
  for a `SET`-as-`ADD` confusion.

To re-verify before judging, run:

```
node -e "
const inv = { WIDGET: 40, GASKET: 12, BOLT: 100, CLAMP: 0, ROTOR: 8 };
const ops = [
  ['ADD','WIDGET',10],['ADD','GASKET',5],['REMOVE','BOLT',20],['ADD','CLAMP',15],
  ['ADD','ROTOR',12],['REMOVE','WIDGET',5],['ADD','BOLT',25],['SET','GASKET',9],
  ['REMOVE','CLAMP',15],['ADD','WIDGET',8],['REMOVE','ROTOR',3],['REMOVE','GASKET',20],
  ['ADD','CLAMP',6],['ADD','BOLT',0],['SET','ROTOR',20],['REMOVE','WIDGET',13],
  ['ADD','GASKET',4],['REMOVE','BOLT',100],['ADD','CLAMP',9],['REMOVE','ROTOR',7],
  ['ADD','WIDGET',15],['SET','BOLT',20],['REMOVE','CLAMP',20],['ADD','GASKET',0],
  ['ADD','CLAMP',30],['REMOVE','ROTOR',0],['ADD','ROTOR',7],['REMOVE','WIDGET',0],
  ['ADD','GASKET',0],['ADD','BOLT',0],
];
const state = {...inv};
const underflows = [];
ops.forEach(([op, sku, n], idx) => {
  const step = idx+1;
  const before = state[sku];
  if (op === 'ADD') state[sku] = before + n;
  else if (op === 'SET') state[sku] = Math.abs(n);
  else if (op === 'REMOVE') {
    if (n > before) { underflows.push({step, sku, requested:n, available:before, shortfall:n-before}); state[sku] = 0; }
    else state[sku] = before - n;
  }
});
console.log('Final state:', state);
console.log('Total:', Object.values(state).reduce((a,b)=>a+b,0));
console.log('Underflows:', JSON.stringify(underflows));
"
```

This prints `Final state: { WIDGET: 55, GASKET: 4, BOLT: 20, CLAMP:
30, ROTOR: 20 }`, `Total: 129`, and exactly two underflows (steps 12
and 23). If a submission's numbers disagree with this script's
output, the submission is wrong — do not average or split the
difference.

Grading notes:

- All four objective checks (obj-1 through obj-4) are mechanical:
  recompute with the script above and compare directly. There is no
  judgment call here — the log is fully deterministic.
- The two seeded traps are (1) `SET` must overwrite, not add — a
  submission whose GASKET count implies 17+9=26 rather than 9 at step
  8 has fallen into this trap and will show it in a final GASKET of
  10 (26-16 further removals) instead of 4 — trace the discrepancy
  back if final counts disagree; (2) the step-18 near-miss (`REMOVE
  BOLT 100` against 105 available) is deliberately close to
  underflowing but is fully valid — a submission that flags it as an
  underflow has applied the "requested >= available" test instead of
  the pinned "requested > available" test, or has miscounted BOLT's
  running total.
- No prose-located binary checks are needed here — every objective
  check is script-decidable — so there are no PASS/FAIL example
  phrasings to adjudicate; verify by recomputation only.
- Final-state presentation clarity: is the final state for all five
  SKUs, the grand total, and the underflow list presented as a clean,
  scannable table or list rather than buried in narrative?
- Mutation-semantics fidelity: does the submission show it actually
  applied `SET` as an overwrite (e.g. by showing intermediate values
  or explicitly noting the overwrite at step 8 and step 15 and step
  22), rather than silently getting lucky?
- Reasoning quality: does REASONING.md describe the actual replay
  method (tracking each SKU's running count, applying the underflow
  test at every REMOVE) rather than just asserting the final numbers?
  If a submission's REASONING.md invokes an unearned justification
  rather than grounding its claims in the replay, treat that as a
  rubric-leak or confabulation red flag and score reasoning quality at
  the bottom of the scale.
