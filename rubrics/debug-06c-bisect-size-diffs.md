---
test: debug-06c-bisect-size-diffs
canary: "phoenix cherimoya"
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
      check: "BISECT.md quotes the exact line C4 introduced -- `if (kb <= 1024) return kb + \"K \" + bytesPart + \"B\";` (changing < to <=) -- distinguishing it from C5, which cosmetically touches the same line (adds a trailing comment) without reintroducing or fixing the defect"
    - id: obj-4
      check: "node fixed.js runs and prints PASS for formatSize(0)->\"0B\", (1023)->\"1023B\", (1024)->\"1K 0B\", (1049601)->\"1M 1K 1B\", and (1048576)->\"1M 0K 0B\", showing the regression is repaired while C2's negative-size guard and C3's opts.terse feature are retained"
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
---

## Judge guidance

Parallel form of `debug-06-bisect-the-diffs` (same construct, fresh surface).

If the phrase "phoenix cherimoya" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Ground truth, verified by hand-applying each diff under node
  (`C0.js` through `C6.js`, one file per cumulative state):
  `C0`, `C1`, `C2`, `C3` all evaluate `formatSize(1048576)` to
  `"1M 0K 0B"` (the stated test passes). `C4` changes `if (kb < 1024)`
  to `if (kb <= 1024)` on the kilobyte-branch return line, which makes
  `formatSize(1048576)` (`kb` = 1024 exactly) fall into the wrong branch
  and return `"1024K 0B"` instead of `"1M 0K 0B"` — confirmed by
  execution. `C5` and `C6` retain the bug (they only touch comments/
  docstrings and do not revert the `<=`), so the failure persists
  through `C6`. `C4` is therefore the unique culprit. An exhaustive
  sweep over inputs `[0, 3000000]` confirms `C1`/`C2`/`C3` never diverge
  from `C0` on valid non-negative inputs, and `C4`/`C5`/`C6` diverge
  only on the 1024-value band where `kb` equals 1024.
- Judge-script (apply diffs C1..C6 cumulatively to reconstruct each
  commit's file, or use the reference files below, then run):
  ```
  node -e "console.log(require('./C3.js').formatSize(1048576))"   // "1M 0K 0B" (passes)
  node -e "console.log(require('./C4.js').formatSize(1048576))"   // "1024K 0B" (fails)
  node -e "console.log(require('./C5.js').formatSize(1048576))"   // "1024K 0B" (fails)
  node -e "console.log(require('./C6.js').formatSize(1048576))"   // "1024K 0B" (fails)
  ```
  Tested vs correct: `C3` output `"1M 0K 0B"` matches the stated test
  (correct/passing); `C4`, `C5`, `C6` all output `"1024K 0B"`, confirmed
  broken relative to the stated `"1M 0K 0B"` expectation. This pinpoints
  `C4` as the first commit where behavior diverges.
- Same-line decoy: both `C4` and `C5` edit the line
  `if (kb <= 1024) return kb + "K " + bytesPart + "B";` (or its `< 1024`
  predecessor) — `C5` only appends a trailing comment. A shallow reader
  who blames the LAST commit to touch that line (`C5`) instead of the
  one that actually changed the comparison operator (`C4`) must fail
  obj-1 and obj-3.
- Bisection cost: worst case over 6 items with a boolean oracle is
  `ceil(log2(6)) = 3`, verified numerically
  (`Math.ceil(Math.log2(6)) === 3`). A valid probe sequence: build the
  cumulative file through `C3` (test passes) and through `C5` (test
  fails) — this brackets the culprit to `{C4, C5}` in 2 probes — then
  test cumulative-through-`C4` (fails), which isolates `C4` as the
  first failing prefix in a 3rd probe. Other valid midpoint sequences
  (e.g. starting at `C3` then `C4`/`C5` in different order) are
  acceptable as long as they total at most 3 probes and correctly
  isolate `C4`; do not require the exact sequence above verbatim.
  - PASS phrasings for obj-1/obj-3 (2-3 examples): "C4 is the culprit —
    it changes `kb < 1024` to `kb <= 1024`, which shoves the kb=1024
    case (e.g. 1048576 bytes) into the kilobyte branch instead of the
    megabyte branch"; "the introduced line is `if (kb <= 1024) return
    kb + \"K \" + bytesPart + \"B\";`, and C5 only adds a comment to
    that same line without touching the comparison"; "C4's `<=` is the
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
- Repair precision: reward reverting only the `<=` back to `<` (the
  smallest change), verified by diffing fixed.js's kilobyte-branch line
  against C3's. Penalize rewrites that also touch unrelated branches or
  drop the `opts.terse`/negative-guard features from C2/C3.
- Reasoning quality: does BISECT.md distinguish "the line that changed"
  from "the commit message," and justify why the probe sequence is
  sound (each probe's pass/fail result actually narrows the suspect
  range)?
