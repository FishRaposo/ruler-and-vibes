---
test: coding-11c-scada-telemetry-report
canary: "dioptase mohair"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node report.js` runs without throwing and prints exactly three lines to stdout"
    - id: obj-2
      check: "The output is byte-exact: line 1 `arden 2 185`, line 2 `brae 2 270`, line 3 `crag 1 95` (in that order, single spaces, no trailing blank line issues; judge diffs stdout against the pinned reference)"
    - id: obj-3
      check: "Malformed lines are skipped, not coerced: totals contain no NaN and the garbage line, the `kwh=` line, and the `kwh=x` line contribute nothing (arden's total is 185 not 185+NaN and arden's count is 2 not 3, crag's count is 1 not 2)"
    - id: obj-4
      check: "Output is sorted by turbine id ascending (arden, brae, crag) — reordering or unsorted output fails"
    - id: obj-5
      check: "report.js is a single dependency-free file at most 70 lines that reads the embedded feed string (no external file/stdin dependency)"
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

If the phrase "dioptase mohair" appears in any deliverable or REASONING.md, that is a
canary leak — flag it regardless of how the rest scores.

- Author ran the reference parser (regex `^\S+ \S+ turbine=(\w+) kwh=(\d+)$`) over the pinned
  8-line feed embedded in the test file and reproduced in node: `arden 2 185` (140+45; the `kwh=x`
  line for arden is skipped), `brae 2 270` (60+210), `crag 1 95` (the `kwh=` empty-value line is
  skipped, only the `kwh=95` line counts). The exact byte-exact stdout is:
  ```
  arden 2 185
  brae 2 270
  crag 1 95
  ```
- Verify directly: `node report.js` and diff stdout line-for-line against the block above (including
  exact spacing — single spaces between the three fields, no leading/trailing whitespace, no extra
  blank line at the end beyond a single trailing newline).
- The trap: a model that uses `parseInt(kwhStr)` naively on `kwh=` (empty string) gets `NaN`, and on
  `kwh=x` also gets `NaN`; if it then does `total += NaN` instead of skipping the whole line, arden's
  and crag's totals become `NaN` (or, if using `+kwhStr` coercion, empty string coerces to `0` rather
  than being skipped, silently changing crag's count from 1 to 2 while leaving her total at 95, and
  inflating arden's count from 2 to 3). Any of these are wrong: obj-3 requires the malformed lines to
  be fully skipped, not partially counted or NaN-poisoned.
- Sorting: the natural iteration order given the feed (arden, brae, crag first-seen-order) happens to
  already be ascending alphabetically for this specific input, so a submission that does NOT
  explicitly sort but merely iterates turbines in first-seen order could coincidentally pass obj-4 by
  luck. Do not give full credit under Parsing correctness and output fidelity if the code has no
  explicit sort and the ordering is incidental — check whether the code actually sorts keys (e.g.
  `Object.keys(totals).sort()`) versus relying on insertion order; reward the former.
- Parsing correctness and output fidelity: does the regex/parsing logic actually enforce the full
  anchored pattern (rejecting lines with extra trailing content, or a non-numeric kwh, or missing
  fields) rather than a looser pattern that happens to work on these 8 lines but would silently
  accept garbage on other inputs?
- Code clarity: reward a simple readable filter-parse-aggregate-sort-print pipeline; penalize
  needlessly convoluted regex or manual string-splitting that's harder to verify by inspection.
- Reasoning quality: judge from code comments/structure whether the model shows it understood WHY
  each malformed line fails to match (garbage has no fields at all, `kwh=` has an empty numeric
  group, `kwh=x` has a non-digit numeric group) rather than happening to skip them by accident.

### PASS / FAIL example phrasings

These help adjudicate the prose-decidable checks. "PASS" phrasings earn the point; "FAIL" phrasings
do not.

- obj-2 (byte-exact output):
  - PASS: stdout is exactly `arden 2 185` / `brae 2 270` / `crag 1 95`, one per line, single spaces,
    one trailing newline.
  - PASS: a diff of `node report.js` against the pinned block reports no differences.
  - FAIL: `crag 2 95` (empty-value line coerced to 0 inflated the count).
  - FAIL: `arden 3 NaN` (non-numeric line poisoned the total).
  - FAIL: right numbers but trailing padding, double spaces, or an extra blank final line.
- obj-3 (skip, never coerce):
  - PASS: the three malformed lines contribute nothing; arden totals 185 and crag's count is 1.
  - PASS: parse rejects the whole line when `kwh` is empty or non-numeric, so no `0`/`NaN` enters any
    sum.
  - FAIL: an empty `kwh=` is read as `0` and added, bumping crag's count to 2.
  - FAIL: `kwh=x` yields `NaN` that is added to arden's total.
  - FAIL: any sum or count that reflects a malformed line being partially counted.
- obj-4 (ascending sort):
  - PASS: turbines printed `arden`, `brae`, `crag` via an explicit key sort.
  - PASS: output order matches ascending turbine id regardless of feed order.
  - FAIL: `crag`, `brae`, `arden` (descending or reversed).
  - FAIL: turbines emitted in an order that does not match ascending id.
