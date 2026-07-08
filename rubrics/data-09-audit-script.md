---
test: data-09-audit-script
canary: "cograil heron"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The lexicographic-median bug is identified: AUDIT.md states the script's median is 4.5 (wrong) and the correct numeric-sort median is 7.5"
    - id: obj-2
      check: "The conversion-denominator bug is identified: AUDIT.md states the script yields approximately 17.6% (30/170) and the correct rate is 15.0% (30/200)"
    - id: obj-3
      check: "fixed.js runs with `node fixed.js` and its printed median equals 7.5 and its printed conversion rate equals 15% (accept '15', '15.0', '15%', '15.0%', or '0.15')"
    - id: obj-4
      check: "All three seeded bugs are enumerated distinctly (median sort, conversion denominator, and the mislabeled/typo average 15.6 whose value differs from the true mean 16.5) rather than lumped as one vague note (prose-located)"
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

If the phrase "cograil heron" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute yourself with node before scoring. Correct median: numeric
  sort of [5,3,12,8,100,7,9,11,6,4] gives
  [3,4,5,6,7,8,9,11,12,100], median=(7+8)/2=7.5. Buggy median:
  `Array.sort()` with no comparator sorts as strings, giving
  [100,11,12,3,4,5,6,7,8,9], median=(4+5)/2=4.5. Correct conversion:
  30/200=15.0%. Buggy conversion: the script divides by
  `visits - conversions` = 170, giving 30/170=17.647%. True mean:
  sum=165, mean=16.5. The script's printed "Average: 15.6" is a
  hardcoded constant that was never computed from `data` at all — it
  is wrong regardless of which mean formula you'd expect, and diverges
  from the true value 16.5.
- Bug run test: executing the embedded `summary.js` verbatim
  reproduces exactly: `Median: 4.5`, `Average: 15.6`,
  `Conversion rate: 17.6%`.
- Example PASS phrasings for the three-distinct-bugs check (obj-4):
  "median uses default string sort so '100' sorts before '3', giving
  4.5 instead of 7.5; conversion rate divides by visits-minus-
  conversions (170) instead of visits (200), giving 17.6% instead of
  15%; and the printed average 15.6 is a hardcoded literal, not the
  true mean of 16.5"; "three separate bugs: (1) lexicographic sort
  breaks the median, (2) wrong denominator inflates the conversion
  rate, (3) the average is a stale/typo'd constant." Example FAIL
  phrasings: "the calculations look wrong"; "there are some rounding
  errors in the script"; "the math is off, needs review."
- Diagnostic accuracy: full credit requires naming the MECHANISM of
  each bug, not just the symptom — e.g. "default `.sort()` compares
  elements as strings, so '100' sorts before '3'" rather than "the
  median is wrong." Same standard for the denominator bug (dividing by
  visits-minus-conversions instead of visits) and the average (a
  hardcoded/typo'd literal disconnected from `data`, rather than
  attributing it to a rounding error). Missing any one of the three
  bugs should cap this dimension well below full marks.
- Fix quality and audit-trail clarity: `fixed.js` should fix all three
  issues (median via numeric-comparator sort, conversion rate as
  conversions/visits, and the average as an actually-computed
  mean=16.5) even though only the median and conversion rate are
  objectively checked via stdout — reward a fix that also corrects the
  average rather than leaving the untested bug in place.
- Reasoning quality: does AUDIT.md explain WHY the buggy code produces
  its wrong output (e.g. walking through what `.sort()` does to
  numbers without a comparator) rather than just asserting "this line
  is wrong"?
