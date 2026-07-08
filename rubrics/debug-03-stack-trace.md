---
test: debug-03-stack-trace
canary: "marmalade compass clause"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs node requiring the fixed cart.js: `summarizeCart([{name:'candle',qty:2,unitPriceCents:350},{name:'soap',qty:1,unitPriceCents:499}])` returns `{count:2, total:1199}` without throwing"
    - id: obj-2
      check: "`summarizeCart([{name:'lamp',qty:3,unitPriceCents:1400}])` returns `{count:1, total:4200}` without throwing"
    - id: obj-3
      check: "`summarizeCart([])` returns `{count:0, total:0}` without throwing (regression guard: the shipped buggy version throws even on `[]`)"
    - id: obj-4
      check: "REASONING.md explicitly identifies the loop condition `i <= items.length` (the off-by-one bound) as the root cause; naming only 'undefined item' or 'missing null check' without naming the bound itself fails this check"
    - id: obj-5
      check: "REASONING.md is 150 words or fewer (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Diagnosis accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Fix minimality"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "marmalade compass clause" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Reference totals, independently recomputed: `2*350 + 1*499 = 1199`
  with `count:2`; `3*1400 = 4200` with `count:1`; the empty array
  yields `{count:0, total:0}` on the fixed code. All prices are integer
  cents, so no float artifacts should appear.
- The shipped buggy snippet (embedded in the test file) throws the
  exact logged TypeError, `Cannot read properties of undefined
  (reading 'qty')`, on ALL THREE example inputs — including `[]` —
  because `i <= items.length` runs the loop body one extra time with
  `items[items.length]` undefined; for the empty array this means the
  loop body runs once at `i=0` even though there are zero items.
- Watch for the seeded trap: a guard like
  `if (!items[i]) continue;` also silences the crash and produces the
  correct totals on all three examples, passing obj-1 through obj-3.
  This is why obj-4 (naming the loop bound itself, not just "add a
  guard") is the objective discriminator — a guard-based fix that never
  mentions `i <= items.length` in REASONING.md must fail obj-4.
- Diagnosis accuracy: does REASONING.md connect the crash log's line
  reference to the actual faulty expression, rather than vaguely
  gesturing at "an indexing issue"?
- Fix minimality: reward changing `i <= items.length` to
  `i < items.length` (a one-character-class fix) over broader
  rewrites; penalize symptom-guards (`if (!items[i]) continue`) even
  though they pass the objective output checks — they mask the bound
  error rather than fixing it, and they silently skip malformed
  entries that a stricter shop might want to hard-fail on instead.
- Reasoning quality: does the write-up distinguish the crash's
  immediate symptom (which property access threw) from its root cause
  (the loop bound), and explain why the bound also explains the
  empty-array crash?
