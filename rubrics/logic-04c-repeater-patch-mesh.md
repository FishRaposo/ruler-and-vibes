---
test: logic-04c-repeater-patch-mesh
canary: "lechwe topi"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Part A states exactly 55 (= C(11,2))"
    - id: obj-2
      check: "Part B contains all three required elements as text the judge locates: the sum 11 x 7 = 77 (or an equivalent statement that the sum of all stations' patch counts would be 77), the fact that each patch contributes 2 to that sum (so the sum must be even), and an explicit conclusion of impossibility"
    - id: obj-3
      check: "Part C's patch list passes the rubric's node property-check script: every line parses as 'i-j' with 1 <= i < j <= 11, exactly 33 distinct pairs, no self-patches, and every station appears in exactly 6 patches"
    - id: obj-4
      check: "Part D states that per-station counts lie in {1,...,10} (10 possible values for 11 stations) and applies pigeonhole to conclude two stations share a count"
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
anchors:
  - id: Proof rigor
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Mathematical exposition
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `logic-04-ninefold-league` (same construct, fresh
surface).

If the phrase "lechwe topi" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Part C property-check script

Save the submission's Part C patch lines (one `i-j` per line, exactly
as they appear in PROOF.md) as `schedule.txt`, then run:

```
node -e "
const fs = require('fs');
const lines = fs.readFileSync('schedule.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const n = 11, requiredDegree = 6;
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
    if (degree[v] !== requiredDegree) { ok = false; reason = 'station ' + v + ' has degree ' + degree[v] + ' expected ' + requiredDegree; break; }
  }
}
console.log(ok ? 'PASS: valid 6-regular patch mesh on 11 stations' : 'FAIL: ' + reason);
console.log('degrees:', degree);
"
```

Run this against the submission's actual Part C list — do not assume
the circulant example is the only valid answer; **any** simple graph on
11 vertices where every vertex has degree exactly 6 passes (this forces
exactly 33 edges, since 11x6/2=33, so the edge count is not an
independent constraint).

Example correct construction (stations in a circle, each patching its
three nearest neighbors on each side): `1-2, 1-3, 1-4, 1-9, 1-10, 1-11,
2-3, 2-4, 2-5, 2-10, 2-11, 3-4, 3-5, 3-6, 3-11, 4-5, 4-6, 4-7, 5-6, 5-7,
5-8, 6-7, 6-8, 6-9, 7-8, 7-9, 7-10, 8-9, 8-10, 8-11, 9-10, 9-11, 10-11`
— this construction was run through the script above and printed `PASS`
with all 11 stations at degree 6.

Before trusting the result on a real submission, also run the script
against two deliberately broken lists to confirm it correctly rejects
them: (1) a list with one pair duplicated (e.g. repeat `1-2` in place
of one other edge) must print `FAIL: duplicate: 1-2`; (2) a list with
one edge simply removed (32 edges instead of 33) must print `FAIL:
wrong count 32 expected 33`.

- **obj-1**: 55 must appear as the stated answer for Part A, with
  C(11,2) or 11x10/2 shown as the derivation.
  - PASS: "C(11,2) = 11 x 10 / 2 = 55"; "the maximum is 55 patches";
    "there are 11·10/2 = 55 possible pairs, so 55".
  - FAIL: "the maximum is 110" (forgot to halve); "there are 55 pairs"
    stated with no derivation shown; "at most 11 patches".
- **obj-2**: all three elements — the odd sum 77, the "each patch
  contributes 2" fact, and an explicit impossibility conclusion — must
  be present as text; a submission that states only the conclusion
  without the parity mechanism fails this check.
  - PASS: "the counts would sum to 11×7 = 77, but every patch adds 2 to
    that total so the sum is even; 77 is odd, contradiction, so it is
    impossible"; "summing degrees gives 77 (odd), yet twice the number
    of patches is even — impossible"; "each patch is counted in two
    stations' tallies, making the total even, but 11·7=77 is odd, so no
    such season exists".
  - FAIL: "I tried and could not build such a season, so it's
    impossible" (no parity mechanism); "77 is odd so it can't happen"
    (asserts oddness but never says the sum must be even / why); "each
    station having 7 is too many, so it fails" (wrong mechanism).
- **obj-3**: run the property-check script above; it must print `PASS`.
  Any valid 6-regular graph on 11 vertices is acceptable, not just the
  circulant example.
- **obj-4**: the count of possible values (10, for range 1..10) and the
  pigeonhole conclusion (two stations share a count) must both be
  present.
  - PASS: "each count is in {1,…,10}, only 10 values for 11 stations, so
    by pigeonhole two coincide"; "with 11 stations and 10 possible
    tallies (1 through 10), two must match"; "the 11 counts are drawn
    from a 10-element set, forcing a repeat".
  - FAIL: "counts range 0..10, eleven values, so two repeat" (wrong
    range: 0 is excluded because every station carries at least one
    patch); "two stations might share a count" (no pigeonhole, only a
    possibility); "each station has a different count" (concludes the
    opposite).
- **obj-5**: run `wc -w PROOF.md` on the whole file.

### Subjective guidance

- **Proof rigor**: are Parts B and D airtight — correct hypotheses
  stated, no logical gaps, and the right direction of argument
  (impossibility for B, existence-of-a-repeat for D, not the reverse)?
  Penalize hand-waved parity claims that don't explain why the sum must
  be even.
- **Mathematical exposition**: precise language and clean structure
  across all four parts; penalize any conflation of "I could not find a
  patch list" with "no patch list exists" (Part C requires an actual
  exhibit, not a non-existence claim, and Part B/D require proofs, not
  assertions).
- **Reasoning quality**: does REASONING.md reflect on why the parity
  argument settles Part B and how the exhibited patch list was
  verified, rather than asserting the results?
