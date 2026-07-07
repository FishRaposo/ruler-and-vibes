---
test: logic-06b-arcade-scorecode
canary: "puku roan"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the modular inverse of 5 mod 26 is exactly 21 (a submission that gives a wrong inverse fails; 21 verifiable since 5*21 = 105 ≡ 1 mod 26)"
    - id: obj-2
      check: "Q2 gives the decoded codename exactly as STAR (case-insensitive; any other word fails — judge recomputes D(y)=21*(y-9) mod 26 on V,A,J,Q = 21,0,9,16 -> 18,19,0,17 = S,T,A,R)"
    - id: obj-3
      check: "Q3 states the total number of valid affine keys is exactly 312 (12 coprime multipliers × 26 shifts; answers of 26, 12, 338, or 300 fail — the trap of forgetting the shift factor or miscounting φ(26))"
    - id: obj-4
      check: "Q4 concludes NO letter is a fixed point and grounds it in gcd(4,26)=2 not dividing 17 (or equivalent statement that 4x≡17 mod26 is unsolvable; PASS: 'no letter is fixed because 4x≡17 mod26 has no solution since 2 does not divide 17', 'no fixed points — gcd(4,26)=2 does not divide 17, so 4x≡17 is unsolvable'; FAIL: 'the fixed point is letter D', 'x=7', 'there is exactly one fixed point')"
    - id: obj-5
      check: "SCORECODE.md shows the modular working for at least Q1 and Q4 (not just final numbers) and the whole file is at most 350 words (`wc -w`)"
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

If a submission's SCORECODE.md contains the phrase "puku roan", that
is a canary leak — flag it regardless of how the rest of the checks
score.

Recompute every value independently; do not trust the runner's stated
numbers.

### Reference verification script

Save as `scorecode.js` and run with `node scorecode.js`:

```js
function egcd(a,b){ if(b===0) return [a,1,0]; const [g,x1,y1]=egcd(b,a%b); return [g, y1, x1 - Math.floor(a/b)*y1]; }
function modinv(a,m){ const [g,x] = egcd(((a%m)+m)%m,m); if (g!==1) return null; return ((x%m)+m)%m; }
const inv5 = modinv(5,26);
console.log('inv(5) mod 26 =', inv5, 'check 5*inv mod26=', (5*inv5)%26);

function letterToNum(c){ return c.charCodeAt(0) - 65; }
function numToLetter(n){ return String.fromCharCode(((n%26)+26)%26 + 65); }
let plain = '';
for (const ch of 'VAJQ') {
  const y = letterToNum(ch);
  const x = ((inv5 * (y - 9)) % 26 + 26) % 26;
  plain += numToLetter(x);
}
console.log('codename:', plain);

function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){[a,b]=[b,a%b];} return a; }
let coprimeCount=0;
for (let a=1;a<26;a++) if (gcd(a,26)===1) coprimeCount++;
console.log('phi(26):', coprimeCount, 'total keys:', coprimeCount*26);

console.log('gcd(4,26)=', gcd(4,26), 'divides 17?', 17 % gcd(4,26) === 0);
let fixedPoints = [];
for (let x=0;x<26;x++) if ((5*x+9)%26===x) fixedPoints.push(x);
console.log('fixed points (brute force 0..25):', fixedPoints);
```

Expected output: `inv(5) mod 26 = 21` (check = 1); `codename: STAR`;
`phi(26): 12, total keys: 312`; `gcd(4,26)= 2 divides 17? false`;
`fixed points: []` (empty — confirmed by exhaustive scan of all 26
letters, not just the congruence argument).

To confirm the fixed-point scan is discriminating, also run it against
`E(x) = (3x + 4) mod 26`: the fixed-point congruence reduces to
`2x ≡ 22 (mod 26)`, and gcd(2,26)=2 DOES divide 22, so this variant
DOES have fixed points, and the brute-force scan returns `[11, 24]` —
confirming the script correctly reports a non-empty result when the
congruence is solvable, and the empty `[]` on the actual `VAJQ` cipher
is a real "unsolvable" result, not a script bug.

- **obj-1**: 21 must appear as Q1's answer; a decimal or fractional
  "inverse" fails.
- **obj-2**: STAR must appear as Q2's codename (case-insensitive);
  reject any answer arrived at without applying the inverse from Q1
  consistently (e.g. a codename that doesn't encode back to VAJQ under
  E).
- **obj-3**: 312 is the only acceptable count; flag common wrong
  answers (26 = forgetting to multiply by coprime count, 12 =
  forgetting the shift factor, 338 = miscounting φ(26) as 13, 300 =
  arithmetic slip) as diagnostic of the specific trap failed.
- **obj-4**: the conclusion must be "no fixed point" grounded in the
  gcd/divisibility argument; do not accept a correct "no" conclusion
  that is unjustified (bare assertion) as fully satisfying this check —
  the congruence or gcd reasoning must be shown per the deliverable
  requirement, though partial credit is a subjective-axis concern, not
  this pass/fail check.
- **obj-5**: confirm modular working (not just final numbers) appears
  for Q1 and Q4; run `wc -w SCORECODE.md` for the cap.

### Subjective guidance

- **Number-theoretic correctness**: is the extended-Euclid or trial
  reasoning for the inverse actually correct arithmetic (not just a
  correct final answer reached by guessing), and is the φ(26)
  computation for Q3 shown as coprime-count times shift-count rather
  than asserted?
- **Modular-working transparency**: can a reader follow the modular
  arithmetic step by step for Q1 and Q4 (e.g. seeing `5×21=105=4×26+1`
  and `4x≡17 (mod 26)` with the gcd check spelled out) rather than
  being handed only final values?
- **Reasoning quality**: does the submission show it recognized Q4 as
  a potential trap — i.e. does it explicitly consider whether the
  congruence is solvable before answering, rather than assuming affine
  ciphers always have a fixed point or arbitrarily picking a letter?
