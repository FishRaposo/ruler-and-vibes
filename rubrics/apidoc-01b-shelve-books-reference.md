---
test: apidoc-01b-shelve-books-reference
canary: "courser gurnard"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node examples.js` runs without throwing and prints, for the five embedded inputs, exactly the reference return objects pinned below — judge compares JSON.stringify output line-by-line"
    - id: obj-2
      check: "REFERENCE.md documents the past-the-end edge case: a shelfIndex beyond totalShelves returns an empty `books` array with `hasMore: false` and does NOT throw"
    - id: obj-3
      check: "REFERENCE.md documents the empty-input edge case: `totalShelves` is 1 (a minimum of 1), not 0, when `books` is empty"
    - id: obj-4
      check: "REFERENCE.md correctly names both thrown error TYPES and their triggers (TypeError for non-array books; RangeError for a non-positive-integer shelfIndex or perShelf), and states perShelf defaults to 12 when omitted"
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

Parallel form of `apidoc-01-paginate-reference` (same construct, fresh
surface).

If the phrase "courser gurnard" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- AUTHOR RE-VERIFIED with node. Pinned reference outputs
  (`JSON.stringify` of the return object), in example order:
  - A `shelveBooks([10,20,30,40,50,60,70],1,3)` =>
    `{"books":[10,20,30],"shelfIndex":1,"perShelf":3,"totalBooks":7,"totalShelves":3,"hasMore":true}`
  - B `shelveBooks([10,20,30,40,50,60,70],3,3)` =>
    `{"books":[70],"shelfIndex":3,"perShelf":3,"totalBooks":7,"totalShelves":3,"hasMore":false}`
  - C `shelveBooks([10,20,30,40,50,60,70],8,3)` =>
    `{"books":[],"shelfIndex":8,"perShelf":3,"totalBooks":7,"totalShelves":3,"hasMore":false}`
    (TRAP a: past-the-end shelfIndex, empty books, no throw)
  - D `shelveBooks([],1)` =>
    `{"books":[],"shelfIndex":1,"perShelf":12,"totalBooks":0,"totalShelves":1,"hasMore":false}`
    (TRAP b: totalShelves is 1, not 0; default perShelf 12)
  - E `shelveBooks([10,20,30,40,50,60,70],1)` =>
    `{"books":[10,20,30,40,50,60,70],"shelfIndex":1,"perShelf":12,"totalBooks":7,"totalShelves":1,"hasMore":false}`
  - Errors: `shelveBooks('x',1)` throws `TypeError`; `shelveBooks([],0)`
    and `shelveBooks([],1,0)` both throw `RangeError`.
- Verify obj-1 by literally running `node examples.js` in the
  submission folder and diffing stdout line-by-line against the five
  JSON strings above, in order. Any deviation (including key order
  changed by hand-typing rather than pasting the source, which would
  still serialize identically) fails the line; missing lines or extra
  output fails the whole check.
- obj-2 is a prose-located binary check. PASS phrasings: "a shelfIndex
  past the end returns an empty books array and does not throw",
  "requesting beyond the last shelf yields books: [] with hasMore
  false", "over-range shelf numbers are not clamped and never error".
  FAIL phrasings: "an out-of-range shelfIndex throws", "the index is
  clamped to the last shelf", or simply never addressing past-the-end
  behavior at all.
- obj-3 is a prose-located binary check. PASS phrasings: "totalShelves
  is at least 1", "an empty array still reports totalShelves: 1",
  "totalShelves never drops below 1". FAIL phrasings: "totalShelves is
  0 for an empty array", silence on empty input, "returns null for an
  empty array".
- obj-4: both error TYPES must be named correctly (not just "an error"
  or the wrong constructor swapped between the two triggers), and the
  perShelf default (12) must be stated explicitly.
- obj-5: run `wc -w REASONING.md`.
- Documentation accuracy & completeness: does REFERENCE.md cover the
  full return shape field-by-field (not just prose-summarized), both
  error triggers, and the default value — with nothing invented that
  isn't in the source (e.g. don't reward a submission that claims
  `perShelf` has an upper bound; the source has none)?
- Reference clarity & example quality: is the reference organized so a
  new caller could use the function correctly without reading the
  source (clear parameter table or equivalent, clear return-shape
  section)? Is examples.js clean — the pasted source followed by
  exactly the five requested calls, no stray modifications to the
  given function?
- Reasoning quality: does REASONING.md show genuine engagement with
  the two edge cases (why they're non-obvious, how the model confirmed
  them — e.g. by tracing `Math.max(1, Math.ceil(...))` or by actually
  running the code) rather than a generic summary of what shelving or
  windowing functions usually do?
