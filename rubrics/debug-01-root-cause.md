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
---

## Judge guidance

- Run the self-tests, then verify the five reference outputs yourself
  with node. Probe extra cases: an empty items array, wrap on multiple
  items, a subtotal of exactly 200.
- Root-cause depth: a good diagnosis follows the splinter-trace — from
  the visible symptom back to the exact faulty expression — rather than
  describing what the new code does. Penalize diagnoses that only
  restate the fix.
- Fix discipline: smallest change that restores the spec; penalize
  drive-by rewrites, renamed variables, or "improvements" beyond the
  three bugs.
- Reasoning quality: does REASONING.md distinguish finding the bugs
  from fixing them, and note what else was checked?
