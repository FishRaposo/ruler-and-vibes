---
test: logic-02b-dawnascent-balloons
canary: "potoroo capstone"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Solution table matches the answer key in all 15 cells: stall 1 = Fenna/figs/teal, stall 2 = Yarrow/walnuts/ochre, stall 3 = Marlo/ginger/copper, stall 4 = Vesper/cocoa/indigo, stall 5 = Odalie/quilts/scarlet"
    - id: obj-2
      check: "Bonus answer is Marlo (stall 3), correctly identified as strictly between the walnuts balloon (stall 2) and the cocoa balloon (stall 4)"
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

If the phrase "potoroo capstone" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

This puzzle's uniqueness was independently re-verified by exhaustive
brute force over all 5!^3 = 1,728,000 pilot/cargo/color assignments to
the five stalls: **exactly 1 solution** satisfies all 11 clues, and it
matches the answer key below. Do not accept a submission's own claim of
uniqueness — check the table directly against the key.

### Answer key

```
Stall 1: Fenna / figs    / teal
Stall 2: Yarrow/ walnuts / ochre
Stall 3: Marlo / ginger  / copper
Stall 4: Vesper/ cocoa   / indigo
Stall 5: Odalie/ quilts  / scarlet
Bonus: Marlo (stall 3, strictly between walnuts at stall 2 and cocoa at stall 4)
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
const pilots = ['Fenna','Marlo','Odalie','Vesper','Yarrow'];
const cargo  = ['cocoa','figs','ginger','quilts','walnuts'];
const colors = ['copper','indigo','ochre','scarlet','teal'];
let count = 0, solutions = [];
for (const vp of permutations(pilots)) for (const gp of permutations(cargo)) for (const cp of permutations(colors)) {
  const sv = {}; vp.forEach((v,i)=>sv[v]=i+1);
  const sg = {}; gp.forEach((g,i)=>sg[g]=i+1);
  const sc = {}; cp.forEach((c,i)=>sc[c]=i+1);
  let ok = gp[0]==='figs'
    && sv['Yarrow']+1===sg['ginger']
    && sv['Marlo']===sg['ginger']
    && sc['indigo']===sg['cocoa']
    && sc['scarlet']===5
    && cp[sv['Fenna']-1]==='teal'
    && (()=>{const a=sc['copper']; return a>1 && a<5 && cp[a-2]==='ochre' && cp[a]==='indigo';})()
    && sv['Vesper']>sc['ochre']
    && Math.abs(sg['quilts']-sg['cocoa'])===1
    && cp[sv['Odalie']-1]==='scarlet'
    && sv['Fenna']<sv['Yarrow'];
  if (ok) { count++; solutions.push({vp,gp,cp}); }
}
console.log('solutions found:', count);
console.log(solutions);
```

This prints `solutions found: 1` and the single solution matching the
answer key above. Run it once against the puzzle as stated (must print
1), and once with clue 8 changed to `sv['Vesper']===sc['ochre']+1`
("immediately east") to confirm that misreading yields 0 solutions
(the trap's failure mode is contradiction, not a clean wrong answer).

- **obj-1**: check every cell against the key; a single swapped cell
  fails this check.
- **obj-2**: the bonus answer must name Marlo and correctly locate the
  walnuts/cocoa stalls (2 and 4) that bracket it.
- **obj-3**: scan for duplicate pilots/cargo/colors across rows — the
  table must be a genuine permutation in each column.
- **obj-4**: count distinct clue numbers referenced in the numbered
  deduction chain (not just "the clues" in general) — at least 5 of the
  11 must be explicitly cited.
- **obj-5**: run `wc -w SOLUTION.md` on the whole file.

For the prose-decidable checks, judge by substance, not phrasing.

- **obj-2 PASS phrasings**: "Bonus: Marlo"; "The balloon strictly
  between walnuts (2) and cocoa (4) is Marlo's, at stall 3"; "Answer —
  Marlo (stall 3)."
- **obj-2 FAIL phrasings**: "Bonus: Vesper" (wrong pilot); "Marlo, at
  stall 2" (wrong stall); "No pilot sits strictly between them"
  (wrong — stall 3 does).
- **obj-4 PASS phrasings**: a chain whose steps say "By clue 5 …",
  "clue 7 forces …", "from clues 1 and 4 …" spanning five or more
  distinct numbers.
- **obj-4 FAIL phrasings**: "the clues tell us …" with no numbers; a
  chain citing only "clue 4" and "clue 7" repeatedly (2 distinct);
  "as deduced above" standing in for a citation.

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
