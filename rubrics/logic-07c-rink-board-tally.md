---
test: logic-07c-rink-board-tally
canary: "klipspringer steenbok"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the area is exactly 3000 m² (75×40; any other value fails)"
    - id: obj-2
      check: "Q2 states the dasher board length (perimeter) is exactly 230 m AND the board cost is exactly 4370 credits (230×19); giving only one, or importing the 2145 platform cost into the board total, fails"
    - id: obj-3
      check: "Q3 concludes the stated 86 m diagonal is INCONSISTENT / incorrect and states the correct diagonal is exactly 85 m (PASS: 'the diagonal cannot be 86 — sqrt(75²+40²)=85, so the record is wrong', 'stated 86 m is inconsistent; true diagonal is 85 m'; FAIL: 'diagonal is 86 as recorded', 'diagonal ≈ 85 so 86 is basically consistent', 'the 86 m figure checks out')"
    - id: obj-4
      check: "RINKPLAN.md explicitly notes that the crew size, number of days, and the 165 m viewing-platform cost are irrelevant to the requested quantities (PASS: 'the crew of 7, the 5 days, and the platform cost are distractors and unused', 'crew size, days on site, and the 165 m/2145-credit platform are irrelevant'; FAIL: 'total including platform = ...', 'grand total 6515 (with the 2145 platform)', any answer that folds 2145 or crew-days into a requested total)"
    - id: obj-5
      check: "The whole file is at most 350 words (`wc -w`) and shows the arithmetic behind area, perimeter, and diagonal"
  subjective:
    - id: sub-quality
      name: "Distractor discipline"
      weight: 0.4
    - id: sub-craft
      name: "Explanatory precision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `logic-07-surveyor-estimate` (same construct, fresh
surface).

If the phrase "klipspringer steenbok" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every value independently; do not trust the runner's stated
numbers.

### Reference verification script

Save as `rink.js` and run with `node rink.js`:

```js
const L=75, W=40;
const area = L*W;
const perimeter = 2*(L+W);
const boardCost = perimeter*19;
const trueDiagonal = Math.sqrt(L*L+W*W);
console.log('area:', area);
console.log('perimeter:', perimeter);
console.log('board cost:', boardCost);
console.log('true diagonal:', trueDiagonal, 'is perfect square:', Number.isInteger(trueDiagonal));
console.log('stated 86^2 =', 86*86, 'vs actual L^2+W^2 =', L*L+W*W);
console.log('platform cost (must NOT appear in any requested total):', 165*13);
```

Expected output: `area: 3000`; `perimeter: 230`; `board cost: 4370`;
`true diagonal: 85 is perfect square: true`; `stated 86^2 = 7396 vs
actual L^2+W^2 = 7225` (mismatch, confirming 86 is wrong); `platform
cost: 2145` (this number must not appear anywhere in the submission's
Q1/Q2 totals).

To confirm the diagonal check is discriminating, also run it with a
genuinely consistent pair, e.g. `L=6,W=8`: `true diagonal: 10 is
perfect square: true` and a stated diagonal of 10 would match —
showing the script correctly reports consistency when the numbers
actually agree, and correctly flags the 75/40/86 case as inconsistent.

- **obj-1**: 3000 only; reject any total that folds in the platform or
  crew-day figures.
- **obj-2**: both 230 m and 4370 credits are required; a submission
  giving board cost as 230×19+2145 (importing the platform) or as 4370
  but perimeter of 115 (half-perimeter slip) fails.
- **obj-3**: the verdict must be "inconsistent" plus the corrected
  value 85; a hedge like "close enough" or "approximately consistent"
  fails — 40-75-85 is an exact Pythagorean triple (5×(8,15,17)), so
  there is no rounding ambiguity to hide behind.
- **obj-4**: look for an explicit sentence identifying crew (7), days
  (5), and the 165 m/2145-credit viewing platform as unused; silence
  on this (even if the totals happen to be correct) fails this check,
  since the check is about explicit acknowledgment, not just correct
  arithmetic.
- **obj-5**: run `wc -w RINKPLAN.md` for the cap; confirm arithmetic
  (not just final numbers) is shown for area, perimeter, and the
  diagonal check.

### Subjective guidance

- **Distractor discipline**: does the submission actively filter the
  word problem's figures against what Q1–Q3 actually ask for, rather
  than including every given number somewhere "to be safe"?
- **Explanatory precision**: is the Pythagorean check for Q3 shown
  cleanly (squares, sum, square root) so a reader can verify 85
  without redoing the problem from scratch?
- **Reasoning quality**: does the submission explain *why* the crew,
  days, and platform figures don't belong (e.g. "the platform is a
  separate structure from the rink being boarded" rather than just
  "unused"), and does it show genuine suspicion of the 86 m figure
  before confirming it's wrong, rather than accepting it and only
  checking arithmetic elsewhere?
