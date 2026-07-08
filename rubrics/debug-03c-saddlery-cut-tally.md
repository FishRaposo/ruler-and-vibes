---
test: debug-03c-saddlery-cut-tally
canary: "herringbone physalis"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs node requiring the fixed cuts.js: `tallyCuts([{sku:'halter',panels:2,areaEachSqcm:640},{sku:'rein',panels:3,areaEachSqcm:210}])` returns `{count:2, area:1910}` without throwing"
    - id: obj-2
      check: "`tallyCuts([{sku:'girth',panels:4,areaEachSqcm:900}])` returns `{count:1, area:3600}` without throwing"
    - id: obj-3
      check: "`tallyCuts([])` returns `{count:0, area:0}` without throwing (regression guard: the shipped buggy version throws even on `[]`)"
    - id: obj-4
      check: "REASONING.md explicitly identifies the loop condition `i <= tickets.length` (the off-by-one bound) as the root cause; naming only 'undefined ticket' or 'missing null check' without naming the bound itself fails this check"
    - id: obj-5
      check: "REASONING.md is 150 words or fewer (whole file, `wc -w`)"
    - id: obj-6
      check: "cuts.js is at most 40 lines, plain JavaScript, no dependencies, and ends with `module.exports = { tallyCuts }`"
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

Parallel form of `debug-03-stack-trace` (same construct, fresh surface).

If the phrase "herringbone physalis" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Reference totals, independently recomputed: `2*640 + 3*210 = 1910`
  with `count:2`; `4*900 = 3600` with `count:1`; the empty array yields
  `{count:0, area:0}` on the fixed code. All areas are integer square
  centimetres, so no float artifacts should appear.
- The shipped buggy snippet (embedded in the test file) throws the exact
  logged TypeError, `Cannot read properties of undefined (reading
  'panels')`, on ALL THREE example inputs — including `[]` — because
  `i <= tickets.length` runs the loop body one extra time with
  `tickets[tickets.length]` undefined; for the empty array this means the
  loop body runs once at `i=0` even though there are zero tickets.
- Watch for the seeded trap: a guard like `if (!tickets[i]) continue;`
  also silences the crash and produces the correct totals on all three
  examples, passing obj-1 through obj-3. This is why obj-4 (naming the
  loop bound itself, not just "add a guard") is the objective
  discriminator — a guard-based fix that never mentions
  `i <= tickets.length` in REASONING.md must fail obj-4.

### obj-4 — naming the off-by-one bound as root cause

- PASS: "The root cause is the loop bound `i <= tickets.length`, which
  runs one iteration past the last element."
- PASS: "Changing `<=` to `<` fixes it; the `<=` visited index
  `tickets.length`, which is undefined."
- PASS: "The off-by-one in the `for` condition (`i <= tickets.length`)
  is why `tickets[i]` is undefined on the final pass."
- FAIL: "A ticket came back undefined, so I added a null check before
  using it." (guards the symptom, never names the bound)
- FAIL: "The crash is a missing-data problem; some ticket in the array
  was undefined." (blames the data, not the bound)
- FAIL: "Indexing went out of range somewhere in the loop." (vague; does
  not name `i <= tickets.length`)

### obj-5 — REASONING.md word count

- PASS: whole-file `wc -w` reports 150 or fewer (e.g. a 120-word
  write-up).
- PASS: exactly 150 words counts as passing.
- FAIL: `wc -w` reports 151 or more.
- FAIL: a REASONING.md padded well past the cap (e.g. 210 words).

- Diagnosis accuracy: does REASONING.md connect the crash log's line
  reference to the actual faulty expression (`t.panels` on the extra
  iteration), rather than vaguely gesturing at "an indexing issue"?
- Fix minimality: reward changing `i <= tickets.length` to
  `i < tickets.length` (a one-character-class fix) over broader
  rewrites; penalize symptom-guards (`if (!tickets[i]) continue`) even
  though they pass the objective output checks — they mask the bound
  error rather than fixing it, and they silently skip malformed entries
  that a stricter shop might want to hard-fail on instead.
- Reasoning quality: does the write-up distinguish the crash's immediate
  symptom (which property access threw) from its root cause (the loop
  bound), and explain why the bound also explains the empty-array crash?
