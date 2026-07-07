---
test: logic-04b-sevenfold-troupes
canary: "spatula whisk"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Part A states exactly 21 (= C(7,2))"
    - id: obj-2
      check: "Part B contains all three required elements as text the judge locates: the sum 7 x 3 = 21 (or an equivalent statement that the sum of all troupes' coproduction counts would be 21), the fact that each coproduction contributes 2 to that sum (so the sum must be even), and an explicit conclusion of impossibility"
    - id: obj-3
      check: "Part C's coproduction list passes the rubric's node property-check script: every line parses as 'i-j' with 1 <= i < j <= 7, exactly 14 distinct pairs, no self-pairings, and every troupe appears in exactly 4 coproductions"
    - id: obj-4
      check: "Part D states that per-troupe counts lie in {1,...,6} (6 possible values for 7 troupes) and applies pigeonhole to conclude two troupes share a count"
    - id: obj-5
      check: "PROOF.md is at most 600 words (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Proof rigor"
      weight: 0.4
    - id: sub-craft
      name: "Mathematical exposition"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `logic-04-ninefold-league` (same construct, fresh
surface).

If the phrase "spatula whisk" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Part C property-check script

Save the submission's Part C coproduction lines (one `i-j` per line,
exactly as they appear in PROOF.md) as `schedule.txt`, then run:

```
node -e "
const fs = require('fs');
const lines = fs.readFileSync('schedule.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const n = 7, requiredDegree = 4;
const seen = new Set();
const degree = {};
for (let i = 1; i <= n; i++) degree[i] = 0;
let ok = true, reason = '';
for (const line of lines) {
  const m = line.match(/^(\d+)-(\d+)$/);
  if (!m) { ok = false; reason = 'bad format: ' + line; break; }
  const i = Number(m[1]), j = Number(m[2]);
  if (!(i < j)) { ok = false; reason = 'not i<j: ' + line; break; }
  if (i < 1 || j > n) { ok = false; reason = 'out of range: ' + line; break; }
  const key = i + '-' + j;
  if (seen.has(key)) { ok = false; reason = 'duplicate: ' + key; break; }
  seen.add(key);
  degree[i]++; degree[j]++;
}
if (ok && lines.length !== n * requiredDegree / 2) { ok = false; reason = 'wrong count ' + lines.length + ' expected ' + (n * requiredDegree / 2); }
if (ok) {
  for (let v = 1; v <= n; v++) {
    if (degree[v] !== requiredDegree) { ok = false; reason = 'troupe ' + v + ' has degree ' + degree[v] + ' expected ' + requiredDegree; break; }
  }
}
console.log(ok ? 'PASS: valid 4-regular festival on 7 troupes' : 'FAIL: ' + reason);
console.log('degrees:', degree);
"
```

Run this against the submission's actual Part C list — do not assume the
circulant example is the only valid answer; **any** simple graph on 7
vertices where every vertex has degree exactly 4 passes (this forces
exactly 14 edges, since 7x4/2=14, so the edge count is not an
independent constraint).

Example correct construction (troupes in a circle, each coproducing with
its two nearest neighbors on each side): `1-2, 1-3, 1-6, 1-7, 2-3, 2-4,
2-7, 3-4, 3-5, 4-5, 4-6, 5-6, 5-7, 6-7` — this construction was run
through the script above and printed `PASS` with all 7 troupes at degree
4.

Before trusting the result on a real submission, also run the script
against two deliberately broken lists to confirm it correctly rejects
them: (1) a list with one pair duplicated (e.g. repeat `1-2` in place of
one other edge) must print `FAIL: duplicate: 1-2`; (2) a list with one
edge simply removed (13 edges instead of 14) must print `FAIL: wrong
count 13 expected 14`.

- **obj-1**: 21 must appear as the stated answer for Part A, with C(7,2)
  or 7x6/2 shown as the derivation.
  - PASS: "C(7,2) = 7 x 6 / 2 = 21"; "the maximum is 21 coproductions";
    "there are 7·6/2 = 21 possible pairs, so 21".
  - FAIL: "the maximum is 42" (forgot to halve); "there are 21 pairs"
    stated with no derivation shown; "at most 7 coproductions".
- **obj-2**: all three elements — the odd sum 21, the "each
  coproduction contributes 2" fact, and an explicit impossibility
  conclusion — must be present as text; a submission that states only
  the conclusion without the parity mechanism fails this check.
  - PASS: "the counts would sum to 7×3 = 21, but every coproduction adds
    2 to that total so the sum is even; 21 is odd, contradiction, so it
    is impossible"; "summing degrees gives 21 (odd), yet twice the
    number of coproductions is even — impossible"; "each pairing is
    counted in two troupes' tallies, making the total even, but 7·3=21
    is odd, so no such festival exists".
  - FAIL: "I tried and could not build such a festival, so it's
    impossible" (no parity mechanism); "21 is odd so it can't happen"
    (asserts oddness but never says the sum must be even / why); "each
    troupe having 3 is too many, so it fails" (wrong mechanism).
- **obj-3**: run the property-check script above; it must print `PASS`.
  Any valid 4-regular graph on 7 vertices is acceptable, not just the
  circulant example.
- **obj-4**: the count of possible values (6, for range 1..6) and the
  pigeonhole conclusion (two troupes share a count) must both be
  present.
  - PASS: "each count is in {1,…,6}, only 6 values for 7 troupes, so by
    pigeonhole two coincide"; "with 7 troupes and 6 possible tallies
    (1 through 6), two must match"; "the 7 counts are drawn from a
    6-element set, forcing a repeat".
  - FAIL: "counts range 0..6, seven values, so two repeat" (wrong range:
    0 is excluded because every troupe coproduces at least once); "two
    troupes might share a count" (no pigeonhole, only a possibility);
    "each troupe has a different count" (concludes the opposite).
- **obj-5**: run `wc -w PROOF.md` on the whole file.

### Subjective guidance

- **Proof rigor**: are Parts B and D airtight — correct hypotheses
  stated, no logical gaps, and the right direction of argument
  (impossibility for B, existence-of-a-repeat for D, not the reverse)?
  Penalize hand-waved parity claims that don't explain why the sum must
  be even.
- **Mathematical exposition**: precise language and clean structure
  across all four parts; penalize any conflation of "I could not find a
  festival" with "no festival exists" (Part C requires an actual exhibit,
  not a non-existence claim, and Part B/D require proofs, not
  assertions).
- **Reasoning quality**: does REASONING.md reflect on why the parity
  argument settles Part B and how the exhibited festival was verified,
  rather than asserting the results?
