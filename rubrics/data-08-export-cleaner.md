---
test: data-08-export-cleaner
canary: "seabrine warble"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "clean.js executes with `node clean.js` in the deliverables directory without error and writes clean.json whose content byte-matches the reference output (judge runs it and diffs)"
    - id: obj-2
      check: "clean.json parses with node and contains exactly 4 objects with order_ids '1001','1002','1003','1005' in that order"
    - id: obj-3
      check: "Amounts are numeric and correct: 1001->1200.5, 1002->980, 1003->75, 1005->2000; sum === 4255.5"
    - id: obj-4
      check: "Country normalization is correct and uppercase: 1001->'US', 1002->'US' (from 'usa'), 1003->'CA', 1005->'GB' (from 'gb')"
    - id: obj-5
      check: "clean.js contains no require()/import of any non-built-in module (judge greps the file for require( and import )"
  subjective:
    - id: sub-quality
      name: "Cleaning correctness and rule fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Code readability and robustness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Cleaning correctness and rule fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Code readability and robustness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "seabrine warble" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute yourself: run the submitted `clean.js` with `node clean.js`
  in the deliverables directory, then read and diff `clean.json`
  against the reference below. Reference output (in order): `1001`
  amount 1200.5 country US; `1002` amount 980 country US (from
  "usa"); `1003` amount 75 country CA; `1005` amount 2000 country GB
  (from "gb"). Count=4, sum=4255.5.
- Dropped rows and why: order_id `1004` is dropped because its amount
  field is empty (missing amount, not zero — must not be defaulted to
  0 or silently kept). The row with blank `order_id` is dropped
  regardless of having a valid amount. The second `1001` row is a
  verbatim duplicate and must be removed, keeping only the
  first-seen `1001` (which is the whitespace-padded, `$`-prefixed
  version — its cleaned values are identical to the duplicate's
  either way).
- Cleaning correctness and rule fidelity: verify `clean.js` actually
  implements trimming, `$`/comma stripping, numeric parsing, the
  drop-if-missing-id-or-amount rule, dedup-keep-first, and the
  `USA`->`US` uppercase mapping — not just that `clean.json` happens
  to match (a hardcoded literal clean.json is still an acceptable pass
  per the objective checks, but score this subjective dimension lower
  if the code doesn't generalize, e.g. if it special-cases on the
  literal input strings instead of applying the stated rules). Example
  PASS phrasings: "trim -> strip $ and comma -> Number() -> drop blanks
  -> dedupe by order_id -> uppercase and map USA to US"; "keeps the
  first 1001 and skips the later identical one"; "1004 has no amount so
  it is dropped, not zero-filled". Example FAIL phrasings: "parseFloat
  on the raw field" (leaves 1 from "1,200.50"); "default missing
  amounts to 0"; "de-dupe keeping the last row"; "treats 'USA' and 'US'
  as different countries".
- Code readability and robustness: reward small, named steps (trim ->
  strip -> parse -> validate -> dedupe -> normalize) over a single
  dense one-liner, and sensible handling of edge cases in the
  parsing (e.g. not crashing on an empty string before checking it).
  Example PASS phrasings: "a named parseAmount helper that returns NaN
  for blanks"; "guards the empty string before Number() so it never
  yields 0"; "Set-based dedupe keyed on the trimmed order_id". Example
  FAIL phrasings: "one chained map/filter with three regexes inline";
  "assumes every amount has a leading $ and slices the first
  character"; "throws on the missing-amount row".
- Reasoning quality: does the submission explain why each of the
  three trap rows (missing amount, blank id, duplicate) was excluded,
  rather than only presenting the final count? Example PASS phrasings:
  "I drop 1004 because its amount is blank, drop the empty-id row, and
  dedupe the repeated 1001"; "three rows leave the set: one has no id,
  one has no amount, one is a duplicate". Example FAIL phrasings: "the
  output has four rows" (count only, no why); "removed some bad rows";
  silence on which rows left and why.
