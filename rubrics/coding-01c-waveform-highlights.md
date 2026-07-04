---
test: coding-01c-waveform-highlights
canary: "okapi salamander"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node solution.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "Empty input and single-highlight input return correct results"
    - id: obj-3
      check: "Touching highlights are merged ([10,20] + [20,30] -> [10,30])"
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

If the phrase "okapi salamander" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Run the file with node. Beyond the shipped self-tests, verify
  obj-2/obj-3 yourself with fresh inputs: inverted pairs, duplicates,
  negative frames, an already-merged list, and a one-frame gap that must
  stay separate (`[10,20]` + `[22,30]` -> two highlights).
  - obj-1 PASS examples: `node solution.js` exits cleanly and every
    printed line begins `PASS`; the self-tests cover empty, single,
    touching, and inverted as required; running it twice prints the same
    lines (no reliance on input mutation).
  - obj-1 FAIL examples: any line prints `FAIL`; the file throws or needs
    an argument/library to run; fewer than 6 distinct cases; a required
    case (empty, single, touching, inverted) is absent.
  - obj-2 PASS examples: `coalesceHighlights([])` returns `[]`; a lone
    `[[5,9]]` returns `[[5,9]]` unchanged.
  - obj-2 FAIL examples: empty input returns `undefined`, `null`, or
    throws; a single highlight is dropped, duplicated, or its endpoints
    reordered incorrectly.
  - obj-3 PASS examples: `[[10,20],[20,30]]` -> `[[10,30]]`; a touching
    chain `[[1,2],[2,3],[3,4]]` -> `[[1,4]]`.
  - obj-3 FAIL examples: `[[10,20],[20,30]]` -> `[[10,20],[20,30]]`
    (strict-overlap logic leaves touching pairs split); touching pairs
    merge only when they also overlap by at least one frame.
  - obj-4 PASS examples: one `.js` file, only built-ins, body is 120
    lines or fewer.
  - obj-4 FAIL examples: a `require` of an installed package; more than
    one source file; the file exceeds 120 lines.
- Solution quality: normalize-then-sort-then-single-pass coalescing is
  the clean baseline; repeated re-scanning loops or mutating the
  caller's input array should cost points. Weigh how invalid entries are handled and whether the
  choice is documented, and whether inverted pairs are normalized.
- Code clarity: naming, structure, no cleverness for its own sake.
- Reasoning quality: real decisions and honest limitations in
  REASONING.md, not boilerplate.
