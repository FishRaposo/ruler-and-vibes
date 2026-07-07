---
test: logic-03b-crystal-tray
canary: "waterwheel gristmill"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the exact fraction 16/3 (an unreduced form like 112/21 passes only if the reduced fraction also appears; a decimal like 5.33 with no fraction fails)"
    - id: obj-2
      check: "Q2 states P(clarity >= 10) = 10/21 and P(clarity < 0) = 1/7 as exact fractions"
    - id: obj-3
      check: "Q3 states the exact fraction 256/49 (5.22 or 5.2245 alone fails — this is the seeded decimal trap)"
    - id: obj-4
      check: "Q4 states Appraisal A (without replacement) is higher by exactly 16/147"
    - id: obj-5
      check: "ANSWERS.md includes an enumeration covering the five pair types GG, GS, GL, SS, SL with clarities 10, 3, 10, -4, -4, includes the Appraisal B LL case scoring 0, and the whole file is at most 500 words (`wc -w`)"
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

If a submission's ANSWERS.md or REASONING.md contains the phrase
"waterwheel gristmill", that is a canary leak — flag it regardless of how the
rest of the checks score.

Recompute every value independently using the node enumeration below;
do not trust the runner's stated numbers.

### Reference enumeration script

```js
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;}
function reduce(n,d){const g=gcd(n,d);return [n/g, d/g];}
const shards = [
  {t:'G',v:5},{t:'G',v:5},{t:'G',v:5},{t:'G',v:5},
  {t:'S',v:-2},{t:'S',v:-2},
  {t:'L',v:0},
];
function score(a,b){
  if (a.t==='L' && b.t==='L') return 0;
  if (a.t==='L') return b.v*2;
  if (b.t==='L') return a.v*2;
  return a.v+b.v;
}
// Appraisal A: unordered pairs without replacement
let pairsA=[], sumA=0;
for (let i=0;i<7;i++) for (let j=i+1;j<7;j++){ const s=score(shards[i],shards[j]); pairsA.push(s); sumA+=s; }
console.log('Appraisal A pairs:', pairsA.length, 'sum:', sumA, 'EV:', reduce(sumA,pairsA.length));
console.log('P(>=10):', reduce(pairsA.filter(s=>s>=10).length, pairsA.length));
console.log('P(<0):', reduce(pairsA.filter(s=>s<0).length, pairsA.length));
// Appraisal B: ordered pairs with replacement
let sumB=0, n=0;
for (let i=0;i<7;i++) for (let j=0;j<7;j++){ sumB+=score(shards[i],shards[j]); n++; }
console.log('Appraisal B outcomes:', n, 'sum:', sumB, 'EV:', reduce(sumB,n));
```

Expected output: Appraisal A: 21 pairs, sum 112, EV = 16/3; P(>=10) = 10/21;
P(<0) = 1/7. Appraisal B: 49 outcomes, sum 256, EV = 256/49. Difference:
16/3 - 256/49 = 784/147 - 768/147 = 16/147 (Appraisal A higher).

- **obj-1/obj-3**: fractions must be reduced or accompanied by the
  reduced form; a bare decimal fails even if numerically correct to 2
  decimal places, since the test explicitly requires exact fractions.
  PASS: "Q1: 16/3", "EV(A) = 112/21 = 16/3", "16/3 (= 5.33)". FAIL:
  "Q1: 5.33", "Q3: 5.22", "Q3: 5.2245 (repeating)".
- **obj-2**: both probabilities are required; a submission giving only
  one is incomplete. PASS: "P(clarity >= 10) = 10/21, P(clarity < 0) =
  1/7", "10/21 and 1/7", "= 10/21 ... = 1/7". FAIL: "P(>=10) = 10/21"
  with no P(<0), "0.48 and 0.14" (decimals only), "P(<0) = 3/21" left
  unreduced with no 1/7.
- **obj-4**: both the winner ("Appraisal A") and the exact margin
  (16/147) are required. PASS: "Appraisal A is higher by 16/147",
  "Appraisal A, by 16/147", "A wins by exactly 16/147". FAIL: "Appraisal
  A is higher" with no fraction, "they are tied", "Appraisal B by
  16/147" (wrong winner).
- **obj-5**: verify the Appraisal A table has all five row types with
  the correct per-type clarity (GG=10, GS=3, GL=10, SS=-4, SL=-4) and
  that the Appraisal B table additionally includes LL=0. PASS: a B
  table with a "lensstone-lensstone | 1 | 0" row present; all five A
  rows shown with matching clarities; `wc -w` at or under 500. FAIL: B
  table omits the LL=0 outcome; an A row score is wrong (e.g. SL listed
  as -1); the file exceeds 500 words. Run `wc -w ANSWERS.md` on the
  whole file for the cap.

### Subjective guidance

- **Probabilistic rigor**: correct sample-space setup for both regimes
  (21 unordered pairs for A, 49 ordered outcomes for B, with same-shard
  repeats and LL properly included in B), correct case weighting, and
  exact-fraction discipline maintained throughout the working, not just
  in the final answer line.
- **Enumeration craft**: are the case tables complete, clearly labeled,
  and organized so a reader could re-total the expected value by hand
  from the table alone (counts, per-case clarities, and a visible sum)?
- **Reasoning quality**: does REASONING.md justify the without- vs
  with-replacement distinction and the choice to keep exact fractions,
  showing awareness of the 256/49 decimal trap?
