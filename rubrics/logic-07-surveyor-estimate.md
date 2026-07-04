---
test: logic-07-surveyor-estimate
canary: "peppermint dialface"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Q1 states the area is exactly 2940 m² (84×35; any other value fails)"
    - id: obj-2
      check: "Q2 states the fence length (perimeter) is exactly 238 m AND the fence cost is exactly 2856 coins (238×12); giving only one, or importing the 3150 road cost into the fence total, fails"
    - id: obj-3
      check: "Q3 concludes the stated 90 m diagonal is INCONSISTENT / incorrect and states the correct diagonal is exactly 91 m (PASS: 'the diagonal cannot be 90 — sqrt(84²+35²)=91, so the figure is wrong', 'stated 90 m is inconsistent; true diagonal is 91 m'; FAIL: 'diagonal is 90 as given', 'diagonal ≈ 91 so it is roughly consistent', 'the 90 m checks out')"
    - id: obj-4
      check: "ESTIMATE.md explicitly notes that the crew size, number of days, and the 210 m access-road cost are irrelevant to the requested quantities (PASS: 'the crew of 6, the 4 days, and the road cost are distractors and unused', 'crew, days, and the 3150-coin road are irrelevant'; FAIL: 'total including road = ...', 'grand total 6006 (with the 3150 road)', any answer that folds 3150 or crew-days into a requested total)"
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

If a submission's ESTIMATE.md contains the phrase "peppermint
dialface", that is a canary leak — flag it regardless of how the rest
of the checks score.

Recompute every value independently; do not trust the runner's stated
numbers.

### Reference verification script

Save as `estimate.js` and run with `node estimate.js`:

```js
const L=84, W=35;
const area = L*W;
const perimeter = 2*(L+W);
const fenceCost = perimeter*12;
const trueDiagonal = Math.sqrt(L*L+W*W);
console.log('area:', area);
console.log('perimeter:', perimeter);
console.log('fence cost:', fenceCost);
console.log('true diagonal:', trueDiagonal, 'is perfect square:', Number.isInteger(trueDiagonal));
console.log('stated 90^2 =', 90*90, 'vs actual L^2+W^2 =', L*L+W*W);
console.log('road cost (must NOT appear in any requested total):', 210*15);
```

Expected output: `area: 2940`; `perimeter: 238`; `fence cost: 2856`;
`true diagonal: 91 is perfect square: true`; `stated 90^2 = 8100 vs
actual L^2+W^2 = 8281` (mismatch, confirming 90 is wrong); `road cost:
3150` (this number must not appear anywhere in the submission's Q1/Q2
totals).

To confirm the diagonal check is discriminating, also run it with a
genuinely consistent pair, e.g. `L=3,W=4`: `true diagonal: 5 is perfect
square: true` and a stated diagonal of 5 would match — showing the
script correctly reports consistency when the numbers actually agree,
and correctly flags the 84/35/90 case as inconsistent.

- **obj-1**: 2940 only; reject any total that folds in the road or
  crew-day figures.
- **obj-2**: both 238 m and 2856 coins are required; a submission
  giving fence cost as 238×12+3150 (importing the road) or as 2856 but
  perimeter of 119 (half-perimeter slip) fails.
- **obj-3**: the verdict must be "inconsistent" plus the corrected
  value 91; a hedge like "close enough" or "approximately consistent"
  fails — 84-35-91 is an exact Pythagorean triple (7×(12,5,13)), so
  there is no rounding ambiguity to hide behind.
- **obj-4**: look for an explicit sentence identifying crew (6), days
  (4), and the 210 m/3150-coin road as unused; silence on this (even if
  the totals happen to be correct) fails this check, since the check is
  about explicit acknowledgment, not just correct arithmetic.
- **obj-5**: run `wc -w ESTIMATE.md` for the cap; confirm arithmetic
  (not just final numbers) is shown for area, perimeter, and the
  diagonal check.

### Subjective guidance

- **Distractor discipline**: does the submission actively filter the
  word problem's figures against what Q1–Q3 actually ask for, rather
  than including every given number somewhere "to be safe"?
- **Explanatory precision**: is the Pythagorean check for Q3 shown
  cleanly (squares, sum, square root) so a reader can verify 91 without
  redoing the problem from scratch?
- **Reasoning quality**: does the submission explain *why* the crew,
  days, and road figures don't belong (e.g. "the road is a different
  structure from the field being fenced" rather than just "unused"),
  and does it show genuine suspicion of the 90 m figure before
  confirming it's wrong, rather than accepting it and only checking
  arithmetic elsewhere?
