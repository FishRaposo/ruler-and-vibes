---
test: game-08c-gearcore-torque
canary: "greenfinch beluga"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "gearcores.json parses as valid JSON listing exactly 3 gear-core families, each with a name and an integer base torque, loadable with node"
    - id: obj-2
      check: "PROOF.md computes the WORST-CASE (spin-maximizing) legal 3-core seating as the maximum over ALL size-3 multisets of the three families (not just same-family triples) and shows its total spin score <= 52 using the embedded diminishing-stack rule — judge recomputes the max over all multisets with node from gearcores.json base values and confirms it equals PROOF.md's stated worst-case number and is <= 52"
    - id: obj-3
      check: "The worst-case total the judge recomputes over ALL legal multisets from gearcores.json is <= 52 AND the design admits at least one legal seating reaching >= 36"
    - id: obj-4
      check: "PROOF.md correctly applies the floor-division halving (e.g. shows a base-b family's three-copy contribution as b + floor(b/2) + floor(b/4)) rather than naive full-stacking"
    - id: obj-5
      check: "PROOF.md is at most 500 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Systems-design coherence"
      weight: 0.4
    - id: sub-craft
      name: "Rigor and completeness of the bound proof"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `game-08-combo-engine` (same construct, fresh surface).

If the phrase "greenfinch beluga" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute obj-2/obj-3 yourself from `gearcores.json`'s base values by
scanning ALL 10 size-3 multisets of the 3 families (3 same-family
triples + 6 two-plus-one combos + 1 one-of-each) using the stacking
rule: base spin score 8, plus for each family with `c` copies in the
seating, contribution = `base + floor(base/2) + floor(base/4) + ...`
for `c` terms (0 if `c=0`). Do not trust a submission's stated max
without recomputing — the entire point of this test is that a solver
who only checks same-family triples underestimates the true worst
case.

### Reference verification (author, script-run)

For a compliant sample design with bases `[17, 12, 10]`, all 10
multiset totals:

```
counts=[1,1,1] total=47   <- TRUE WORST CASE (one-of-each)
counts=[2,1,0] total=45
counts=[2,0,1] total=43
counts=[1,2,0] total=43
counts=[1,0,2] total=40
counts=[3,0,0] total=37   <- NOT the worst case, despite being the
                             same-family triple of the largest base
counts=[0,2,1] total=36
counts=[0,1,2] total=35
counts=[0,3,0] total=29
counts=[0,0,3] total=25
```

Worst case = 47 (one-of-each: 8 + 17 + 12 + 10), which is <= 52 (a
5-point margin) and also satisfies the >= 36 requirement. Note that
3x base-17 = 8 + (17+8+4) = 37 is LOWER than the one-of-each total of
47 — confirming that same-family-triple-only analysis would have
badly underestimated the true worst case here.

Confirmed trap: a family with base 23 alongside 12 and 10 gives
one-of-each = 8 + 23 + 12 + 10 = **53 > 52** (INVALID), even though
3x base-23 diminishing = 8 + (23+11+5) = 47 sits comfortably under the
cap — a submission that only checked the same-family triple would
wrongly conclude base 23 is compliant.

Submissions do not need to match `[17, 12, 10]` — any 3 base values
whose judge-recomputed true worst-case (over all 10 multisets) is
<= 52 and whose best seating reaches >= 36 passes obj-2/obj-3.

Judge recomputation script (run standalone from the directory holding
the submission's `gearcores.json`):

```
node check.js gearcores.json
```

where `check.js` is:

```js
// Usage: node check.js gearcores.json
const fs = require('fs');
const path = process.argv[2] || 'gearcores.json';
const fams = JSON.parse(fs.readFileSync(path, 'utf8'));
if (!Array.isArray(fams) || fams.length !== 3) { console.error('FAIL: need exactly 3 families'); process.exit(1); }
const bases = fams.map(f => f.base);
const BASE = 8, CAP = 52, FLOORREQ = 36;
function famContribution(b, c){ let t=0, cur=b; for(let i=0;i<c;i++){ t+=cur; cur=Math.floor(cur/2); } return t; }
const rows = [];
for (let a=3;a>=0;a--) for (let b=3-a;b>=0;b--){ const c=3-a-b; if(c<0) continue;
  const total = BASE + famContribution(bases[0],a) + famContribution(bases[1],b) + famContribution(bases[2],c);
  rows.push({cnts:[a,b,c], total});
}
rows.sort((x,y)=>y.total-x.total);
const trueMax = rows[0].total;
rows.forEach(r=>console.log(`counts=[${r.cnts.join(',')}] total=${r.total}`));
console.log('TRUE worst-case (max over all 10 multisets) =', trueMax);
console.log('worst-case <= 52 ?', trueMax <= CAP, ' (margin', CAP - trueMax, ')');
console.log('some seating >= 36 ?', trueMax >= FLOORREQ);
console.log('VERDICT obj-2/obj-3:', (trueMax <= CAP && trueMax >= FLOORREQ) ? 'PASS' : 'FAIL');
```

### Per-check guidance

- **obj-1**: confirm exactly 3 entries, each with a `name` string and
  integer `base`.
- **obj-2**: recompute the max over all 10 multisets yourself in node
  from the submitted base values; compare against PROOF.md's stated
  worst-case seating and number. A PROOF.md that only checks same-
  family triples and states a lower (wrong) worst-case fails this
  check even if that lower number happens to be <= 52 — the true max
  must be shown and must be <= 52.
- **obj-3**: two independent numeric facts, both from your own
  recomputation: true max <= 52, and some multiset total >= 36.
- **obj-4**: check that at least one same-family triple's arithmetic
  literally shows the floored halving series (e.g. `b + floor(b/2) +
  floor(b/4)`), not `3 * b` or an unexplained final number.
  - PASS phrasings: "base 17 over three copies: 17 + 8 + 4 = 29",
    "floor(17/2)=8, floor(17/4)=4, so three stacks give 29".
  - FAIL phrasings: "three copies of base 17 gives 51" (naive linear
    stacking, ignores diminishing), "stacking triples the value"
    (contradicts the embedded rule).
- **obj-5**: run `wc -w PROOF.md` on the whole file.

### Subjective guidance

- **Systems-design coherence**: do the three gear-core families feel
  like a real, distinct trio (not three arbitrary numbers) with
  sensible relative power levels?
- **Rigor and completeness of the bound proof**: does the proof
  actually enumerate or clearly justify covering the full multiset
  space (all 10 combinations, or a convincing argument for why the
  one-of-each / near-one-of-each case dominates), rather than checking
  only same-family triples and hoping?
- **Reasoning quality**: does REASONING.md describe genuinely scanning
  the multiset space (by hand enumeration or a script) rather than
  asserting the bound holds without showing the mixed-multiset work?
