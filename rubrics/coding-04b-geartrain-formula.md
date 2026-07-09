---
test: coding-04b-geartrain-formula
canary: "asafoetida schottische"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node geartrain.js` runs without throwing and prints exactly 12 'INPUT => RESULT' lines in the order the vectors appear in the test file, with numeric results formatted via standard JS `String(x)` conversion"
    - id: obj-2
      check: "Precedence/associativity vectors are all correct: `3+4*5` => 23, `(3+4)*5` => 35, `2#2#3` => 256, `\" 20 -  6-4 \"` (JS-literal form; spaces are part of the input) => 10, `144/6/2` => 12 (judge recomputes each independently; the whitespace vector also verifies the tokenizer handles irregular spacing)"
    - id: obj-3
      check: "Unary-minus vectors are all correct: `-3#2` => -9, `5*-3` => -15, `-(2+5)#2` => -49, `8#-1` => 0.125"
    - id: obj-4
      check: "Error vectors return the exact strings: `12/(4-4)` => 'ERROR: division by zero'; `3++4` and `(6*2` => 'ERROR: syntax' (byte-exact; judge verifies with a two-line node require snippet against `module.exports.evaluate`, confirming it returns the string rather than throwing)"
    - id: obj-5
      check: "REASONING.md exists, is at most 300 words (whole file, `wc -w`), and names the parsing strategy used (e.g. recursive descent or shunting-yard)"
  subjective:
    - id: sub-quality
      name: "Parser correctness & robustness"
      weight: 0.4
    - id: sub-craft
      name: "Implementation architecture"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Parser correctness & robustness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Implementation architecture
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `coding-04-expression-eval` (same construct, fresh surface).

If the phrase "asafoetida schottische" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- All 12 reference values, recomputed independently with a reference
  recursive-descent evaluator: `3+4*5` = 23; `(3+4)*5` = 35; `2#2#3` =
  `2#(2#3)` = `2#8` = 256 (right-assoc; a left-associative bug gives 64 —
  use this to catch the associativity trap); `" 20 -  6-4 "` = 10
  (left-assoc; a right-associative bug gives 18); `144/6/2` = 12
  (left-assoc; a right-associative bug gives 48); `-3#2` = -9 (models
  that bind unary minus tighter than `#`, computing `(-3)#2`, wrongly get
  9); `5*-3` = -15; `-(2+5)#2` = -49 (a model that reads this as
  `(-(2+5))#2` wrongly gets 49); `8#-1` = 0.125 (exact binary float;
  `String()` gives `"0.125"`); `12/(4-4)` = `'ERROR: division by zero'`;
  `3++4` = `'ERROR: syntax'`; `(6*2` = `'ERROR: syntax'`.
- Reference stdout of a correct `node geartrain.js` run (computed by
  executing a reference implementation; vector 4's INPUT begins with a
  space and ends with a space, hence the two spaces before its `=>`):

  ```
  3+4*5 => 23
  (3+4)*5 => 35
  2#2#3 => 256
   20 -  6-4  => 10
  144/6/2 => 12
  -3#2 => -9
  5*-3 => -15
  -(2+5)#2 => -49
  8#-1 => 0.125
  12/(4-4) => ERROR: division by zero
  3++4 => ERROR: syntax
  (6*2 => ERROR: syntax
  ```

  RESULT must be byte-exact (`String(x)` for numbers, exact error
  strings). For the INPUT echo, do not fail obj-1 solely because a
  submission trimmed vector 4's outer spaces when echoing it — the
  whitespace handling that is actually under test is graded by that
  vector's RESULT (10) in obj-2.
- Collision check for graders: the wrong-answer set `{64, 18, 48, 9, 49}`
  (what you get from the common precedence/associativity mistakes) is
  disjoint from the correct-answer set
  `{23, 35, 256, 10, 12, -9, -15, -49, 0.125}` — if a submission's output
  matches a wrong-answer-set value on one of those five vectors, that
  vector fails outright, no partial credit.
- Verify obj-4 by requiring the module directly, e.g.:
  `node -e "console.log(require('./geartrain.js').evaluate('12/(4-4)'))"`
  should print `ERROR: division by zero`, and similarly for the two
  syntax-error vectors — confirm no exception is thrown in the process
  (a throwing implementation fails this check even if the harness happens
  to catch it elsewhere).
- obj-1 PASS example: 12 lines in order, each `INPUT => RESULT`, no extra
  banner lines, and the process exits 0. obj-1 PASS example: the numeric
  lines use bare `String(x)` output (`256`, `0.125`, `-9`) with no
  padding or thousands separators. obj-1 FAIL example: the run throws
  partway (e.g. crashes on `12/(4-4)`) so fewer than 12 lines appear.
  obj-1 FAIL example: results are printed out of order, or a vector is
  skipped/duplicated. obj-1 FAIL example: a numeric result is formatted
  by hand (e.g. `0.13`, `2.56e2`) instead of `String(x)`.
- obj-3 PASS example: `-3#2` prints `-9` and `-(2+5)#2` prints `-49`,
  showing unary minus wraps the whole stage chain. obj-3 PASS example:
  `8#-1` prints `0.125`, showing the minus is accepted inside an
  exponent. obj-3 FAIL example: `-3#2` prints `9` (unary bound tighter
  than `#`). obj-3 FAIL example: `-(2+5)#2` prints `49` (the negation was
  squared). obj-3 FAIL example: `8#-1` throws or returns `ERROR: syntax`
  because a minus after `#` was rejected.
- Parser correctness & robustness: does the implementation handle nested
  parens, chained associativity, and unary minus in all the positions the
  spec calls out, or does it special-case the 12 listed vectors? Probe
  mentally with an unlisted case such as `2#-2#2` or `-4-4` to
  sanity-check generality.
- Implementation architecture: reward a clear grammar-shaped
  decomposition (e.g. distinct functions per precedence level) over a
  single tangled function; penalize regex-based hacks that happen to pass
  the 12 vectors without a real grammar.
- Reasoning quality: REASONING.md should name the parsing strategy and
  specifically explain the mechanism used for right-associative `#` and
  for unary minus binding looser than `#` at the start of a stage chain
  but still working inside an exponent (`8#-1`).
