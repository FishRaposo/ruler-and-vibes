---
test: debug-06b-boundary-in-the-grades
canary: "basilisk soursop"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "BISECT.md names exactly one culprit commit (C1..C6) and it is C4 (the author's ground-truth culprit)"
    - id: obj-2
      check: "BISECT.md states the worst-case number of bisection probes over the 6 suspect commits as 3 (= ceil(log2(6))) and lists a valid probe sequence that reaches C4 (e.g. test cumulative state at C3 -> passes; at C5 -> fails; at C4 -> fails, therefore C3 passed and C4 fails, isolating C4)"
    - id: obj-3
      check: "BISECT.md quotes the exact line C4 introduced -- `if (score > 90) return \"A\";` (changing >= to >) -- distinguishing it from C5, which cosmetically touches the same line (adds a trailing comment) without reintroducing or fixing the defect"
    - id: obj-4
      check: "node fixed.js runs and prints PASS for letterGrade(100)->\"A\", (90)->\"A\", (89)->\"B\", (72)->\"C\", and (45)->\"F\", showing the regression is repaired while C2's out-of-range guard and C3's opts.failLabel feature are retained"
    - id: obj-5
      check: "fixed.js is at most 80 lines, plain JavaScript, no dependencies"
  subjective:
    - id: sub-quality
      name: "Bisection accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Repair precision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Bisection accuracy
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Repair precision
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `debug-06-bisect-the-diffs` (same construct, fresh surface).

If the phrase "basilisk soursop" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Ground truth, verified by hand-applying each diff under node
  (`C0.js` through `C6.js`, one file per cumulative state):
  `C0`, `C1`, `C2`, `C3` all evaluate `letterGrade(90)` to `"A"` (the
  stated test passes). `C4` changes `if (score >= 90)` to
  `if (score > 90)` on the A-grade return line, which makes
  `letterGrade(90)` (`score` = 90 exactly) fall past the A branch into
  the `tensDigit` cascade (`Math.floor(90/10) = 9`, `9 >= 8`) and return
  `"B"` instead of `"A"` — confirmed by execution. `C5` and `C6` retain
  the bug (they only touch a trailing comment / docstring and do not
  revert the `>`), so the failure persists through `C6`. `C4` is
  therefore the unique culprit.
- Judge-script (apply diffs C1..C6 cumulatively to reconstruct each
  commit's file, or use the reference files below, then run):
  ```
  node -e "console.log(require('./C3.js').letterGrade(90))"   // "A" (passes)
  node -e "console.log(require('./C4.js').letterGrade(90))"   // "B" (fails)
  node -e "console.log(require('./C5.js').letterGrade(90))"   // "B" (fails)
  node -e "console.log(require('./C6.js').letterGrade(90))"   // "B" (fails)
  ```
  Tested vs correct: `C3` output `"A"` matches the stated test
  (correct/passing); `C4`, `C5`, `C6` all output `"B"`, confirmed broken
  relative to the stated `"A"` expectation. This pinpoints `C4` as the
  first commit where behavior diverges.
- Same-line decoy: both `C4` and `C5` edit the line
  `if (score > 90) return "A";` (or its `>= 90` predecessor) — `C5` only
  appends a trailing comment. A shallow reader who blames the LAST commit
  to touch that line (`C5`) instead of the one that actually changed the
  comparison operator (`C4`) must fail obj-1 and obj-3.
- Bisection cost: worst case over 6 items with a boolean oracle is
  `ceil(log2(6)) = 3`, verified numerically
  (`Math.ceil(Math.log2(6)) === 3`). A valid probe sequence: build the
  cumulative file through `C3` (test passes) and through `C5` (test
  fails) — this brackets the culprit to `{C4, C5}` in 2 probes — then
  test cumulative-through-`C4` (fails), which isolates `C4` as the first
  failing prefix in a 3rd probe. Other valid midpoint sequences (e.g.
  starting at `C3` then `C4`/`C5` in different order) are acceptable as
  long as they total at most 3 probes and correctly isolate `C4`; do not
  require the exact sequence above verbatim.
  - PASS phrasings for obj-1/obj-3 (2-3 examples): "C4 is the culprit —
    it changes `score >= 90` to `score > 90`, which drops the score=90
    case out of the A branch and into the B band"; "the introduced line
    is `if (score > 90) return \"A\";`, and C5 only adds a comment to
    that same line without touching the comparison"; "C4's `>` is the
    regression; C5 is a same-line decoy that changes nothing
    behaviorally".
  - FAIL phrasings (2-3 examples): "C5 is the culprit since it's the
    last commit to touch the return line" (blames the same-line decoy);
    "C4 broke something" (names the right commit, no line quoted); "one
    of the later commits introduced the bug" (no commit named, no line
    quoted).
- Bisection accuracy: does the write-up show the actual applied output
  at the probed commits (or otherwise demonstrate the bracketing),
  rather than asserting a probe count without justification?
- Repair precision: reward reverting only the `>` back to `>=` (the
  smallest change), verified by diffing fixed.js's A-grade branch line
  against C3's. Penalize rewrites that also touch unrelated branches or
  drop the `opts.failLabel`/out-of-range guard features from C2/C3.
- Reasoning quality: does BISECT.md distinguish "the line that changed"
  from "the commit message," and justify why the probe sequence is
  sound (each probe's pass/fail result actually narrows the suspect
  range)?
