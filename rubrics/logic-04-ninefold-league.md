---
test: logic-04-ninefold-league
canary: "porcelain tumbleweed sonata"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Part A states exactly 36 (= C(9,2))"
    - id: obj-2
      check: "Part B contains all three required elements as text the judge locates: the sum 9 x 5 = 45 (or an equivalent statement that the sum of all clubs' match counts would be 45), the fact that each match contributes 2 to that sum (so the sum must be even), and an explicit conclusion of impossibility"
    - id: obj-3
      check: "Part C's match list passes the rubric's node property-check script: every line parses as 'i-j' with 1 <= i < j <= 9, exactly 18 distinct pairs, no self-matches, and every club appears in exactly 4 matches"
    - id: obj-4
      check: "Part D states that per-club counts lie in {1,...,8} (8 possible values for 9 clubs) and applies pigeonhole to conclude two clubs share a count"
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

If the phrase "porcelain tumbleweed sonata" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Part C property-check script

Save the submission's Part C match lines (one `i-j` per line, exactly
as they appear in PROOF.md) as `schedule.txt`, then run:

```
node -e "
const fs = require('fs');
const lines = fs.readFileSync('schedule.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const n = 9, requiredDegree = 4;
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
    if (degree[v] !== requiredDegree) { ok = false; reason = 'club ' + v + ' has degree ' + degree[v] + ' expected ' + requiredDegree; break; }
  }
}
console.log(ok ? 'PASS: valid 4-regular schedule on 9 clubs' : 'FAIL: ' + reason);
console.log('degrees:', degree);
"
```

Run this against the submission's actual Part C list — do not assume
the circulant example is the only valid answer; **any** simple graph on
9 vertices where every vertex has degree exactly 4 passes (this forces
exactly 18 edges, since 9x4/2=18, so the edge count is not an
independent constraint).

Example correct construction (clubs in a circle, each playing its two
nearest neighbors each side): `1-2, 1-3, 1-8, 1-9, 2-3, 2-4, 2-9, 3-4,
3-5, 4-5, 4-6, 5-6, 5-7, 6-7, 6-8, 7-8, 7-9, 8-9` — this construction
was run through the script above and printed `PASS` with all 9 clubs
at degree 4.

Before trusting the result on a real submission, also run the script
against two deliberately broken lists to confirm it correctly rejects
them: (1) a list with one pair duplicated (e.g. repeat `1-2` in place
of one other edge) must print `FAIL: duplicate: 1-2`; (2) a list with
one edge simply removed (17 edges instead of 18) must print `FAIL:
wrong count 17 expected 18`.

- **obj-1**: 36 must appear as the stated answer for Part A, with C(9,2)
  or 9x8/2 shown as the derivation.
- **obj-2**: all three elements — the odd sum 45, the "each match
  contributes 2" fact, and an explicit impossibility conclusion — must
  be present as text; a submission that states only the conclusion
  without the parity mechanism fails this check.
- **obj-3**: run the property-check script above; it must print `PASS`.
  Any valid 4-regular graph on 9 vertices is acceptable, not just the
  circulant example.
- **obj-4**: the count of possible values (8, for range 1..8) and the
  pigeonhole conclusion (two clubs share a count) must both be present.
- **obj-5**: run `wc -w PROOF.md` on the whole file.

### Subjective guidance

- **Proof rigor**: are Parts B and D airtight — correct hypotheses
  stated, no logical gaps, and the right direction of argument
  (impossibility for B, existence-of-a-repeat for D, not the reverse)?
  Penalize hand-waved parity claims that don't explain why the sum must
  be even.
- **Mathematical exposition**: precise language and clean structure
  across all four parts; penalize any conflation of "I could not find a
  schedule" with "no schedule exists" (Part C requires an actual
  exhibit, not a non-existence claim, and Part B/D require proofs, not
  assertions).
- **Reasoning quality**: does REASONING.md reflect on why the parity
  argument settles Part B and how the exhibited schedule was verified,
  rather than asserting the results?
