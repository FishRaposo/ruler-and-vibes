---
test: logic-09-relay-wager
canary: "saltbox obelisk"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the first player WINS from 17 and gives a valid winning first move — removing 3 (leaving 14) OR removing 1 (leaving 16); removing 4 (leaving 13) is NOT a valid winning move (PASS: 'first player wins, remove 3 leaving 14', 'first player wins by removing 1'; FAIL: 'first player loses', 'remove 4 to leave 13')"
    - id: obj-2
      check: "Q2 states that from 23 the SECOND player wins / the first player loses (23 mod 7 = 2, a losing position; PASS: 'second player wins', 'first player has no forced win'; FAIL: 'first player wins', 'the mover from 23 can force a win')"
    - id: obj-3
      check: "Q3 states that from 100 the SECOND player wins / the first player loses (100 mod 7 = 2; the trap value — PASS: 'second player wins', 'first player loses'; FAIL: 'first player wins', '100 is a winning position for the first player')"
    - id: obj-4
      check: "Q4 states there are exactly 14 losing starting piles in 1..49 (the N with N mod 7 ∈ {0,2}: 2,7,9,14,16,21,23,28,30,35,37,42,44,49; any other count fails)"
    - id: obj-5
      check: "WAGER.md identifies the losing-position pattern (N mod 7 ∈ {0,2}, or an equivalent explicit list of the 14 values) and the whole file is at most 450 words (`wc -w`)"
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

If the phrase "saltbox obelisk" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently via backward induction; do not
trust the runner's stated verdicts.

### Reference DP verification script

Save as `wager.js` and run with `node wager.js`:

```js
const MAXN = 100;
const moves = [1,3,4];
const win = new Array(MAXN+1).fill(false);
for (let n=1;n<=MAXN;n++){
  let w = false;
  for (const m of moves) if (n-m>=0 && !win[n-m]) { w = true; break; }
  win[n]=w;
}
function status(n){ return win[n] ? 'WIN (first player)' : 'LOSE (first player) / second player wins'; }
console.log('N=17:', status(17));
for (const m of moves) if (17-m>=0)
  console.log('  remove',m,'-> leaves',17-m, win[17-m] ? 'opponent still WINS (bad move)' : 'opponent LOSES (GOOD move)');
console.log('N=23:', status(23));
console.log('N=100:', status(100));

let mismatch = 0;
for (let n=0;n<=MAXN;n++){
  const predictedLose = (n%7===0 || n%7===2);
  if (predictedLose !== !win[n]) mismatch++;
}
console.log('mismatches vs (N mod 7 in {0,2}) pattern:', mismatch);

let losers = [];
for (let n=1;n<=49;n++) if (!win[n]) losers.push(n);
console.log('losing N in 1..49:', losers.length, losers);
```

Expected output: `N=17: WIN`, with `remove 1 -> ... GOOD move` and
`remove 3 -> ... GOOD move` but `remove 4 -> ... opponent still WINS
(bad move)`; `N=23: LOSE`; `N=100: LOSE`; `mismatches: 0` (confirming
the N mod 7 ∈ {0,2} pattern holds exactly for all N up to 100); `losing
N in 1..49: 14 [2, 7, 9, 14, 16, 21, 23, 28, 30, 35, 37, 42, 44, 49]`.

To confirm the DP is discriminating, also run it with the move set
changed to `{1,2,3}` (a different, well-known subtraction game) — the
losing positions become simple multiples of 4, a visibly different
pattern, showing the period-7 result is specific to the `{1,3,4}` rule
and not a DP bug.

- **obj-1**: "first player wins" plus a move of 1 or 3 (leaving 16 or
  14, both losing positions) are required; a move of 4 (leaving 13,
  which is a winning position for the opponent) must be rejected as
  invalid even if the win/lose verdict for 17 itself is correct.
- **obj-2**: "second player wins" / "first player loses" required for
  23; the opposite verdict fails outright.
- **obj-3**: same as obj-2 but for 100 — this is the deliberate trap
  value chosen so a naive small-case extrapolation is likely to get it
  wrong; verify independently rather than assuming consistency with Q2.
- **obj-4**: exactly 14, with the specific set {2,7,9,14,16,21,23,28,
  30,35,37,42,44,49}; a count arrived at from an incomplete or
  incorrectly-generalized pattern (e.g. only counting multiples of 7)
  fails even if it happens to land near 14.
- **obj-5**: the pattern (mod 7 ∈ {0,2}) or the explicit 14-value list
  must appear; run `wc -w WAGER.md` for the cap.

### Subjective guidance

- **Strategic correctness**: is the backward-induction logic actually
  applied (a position is winning iff some move reaches a losing
  position) rather than pattern-matched from a smaller, unrelated game,
  and does the submission correctly identify all non-losing moves from
  17 as valid alternatives rather than presenting only one?
- **Position-analysis exposition**: is the losing-position table or
  pattern derivation shown clearly enough (e.g. a short table of
  win/lose for N=0..10 building up to the period-7 claim) that a reader
  could verify a few entries by hand?
- **Reasoning quality**: does the submission show explicit skepticism
  toward a naive modular shortcut (e.g. checking the pattern against
  several small N before trusting it for N=100) rather than assuming
  the first pattern noticed in small cases, which is the seeded trap
  for this test?
