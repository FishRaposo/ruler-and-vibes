---
test: logic-02-wrenmarket-stalls
canary: "corduroy pelican statute"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Solution table matches the answer key in all 15 cells: stall 1 = Dima/maps/green, stall 2 = Ansa/candles/violet, stall 3 = Ezel/rope/amber, stall 4 = Brix/honey/blue, stall 5 = Corvel/lanterns/crimson"
    - id: obj-2
      check: "Bonus answer is Ezel (stall 3), correctly identified as strictly between the candle seller (stall 2) and the honey seller (stall 4)"
    - id: obj-3
      check: "Table is internally consistent: each of the 5 vendors, 5 goods, and 5 colors appears exactly once across the five rows"
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

If a submission's SOLUTION.md or REASONING.md contains the phrase
"corduroy pelican statute", that is a canary leak — flag it regardless
of how the rest of the checks score.

This puzzle's uniqueness was independently re-verified by exhaustive
brute force over all 5!^3 = 1,728,000 vendor/good/color assignments to
the five stalls: **exactly 1 solution** satisfies all 11 clues, and it
matches the answer key below. Do not accept a submission's own claim of
uniqueness — check the table directly against the key.

### Answer key

```
Stall 1: Dima  / maps     / green
Stall 2: Ansa  / candles  / violet
Stall 3: Ezel  / rope     / amber
Stall 4: Brix  / honey    / blue
Stall 5: Corvel/ lanterns / crimson
Bonus: Ezel (stall 3, strictly between candles at stall 2 and honey at stall 4)
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
const vendors = ['Ansa','Brix','Corvel','Dima','Ezel'];
const goods = ['candles','honey','lanterns','maps','rope'];
const colors = ['amber','blue','crimson','green','violet'];
let count = 0, solutions = [];
for (const vp of permutations(vendors)) for (const gp of permutations(goods)) for (const cp of permutations(colors)) {
  const sv = {}; vp.forEach((v,i)=>sv[v]=i+1);
  const sg = {}; gp.forEach((g,i)=>sg[g]=i+1);
  const sc = {}; cp.forEach((c,i)=>sc[c]=i+1);
  let ok = gp[0]==='maps'
    && sv['Ansa']+1===sg['rope']
    && sv['Ezel']===sg['rope']
    && sc['blue']===sg['honey']
    && sc['crimson']===5
    && cp[sv['Dima']-1]==='green'
    && (()=>{const a=sc['amber']; return a>1 && a<5 && cp[a-2]==='violet' && cp[a]==='blue';})()
    && sv['Brix']>sc['violet']
    && Math.abs(sg['lanterns']-sg['honey'])===1
    && cp[sv['Corvel']-1]==='crimson'
    && sv['Dima']<sv['Ansa'];
  if (ok) { count++; solutions.push({vp,gp,cp}); }
}
console.log('solutions found:', count);
console.log(solutions);
```

This prints `solutions found: 1` and the single solution matching the
answer key above. Run it once against the puzzle as stated (must print
1), and once with clue 8 changed to `sv['Brix']===sc['violet']+1`
("immediately right") to confirm that misreading yields 0 solutions
(the trap's failure mode is contradiction, not a clean wrong answer).

- **obj-1**: check every cell against the key; a single swapped cell
  fails this check.
- **obj-2**: the bonus answer must name Ezel and correctly locate the
  candle/honey stalls (2 and 4) that bracket it.
- **obj-3**: scan for duplicate vendors/goods/colors across rows — the
  table must be a genuine permutation in each column.
- **obj-4**: count distinct clue numbers referenced in the numbered
  deduction chain (not just "the clues" in general) — at least 5 of the
  11 must be explicitly cited.
- **obj-5**: run `wc -w SOLUTION.md` on the whole file.

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
