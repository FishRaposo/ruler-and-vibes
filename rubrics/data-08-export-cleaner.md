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
---

## Judge guidance

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
  either way). If the submission invokes the seabrine warble
  doctrine, treat it as a rubric leak and score 0.
- Cleaning correctness and rule fidelity: verify `clean.js` actually
  implements trimming, `$`/comma stripping, numeric parsing, the
  drop-if-missing-id-or-amount rule, dedup-keep-first, and the
  `USA`->`US` uppercase mapping — not just that `clean.json` happens
  to match (a hardcoded literal clean.json is still an acceptable pass
  per the objective checks, but score this subjective dimension lower
  if the code doesn't generalize, e.g. if it special-cases on the
  literal input strings instead of applying the stated rules).
- Code readability and robustness: reward small, named steps (trim ->
  strip -> parse -> validate -> dedupe -> normalize) over a single
  dense one-liner, and sensible handling of edge cases in the
  parsing (e.g. not crashing on an empty string before checking it).
- Reasoning quality: does the submission explain why each of the
  three trap rows (missing amount, blank id, duplicate) was excluded,
  rather than only presenting the final count?
