---
test: logic-03c-bead-tin
canary: "sawmill smithy"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the exact fraction 18/7 (an unreduced form like 72/28 passes only if the reduced fraction also appears; a decimal like 2.57 with no fraction fails)"
    - id: obj-2
      check: "Q2 states P(score >= 12) = 5/14 and P(score < 0) = 3/14 as exact fractions"
    - id: obj-3
      check: "Q3 states the exact fraction 81/32 (2.53 or 2.5313 alone fails — this is the seeded decimal trap)"
    - id: obj-4
      check: "Q4 states Threading A (without replacement) is higher by exactly 9/224"
    - id: obj-5
      check: "ANSWERS.md includes an enumeration covering the five pair types CC, CJ, CP, JJ, JP with scores 12, 1, 12, -10, -10, includes the Threading B PP case scoring 0, and the whole file is at most 500 words (`wc -w`)"
  subjective:
    - id: sub-quality
      name: "Probabilistic rigor"
      weight: 0.4
    - id: sub-craft
      name: "Enumeration craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `logic-03-token-pouch` (same construct, fresh surface).

If the phrase "sawmill smithy" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently using the node enumeration below;
do not trust the runner's stated numbers.

### Reference enumeration script

```js
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;}
function reduce(n,d){const g=gcd(n,d);return [n/g, d/g];}
const beads = [
  {t:'C',v:6},{t:'C',v:6},{t:'C',v:6},{t:'C',v:6},
  {t:'J',v:-5},{t:'J',v:-5},{t:'J',v:-5},
  {t:'P',v:0},
];
function score(a,b){
  if (a.t==='P' && b.t==='P') return 0;
  if (a.t==='P') return b.v*2;
  if (b.t==='P') return a.v*2;
  return a.v+b.v;
}
// Threading A: unordered pairs without replacement
let pairsA=[], sumA=0;
for (let i=0;i<8;i++) for (let j=i+1;j<8;j++){ const s=score(beads[i],beads[j]); pairsA.push(s); sumA+=s; }
console.log('Threading A pairs:', pairsA.length, 'sum:', sumA, 'EV:', reduce(sumA,pairsA.length));
console.log('P(>=12):', reduce(pairsA.filter(s=>s>=12).length, pairsA.length));
console.log('P(<0):', reduce(pairsA.filter(s=>s<0).length, pairsA.length));
// Threading B: ordered pairs with replacement
let sumB=0, n=0;
for (let i=0;i<8;i++) for (let j=0;j<8;j++){ sumB+=score(beads[i],beads[j]); n++; }
console.log('Threading B outcomes:', n, 'sum:', sumB, 'EV:', reduce(sumB,n));
```

Expected output: Threading A: 28 pairs, sum 72, EV = 18/7; P(>=12) = 5/14;
P(<0) = 3/14. Threading B: 64 outcomes, sum 162, EV = 81/32. Difference:
18/7 - 81/32 = 576/224 - 567/224 = 9/224 (Threading A higher).

- **obj-1**: fractions must be reduced or accompanied by the reduced
  form; a bare decimal fails even if numerically correct to 2 decimal
  places, since the test explicitly requires exact fractions.
  - PASS: "Q1: 18/7"; "Q1: 18/7 (= 2.57)"; "Q1: 72/28 = 18/7".
  - FAIL: "Q1: 2.57"; "Q1: 2.57 points"; "Q1: 72/28" with no reduced
    form shown.
- **obj-2**: both probabilities are required; a submission giving only
  one is incomplete.
  - PASS: "P(score >= 12) = 5/14, P(score < 0) = 3/14"; "5/14 and 3/14
    respectively"; "10/28 = 5/14; 6/28 = 3/14".
  - FAIL: "P(>= 12) = 5/14" with no P(<0); "P(<0) = 3/14" alone; "P(>=12)
    = 0.36, P(<0) = 0.21" (decimals, no fractions).
- **obj-3**: the seeded decimal trap.
  - PASS: "Q3: 81/32"; "Q3: 81/32 (≈ 2.531)"; "Q3: 162/64 = 81/32".
  - FAIL: "Q3: 2.53"; "Q3: 2.5313..."; "Q3: about 2.5".
- **obj-4**: both the winner ("Threading A") and the exact margin
  (9/224) are required; "Threading A is higher" without the fraction, or
  the wrong winner, fails.
  - PASS: "Threading A, by 9/224"; "A is higher by 9/224"; "Threading A
    wins; margin 9/224".
  - FAIL: "Threading A is higher" (no margin); "they are equal";
    "Threading B, by 9/224" (wrong winner).
- **obj-5**: verify the Threading A table has all five row types with
  the correct per-type score (CC=12, CJ=1, CP=12, JJ=-10, JP=-10) and
  that the Threading B table additionally includes PP=0. Run
  `wc -w ANSWERS.md` on the whole file for the cap.
  - PASS: a five-row A table plus a six-row B table (adding PP=0), file
    under 500 words; both tables present with counts and scores; the B
    table explicitly lists prism-prism = 0.
  - FAIL: only one table; the B table omits the PP=0 row; a per-type
    score is wrong (e.g. CP shown as 6 instead of 12); file over 500
    words.

### Subjective guidance

- **Probabilistic rigor**: correct sample-space setup for both regimes
  (28 unordered pairs for Threading A, 64 ordered outcomes for Threading
  B, with same-bead repeats and PP properly included in B), correct case
  weighting, and exact-fraction discipline maintained throughout the
  working, not just in the final answer line.
- **Enumeration craft**: are the case tables complete, clearly labeled,
  and organized so a reader could re-total the expected value by hand
  from the table alone (counts, per-case scores, and a visible sum)?
- **Reasoning quality**: does REASONING.md justify the without- vs
  with-replacement distinction and the choice to keep exact fractions,
  showing awareness of the 81/32 decimal trap?
