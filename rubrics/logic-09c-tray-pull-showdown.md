---
test: logic-09c-tray-pull-showdown
canary: "ocelot kodkod"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the first baker WINS from 30 and gives a valid winning first move — removing 2 (leaving 28) OR removing 6 (leaving 24); removing 1 (leaving 29) is NOT a valid winning move (PASS: 'first baker wins, remove 2 leaving 28', 'first baker wins by removing 6'; FAIL: 'first baker loses', 'remove 1 to leave 29')"
    - id: obj-2
      check: "Q2 states that from 38 the SECOND baker wins / the first baker loses (38 mod 7 = 3, a losing position; PASS: 'second baker wins', 'first baker has no forced win'; FAIL: 'first baker wins', 'the mover from 38 can force a win')"
    - id: obj-3
      check: "Q3 states that from 115 the SECOND baker wins / the first baker loses (115 mod 7 = 3; the trap value — PASS: 'second baker wins', 'first baker loses'; FAIL: 'first baker wins', '115 is a winning position for the first baker')"
    - id: obj-4
      check: "Q4 states there are exactly 16 losing starting rack sizes in 1..56 (the N with N mod 7 ∈ {0,3}: 3,7,10,14,17,21,24,28,31,35,38,42,45,49,52,56; any other count fails)"
    - id: obj-5
      check: "BAKEOFF.md identifies the losing-position pattern (N mod 7 ∈ {0,3}, or an equivalent explicit list of the 16 values) and the whole file is at most 450 words (`wc -w`)"
  subjective:
    - id: sub-quality
      name: "Strategic correctness"
      weight: 0.4
    - id: sub-craft
      name: "Position-analysis exposition"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Strategic correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Position-analysis exposition
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `logic-09-relay-wager` (same construct, fresh surface).

If the phrase "ocelot kodkod" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently via backward induction; do not
trust the runner's stated verdicts.

### Reference DP verification script

Save as `bakeoff.js` and run with `node bakeoff.js`:

```js
const MAXN = 130;
const moves = [1,2,6];
const win = new Array(MAXN+1).fill(false);
for (let n=1;n<=MAXN;n++){
  let w = false;
  for (const m of moves) if (n-m>=0 && !win[n-m]) { w = true; break; }
  win[n]=w;
}
function status(n){ return win[n] ? 'WIN (first baker)' : 'LOSE (first baker) / second baker wins'; }
console.log('N=30:', status(30));
for (const m of moves) if (30-m>=0)
  console.log('  remove',m,'-> leaves',30-m, win[30-m] ? 'opponent still WINS (bad move)' : 'opponent LOSES (GOOD move)');
console.log('N=38:', status(38));
console.log('N=115:', status(115));

let mismatch = 0;
for (let n=0;n<=MAXN;n++){
  const predictedLose = (n%7===0 || n%7===3);
  if (predictedLose !== !win[n]) mismatch++;
}
console.log('mismatches vs (N mod 7 in {0,3}) pattern:', mismatch);

let losers = [];
for (let n=1;n<=56;n++) if (!win[n]) losers.push(n);
console.log('losing N in 1..56:', losers.length, losers);
```

Expected output: `N=30: WIN`, with `remove 2 -> ... GOOD move` and
`remove 6 -> ... GOOD move` but `remove 1 -> ... opponent still WINS
(bad move)`; `N=38: LOSE`; `N=115: LOSE`; `mismatches: 0` (confirming
the N mod 7 ∈ {0,3} pattern holds exactly for all N up to 130); `losing
N in 1..56: 16 [3, 7, 10, 14, 17, 21, 24, 28, 31, 35, 38, 42, 45, 49,
52, 56]`.

To confirm the DP is discriminating, also run it with the move set
changed to `{1,2,3,4,5,6}` (i.e. assume every amount up to the largest
is a legal move, not just 1, 2, and 6) — the losing positions collapse
to plain multiples of 7 (only 8 of them in 1..56), a visibly simpler
single-residue pattern, showing the two-residue period-7 result is
specific to the `{1,2,6}` rule and not a DP bug.

- **obj-1**: "first baker wins" plus a move of 2 or 6 (leaving 28 or
  24, both losing positions) are required; a move of 1 (leaving 29,
  which is a winning position for the opponent) must be rejected as
  invalid even if the win/lose verdict for 30 itself is correct.
- **obj-2**: "second baker wins" / "first baker loses" required for
  38; the opposite verdict fails outright.
- **obj-3**: same as obj-2 but for 115 — this is the deliberate trap
  value chosen so a naive "only multiples of the period lose" shortcut
  is likely to get it wrong (115 is not a multiple of 7); verify
  independently rather than assuming consistency with a partial
  pattern.
- **obj-4**: exactly 16, with the specific set {3,7,10,14,17,21,24,28,
  31,35,38,42,45,49,52,56}; a count arrived at from an incomplete or
  incorrectly-generalized pattern (e.g. only counting multiples of 7)
  fails even if it happens to land near 16.
- **obj-5**: the pattern (mod 7 ∈ {0,3}) or the explicit 16-value list
  must appear; run `wc -w BAKEOFF.md` for the cap.

### Subjective guidance

- **Strategic correctness**: is the backward-induction logic actually
  applied (a position is winning iff some move reaches a losing
  position) rather than pattern-matched from a smaller, unrelated
  game, and does the submission correctly identify all non-losing
  moves from 30 as valid alternatives rather than presenting only one?
- **Position-analysis exposition**: is the losing-position table or
  pattern derivation shown clearly enough (e.g. a short table of
  win/lose for N=0..10 building up to the period-7 claim) that a
  reader could verify a few entries by hand?
- **Reasoning quality**: does the submission show explicit skepticism
  toward a naive modular shortcut (e.g. checking the pattern against
  several small N before trusting it for N=115) rather than assuming
  the first pattern noticed in small cases, which is the seeded trap
  for this test?
