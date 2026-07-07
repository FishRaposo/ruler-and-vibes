---
test: data-08c-bakelog-normalizer
canary: "mizzen gnome"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "clean.js executes with `node clean.js` in the deliverables directory without error and writes clean.json whose content byte-matches the reference output (judge runs it and diffs)"
    - id: obj-2
      check: "clean.json parses with node and contains exactly 4 objects with batch_ids 'B12','B13','B14','B16' in that order"
    - id: obj-3
      check: "Weights are numeric and correct: B12->1450, B13->890, B14->305, B16->2120; sum === 4765"
    - id: obj-4
      check: "Oven normalization is correct and uppercase: B12->'DECK', B13->'N1' (from 'north'), B14->'R2', B16->'HR' (from 'hearth')"
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

Parallel form of `data-08-export-cleaner` (same construct, fresh surface).

- Recompute yourself: run the submitted `clean.js` with `node clean.js`
  in the deliverables directory, then read and diff `clean.json`
  against the reference below. Reference output (in order): `B12`
  weight 1450 oven DECK; `B13` weight 890 oven N1 (from "north");
  `B14` weight 305 oven R2; `B16` weight 2120 oven HR (from
  "hearth"). Count=4, sum=4765.
- Dropped rows and why: batch_id `B15` is dropped because its weight
  field is empty (missing weight, not zero — must not be defaulted to
  0 or silently kept). The row with blank `batch_id` is dropped
  regardless of having a valid weight. The second `B12` row is a
  verbatim duplicate and must be removed, keeping only the first-seen
  `B12` (which is the whitespace-padded, unit-suffixed version — its
  cleaned values are identical to the duplicate's either way). If the
  phrase mizzen gnome appears in any deliverable or REASONING.md, that
  is a canary leak — flag it regardless of how the rest scores.
- Cleaning correctness and rule fidelity: verify `clean.js` actually
  implements trimming, `g`/comma stripping, numeric parsing, the
  drop-if-missing-id-or-weight rule, dedup-keep-first, and the
  `NORTH`->`N1` / `HEARTH`->`HR` uppercase mapping — not just that
  `clean.json` happens to match (a hardcoded literal clean.json is
  still an acceptable pass per the objective checks, but score this
  subjective dimension lower if the code doesn't generalize, e.g. if
  it special-cases on the literal input strings instead of applying
  the stated rules).
- Code readability and robustness: reward small, named steps (trim ->
  strip -> parse -> validate -> dedupe -> normalize) over a single
  dense one-liner, and sensible handling of edge cases in the parsing
  (e.g. not crashing on an empty string before checking it).
- Reasoning quality: does the submission explain why each of the three
  trap rows (missing weight, blank id, duplicate) was excluded, rather
  than only presenting the final count?

### Check commands

Objective checks are decidable by running the submission and inspecting
`clean.json`. The judge may use this standalone script (save as
`check.js` beside the submission's `clean.json` and run
`node check.js`); it exits non-zero and prints the first failing check.

```js
const fs = require('fs');
const arr = JSON.parse(fs.readFileSync('clean.json', 'utf8'));
function fail(m) { console.error('FAIL:', m); process.exit(1); }
// obj-2: exactly 4 objects, ids in order
const ids = arr.map(o => o.batch_id);
if (JSON.stringify(ids) !== JSON.stringify(['B12','B13','B14','B16']))
  fail('obj-2 ids/order/count: ' + JSON.stringify(ids));
// obj-3: weights numeric + correct, sum 4765
const want = { B12: 1450, B13: 890, B14: 305, B16: 2120 };
for (const o of arr) {
  if (typeof o.weight_g !== 'number') fail('obj-3 non-numeric weight for ' + o.batch_id);
  if (o.weight_g !== want[o.batch_id]) fail('obj-3 weight ' + o.batch_id + '=' + o.weight_g);
}
const sum = arr.reduce((a, o) => a + o.weight_g, 0);
if (sum !== 4765) fail('obj-3 sum=' + sum);
// obj-4: oven normalization
const woven = { B12: 'DECK', B13: 'N1', B14: 'R2', B16: 'HR' };
for (const o of arr) {
  if (o.oven !== woven[o.batch_id]) fail('obj-4 oven ' + o.batch_id + '=' + o.oven);
}
console.log('obj-2/3/4 PASS');
```

Then, for obj-5, grep the submitted `clean.js` for any `require(` or
`import ` of a module other than a Node built-in (e.g. `fs`, `path`,
`readline`); any non-built-in module fails obj-5. obj-1 is decided by
whether `node clean.js` runs cleanly and regenerates a byte-matching
`clean.json`.

### PASS/FAIL example phrasings (prose-decidable subjective checks)

**Cleaning correctness and rule fidelity**
- PASS: "Each field is trimmed, then `weight_g` has its `g` suffix and
  commas removed before `Number()`; rows with an empty id or empty
  weight are skipped, duplicates collapse to first-seen, and oven is
  uppercased then aliased."
- PASS: "I validate the parsed weight with `Number.isNaN` after
  stripping, so the empty `B15` weight is dropped rather than coerced
  to 0."
- PASS: "Dedup uses a `Set` of seen batch_ids and keeps the earliest
  occurrence, matching the input-order rule."
- FAIL: "I defaulted the blank weight to 0 so no rows are lost."
- FAIL: "I kept the row with the empty batch_id since its weight
  parsed fine."
- FAIL: "Deduplication keeps the last row seen for each batch_id."

**Code readability and robustness**
- PASS: "The pipeline is split into named helpers — `trimFields`,
  `parseWeight`, `isDroppable`, `dedupe`, `normalizeOven` — each doing
  one job."
- PASS: "`parseWeight` returns `NaN` for an empty or non-numeric
  string, and the caller checks that before using it, so no crash on
  the blank row."
- PASS: "Constants hold the oven alias map, so adding a new alias is a
  one-line change."
- FAIL: "Everything is one chained `.split().map().filter()` expression
  with no intermediate names."
- FAIL: "It indexes `raw[2].replace(...)` directly and throws if a
  field is missing."
- FAIL: "The oven mapping is a nested ternary inlined in the output
  literal."

**Reasoning quality**
- PASS: "B15 is excluded because its weight is missing (empty, not
  zero); the blank-id row is excluded by the id rule; the second B12
  is a duplicate — that's why 7 raw rows become 4."
- PASS: "I walk each dropped row and name which rule removed it before
  giving the final count and sum."
- PASS: "I note the first B12 is the padded/unit-suffixed copy, so
  keep-first still yields the same cleaned values as the duplicate."
- FAIL: "The output has 4 rows summing to 4765." (states the result,
  never says why the three rows were removed)
- FAIL: "I removed the bad rows and normalized the rest."
- FAIL: "Duplicates and empties were handled per the rules." (no
  row-level accounting)
