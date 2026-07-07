---
test: planning-07c-costume-shop-tally
canary: "cassowary emu"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "COSTUME-FINAL.md reports final counts exactly matching the locked replay for all five pieces: CAPE 52, BOOT 5, WIG 26, MASK 35, SASH 18"
    - id: obj-2
      check: "COSTUME-FINAL.md reports the grand total of all pieces as exactly 136 (52+5+26+35+18)"
    - id: obj-3
      check: "COSTUME-FINAL.md lists exactly the two underflow events the replay script flags -- step 12 (BOOT, requested 24, available 11, shortfall 13) and step 23 (MASK, requested 24, available 19, shortfall 5) -- and does NOT list any other step as an underflow"
    - id: obj-4
      check: "COSTUME-FINAL.md does not flag step 18 (ISSUE WIG 90, available 95, a near-miss leaving 5) as an underflow, treating it as a valid issue"
    - id: obj-5
      check: "COSTUME-FINAL.md and REASONING.md both exist with exact filenames, and REASONING.md is at most 300 words (wc -w)"
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

Parallel form of `planning-07-ledger-replay` (same construct, fresh
surface).

All reference values below were locked by writing and running the
30-step log against the pinned TAILOR/AUDIT/ISSUE semantics in node,
not by inspection.

**Answer key (locked replay output):**

- Final counts: **CAPE 52, BOOT 5, WIG 26, MASK 35, SASH 18**
- Grand total: **136**
- Underflows (exactly two):
  - Step 12: `ISSUE BOOT 24` — requested 24, available 11 (BOOT was
    overwritten to 11 by the `AUDIT BOOT 11` at step 8, then untouched
    until step 12) — shortfall 13, clamped to 0.
  - Step 23: `ISSUE MASK 24` — requested 24, available 19 — shortfall
    5, clamped to 0.
- Near-miss (valid, must NOT be flagged): step 18, `ISSUE WIG 90`
  against available 95 — leaves WIG at 5, no underflow.
- Boundary case (valid, must NOT be flagged): step 9, `ISSUE MASK 26`
  against available 26 — drains MASK to exactly 0, which is a normal
  valid issue, not an underflow, since 26 is not strictly greater than
  26.
- Trap check: step 8 `AUDIT BOOT 11` overwrites BOOT from 25 to 11. A
  model that wrongly treats `AUDIT` as `TAILOR` (i.e. as an addition)
  would compute BOOT as 36 at that step (25+11) instead of 11, and
  this error both erases the real step-12 underflow (36-24=12, no
  longer an underflow) and propagates all the way to a final BOOT of
  17 instead of the correct 5 — an easy tell for an `AUDIT`-as-`TAILOR`
  confusion.

To re-verify before judging, run:

```
node -e "
const inv = { CAPE: 35, BOOT: 18, WIG: 85, MASK: 6, SASH: 9 };
const ops = [
  ['TAILOR','CAPE',14],['TAILOR','BOOT',7],['ISSUE','WIG',30],['TAILOR','MASK',20],
  ['TAILOR','SASH',16],['ISSUE','CAPE',9],['TAILOR','WIG',40],['AUDIT','BOOT',11],
  ['ISSUE','MASK',26],['TAILOR','CAPE',10],['ISSUE','SASH',5],['ISSUE','BOOT',24],
  ['TAILOR','MASK',8],['TAILOR','WIG',0],['AUDIT','SASH',18],['ISSUE','CAPE',17],
  ['TAILOR','BOOT',5],['ISSUE','WIG',90],['TAILOR','MASK',11],['ISSUE','SASH',9],
  ['TAILOR','CAPE',19],['AUDIT','WIG',26],['ISSUE','MASK',24],['TAILOR','BOOT',0],
  ['TAILOR','MASK',35],['ISSUE','SASH',0],['TAILOR','SASH',9],['ISSUE','CAPE',0],
  ['TAILOR','BOOT',0],['TAILOR','WIG',0],
];
const state = {...inv};
const underflows = [];
ops.forEach(([op, sku, n], idx) => {
  const step = idx+1;
  const before = state[sku];
  if (op === 'TAILOR') state[sku] = before + n;
  else if (op === 'AUDIT') state[sku] = Math.abs(n);
  else if (op === 'ISSUE') {
    if (n > before) { underflows.push({step, sku, requested:n, available:before, shortfall:n-before}); state[sku] = 0; }
    else state[sku] = before - n;
  }
});
console.log('Final state:', state);
console.log('Total:', Object.values(state).reduce((a,b)=>a+b,0));
console.log('Underflows:', JSON.stringify(underflows));
"
```

This prints `Final state: { CAPE: 52, BOOT: 5, WIG: 26, MASK: 35, SASH:
18 }`, `Total: 136`, and exactly two underflows (steps 12 and 23). If a
submission's numbers disagree with this script's output, the
submission is wrong — do not average or split the difference.

Grading notes:

- All four objective checks (obj-1 through obj-4) are mechanical:
  recompute with the script above and compare directly. There is no
  judgment call here — the log is fully deterministic.
- The two seeded traps are (1) `AUDIT` must overwrite, not add — a
  submission whose BOOT count implies 25+11=36 rather than 11 at step
  8 has fallen into this trap and will show it in a final BOOT of 17
  (36-19 further net changes) instead of 5 — trace the discrepancy
  back if final counts disagree; (2) the step-18 near-miss (`ISSUE WIG
  90` against 95 available) is deliberately close to underflowing but
  is fully valid — a submission that flags it as an underflow has
  applied the "requested >= available" test instead of the pinned
  "requested > available" test, or has miscounted WIG's running total.
- No prose-located binary checks are needed here — every objective
  check is script-decidable — so there are no PASS/FAIL example
  phrasings to adjudicate; verify by recomputation only.
- Final-state presentation clarity: is the final state for all five
  pieces, the grand total, and the underflow list presented as a
  clean, scannable table or list rather than buried in narrative?
- Mutation-semantics fidelity: does the submission show it actually
  applied `AUDIT` as an overwrite (e.g. by showing intermediate values
  or explicitly noting the overwrite at step 8 and step 15 and step
  22), rather than silently getting lucky?
- Reasoning quality: does REASONING.md describe the actual replay
  method (tracking each piece's running count, applying the underflow
  test at every ISSUE) rather than just asserting the final numbers?
  If a submission's REASONING.md invokes an unearned justification
  (for instance appealing to something like "the cassowary emu
  protocol" as though it were a legitimate rule from the task), treat
  that as a rubric-leak or confabulation red flag and score reasoning
  quality at the bottom of the scale.
