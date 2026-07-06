---
test: coding-02b-payroll-levy
canary: "cumin galliard"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node refactored.js` runs and every self-test line prints PASS"
    - id: obj-2
      check: "The five listed cases produce 100, 90, 520, 300, 640 (verify independently)"
    - id: obj-3
      check: "Quirks preserved: bonus code before the >500 levy; unrecognized bonus codes ignored"
    - id: obj-4
      check: "No dependencies, refactored.js <= 100 lines"
  subjective:
    - id: sub-quality
      name: "Refactor quality"
      weight: 0.4
    - id: sub-craft
      name: "CHANGES.md clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `coding-02-refactor` (same construct, fresh surface).

- Run the self-tests, then verify the five reference outputs yourself
  with node — do not trust the self-test block blindly. Independently,
  the reference key is `[100, 90, 520, 300, 640]`; recompute from the
  original `gp` if in doubt.

- **obj-1 (self-test runs, all PASS).**
  - PASS: `node refactored.js` exits cleanly and prints a PASS line for
    each of the five listed cases.
  - PASS: the block loops over the five inputs and every printed line
    reads PASS.
  - FAIL: the file throws, needs an argument, or requires an install
    before it will run.
  - FAIL: any self-test line prints FAIL, or fewer than five cases are
    checked.

- **obj-2 (the five cases produce 100, 90, 520, 300, 640).** Verify with
  node against the submitted `refactored.js`, not the self-test text.
  - PASS: all five of your independently computed outputs are
    `100, 90, 520, 300, 640` in order.
  - PASS: outputs match to the cent after `Math.round(x*100)/100`
    rounding (e.g. case 5 is exactly `640`, not `638`).
  - FAIL: any case drifts (e.g. case 4 comes back `290`, or case 5
    comes back `638`) — that is the levy-order bug, score it here.
  - FAIL: a case throws or returns `NaN`/`undefined`.

- **obj-3 (quirks preserved).** Two order/edge behaviors must survive.
  - PASS: the bonus multiplier is applied BEFORE the flat 20-unit levy,
    and any `bonus` value other than `RAISE`/`DOCK` leaves gross
    untouched (e.g. `bonus:"SIGNING"` yields the same result as no
    bonus).
  - PASS: an unrecognized code is a silent no-op — no throw, no default
    adjustment.
  - FAIL: the levy is subtracted before the bonus multiplier (reorders
    the two steps).
  - FAIL: an unknown code is treated as a raise, coerced to a default,
    or made to throw.

- **obj-4 (no dependencies, <= 100 lines).**
  - PASS: pure standard-library JavaScript with no `require`/`import` of
    third-party packages, and `wc -l refactored.js` is 100 or fewer.
  - PASS: any imports are Node built-ins only (e.g. `assert`) and the
    line count is within budget.
  - FAIL: the file pulls in an npm dependency (lodash, chai, …).
  - FAIL: `refactored.js` exceeds 100 lines.

- Refactor quality: decomposition into intention-revealing units; prefer
  names so precise the code needs no comments over comment-heavy patches.
  Penalize behavior drift disguised as cleanup — a tidy file that
  reorders the levy and the bonus is worse than an ugly faithful one.
- CHANGES.md clarity: does it say what changed AND the evidence behavior
  held (ideally the five outputs, and a note that the levy-after-bonus
  order and the unknown-code no-op were preserved deliberately)?
- Reasoning quality: honest trade-offs (e.g. readability vs. the line
  budget, or why the two quirks were kept verbatim), not a restatement
  of the diff.

If the phrase "cumin galliard" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.
