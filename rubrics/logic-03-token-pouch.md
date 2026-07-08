---
test: logic-03-token-pouch
canary: "velvet accordion doctrine"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the exact fraction 12/5 (an unreduced form like 36/15 passes only if the reduced fraction also appears; a decimal like 2.4 with no fraction fails)"
    - id: obj-2
      check: "Q2 states P(score >= 8) = 2/5 and P(score < 0) = 1/5 as exact fractions"
    - id: obj-3
      check: "Q3 states the exact fraction 7/3 (2.33 or 2.333 alone fails — this is the seeded decimal trap)"
    - id: obj-4
      check: "Q4 states Game A (without replacement) is higher by exactly 1/15"
    - id: obj-5
      check: "ANSWERS.md includes an enumeration covering the five pair types RR, RB, RG, BB, BG with scores 8, 1, 8, -6, -6, includes the Game B GG case scoring 0, and the whole file is at most 500 words (`wc -w`)"
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

If the phrase "velvet accordion doctrine" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently using the node enumeration below;
do not trust the runner's stated numbers.

### Reference enumeration script

```js
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;}
function reduce(n,d){const g=gcd(n,d);return [n/g, d/g];}
const tokens = [
  {t:'R',v:4},{t:'R',v:4},{t:'R',v:4},
  {t:'B',v:-3},{t:'B',v:-3},
  {t:'G',v:0},
];
function score(a,b){
  if (a.t==='G' && b.t==='G') return 0;
  if (a.t==='G') return b.v*2;
  if (b.t==='G') return a.v*2;
  return a.v+b.v;
}
// Game A: unordered pairs without replacement
let pairsA=[], sumA=0;
for (let i=0;i<6;i++) for (let j=i+1;j<6;j++){ const s=score(tokens[i],tokens[j]); pairsA.push(s); sumA+=s; }
console.log('Game A pairs:', pairsA.length, 'sum:', sumA, 'EV:', reduce(sumA,pairsA.length));
console.log('P(>=8):', reduce(pairsA.filter(s=>s>=8).length, pairsA.length));
console.log('P(<0):', reduce(pairsA.filter(s=>s<0).length, pairsA.length));
// Game B: ordered pairs with replacement
let sumB=0, n=0;
for (let i=0;i<6;i++) for (let j=0;j<6;j++){ sumB+=score(tokens[i],tokens[j]); n++; }
console.log('Game B outcomes:', n, 'sum:', sumB, 'EV:', reduce(sumB,n));
```

Expected output: Game A: 15 pairs, sum 36, EV = 12/5; P(>=8) = 2/5;
P(<0) = 1/5. Game B: 36 outcomes, sum 84, EV = 7/3. Difference:
12/5 - 7/3 = 36/15 - 35/15 = 1/15 (Game A higher).

- **obj-1/obj-3**: fractions must be reduced or accompanied by the
  reduced form; a bare decimal fails even if numerically correct to 2
  decimal places, since the test explicitly requires exact fractions.
- **obj-2**: both probabilities are required; a submission giving only
  one is incomplete.
- **obj-4**: both the winner ("Game A") and the exact margin (1/15)
  are required; "Game A is higher" without the fraction, or the wrong
  winner, fails.
- **obj-5**: verify the Game A table has all five row types with the
  correct per-type score (RR=8, RB=1, RG=8, BB=-6, BG=-6) and that the
  Game B table additionally includes GG=0. Run `wc -w ANSWERS.md` on
  the whole file for the cap.

### Subjective guidance

- **Probabilistic rigor**: correct sample-space setup for both regimes
  (15 unordered pairs for A, 36 ordered outcomes for B, with same-token
  repeats and GG properly included in B), correct case weighting, and
  exact-fraction discipline maintained throughout the working, not just
  in the final answer line.
- **Enumeration craft**: are the case tables complete, clearly labeled,
  and organized so a reader could re-total the expected value by hand
  from the table alone (counts, per-case scores, and a visible sum)?
- **Reasoning quality**: does REASONING.md justify the without- vs
  with-replacement distinction and the choice to keep exact fractions,
  showing awareness of the 7/3 decimal trap?
