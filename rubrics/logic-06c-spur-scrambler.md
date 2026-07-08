---
test: logic-06c-spur-scrambler
canary: "blesbok bongo"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the modular inverse of 3 mod 34 is exactly 23 (a submission that gives a wrong inverse fails; 23 verifiable since 3*23 = 69 ≡ 1 mod 34)"
    - id: obj-2
      check: "Q2 gives the decoded true spur sequence exactly as 18, 32, 33, 14 in that order (any other sequence or order fails — judge recomputes D(y)=23*(y-15) mod 34 on 1,9,12,23 -> 18,32,33,14)"
    - id: obj-3
      check: "Q3 states the total number of valid scrambler keys is exactly 544 (16 coprime multipliers × 34 shifts; answers of 34, 33, 16, or 540 fail — the trap of forgetting the shift factor or miscounting the coprime-multiplier count)"
    - id: obj-4
      check: "Q4 concludes NO spur is a fixed point and grounds it in gcd(2,34)=2 not dividing 19 (or equivalent statement that 2x≡19 mod34 is unsolvable; PASS: 'no spur is fixed because 2x≡19 mod34 has no solution since 2 does not divide 19', 'no fixed spurs — gcd(2,34)=2 does not divide 19, so 2x≡19 is unsolvable', 'unsolvable: 19 is odd but any multiple of gcd 2 is even, so no spur maps to itself'; FAIL: 'the fixed spur is 15', 'x=8 is the fixed point', 'there is exactly one fixed spur')"
    - id: obj-5
      check: "YARDLOG.md shows the modular working for at least Q1 and Q4 (not just final numbers) and the whole file is at most 350 words (`wc -w`)"
  subjective:
    - id: sub-quality
      name: "Number-theoretic correctness"
      weight: 0.4
    - id: sub-craft
      name: "Modular-working transparency"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `logic-06-cipher-wheel` (same construct, fresh surface).

If the phrase "blesbok bongo" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently; do not trust the runner's stated
numbers.

### Reference verification script

Save as `spurs.js` and run with `node spurs.js`:

```js
function egcd(a,b){ if(b===0) return [a,1,0]; const [g,x1,y1]=egcd(b,a%b); return [g, y1, x1 - Math.floor(a/b)*y1]; }
function modinv(a,m){ const [g,x] = egcd(((a%m)+m)%m,m); if (g!==1) return null; return ((x%m)+m)%m; }
const inv3 = modinv(3,34);
console.log('inv(3) mod 34 =', inv3, 'check 3*inv mod34=', (3*inv3)%34);

const cipher = [1,9,12,23];
const plain = cipher.map(y => ((inv3 * (y - 15)) % 34 + 34) % 34);
console.log('recovered spur sequence:', plain);

function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){[a,b]=[b,a%b];} return a; }
let coprimeCount=0;
for (let a=1;a<34;a++) if (gcd(a,34)===1) coprimeCount++;
console.log('phi(34):', coprimeCount, 'total keys:', coprimeCount*34);

console.log('gcd(2,34)=', gcd(2,34), 'divides 19?', 19 % gcd(2,34) === 0);
let fixedSpurs = [];
for (let x=0;x<34;x++) if ((3*x+15)%34===x) fixedSpurs.push(x);
console.log('fixed spurs (brute force 0..33):', fixedSpurs);
```

Expected output: `inv(3) mod 34 = 23` (check = 1); `recovered spur
sequence: [ 18, 32, 33, 14 ]`; `phi(34): 16, total keys: 544`;
`gcd(2,34)= 2 divides 19? false`; `fixed spurs: []` (empty — confirmed
by exhaustive scan of all 34 spurs, not just the congruence argument).

To confirm the fixed-spur scan is discriminating, also run it against
`S(x) = (3x + 4) mod 34`: the fixed-point congruence reduces to
`2x ≡ 30 (mod 34)`, and gcd(2,34)=2 DOES divide 30, so this variant
DOES have fixed points, and the brute-force scan returns `[15, 32]` —
confirming the script correctly reports a non-empty result when the
congruence is solvable, and the empty `[]` on the actual scrambler is
a real "unsolvable" result, not a script bug.

- **obj-1**: 23 must appear as Q1's answer; a decimal or fractional
  "inverse" fails.
- **obj-2**: `18, 32, 33, 14` (in that order) must appear as Q2's
  recovered sequence; reject any answer arrived at without applying
  the inverse from Q1 consistently (e.g. a sequence that doesn't
  re-scramble back to `1, 9, 12, 23` under S).
- **obj-3**: 544 is the only acceptable count; flag common wrong
  answers (34 = forgetting the coprime restriction on the multiplier
  and counting shifts alone, 33 = wrongly assuming every nonzero
  residue is a valid multiplier, 16 = forgetting to multiply by the
  shift count, 540 = arithmetic slip) as diagnostic of the specific
  trap failed.
- **obj-4**: the conclusion must be "no fixed spur" grounded in the
  gcd/divisibility argument; do not accept a correct "no" conclusion
  that is unjustified (bare assertion) as fully satisfying this check —
  the congruence or gcd reasoning must be shown per the deliverable
  requirement, though partial credit is a subjective-axis concern, not
  this pass/fail check.
- **obj-5**: confirm modular working (not just final numbers) appears
  for Q1 and Q4; run `wc -w YARDLOG.md` for the cap.

### Subjective guidance

- **Number-theoretic correctness**: is the extended-Euclid or trial
  reasoning for the inverse actually correct arithmetic (not just a
  correct final answer reached by guessing), and is the key-count
  computation for Q3 shown as coprime-multiplier-count times
  shift-count rather than asserted?
- **Modular-working transparency**: can a reader follow the modular
  arithmetic step by step for Q1 and Q4 (e.g. seeing `3×23=69=2×34+1`
  and `2x≡19 (mod 34)` with the gcd check spelled out) rather than
  being handed only final values?
- **Reasoning quality**: does the submission show it recognized Q4 as
  a potential trap — i.e. does it explicitly consider whether the
  congruence is solvable before answering, rather than assuming
  scrambler formulas always have a fixed spur or arbitrarily picking
  one?
