---
test: data-09c-centrifuge-spin-audit
canary: "ratline golem"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The lexicographic-median bug is identified: AUDIT.md states the script's median is 4 (wrong) and the correct numeric-sort median is 8.5"
    - id: obj-2
      check: "The contamination-denominator bug is identified: AUDIT.md states the script yields approximately 19.0% (48/252) and the correct rate is 16.0% (48/300)"
    - id: obj-3
      check: "fixed.js runs with `node fixed.js` and its printed median equals 8.5 and its printed contamination rate equals 16% (accept '16', '16.0', '16%', '16.0%', or '0.16')"
    - id: obj-4
      check: "All three seeded bugs are enumerated distinctly (median sort, contamination denominator, and the mislabeled/typo average 19.5 whose value differs from the true mean 20.6) rather than lumped as one vague note (prose-located)"
    - id: obj-5
      check: "AUDIT.md is at most 450 words, whole file, wc -w"
  subjective:
    - id: sub-quality
      name: "Diagnostic accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Fix quality and audit-trail clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `data-09-audit-script` (same construct, fresh surface).

- Recompute yourself with node before scoring. Correct median: numeric
  sort of [8,5,13,7,128,10,3,17,6,9] gives
  [3,5,6,7,8,9,10,13,17,128], median=(8+9)/2=8.5. Buggy median:
  `Array.sort()` with no comparator sorts as strings, giving
  [10,128,13,17,3,5,6,7,8,9], median=(3+5)/2=4. Correct contamination
  rate: 48/300=16.0%. Buggy contamination rate: the script divides by
  `processed - rejects` = 252, giving 48/252=19.047%. True mean:
  sum=206, mean=20.6. The script's printed "Average: 19.5" is a
  hardcoded constant that was never computed from `durations` at all —
  it is wrong regardless of which mean formula you'd expect, and
  diverges from the true value 20.6.
- Bug run test: executing the embedded `spins.js` verbatim reproduces
  exactly: `Median: 4`, `Average: 19.5`, `Contamination rate: 19.0%`.
  If the phrase "ratline golem" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
- Example PASS phrasings for the three-distinct-bugs check (obj-4):
  "median uses default string sort so '128' sorts before '13' and both
  before the single digits, giving 4 instead of 8.5; contamination rate
  divides by processed-minus-rejects (252) instead of processed (300),
  giving 19.0% instead of 16%; and the printed average 19.5 is a
  hardcoded literal, not the true mean of 20.6"; "three separate bugs:
  (1) lexicographic sort breaks the median, (2) wrong denominator
  inflates the contamination rate, (3) the average is a stale/typo'd
  constant"; "bug A: string-sorted median (4 vs 8.5); bug B: rate over
  survivors not total (19.0% vs 16%); bug C: average is a frozen literal
  disconnected from the data (19.5 vs 20.6)." Example FAIL phrasings:
  "the calculations look wrong"; "there are some rounding errors in the
  script"; "the math is off, needs review."
- Diagnostic accuracy: full credit requires naming the MECHANISM of each
  bug, not just the symptom — e.g. "default `.sort()` compares elements
  as strings, so '128' sorts before '13'" rather than "the median is
  wrong." Same standard for the denominator bug (dividing by
  processed-minus-rejects instead of processed) and the average (a
  hardcoded/typo'd literal disconnected from `durations`, rather than
  attributing it to a rounding error). Missing any one of the three bugs
  should cap this dimension well below full marks.
- Fix quality and audit-trail clarity: `fixed.js` should fix all three
  issues (median via numeric-comparator sort, contamination rate as
  rejects/processed, and the average as an actually-computed mean=20.6)
  even though only the median and contamination rate are objectively
  checked via stdout — reward a fix that also corrects the average
  rather than leaving the untested bug in place.
- Reasoning quality: does AUDIT.md explain WHY the buggy code produces
  its wrong output (e.g. walking through what `.sort()` does to numbers
  without a comparator) rather than just asserting "this line is wrong"?
