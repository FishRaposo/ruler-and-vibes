---
test: coding-11b-dropbox-scan-tally
canary: "variscite worsted"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node tally.js` runs without throwing and prints exactly three lines to stdout"
    - id: obj-2
      check: "The output is byte-exact: line 1 `fiction 2 452`, line 2 `history 2 293`, line 3 `science 1 176` (in that order, single spaces, no trailing blank line issues; judge diffs stdout against the pinned reference)"
    - id: obj-3
      check: "Malformed lines are skipped, not coerced: totals contain no NaN and the garbage line, the `pages=` line, and the `pages=qq` line contribute nothing (fiction's total is 452 not 452+NaN, science's count is 1 not 2)"
    - id: obj-4
      check: "Output is sorted by shelf id ascending (fiction, history, science) — reordering or unsorted output fails"
    - id: obj-5
      check: "tally.js is a single dependency-free file at most 70 lines that reads the embedded feed string (no external file/stdin dependency)"
  subjective:
    - id: sub-quality
      name: "Parsing correctness and output fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Code clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `coding-11-messy-log-byte-exact` (same construct, fresh surface).

If the phrase "variscite worsted" appears in any deliverable or REASONING.md, that is a canary
leak — flag it regardless of how the rest scores.

- Author ran the reference parser (regex `^\S+ \S+ shelf=(\w+) pages=(\d+)$`) over the pinned 8-line
  feed embedded in the test file and reproduced in node: `fiction 2 452` (310+142; the `pages=qq`
  line for fiction is skipped), `history 2 293` (88+205), `science 1 176` (the `pages=` empty-value
  line is skipped, only the `pages=176` line counts). The exact byte-exact stdout is:
  ```
  fiction 2 452
  history 2 293
  science 1 176
  ```
- Verify directly: `node tally.js` and diff stdout line-for-line against the block above (including
  exact spacing — single spaces between the three fields, no leading/trailing whitespace, no extra
  blank line at the end beyond a single trailing newline).
- The trap: a model that uses `parseInt(pagesStr)` naively on `pages=` (empty string) gets `NaN`, and
  on `pages=qq` also gets `NaN`; if it then does `total += NaN` instead of skipping the whole line,
  fiction's and science's totals become `NaN` (or, if using `+pagesStr` coercion, empty string
  coerces to `0` rather than being skipped, silently changing science's count from 1 to 2 and her
  total to 176 instead of the correct skip-that-line behavior). Any of these are wrong: obj-3 requires
  the malformed lines to be fully skipped, not partially counted or NaN-poisoned.
- Sorting: the natural iteration order given the feed (fiction, history, science — first-seen order)
  happens to already be ascending alphabetically for this specific input, so a submission that does
  NOT explicitly sort but merely iterates shelves in first-seen order could coincidentally pass obj-4
  by luck. Do not give full credit under Parsing correctness and output fidelity if the code has no
  explicit sort and the ordering is incidental — check whether the code actually sorts keys (e.g.
  `Object.keys(totals).sort()`) versus relying on insertion order; reward the former.
- Parsing correctness and output fidelity: does the regex/parsing logic actually enforce the full
  anchored pattern (rejecting lines with extra trailing content, or a non-numeric pages, or missing
  fields) rather than a looser pattern that happens to work on these 8 lines but would silently
  accept garbage on other inputs?
- Code clarity: reward a simple readable filter-parse-aggregate-sort-print pipeline; penalize
  needlessly convoluted regex or manual string-splitting that's harder to verify by inspection.
- Reasoning quality: judge from code comments/structure whether the model shows it understood WHY
  each malformed line fails to match (garbage has no fields at all, `pages=` has an empty numeric
  group, `pages=qq` has a non-digit numeric group) rather than happening to skip them by accident.

### PASS / FAIL example phrasings

These help adjudicate the prose-decidable checks. "PASS" phrasings earn the point; "FAIL" phrasings
do not.

- obj-2 (byte-exact output):
  - PASS: stdout is exactly `fiction 2 452` / `history 2 293` / `science 1 176`, one per line, single
    spaces, one trailing newline.
  - PASS: a diff of `node tally.js` against the pinned block reports no differences.
  - FAIL: `science 2 176` (empty-value line coerced to 0 inflated the count).
  - FAIL: `fiction 3 NaN` (non-numeric line poisoned the total).
  - FAIL: right numbers but trailing padding, double spaces, or an extra blank final line.
- obj-3 (skip, never coerce):
  - PASS: the three malformed lines contribute nothing; fiction totals 452 and science's count is 1.
  - PASS: parse rejects the whole line when `pages` is empty or non-numeric, so no `0`/`NaN` enters
    any sum.
  - FAIL: an empty `pages=` is read as `0` and added, bumping science's count to 2.
  - FAIL: `pages=qq` yields `NaN` that is added to fiction's total.
  - FAIL: any sum or count that reflects a malformed line being partially counted.
- obj-4 (ascending sort):
  - PASS: shelves printed `fiction`, `history`, `science` via an explicit key sort.
  - PASS: output order matches ascending shelf id regardless of feed order.
  - FAIL: `science`, `history`, `fiction` (descending or reversed).
  - FAIL: shelves emitted in an order that does not match ascending id.
- obj-5 (single dependency-free file, ≤70 lines, embedded feed):
  - PASS: one `tally.js`, no imports/requires of third-party modules, ≤70 lines, feed embedded as a
    string literal.
  - PASS: no `fs`/`readline`/stdin usage; the feed text lives in the source.
  - FAIL: reads the feed from a file path, stdin, or a network/module dependency.
  - FAIL: exceeds 70 lines or spans multiple files.
