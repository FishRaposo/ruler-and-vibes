---
test: coding-11-messy-log-byte-exact
canary: "pinewood scupper"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node report.js` runs without throwing and prints exactly three lines to stdout"
    - id: obj-2
      check: "The output is byte-exact: line 1 `alice 2 150`, line 2 `bob 2 250`, line 3 `carol 1 75` (in that order, single spaces, no trailing blank line issues; judge diffs stdout against the pinned reference)"
    - id: obj-3
      check: "Malformed lines are skipped, not coerced: totals contain no NaN and the garbage line, the `ms=` line, and the `ms=x` line contribute nothing (alice's total is 150 not 150+NaN, carol's count is 1 not 2)"
    - id: obj-4
      check: "Output is sorted by user id ascending (alice, bob, carol) — reordering or unsorted output fails"
    - id: obj-5
      check: "report.js is a single dependency-free file at most 70 lines that reads the embedded log string (no external file/stdin dependency)"
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
anchors:
  - id: Parsing correctness and output fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Code clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "pinewood scupper" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author ran the reference parser (regex `^\S+ \S+ user=(\w+) ms=(\d+)$`) over the pinned 8-line
  log embedded in the test file and reproduced in node: `alice 2 150` (120+30; the `ms=x` line for
  alice is skipped), `bob 2 250` (50+200), `carol 1 75` (the `ms=` empty-value line is skipped, only
  the `ms=75` line counts). The exact byte-exact stdout is:
  ```
  alice 2 150
  bob 2 250
  carol 1 75
  ```
- Verify directly: `node report.js` and diff stdout line-for-line against the block above (including
  exact spacing — single spaces between the three fields, no leading/trailing whitespace, no extra
  blank line at the end beyond a single trailing newline).
- The trap: a model that uses `parseInt(msStr)` naively on `ms=` (empty string) gets `NaN`, and on
  `ms=x` also gets `NaN`; if it then does `total += NaN` instead of skipping the whole line, alice's
  and carol's totals become `NaN` (or, if using `+msStr` coercion, empty string coerces to `0` rather
  than being skipped, silently changing carol's count from 1 to 2 and her total to 75 instead of the
  correct skip-that-line behavior). Any of these are wrong: obj-3 requires the malformed lines to be
  fully skipped, not partially counted or NaN-poisoned.
- Sorting: the natural iteration order given the log (alice, bob, first-seen-order) happens to
  already be ascending alphabetically for this specific input, so a submission that does NOT
  explicitly sort but merely iterates users in first-seen order could coincidentally pass obj-4 by
  luck. Do not give full credit under Parsing correctness and output fidelity if the code has no
  explicit sort and the ordering is incidental — check whether the code actually sorts keys (e.g.
  `Object.keys(totals).sort()`) versus relying on insertion order; reward the former.
- Parsing correctness and output fidelity: does the regex/parsing logic actually enforce the full
  anchored pattern (rejecting lines with extra trailing content, or a non-numeric ms, or missing
  fields) rather than a looser pattern that happens to work on these 8 lines but would silently
  accept garbage on other inputs?
- Code clarity: reward a simple readable filter-parse-aggregate-sort-print pipeline; penalize
  needlessly convoluted regex or manual string-splitting that's harder to verify by inspection.
- Reasoning quality: judge from code comments/structure whether the model shows it understood WHY
  each malformed line fails to match (garbage has no fields at all, `ms=` has an empty numeric
  group, `ms=x` has a non-digit numeric group) rather than happening to skip them by accident.
