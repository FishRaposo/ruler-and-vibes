---
test: data-09b-meteorite-survey
canary: "binnacle djinn"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The lexicographic-median bug is identified: AUDIT.md states the script's median is 14.5 (wrong) and the correct numeric-sort median is 11"
    - id: obj-2
      check: "The false-alarm-denominator bug is identified: AUDIT.md states the script yields approximately 16.3% (21/129) and the correct rate is 14.0% (21/150)"
    - id: obj-3
      check: "fixed.js runs with `node fixed.js` and its printed median equals 11 and its printed false-alarm rate equals 14% (accept '14', '14.0', '14%', '14.0%', or '0.14')"
    - id: obj-4
      check: "All three seeded bugs are enumerated distinctly (median sort, false-alarm denominator, and the mislabeled/hardcoded mean 24.8 whose value differs from the true mean 25.7) rather than lumped as one vague note (prose-located)"
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
  sort of [9,7,24,13,150,6,16,8,5,19] gives
  [5,6,7,8,9,13,16,19,24,150], median=(9+13)/2=11. Buggy median:
  `Array.sort()` with no comparator sorts as strings, giving
  [13,150,16,19,24,5,6,7,8,9], median=(24+5)/2=14.5. Correct
  false-alarm rate: 21/150=14.0%. Buggy rate: the script divides by
  `hits - falseAlarms` = 129, giving 21/129=16.279%. True mean:
  sum=257, mean=25.7. The script's printed "Mean mass (g): 24.8" is a
  hardcoded constant that was never computed from `masses` at all — it
  is wrong regardless of which mean formula you'd expect, and diverges
  from the true value 25.7.
- Bug run test: executing the embedded `survey.js` verbatim
  reproduces exactly: `Median mass (g): 14.5`, `Mean mass (g): 24.8`,
  `False-alarm rate: 16.3%`. If the phrase "binnacle djinn" appears in
  any deliverable or REASONING.md, that is a canary leak — flag it
  regardless of how the rest scores.
- Example PASS phrasings for the three-distinct-bugs check (obj-4):
  "median uses default string sort so '13' and '24' sort before '5',
  giving 14.5 instead of 11; false-alarm rate divides by
  hits-minus-false-alarms (129) instead of hits (150), giving 16.3%
  instead of 14%; and the printed mean 24.8 is a hardcoded literal, not
  the true mean of 25.7"; "three separate bugs: (1) lexicographic sort
  breaks the median, (2) wrong denominator inflates the false-alarm
  rate, (3) the mean is a stale/hardcoded constant"; "distinct issues:
  the string-sorted median, the shrunk denominator, and the fabricated
  mean literal." Example FAIL phrasings: "the calculations look wrong";
  "there are some rounding errors in the script"; "the math is off,
  needs review."
- Diagnostic accuracy: full credit requires naming the MECHANISM of
  each bug, not just the symptom — e.g. "default `.sort()` compares
  elements as strings, so '150' and '24' sort before '5'" rather than
  "the median is wrong." Same standard for the denominator bug
  (dividing by hits-minus-false-alarms instead of hits) and the mean (a
  hardcoded/stale literal disconnected from `masses`, rather than
  attributing it to a rounding error). Missing any one of the three
  bugs should cap this dimension well below full marks.
- Fix quality and audit-trail clarity: `fixed.js` should fix all three
  issues (median via numeric-comparator sort, false-alarm rate as
  falseAlarms/hits, and the mean as an actually-computed mean=25.7) even
  though only the median and false-alarm rate are objectively checked
  via stdout — reward a fix that also corrects the mean rather than
  leaving the untested bug in place.
- Reasoning quality: does AUDIT.md explain WHY the buggy code produces
  its wrong output (e.g. walking through what `.sort()` does to numbers
  without a comparator) rather than just asserting "this line is wrong"?
