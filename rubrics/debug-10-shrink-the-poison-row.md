---
test: debug-10-shrink-the-poison-row
canary: "cavern fjord"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs the EMBEDDED buggy summarize (carried verbatim below) on the submitted minimal.csv and confirms it still throws the NaN error -- the minimization genuinely reproduces the bug"
    - id: obj-2
      check: "minimal.csv contains exactly two lines (header + one data row, mechanically checked by line count), and that row is the author's ground-truth poison row: `17,\"Smith, Co\",151`"
    - id: obj-3
      check: "node fixed.js run against the full embedded 40-row CSV parses without throwing and returns the reference total of 6460"
    - id: obj-4
      check: "Judge confirms fixed.js correctly handles a quoted field containing a comma: summarize('id,name,amount\\n9,\"Smith, Co\",200\\n') returns exactly 200, not NaN and not a shifted value"
    - id: obj-5
      check: "MINIMIZE.md names the root cause (splitting on comma ignores quoted fields, so an embedded comma shifts columns) and explains why the chosen row is the minimal reproducer, distinguishing it from the other quoted-but-safe rows; fixed.js at most 90 lines, no dependencies"
  subjective:
    - id: sub-quality
      name: "Minimization precision"
      weight: 0.4
    - id: sub-craft
      name: "Parser robustness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "cavern fjord" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Embedded buggy summarizer (carried here verbatim so the judge can
  run it directly against minimal.csv):
  ```js
  function summarize(csvText) {
    const lines = csvText.trim().split('\n');
    let total = 0;
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      const amount = Number(cols[2]);
      if (Number.isNaN(amount)) {
        throw new Error('NaN amount on line ' + (i + 1) + ': ' + lines[i]);
      }
      total += amount;
    }
    return total;
  }
  ```
- Ground truth, verified under node: the export's row 17,
  `17,"Smith, Co",151`, naive-splits on comma into
  `['17', '"Smith', ' Co"', '151']`; `cols[2]` reads `' Co"'` ->
  `Number` -> `NaN` -> throws. This is the unique poison row. The
  three decoy rows (`9,"OBrien 9",127`; `24,"OBrien 24",172`;
  `33,"OBrien 33",199`) use quotes but contain NO literal comma inside
  them, so the naive split is unaffected and they parse fine --
  confirmed by execution. A submission whose minimal.csv keeps a
  decoy row instead of row 17, or that keeps more than one data row,
  fails obj-2 even if it happens to still crash for an unrelated
  reason (verify the crash is specifically the row-17 shift, not
  something else introduced by the submission).
- Reference total over the full 40-row export under a correct
  quoted-CSV parse: **6460** (sum of `100 + 3*i` for i in 1..40).
  Recompute directly if in doubt: `sum_{i=1}^{40}(100+3i) = 40*100 +
  3*(40*41/2) = 4000 + 2460 = 6460`.
- Judge-script sketch:
  ```
  node -e "
  const {summarize} = require('./fixed.js');
  console.log(summarize(require('fs').readFileSync('data40.csv','utf8')));
  console.log(summarize('id,name,amount\n9,\"Smith, Co\",200\n'));
  "
  ```
  Expected: `6460` then `200`. (The judge reconstructs `data40.csv`
  from the 40-row block embedded in the test file.)
- obj-5 root-cause naming -- example phrasings for comparison:
  - PASS phrasings (2-3 examples): "the parser splits every line on
    `,` with no awareness of quotes, so the embedded comma in
    `\"Smith, Co\"` produces an extra field and shifts the amount
    column"; "row 17 is the only row where a literal comma sits
    inside a quoted field -- the other quoted rows (OBrien) have no
    internal comma, so they don't shift anything"; "naive
    `split(',')` treats quotes as plain characters, so any comma
    inside quotes still counts as a field separator".
  - FAIL phrasings (2-3 examples): "any row with quotes is
    suspicious" (fails to distinguish poison from decoy); "the parser
    crashes because of bad data" (no mechanism named); "row 9 is the
    culprit" or naming any decoy row instead of row 17.
- Minimization precision: reward a minimal.csv that is exactly header
  + the true poison row, with a MINIMIZE.md that explicitly rules out
  the decoy rows by checking they contain no internal comma. Penalize
  (but do not zero) a minimal.csv that reproduces via a *different*
  single row than row 17 only if such a row would also independently
  and correctly reproduce the crash under the embedded buggy parser --
  in practice, row 17 is the only such row, so any other single-row
  file either fails obj-1 (doesn't crash) or is factually wrong about
  which row is poison.
- Parser robustness: reward a real quoted-field-aware parser (state
  machine or equivalent) over ad-hoc string replacement that happens
  to work only on this file's specific quoting style.
- Reasoning quality: does MINIMIZE.md show the actual shifted-column
  mechanism (naming what naive split produces for the poison row), or
  just assert "the CSV parsing is broken"?
