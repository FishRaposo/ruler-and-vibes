---
test: logic-09b-lighthouse-flask-duel
canary: "bettong pademelon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the first keeper WINS from 27 and gives a valid winning first move — taking 2 (leaving 25) OR taking 3 (leaving 24); taking 4 (leaving 23) is NOT a valid winning move (PASS: 'first keeper wins, take 2 leaving 25', 'first keeper wins by taking 3'; FAIL: 'first keeper loses', 'take 4 to leave 23')"
    - id: obj-2
      check: "Q2 states that from 25 the SECOND keeper wins / the first keeper loses (25 mod 6 = 1, a losing position; PASS: 'second keeper wins', 'first keeper has no forced win'; FAIL: 'first keeper wins', 'the mover from 25 can force a win')"
    - id: obj-3
      check: "Q3 states that from 97 the SECOND keeper wins / the first keeper loses (97 mod 6 = 1; the trap value — PASS: 'second keeper wins', 'first keeper loses'; FAIL: 'first keeper wins', '97 is a winning position for the first keeper')"
    - id: obj-4
      check: "Q4 states there are exactly 15 losing starting shelf sizes in 1..44 (the N with N mod 6 ∈ {0,1}: 1,6,7,12,13,18,19,24,25,30,31,36,37,42,43; any other count fails)"
    - id: obj-5
      check: "WATCH.md identifies the losing-position pattern (N mod 6 ∈ {0,1}, or an equivalent explicit list of the 15 values) and the whole file is at most 450 words (`wc -w`)"
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
---

## Judge guidance

Parallel form of `logic-09-relay-wager` (same construct, fresh surface).

If the phrase "bettong pademelon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently via backward induction; do not trust
the runner's stated verdicts.

### Reference DP verification script

Save as `flask.js` and run with `node flask.js`:

```js
const MAXN = 100;
const moves = [2,3,4];
const win = new Array(MAXN+1).fill(false);
for (let n=1;n<=MAXN;n++){
  let w = false;
  for (const m of moves) if (n-m>=0 && !win[n-m]) { w = true; break; }
  win[n]=w;
}
function status(n){ return win[n] ? 'WIN (first keeper)' : 'LOSE (first keeper) / second keeper wins'; }
console.log('N=27:', status(27));
for (const m of moves) if (27-m>=0)
  console.log('  take',m,'-> leaves',27-m, win[27-m] ? 'opponent still WINS (bad move)' : 'opponent LOSES (GOOD move)');
console.log('N=25:', status(25));
console.log('N=97:', status(97));

let mismatch = 0;
for (let n=0;n<=MAXN;n++){
  const predictedLose = (n%6===0 || n%6===1);
  if (predictedLose !== !win[n]) mismatch++;
}
console.log('mismatches vs (N mod 6 in {0,1}) pattern:', mismatch);

let losers = [];
for (let n=1;n<=44;n++) if (!win[n]) losers.push(n);
console.log('losing N in 1..44:', losers.length, losers);
```

Expected output: `N=27: WIN`, with `take 2 -> ... GOOD move` and `take 3
-> ... GOOD move` but `take 4 -> ... opponent still WINS (bad move)`;
`N=25: LOSE`; `N=97: LOSE`; `mismatches: 0` (confirming the N mod 6 ∈
{0,1} pattern holds exactly for all N up to 100); `losing N in 1..44: 15
[1, 6, 7, 12, 13, 18, 19, 24, 25, 30, 31, 36, 37, 42, 43]`.

To confirm the DP is discriminating, also run it with the move set
changed to `{1,2,3}` (a different, well-known subtraction game) — the
losing positions become simple multiples of 4, a visibly different
pattern, showing the period-6 result is specific to the `{2,3,4}` rule
and not a DP bug.

- **obj-1**: "first keeper wins" plus a move of 2 or 3 (leaving 25 or 24,
  both losing positions) are required; a move of 4 (leaving 23, which is
  a winning position for the opponent) must be rejected as invalid even
  if the win/lose verdict for 27 itself is correct.
- **obj-2**: "second keeper wins" / "first keeper loses" required for 25;
  the opposite verdict fails outright.
- **obj-3**: same as obj-2 but for 97 — this is the deliberate trap value
  chosen so a naive "only multiples of the period lose" shortcut is
  likely to get it wrong (97 is not a multiple of 6); verify
  independently rather than assuming consistency with a partial pattern.
- **obj-4**: exactly 15, with the specific set {1,6,7,12,13,18,19,24,25,
  30,31,36,37,42,43}; a count arrived at from an incomplete or
  incorrectly-generalized pattern (e.g. only counting multiples of 6)
  fails even if it happens to land near 15.
- **obj-5**: the pattern (mod 6 ∈ {0,1}) or the explicit 15-value list
  must appear; run `wc -w WATCH.md` for the cap.

### Subjective guidance

- **Strategic correctness**: is the backward-induction logic actually
  applied (a position is winning iff some move reaches a losing
  position) rather than pattern-matched from a smaller, unrelated game,
  and does the submission correctly identify all non-losing moves from 27
  as valid alternatives rather than presenting only one?
- **Position-analysis exposition**: is the losing-position table or
  pattern derivation shown clearly enough (e.g. a short table of win/lose
  for N=0..11 building up to the period-6 claim) that a reader could
  verify a few entries by hand?
- **Reasoning quality**: does the submission show explicit skepticism
  toward a naive modular shortcut (e.g. checking the pattern against
  several small N before trusting it for N=97) rather than assuming the
  first pattern noticed in small cases, which is the seeded trap for
  this test?
