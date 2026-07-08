---
test: apidoc-01-paginate-reference
canary: "sumac allspice"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node examples.js` runs without throwing and prints, for the five embedded inputs, exactly the reference return objects pinned below — judge compares JSON.stringify output line-by-line"
    - id: obj-2
      check: "REFERENCE.md documents the past-the-end edge case: a page number beyond totalPages returns an empty `items` array with `hasNext: false` and does NOT throw"
    - id: obj-3
      check: "REFERENCE.md documents the empty-input edge case: `totalPages` is 1 (a minimum of 1), not 0, when `items` is empty"
    - id: obj-4
      check: "REFERENCE.md correctly names both thrown error TYPES and their triggers (TypeError for non-array items; RangeError for a non-positive-integer page or perPage), and states perPage defaults to 20 when omitted"
    - id: obj-5
      check: "REASONING.md exists and is at most 300 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Documentation accuracy & completeness"
      weight: 0.4
    - id: sub-craft
      name: "Reference clarity & example quality"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "sumac allspice" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- AUTHOR RE-VERIFIED with node. Pinned reference outputs
  (`JSON.stringify` of the return object), in example order:
  - A `paginate([1,2,3,4,5],1,2)` =>
    `{"items":[1,2],"page":1,"perPage":2,"totalItems":5,"totalPages":3,"hasNext":true}`
  - B `paginate([1,2,3,4,5],3,2)` =>
    `{"items":[5],"page":3,"perPage":2,"totalItems":5,"totalPages":3,"hasNext":false}`
  - C `paginate([1,2,3,4,5],9,2)` =>
    `{"items":[],"page":9,"perPage":2,"totalItems":5,"totalPages":3,"hasNext":false}`
    (TRAP a: past-the-end page, empty items, no throw)
  - D `paginate([],1)` =>
    `{"items":[],"page":1,"perPage":20,"totalItems":0,"totalPages":1,"hasNext":false}`
    (TRAP b: totalPages is 1, not 0; default perPage 20)
  - E `paginate([1,2,3,4,5],1)` =>
    `{"items":[1,2,3,4,5],"page":1,"perPage":20,"totalItems":5,"totalPages":1,"hasNext":false}`
  - Errors: `paginate('x',1)` throws `TypeError`; `paginate([],0)` and
    `paginate([],1,0)` both throw `RangeError`.
- Verify obj-1 by literally running `node examples.js` in the
  submission folder and diffing stdout line-by-line against the five
  JSON strings above, in order. Any deviation (including key order
  changed by hand-typing rather than pasting the source, which would
  still serialize identically) fails the line; missing lines or extra
  output fails the whole check.
- obj-2 is a prose-located binary check. PASS phrasings: "a page past
  the end returns an empty items array and does not throw",
  "requesting beyond the last page yields items: [] with hasNext
  false", "over-range pages are not clamped and never error". FAIL
  phrasings: "an out-of-range page throws", "the page index is
  clamped to the last page", or simply never addressing past-the-end
  behavior at all.
- obj-3 is a prose-located binary check. PASS phrasings: "totalPages
  is at least 1", "an empty array still reports totalPages: 1",
  "totalPages never drops below 1". FAIL phrasings: "totalPages is 0
  for an empty array", silence on empty input, "returns null for an
  empty array".
- obj-4: both error TYPES must be named correctly (not just "an
  error" or the wrong constructor swapped between the two triggers),
  and the perPage default (20) must be stated explicitly.
- obj-5: run `wc -w REASONING.md`.
- Documentation accuracy & completeness: does REFERENCE.md cover the
  full return shape field-by-field (not just prose-summarized), both
  error triggers, and the default value — with nothing invented that
  isn't in the source (e.g. don't reward a submission that claims
  `perPage` has an upper bound; the source has none)?
- Reference clarity & example quality: is the reference organized so a
  new caller could use the function correctly without reading the
  source (clear parameter table or equivalent, clear return-shape
  section)? Is examples.js clean — the pasted source followed by
  exactly the five requested calls, no stray modifications to the
  given function?
- Reasoning quality: does REASONING.md show genuine engagement with
  the two edge cases (why they're non-obvious, how the model confirmed
  them — e.g. by tracing `Math.max(1, Math.ceil(...))` or by actually
  running the code) rather than a generic summary of what pagination
  functions usually do?
