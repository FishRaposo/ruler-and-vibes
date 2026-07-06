---
test: logic-02c-tarnhollow-balloons
canary: "merlin finial"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Solution table matches the answer key in all 15 cells: balloon 1 = Ondo/pears/jade, balloon 2 = Vesk/saffron/plum, balloon 3 = Garro/ferns/teal, balloon 4 = Juno/cocoa/ochre, balloon 5 = Yarl/quilts/dun"
    - id: obj-2
      check: "Bonus answer is Garro (balloon 3), correctly identified as strictly between the saffron carrier (balloon 2) and the cocoa carrier (balloon 4)"
    - id: obj-3
      check: "Table is internally consistent: each of the 5 pilots, 5 cargo, and 5 colors appears exactly once across the five rows"
    - id: obj-4
      check: "The numbered deduction chain cites at least 5 distinct clue numbers (e.g. 'clue 7') across its steps"
    - id: obj-5
      check: "SOLUTION.md is at most 450 words (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Deduction narrative"
      weight: 0.4
    - id: sub-craft
      name: "Logical economy"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `logic-02-wrenmarket-stalls` (same construct, fresh surface).

If a submission's SOLUTION.md or REASONING.md contains the phrase
"merlin finial", that is a canary leak — flag it regardless of how the
rest of the checks score.

This puzzle's uniqueness was independently re-verified by exhaustive
brute force over all 5!^3 = 1,728,000 pilot/cargo/color assignments to
the five balloons: **exactly 1 solution** satisfies all 11 clues, and it
matches the answer key below. Do not accept a submission's own claim of
uniqueness — check the table directly against the key.

### Answer key

```
Balloon 1: Ondo  / pears   / jade
Balloon 2: Vesk  / saffron / plum
Balloon 3: Garro / ferns   / teal
Balloon 4: Juno  / cocoa   / ochre
Balloon 5: Yarl  / quilts  / dun
Bonus: Garro (balloon 3, strictly between saffron at balloon 2 and cocoa at balloon 4)
```

### Brute-force verification script

Run with `node bruteforce.js` (save as `bruteforce.js`):

```js
function permutations(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of permutations(rest)) result.push([arr[i], ...p]);
  }
  return result;
}
const pilots = ['Garro','Juno','Ondo','Vesk','Yarl'];
const cargo  = ['cocoa','ferns','pears','quilts','saffron'];
const colors = ['teal','ochre','plum','jade','dun'];
let count = 0, solutions = [];
for (const pp of permutations(pilots)) for (const gp of permutations(cargo)) for (const cp of permutations(colors)) {
  const P = {}; pp.forEach((v,i)=>P[v]=i+1);
  const G = {}; gp.forEach((g,i)=>G[g]=i+1);
  const C = {}; cp.forEach((c,i)=>C[c]=i+1);
  let ok = gp[0]==='pears'
    && P['Vesk']+1===G['ferns']
    && P['Garro']===G['ferns']
    && C['ochre']===G['cocoa']
    && C['dun']===5
    && cp[P['Ondo']-1]==='jade'
    && (()=>{const a=C['teal']; return a>1 && a<5 && cp[a-2]==='plum' && cp[a]==='ochre';})()
    && P['Juno']>C['plum']
    && Math.abs(G['quilts']-G['cocoa'])===1
    && cp[P['Yarl']-1]==='dun'
    && P['Ondo']<P['Vesk'];
  if (ok) { count++; solutions.push({pp,gp,cp}); }
}
console.log('solutions found:', count);
console.log(solutions);
```

This prints `solutions found: 1` and the single solution matching the
answer key above. Run it once against the puzzle as stated (must print
1), and once with clue 8 changed to `P['Juno']===C['plum']+1`
("immediately east") to confirm that misreading yields 0 solutions
(the trap's failure mode is contradiction, not a clean wrong answer).

- **obj-1**: check every cell against the key; a single swapped cell
  fails this check. PASS example: a table reading exactly
  Ondo/pears/jade, Vesk/saffron/plum, Garro/ferns/teal, Juno/cocoa/ochre,
  Yarl/quilts/dun down the five balloons. PASS example: the same five
  rows with colors written "Jade, Plum, Teal, Ochre, Dun" (case/format
  differences are fine so long as every cell's value matches). FAIL
  example: balloons 2 and 3 show Garro/…/plum and Vesk/…/teal (pilots
  swapped). FAIL example: balloon 4 shows Juno/cocoa/**teal** (one
  wrong color cell). FAIL example: a table whose cargo column reads
  pears, ferns, saffron, cocoa, quilts (ferns and saffron transposed).
- **obj-2**: the bonus answer must name Garro and correctly locate the
  saffron/cocoa balloons (2 and 4) that bracket it. PASS example:
  "Garro (balloon 3), between saffron at 2 and cocoa at 4." PASS
  example: "The pilot strictly between is Garro — saffron sits at
  balloon 2, cocoa at balloon 4, and Garro flies balloon 3." FAIL
  example: "Vesk" (the balloon immediately east of the plum envelope —
  a trap misread). FAIL example: "Garro" with no mention of which
  balloons (2 and 4) bracket it. FAIL example: "Juno, balloon 4"
  (names a bracketing endpoint rather than the pilot between them).
- **obj-3**: scan for duplicate pilots/cargo/colors across rows — the
  table must be a genuine permutation in each column. PASS example:
  every pilot, cargo, and color name appears on exactly one row. FAIL
  example: "ochre" appears on two rows while "jade" appears on none.
  FAIL example: Juno is listed on both balloon 4 and balloon 5.
- **obj-4**: count distinct clue numbers referenced in the numbered
  deduction chain (not just "the clues" in general) — at least 5 of the
  11 must be explicitly cited. PASS example: steps that cite "clue 7",
  "clue 5", "clue 6", "clue 10", and "clue 1" (five distinct). PASS
  example: a chain naming clues 2, 3, 4, 8, 9, and 11 across its steps.
  FAIL example: a chain that only ever writes "by the clues" or "as
  given" without numbers. FAIL example: steps citing only clue 7, clue
  5, and clue 1 (three distinct — under the bar). FAIL example: a chain
  citing "clue 4" four separate times and no other number.
- **obj-5**: run `wc -w SOLUTION.md` on the whole file. PASS example:
  a 380-word file. FAIL example: a 512-word file. FAIL example: a file
  whose word count, including the table and headings, exceeds 450.

### Subjective guidance

- **Deduction narrative**: does the write-up show a real inference
  order (start from the most constraining clues — 7, 5, 1, 6 are good
  anchors — and chain outward) that a reader could follow to the
  unique solution, rather than asserting the answer and back-filling
  clue numbers after the fact?
- **Logical economy**: no circular steps (using a fact before it's
  derived), no unjustified leaps (skipping from partial information
  straight to a full cell), and no "brute-force hand-waving" presented
  as deduction (e.g. "by trying combinations, we find..." without
  showing why other combinations are eliminated). Reward a chain that
  explicitly rules out the tempting misreading of clue 8 (adjacency)
  or otherwise shows the strict-order reading was used correctly.
- **Reasoning quality**: does REASONING.md explain the solving strategy
  — which clues anchored the deduction and how the clue-8 misreading
  was ruled out — rather than merely restating the final chain?
