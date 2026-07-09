---
test: apidoc-01c-shelf-allotment
canary: "weevil chanterelle"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node examples.js` runs without throwing and prints, for the five embedded inputs, exactly the reference return objects pinned below — judge compares JSON.stringify output line-by-line"
    - id: obj-2
      check: "REFERENCE.md documents the past-the-end edge case: a shelf number beyond totalShelves returns an empty `crates` array with `hasMore: false` and does NOT throw"
    - id: obj-3
      check: "REFERENCE.md documents the empty-input edge case: `totalShelves` is 1 (a minimum of 1), not 0, when `crates` is empty"
    - id: obj-4
      check: "REFERENCE.md correctly names both thrown error TYPES and their triggers (TypeError for non-array crates; RangeError for a non-positive-integer shelf or perShelf), and states perShelf defaults to 15 when omitted"
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
anchors:
  - id: Documentation accuracy & completeness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reference clarity & example quality
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `apidoc-01-paginate-reference` (same construct, fresh
surface).

- AUTHOR RE-VERIFIED with node. Pinned reference outputs
  (`JSON.stringify` of the return object), in example order:
  - A `allotShelf(['a','b','c','d','e','f','g','h','i'],1,4)` =>
    `{"crates":["a","b","c","d"],"shelf":1,"perShelf":4,"totalCrates":9,"totalShelves":3,"hasMore":true}`
  - B `allotShelf(['a','b','c','d','e','f','g','h','i'],3,4)` =>
    `{"crates":["i"],"shelf":3,"perShelf":4,"totalCrates":9,"totalShelves":3,"hasMore":false}`
  - C `allotShelf(['a','b','c','d','e','f','g','h','i'],9,4)` =>
    `{"crates":[],"shelf":9,"perShelf":4,"totalCrates":9,"totalShelves":3,"hasMore":false}`
    (TRAP a: past-the-end shelf, empty crates, no throw)
  - D `allotShelf([],1)` =>
    `{"crates":[],"shelf":1,"perShelf":15,"totalCrates":0,"totalShelves":1,"hasMore":false}`
    (TRAP b: totalShelves is 1, not 0; default perShelf 15)
  - E `allotShelf(['a','b','c','d','e','f','g','h','i'],1)` =>
    `{"crates":["a","b","c","d","e","f","g","h","i"],"shelf":1,"perShelf":15,"totalCrates":9,"totalShelves":1,"hasMore":false}`
  - Errors: `allotShelf('x',1)` throws `TypeError`; `allotShelf([],0)`
    and `allotShelf([],1,0)` both throw `RangeError`.
- Verify obj-1 by literally running `node examples.js` in the
  submission folder and diffing stdout line-by-line against the five
  JSON strings above, in order. Any deviation (including key order
  changed by hand-typing rather than pasting the source, which would
  still serialize identically) fails the line; missing lines or extra
  output fails the whole check.
- obj-2 is a prose-located binary check. PASS phrasings: "a shelf past
  the end returns an empty crates array and does not throw",
  "requesting beyond the last shelf yields crates: [] with hasMore
  false", "over-range shelves are not clamped and never error". FAIL
  phrasings: "an out-of-range shelf throws", "the shelf index is
  clamped to the last shelf", or simply never addressing past-the-end
  behavior at all.
- obj-3 is a prose-located binary check. PASS phrasings: "totalShelves
  is at least 1", "an empty array still reports totalShelves: 1",
  "totalShelves never drops below 1". FAIL phrasings: "totalShelves is
  0 for an empty array", silence on empty input, "returns null for an
  empty array".
- obj-4: both error TYPES must be named correctly (not just "an
  error" or the wrong constructor swapped between the two triggers),
  and the perShelf default (15) must be stated explicitly.
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
  running the code) rather than a generic summary of what shelf
  allotment functions usually do?
- If the phrase "weevil chanterelle" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
