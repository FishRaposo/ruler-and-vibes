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
      check: "Q1 states the modular inverse of 5 mod 32 is exactly 13 (a submission that gives a wrong inverse fails; 13 verifiable since 5*13 = 65 ≡ 1 mod 32)"
    - id: obj-2
      check: "Q2 gives the decoded codename exactly as WARP (case-insensitive; any other word fails — judge recomputes D(y)=13*(y-9) mod 32 on X,J,'4',U = 23,9,30,20 -> 22,0,17,15 = W,A,R,P)"
    - id: obj-3
      check: "Q3 states the total number of valid affine keys is exactly 512 (16 coprime multipliers × 32 shifts; answers of 32, 16, 480, or 256 fail — the trap of forgetting the shift factor or miscounting φ(32))"
    - id: obj-4
      check: "Q4 concludes NO symbol is a fixed point and grounds it in gcd(4,32)=4 not dividing 23 (or equivalent statement that 4x≡23 mod32 is unsolvable; PASS: 'no symbol is fixed because 4x≡23 mod32 has no solution since 4 does not divide 23', 'no fixed points — gcd(4,32)=4 does not divide 23, so 4x≡23 is unsolvable'; FAIL: 'the fixed point is letter D', 'x=7', 'there is exactly one fixed point')"
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

Parallel form of `logic-06-cipher-wheel` (same construct, fresh surface,
widened to a 32-symbol alphabet so its answers are distinct from both
the base form and `logic-06c`).

If the phrase "puku roan" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently; do not trust the runner's stated
numbers.

### Reference verification script

Save as `scorecode.js` and run with `node scorecode.js`:

```js
function egcd(a,b){ if(b===0) return [a,1,0]; const [g,x1,y1]=egcd(b,a%b); return [g, y1, x1 - Math.floor(a/b)*y1]; }
function modinv(a,m){ const [g,x] = egcd(((a%m)+m)%m,m); if (g!==1) return null; return ((x%m)+m)%m; }
const inv5 = modinv(5,32);
console.log('inv(5) mod 32 =', inv5, 'check 5*inv mod32=', (5*inv5)%32);

function symToNum(c){
  if (c >= '0' && c <= '5') return 26 + c.charCodeAt(0) - '0'.charCodeAt(0);
  return c.charCodeAt(0) - 65;
}
function numToSym(n){
  n = ((n%32)+32)%32;
  return n < 26 ? String.fromCharCode(n + 65) : String(n - 26);
}
let plain = '';
for (const ch of ['X','J','4','U']) {
  const y = symToNum(ch);
  const x = ((inv5 * (y - 9)) % 32 + 32) % 32;
  plain += numToSym(x);
}
console.log('codename:', plain);

function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){[a,b]=[b,a%b];} return a; }
let coprimeCount=0;
for (let a=1;a<32;a++) if (gcd(a,32)===1) coprimeCount++;
console.log('phi(32):', coprimeCount, 'total keys:', coprimeCount*32);

console.log('gcd(4,32)=', gcd(4,32), 'divides 23?', 23 % gcd(4,32) === 0);
let fixedPoints = [];
for (let x=0;x<32;x++) if ((5*x+9)%32===x) fixedPoints.push(x);
console.log('fixed points (brute force 0..31):', fixedPoints);
```

Expected output: `inv(5) mod 32 = 13` (check = 1); `codename: WARP`;
`phi(32): 16, total keys: 512`; `gcd(4,32)= 4 divides 23? false`;
`fixed points: []` (empty — confirmed by exhaustive scan of all 32
symbols, not just the congruence argument).

To confirm the fixed-point scan is discriminating, also run it against
`E(x) = (3x + 4) mod 32`: the fixed-point congruence reduces to
`2x ≡ 28 (mod 32)`, and gcd(2,32)=2 DOES divide 28, so this variant
DOES have fixed points, and the brute-force scan returns `[14, 30]` —
confirming the script correctly reports a non-empty result when the
congruence is solvable, and the empty `[]` on the actual `XJ4U` cipher
is a real "unsolvable" result, not a script bug.

- **obj-1**: 13 must appear as Q1's answer; a decimal or fractional
  "inverse" fails.
- **obj-2**: WARP must appear as Q2's codename (case-insensitive);
  reject any answer arrived at without applying the inverse from Q1
  consistently (e.g. a codename that doesn't encode back to XJ4U under
  E).
- **obj-3**: 512 is the only acceptable count; flag common wrong
  answers (32 = forgetting to multiply by coprime count, 16 =
  forgetting the shift factor, 480 = miscounting φ(32) as 15, 256 =
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
  correct final answer reached by guessing), and is the φ(32)
  computation for Q3 shown as coprime-count times shift-count rather
  than asserted?
- **Modular-working transparency**: can a reader follow the modular
  arithmetic step by step for Q1 and Q4 (e.g. seeing `5×13=65=2×32+1`
  and `4x≡23 (mod 32)` with the gcd check spelled out) rather than
  being handed only final values?
- **Reasoning quality**: does the submission show it recognized Q4 as
  a potential trap — i.e. does it explicitly consider whether the
  congruence is solvable before answering, rather than assuming affine
  ciphers always have a fixed point or arbitrarily picking a letter?
