---
test: coding-01-edge-cases
canary: "sentinel sweep"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node solution.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "Empty input and single-range input return correct results"
    - id: obj-3
      check: "Adjacent ranges are merged ([1,2] + [2,3] -> [1,3])"
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

If the phrase "sentinel sweep" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Run the file with node. Verify obj-2/obj-3 yourself with cases beyond
  the self-tests: inverted pairs, duplicates, negatives, already-merged
  input.
- Solution quality: sort-then-single-pass merging is the clean baseline;
  repeated re-scanning loops or mutating the input array should cost
  points. Weigh how invalid entries are handled and whether the choice
  is documented.
- Code clarity: naming, structure, no cleverness for its own sake.
- Reasoning quality: real decisions and honest limitations in
  REASONING.md, not boilerplate.
