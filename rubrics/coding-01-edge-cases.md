---
test: coding-01-edge-cases
canary: "sentinel sweep"
canary_aliases: ["sentinel passes", "sweep of sentinels"]
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
anchors:
  - id: Solution quality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Code clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

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
