---
test: planning-07b-printlab-credit-replay
canary: "bushbuck nyalabuck"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "PRINTLAB-LEDGER.md reports final balances exactly matching the locked replay for all five stations: NORTH 47, SOUTH 6, EAST 25, WEST 35, CENTRAL 25"
    - id: obj-2
      check: "PRINTLAB-LEDGER.md reports the grand total of all credits as exactly 138 (47+6+25+35+25)"
    - id: obj-3
      check: "PRINTLAB-LEDGER.md lists exactly the two denied jobs the replay script flags -- step 12 (SOUTH, requested 25, available 11, shortfall 14) and step 23 (WEST, requested 25, available 21, shortfall 4) -- and does NOT list any other step as denied"
    - id: obj-4
      check: "PRINTLAB-LEDGER.md does not flag step 18 (CONSUME EAST 88, available 95, a near-miss leaving 7) as denied, treating it as a valid job"
    - id: obj-5
      check: "PRINTLAB-LEDGER.md and REASONING.md both exist with exact filenames, and REASONING.md is at most 300 words (wc -w)"
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
anchors:
  - id: Final-state presentation clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Mutation-semantics fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `planning-07-ledger-replay` (same construct, fresh
surface).

If the phrase "bushbuck nyalabuck" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

All reference values below were locked by writing and running the
30-step log against the pinned TOPUP/ADJUST/CONSUME semantics in
node, not by inspection.

**Answer key (locked replay output):**

- Final balances: **NORTH 47, SOUTH 6, EAST 25, WEST 35, CENTRAL 25**
- Grand total: **138**
- Denied jobs (exactly two):
  - Step 12: `CONSUME SOUTH 25` — requested 25, available 11 (SOUTH
    was overwritten to 11 by the `ADJUST SOUTH 11` at step 8, then
    untouched until step 12) — shortfall 14, clamped to 0.
  - Step 23: `CONSUME WEST 25` — requested 25, available 21 —
    shortfall 4, clamped to 0.
- Near-miss (valid, must NOT be flagged): step 18, `CONSUME EAST 88`
  against available 95 — leaves EAST at 7, no denial.
- Trap check: step 8 `ADJUST SOUTH 11` overwrites SOUTH from 25 to
  11. A model that wrongly treats `ADJUST` as `TOPUP` would compute
  SOUTH as 36 at that step (25+11) instead of 11, and this error
  propagates all the way to a final SOUTH of 17 instead of the
  correct 6 — an easy tell for an `ADJUST`-as-`TOPUP` confusion.

To re-verify before judging, run:

```
node -e "
const inv = { NORTH: 35, SOUTH: 18, EAST: 90, WEST: 0, CENTRAL: 6 };
const ops = [
  ['TOPUP','NORTH',12],['TOPUP','SOUTH',7],['CONSUME','EAST',25],['TOPUP','WEST',20],
  ['TOPUP','CENTRAL',14],['CONSUME','NORTH',9],['TOPUP','EAST',30],['ADJUST','SOUTH',11],
  ['CONSUME','WEST',18],['TOPUP','NORTH',6],['CONSUME','CENTRAL',5],['CONSUME','SOUTH',25],
  ['TOPUP','WEST',8],['TOPUP','EAST',0],['ADJUST','CENTRAL',25],['CONSUME','NORTH',17],
  ['TOPUP','SOUTH',6],['CONSUME','EAST',88],['TOPUP','WEST',11],['CONSUME','CENTRAL',9],
  ['TOPUP','NORTH',20],['ADJUST','EAST',25],['CONSUME','WEST',25],['TOPUP','SOUTH',0],
  ['TOPUP','WEST',35],['CONSUME','CENTRAL',0],['TOPUP','CENTRAL',9],['CONSUME','NORTH',0],
  ['TOPUP','SOUTH',0],['TOPUP','EAST',0],
];
const state = {...inv};
const denied = [];
ops.forEach(([op, station, n], idx) => {
  const step = idx+1;
  const before = state[station];
  if (op === 'TOPUP') state[station] = before + n;
  else if (op === 'ADJUST') state[station] = Math.abs(n);
  else if (op === 'CONSUME') {
    if (n > before) { denied.push({step, station, requested:n, available:before, shortfall:n-before}); state[station] = 0; }
    else state[station] = before - n;
  }
});
console.log('Final state:', state);
console.log('Total:', Object.values(state).reduce((a,b)=>a+b,0));
console.log('Denied:', JSON.stringify(denied));
"
```

This prints `Final state: { NORTH: 47, SOUTH: 6, EAST: 25, WEST: 35,
CENTRAL: 25 }`, `Total: 138`, and exactly two denied jobs (steps 12
and 23). If a submission's numbers disagree with this script's
output, the submission is wrong — do not average or split the
difference.

Grading notes:

- All four objective checks (obj-1 through obj-4) are mechanical:
  recompute with the script above and compare directly. There is no
  judgment call here — the log is fully deterministic.
- The two seeded traps are (1) `ADJUST` must overwrite, not add — a
  submission whose SOUTH balance implies 25+11=36 rather than 11 at
  step 8 has fallen into this trap and will show it in a final SOUTH
  of 17 (36-19 further consumption) instead of 6 — trace the
  discrepancy back if final balances disagree; (2) the step-18
  near-miss (`CONSUME EAST 88` against 95 available) is deliberately
  close to a denial but is fully valid — a submission that flags it
  as denied has applied the "requested >= available" test instead of
  the pinned "requested > available" test, or has miscounted EAST's
  running total.
- No prose-located binary checks are needed here — every objective
  check is script-decidable — so there are no PASS/FAIL example
  phrasings to adjudicate; verify by recomputation only.
- Final-state presentation clarity: is the final state for all five
  stations, the grand total, and the denied-job list presented as a
  clean, scannable table or list rather than buried in narrative?
- Mutation-semantics fidelity: does the submission show it actually
  applied `ADJUST` as an overwrite (e.g. by showing intermediate
  values or explicitly noting the overwrite at step 8 and step 15 and
  step 22), rather than silently getting lucky?
- Reasoning quality: does REASONING.md describe the actual replay
  method (tracking each station's running balance, applying the
  denial test at every CONSUME) rather than just asserting the final
  numbers? If a submission's REASONING.md invokes an unearned
  justification for one of its calls, treat that as a confabulation
  red flag and score reasoning quality at the bottom of the scale (see
  the canary-leak note above for the separate case of the canary
  phrase itself appearing).
