---
test: logic-06-cipher-wheel
canary: "eelgrass stileway"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the modular inverse of 7 mod 26 is exactly 15 (a submission that gives a wrong inverse fails; 15 verifiable since 7*15 = 105 ≡ 1 mod 26)"
    - id: obj-2
      check: "Q2 gives the decrypted plaintext exactly as MEET (case-insensitive; any other word fails — judge recomputes D(y)=15*(y-11) mod 26 on R,N,N,O = 17,13,13,14 -> 12,4,4,19)"
    - id: obj-3
      check: "Q3 states the total number of valid affine keys is exactly 312 (12 coprime multipliers × 26 shifts; answers of 26, 25, 12, or 300 fail — the trap of forgetting the shift factor or miscounting φ(26))"
    - id: obj-4
      check: "Q4 concludes NO letter is a fixed point and grounds it in gcd(6,26)=2 not dividing 15 (or equivalent statement that 6x≡15 mod26 is unsolvable; PASS: 'no letter is fixed because 6x≡15 mod26 has no solution since 2 does not divide 15', 'no fixed points — gcd(6,26)=2 does not divide 15, so 6x≡15 is unsolvable'; FAIL: 'the fixed point is letter P', 'x=13', 'there is exactly one fixed point')"
    - id: obj-5
      check: "CIPHER.md shows the modular working for at least Q1 and Q4 (not just final numbers) and the whole file is at most 350 words (`wc -w`)"
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

If a submission's CIPHER.md contains the phrase "eelgrass stileway",
that is a canary leak — flag it regardless of how the rest of the
checks score.

Recompute every value independently; do not trust the runner's stated
numbers.

### Reference verification script

Save as `cipher.js` and run with `node cipher.js`:

```js
function egcd(a,b){ if(b===0) return [a,1,0]; const [g,x1,y1]=egcd(b,a%b); return [g, y1, x1 - Math.floor(a/b)*y1]; }
function modinv(a,m){ const [g,x] = egcd(((a%m)+m)%m,m); if (g!==1) return null; return ((x%m)+m)%m; }
const inv7 = modinv(7,26);
console.log('inv(7) mod 26 =', inv7, 'check 7*inv mod26=', (7*inv7)%26);

function letterToNum(c){ return c.charCodeAt(0) - 65; }
function numToLetter(n){ return String.fromCharCode(((n%26)+26)%26 + 65); }
let plain = '';
for (const ch of 'RNNO') {
  const y = letterToNum(ch);
  const x = ((inv7 * (y - 11)) % 26 + 26) % 26;
  plain += numToLetter(x);
}
console.log('plaintext:', plain);

function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){[a,b]=[b,a%b];} return a; }
let coprimeCount=0;
for (let a=1;a<26;a++) if (gcd(a,26)===1) coprimeCount++;
console.log('phi(26):', coprimeCount, 'total keys:', coprimeCount*26);

console.log('gcd(6,26)=', gcd(6,26), 'divides 15?', 15 % gcd(6,26) === 0);
let fixedPoints = [];
for (let x=0;x<26;x++) if ((7*x+11)%26===x) fixedPoints.push(x);
console.log('fixed points (brute force 0..25):', fixedPoints);
```

Expected output: `inv(7) mod 26 = 15` (check = 1); `plaintext: MEET`;
`phi(26): 12, total keys: 312`; `gcd(6,26)= 2 divides 15? false`;
`fixed points: []` (empty — confirmed by exhaustive scan of all 26
letters, not just the congruence argument).

To confirm the fixed-point scan is discriminating, also run it against
`E(x) = (2x + 4) mod 26`: the fixed-point congruence reduces to
`x ≡ 22 (mod 26)` (i.e. `1x ≡ 22`, and gcd(1,26)=1 always divides),
so this variant DOES have a fixed point, and the brute-force scan
returns `[22]` — confirming the script correctly reports a non-empty
result when the congruence is solvable, and the empty `[]` on the
actual `RNNO` cipher is a real "unsolvable" result, not a script bug.

- **obj-1**: 15 must appear as Q1's answer; a decimal or fractional
  "inverse" fails.
- **obj-2**: MEET must appear as Q2's plaintext (case-insensitive);
  reject any answer arrived at without applying the inverse from Q1
  consistently (e.g. a plaintext that doesn't decrypt back to RNNO
  under E).
- **obj-3**: 312 is the only acceptable count; flag common wrong
  answers (26 = forgetting to multiply by coprime count, 12 = forgetting
  the shift factor, 300 = arithmetic slip) as diagnostic of the
  specific trap failed.
- **obj-4**: the conclusion must be "no fixed point" grounded in the
  gcd/divisibility argument; do not accept a correct "no" conclusion
  that is unjustified (bare assertion) as fully satisfying this check —
  the congruence or gcd reasoning must be shown per the deliverable
  requirement, though partial credit is a subjective-axis concern, not
  this pass/fail check.
- **obj-5**: confirm modular working (not just final numbers) appears
  for Q1 and Q4; run `wc -w CIPHER.md` for the cap.

### Subjective guidance

- **Number-theoretic correctness**: is the extended-Euclid or trial
  reasoning for the inverse actually correct arithmetic (not just a
  correct final answer reached by guessing), and is the φ(26)
  computation for Q3 shown as coprime-count times shift-count rather
  than asserted?
- **Modular-working transparency**: can a reader follow the modular
  arithmetic step by step for Q1 and Q4 (e.g. seeing `7×15=105=4×26+1`
  and `6x≡15 (mod 26)` with the gcd check spelled out) rather than
  being handed only final values?
- **Reasoning quality**: does the submission show it recognized Q4 as
  a potential trap — i.e. does it explicitly consider whether the
  congruence is solvable before answering, rather than assuming affine
  ciphers always have a fixed point or arbitrarily picking a letter?
