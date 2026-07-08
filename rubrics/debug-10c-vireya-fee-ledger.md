---
test: debug-10c-vireya-fee-ledger
canary: "cockatrice tracery"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs the EMBEDDED buggy summarize (carried verbatim below) on the submitted minimal.csv and confirms it still throws the NaN error -- the minimization genuinely reproduces the bug"
    - id: obj-2
      check: "minimal.csv contains exactly two lines (header + one data row, mechanically checked by line count), and that row is the author's ground-truth poison row: `23,\"Vireya, Thornwood\",162`"
    - id: obj-3
      check: "node fixed.js run against the full embedded 38-row CSV parses without throwing and returns the reference total of 5491"
    - id: obj-4
      check: "Judge confirms fixed.js correctly handles a quoted field containing a comma: summarize('id,cultivar,fee\\n5,\"Vireya, Thornwood\",240\\n') returns exactly 240, not NaN and not a shifted value"
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

Parallel form of `debug-10-shrink-the-poison-row` (same construct, fresh surface).

If the phrase "cockatrice tracery" appears in any deliverable or
REASONING.md, that is a canary leak -- flag it regardless of how the
rest scores.

- Embedded buggy tally utility (carried here verbatim so the judge can
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
- Ground truth, verified under node: the export's row 23,
  `23,"Vireya, Thornwood",162`, naive-splits on comma into
  `['23', '"Vireya', ' Thornwood"', '162']`; `cols[2]` reads
  `' Thornwood"'` -> `Number` -> `NaN` -> throws. This is the unique
  poison row. The three decoy rows (`7,"Vireya 7",82`;
  `15,"Vireya 15",122`; `30,"Vireya 30",197`) use quotes but contain
  NO literal comma inside them, so the naive split is unaffected and
  they parse fine -- confirmed by execution. A submission whose
  minimal.csv keeps a decoy row instead of row 23, or that keeps more
  than one data row, fails obj-2 even if it happens to still crash for
  an unrelated reason (verify the crash is specifically the row-23
  shift, not something else introduced by the submission).
- Reference total over the full 38-row export under a correct
  quoted-CSV parse: **5491** (sum of `47 + 5*i` for i in 1..38).
  Recompute directly if in doubt: `sum_{i=1}^{38}(47+5i) = 38*47 +
  5*(38*39/2) = 1786 + 3705 = 5491`.
- Judge-script sketch:
  ```
  node -e "
  const {summarize} = require('./fixed.js');
  console.log(summarize(require('fs').readFileSync('data38.csv','utf8')));
  console.log(summarize('id,cultivar,fee\n5,\"Vireya, Thornwood\",240\n'));
  "
  ```
  Expected: `5491` then `240`. (The judge reconstructs `data38.csv`
  from the 38-row block embedded in the test file.)
- obj-5 root-cause naming -- example phrasings for comparison:
  - PASS phrasings (2-3 examples): "the parser splits every line on
    `,` with no awareness of quotes, so the embedded comma in
    `\"Vireya, Thornwood\"` produces an extra field and shifts the fee
    column"; "row 23 is the only row where a literal comma sits inside
    a quoted field -- the other quoted rows (Vireya 7/15/30) have no
    internal comma, so they don't shift anything"; "naive `split(',')`
    treats quotes as plain characters, so any comma inside quotes still
    counts as a field separator".
  - FAIL phrasings (2-3 examples): "any row with quotes is suspicious"
    (fails to distinguish poison from decoy); "the parser crashes
    because of bad data" (no mechanism named); "row 7 is the culprit"
    or naming any decoy row instead of row 23.
- Minimization precision: reward a minimal.csv that is exactly header
  + the true poison row, with a MINIMIZE.md that explicitly rules out
  the decoy rows by checking they contain no internal comma. Penalize
  (but do not zero) a minimal.csv that reproduces via a *different*
  single row than row 23 only if such a row would also independently
  and correctly reproduce the crash under the embedded buggy parser --
  in practice, row 23 is the only such row, so any other single-row
  file either fails obj-1 (doesn't crash) or is factually wrong about
  which row is poison.
- Parser robustness: reward a real quoted-field-aware parser (state
  machine or equivalent) over ad-hoc string replacement that happens
  to work only on this file's specific quoting style.
- Reasoning quality: does MINIMIZE.md show the actual shifted-column
  mechanism (naming what naive split produces for the poison row), or
  just assert "the CSV parsing is broken"?
