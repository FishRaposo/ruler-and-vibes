---
test: data-08b-weighbridge-normalizer
canary: "tiller sylph"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "normalize.js executes with `node normalize.js` in the deliverables directory without error and writes normalize.json whose content byte-matches the reference output (judge runs it and diffs)"
    - id: obj-2
      check: "normalize.json parses with node and contains exactly 4 objects with ticket_ids '4401','4402','4403','4405' in that order"
    - id: obj-3
      check: "net_weights are numeric and correct: 4401->18450, 4402->9730, 4403->640, 4405->27300; sum === 56120"
    - id: obj-4
      check: "Commodity normalization is correct and uppercase: 4401->'FERROUS' (from 'FE'), 4402->'FERROUS' (from 'fe'), 4403->'GRAVEL', 4405->'SAND' (from 'sand')"
    - id: obj-5
      check: "normalize.js contains no require()/import of any non-built-in module (judge greps the file for require( and import )"
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

Parallel form of `data-08-export-cleaner` (same construct, fresh surface).

- Recompute yourself: run the submitted `normalize.js` with `node
  normalize.js` in the deliverables directory, then read and diff
  `normalize.json` against the reference below. Reference output (in
  order): `4401` net_weight 18450 commodity FERROUS (from "FE"); `4402`
  net_weight 9730 commodity FERROUS (from "fe"); `4403` net_weight 640
  commodity GRAVEL; `4405` net_weight 27300 commodity SAND (from
  "sand"). Count=4, sum=56120.
- Dropped rows and why: ticket_id `4404` is dropped because its
  net_weight field is empty (missing weight, not zero — must not be
  defaulted to 0 or silently kept). The row with blank `ticket_id` is
  dropped regardless of having a valid weight. The second `4401` row is
  a verbatim duplicate and must be removed, keeping only the first-seen
  `4401` (which is the whitespace-padded, comma-and-unit version — its
  cleaned values are identical to the duplicate's either way). If the
  phrase "tiller sylph" appears in any deliverable or REASONING.md, that
  is a canary leak — flag it regardless of how the rest scores.
- Cleaning correctness and rule fidelity: verify `normalize.js` actually
  implements trimming, comma-and-unit stripping, numeric parsing, the
  drop-if-missing-id-or-weight rule, dedup-keep-first, and the
  `FE`->`FERROUS` uppercase mapping — not just that `normalize.json`
  happens to match (a hardcoded literal normalize.json is still an
  acceptable pass per the objective checks, but score this subjective
  dimension lower if the code doesn't generalize, e.g. if it
  special-cases on the literal input strings instead of applying the
  stated rules). Example PASS phrasings: "trim -> strip commas and the
  trailing t -> Number() -> drop blanks -> dedupe by id -> uppercase and
  map FE"; "keeps the first 4401 and skips the later identical one";
  "4404 has no weight so it is dropped, not zero-filled". Example FAIL
  phrasings: "parseFloat on the raw field" (leaves 18 from "18,450");
  "default missing weights to 0"; "de-dupe keeping the last row"; "map
  FERROUS back to FE".
- Code readability and robustness: reward small, named steps (trim ->
  strip -> parse -> validate -> dedupe -> normalize) over a single dense
  one-liner, and sensible handling of edge cases in the parsing (e.g.
  not crashing on an empty string before checking it). Example PASS
  phrasings: "a named parseWeight helper that returns NaN for blanks";
  "guards the empty string before Number() so it never yields 0";
  "Set-based dedupe keyed on the trimmed id". Example FAIL phrasings:
  "one chained map/filter with three regexes inline"; "assumes every
  weight has a unit suffix and slices the last character"; "throws on
  the missing-weight row".
- Reasoning quality: does the submission explain why each of the three
  trap rows (missing weight, blank id, duplicate) was excluded, rather
  than only presenting the final count? Example PASS phrasings: "I drop
  4404 because its net_weight is blank, drop the empty-id row, and dedupe
  the repeated 4401"; "three rows leave the set: one has no id, one has
  no weight, one is a duplicate". Example FAIL phrasings: "the output has
  four rows" (count only, no why); "removed some bad rows"; silence on
  which rows left and why.
