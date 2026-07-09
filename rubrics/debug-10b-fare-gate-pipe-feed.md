---
test: debug-10b-fare-gate-pipe-feed
canary: "wyvern rosette"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs the EMBEDDED buggy summarize (carried verbatim below) on the submitted minimal.psv and confirms it still throws the NaN error -- the minimization genuinely reproduces the bug"
    - id: obj-2
      check: "minimal.psv contains exactly two lines (header + one data row, mechanically checked by line count), and that row is the author's ground-truth poison row: `22,\"Vantar | East\",359` (pipe-delimited, i.e. the line `22|\"Vantar | East\"|359`)"
    - id: obj-3
      check: "node fixed.js run against the full embedded 36-row feed parses without throwing and returns the reference total of 12042"
    - id: obj-4
      check: "Judge confirms fixed.js correctly handles a quoted field containing the delimiter: summarize('stop_id|station|fare\\n9|\"Vantar | East\"|200\\n') returns exactly 200, not NaN and not a shifted value"
    - id: obj-5
      check: "MINIMIZE.md names the root cause (splitting on the pipe ignores quoted fields, so an embedded '|' shifts columns) and explains why the chosen row is the minimal reproducer, distinguishing it from the other quoted-but-safe rows; fixed.js at most 90 lines, no dependencies"
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
anchors:
  - id: Minimization precision
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Parser robustness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `debug-10-shrink-the-poison-row` (same construct, fresh surface).

If the phrase "wyvern rosette" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Embedded buggy summarizer (carried here verbatim so the judge can
  run it directly against minimal.psv):
  ```js
  function summarize(feedText) {
    const lines = feedText.trim().split('\n');
    let total = 0;
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split('|');
      const amount = Number(cols[2]);
      if (Number.isNaN(amount)) {
        throw new Error('NaN fare on line ' + (i + 1) + ': ' + lines[i]);
      }
      total += amount;
    }
    return total;
  }
  ```
- Ground truth, verified under node: the export's row 22,
  `22|"Vantar | East"|359`, naive-splits on the pipe into
  `['22', '"Vantar ', ' East"', '359']`; `cols[2]` reads `' East"'` ->
  `Number` -> `NaN` -> throws. This is the unique poison row. The
  three decoy rows (`7|"Espen Cross"|254`; `19|"Ashen Halt"|338`;
  `31|"Quillon Bay"|422`) use quotes but contain NO literal pipe inside
  them, so the naive split is unaffected and they parse fine --
  confirmed by execution. A submission whose minimal.psv keeps a
  decoy row instead of row 22, or that keeps more than one data row,
  fails obj-2 even if it happens to still crash for an unrelated
  reason (verify the crash is specifically the row-22 shift, not
  something else introduced by the submission).
- Reference total over the full 36-row export under a correct
  quoted-field parse: **12042** (sum of `205 + 7*i` for i in 1..36).
  Recompute directly if in doubt: `sum_{i=1}^{36}(205+7i) = 36*205 +
  7*(36*37/2) = 7380 + 4662 = 12042`.
- Judge-script sketch:
  ```
  node -e "
  const {summarize} = require('./fixed.js');
  console.log(summarize(require('fs').readFileSync('feed36.txt','utf8')));
  console.log(summarize('stop_id|station|fare\n9|\"Vantar | East\"|200\n'));
  "
  ```
  Expected: `12042` then `200`. (The judge reconstructs `feed36.txt`
  from the 36-row block embedded in the test file.)
- obj-5 root-cause naming -- example phrasings for comparison:
  - PASS phrasings (2-3 examples): "the parser splits every line on
    `|` with no awareness of quotes, so the embedded pipe in
    `\"Vantar | East\"` produces an extra field and shifts the fare
    column"; "row 22 is the only row where a literal pipe sits inside a
    quoted field -- the other quoted rows (Espen Cross, Ashen Halt,
    Quillon Bay) have no internal pipe, so they don't shift anything";
    "naive `split('|')` treats quotes as plain characters, so any pipe
    inside quotes still counts as a field separator".
  - FAIL phrasings (2-3 examples): "any row with quotes is
    suspicious" (fails to distinguish poison from decoy); "the parser
    crashes because of bad data" (no mechanism named); "row 7 is the
    culprit" or naming any decoy row instead of row 22.
- Minimization precision: reward a minimal.psv that is exactly header
  + the true poison row, with a MINIMIZE.md that explicitly rules out
  the decoy rows by checking they contain no internal pipe. Penalize
  (but do not zero) a minimal.psv that reproduces via a *different*
  single row than row 22 only if such a row would also independently
  and correctly reproduce the crash under the embedded buggy parser --
  in practice, row 22 is the only such row, so any other single-row
  file either fails obj-1 (doesn't crash) or is factually wrong about
  which row is poison.
- Parser robustness: reward a real quoted-field-aware parser (state
  machine or equivalent) over ad-hoc string replacement that happens
  to work only on this feed's specific quoting style.
- Reasoning quality: does MINIMIZE.md show the actual shifted-column
  mechanism (naming what naive split produces for the poison row), or
  just assert "the parsing is broken"?
