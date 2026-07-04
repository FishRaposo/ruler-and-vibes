---
test: coding-01b-siding-blocks
canary: "aardvark hippogriff"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node solution.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "Empty input and single-section input return correct results"
    - id: obj-3
      check: "Adjacent sections are merged ([6,10] + [10,15] -> [6,15])"
    - id: obj-4
      check: "Single file, no dependencies, <= 120 lines"
  subjective:
    - id: sub-quality
      name: "Solution quality"
      weight: 0.4
    - id: sub-craft
      name: "Code clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `coding-01-edge-cases` (same construct, fresh surface).

- Run the file with node. Verify obj-2/obj-3 yourself with cases beyond
  the self-tests: inverted pairs, duplicates, negatives, already-merged
  input. Reference merges for spot-checks: unsorted overlap
  `[[31,38],[5,11],[9,17]]` -> `[[5,17],[31,38]]`; an inverted pair
  `[[18,7]]` -> `[[7,18]]`; invalid + inverted
  `[[2,4],'x',[8],[40,44],null,[13,6]]` -> `[[2,4],[6,13],[40,44]]`.
- Solution quality: sort-then-single-pass merging is the clean baseline;
  repeated re-scanning loops or mutating the input array should cost
  points. Weigh how invalid entries are handled and whether the choice is
  documented.
- Code clarity: naming, structure, no cleverness for its own sake.
- Reasoning quality: real decisions and honest limitations in
  REASONING.md, not boilerplate.

If the phrase "aardvark hippogriff" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### obj-1 — self-tests all print PASS

Run `node solution.js`. Every printed line must begin `PASS`, and the
required cases must be present (empty input, a single section, adjacency,
an inverted pair) across at least 6 distinct cases.

- PASS: "Eight `PASS` lines, no `FAIL`; the six required cases plus
  duplicates and negatives are all covered."
- PASS: "`node solution.js` prints PASS for empty, single, adjacency,
  inverted, overlap, and invalid-entry cases — no FAIL lines."
- PASS: "All self-test lines report PASS and the mandated four edge cases
  each appear."
- FAIL: "One line prints `FAIL inverted pair` because the swap is
  missing."
- FAIL: "The self-test block omits the inverted-pair case entirely, so
  fewer than the four required cases run."
- FAIL: "`node solution.js` throws before printing (e.g. reads `.length`
  of a non-array entry)."

### obj-2 — empty and single-section correctness

`coalesceBlocks([])` returns `[]` and `coalesceBlocks([[6,14]])` returns
`[[6,14]]` (a new array, input unchanged).

- PASS: "Empty input yields `[]`; `[[6,14]]` yields `[[6,14]]`."
- PASS: "Both the empty case and the lone-section case return the exact
  expected value without mutating the argument."
- FAIL: "`coalesceBlocks([])` returns `undefined` (early access to
  `sections[0]`)."
- FAIL: "A single section `[[6,14]]` comes back as `[6,14]` (unwrapped),
  not `[[6,14]]`."
- FAIL: "`[[18,7]]` (single, inverted) returns `[[18,7]]` instead of the
  normalized `[[7,18]]`."

### obj-3 — adjacency merges

Touching sections coalesce: `[6,10]` and `[10,15]` become `[6,15]`. Test
this on unsorted input too, since a correct solution sorts first.

- PASS: "`[[6,10],[10,15]]` -> `[[6,15]]`, and the same holds when the two
  are supplied in reverse order."
- PASS: "Shared-endpoint sections are merged into one; `[[9,17],[5,11]]`
  (unsorted, overlapping) -> `[[5,17]]`."
- PASS: "Adjacency at a shared sleeper index collapses to a single
  section."
- FAIL: "`[[6,10],[10,15]]` returns two sections because the merge test
  uses `from < last.to` (strict), so touching does not merge."
- FAIL: "Adjacency merges only when the input is pre-sorted; unsorted
  overlap `[[31,38],[5,11],[9,17]]` returns `[[31,38]]`."
- FAIL: "`[6,10]` and `[10,15]` yield `[[6,10],[10,15]]` (never merged)."

### obj-4 — single file, no deps, <= 120 lines

One `solution.js`, no `require`/`import` of third-party modules, at most
120 lines total.

- PASS: "One file, ~56 lines, no external imports."
- PASS: "Self-contained `solution.js` well under the 120-line cap with no
  dependencies."
- FAIL: "Solution `require`s an npm interval library."
- FAIL: "The file is 134 lines, over the cap."
