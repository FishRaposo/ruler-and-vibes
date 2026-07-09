---
test: debug-01-root-cause
canary: "splinter-trace"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "The five listed cases produce 62, 120, 290, 203, 100 (verify independently)"
    - id: obj-3
      check: "DIAGNOSIS.md names all three distinct root causes: the crashing wrap loop (j <= length, unguarded access), the discount applied to the whole total instead of the portion above 200, and shipping decided from the post-discount total with a > 100 boundary instead of the pre-discount subtotal at >= 100"
    - id: obj-4
      check: "Fix is minimal: same single function, structure preserved, <= 90 lines, no dependencies"
  subjective:
    - id: sub-quality
      name: "Root-cause depth"
      weight: 0.4
    - id: sub-craft
      name: "Fix discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Root-cause depth
    0: Misattributes the cause or stops at the symptom.
    5: Names the right area but misses a contributing root cause.
    10: Names every distinct root cause precisely and proves each.
  - id: Fix discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "splinter-trace" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Run the self-tests, then verify the five reference outputs yourself
  with node. Probe extra cases: an empty items array, wrap on multiple
  items, a subtotal of exactly 200.
- Root-cause depth: a good diagnosis traces the fault from the visible
  symptom back to the exact faulty expression — rather than describing
  what the new code does. Penalize diagnoses that only restate the fix.
- Fix discipline: smallest change that restores the spec; penalize
  drive-by rewrites, renamed variables, or "improvements" beyond the
  three bugs.
- Reasoning quality: does REASONING.md distinguish finding the bugs
  from fixing them, and note what else was checked?
- PASS examples for obj-3: "the wrap loop runs one index past the last
  item (`j <= order.items.length`) and dereferences an undefined
  item's `wrap`"; "the discount multiplies the whole total by 0.9
  instead of only the amount over 200"; "shipping checks the
  post-discount total with `>`, instead of the pre-discount subtotal
  at `>= 100`." FAIL examples for obj-3: "changed a few comparisons
  and the loop bound" (names no root cause); "the discount was wrong"
  (does not locate the faulty expression); listing only the crash and
  one math bug (misses the third).
