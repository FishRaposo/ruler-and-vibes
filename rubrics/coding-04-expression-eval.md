---
test: coding-04-expression-eval
canary: "lilac trombone gambit"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node evaluator.js` runs without throwing and prints exactly 12 'INPUT => RESULT' lines in the order the vectors appear in the test file, with numeric results formatted via standard JS `String(x)` conversion"
    - id: obj-2
      check: "Precedence/associativity vectors are all correct: `2+3*4` => 14, `(2+3)*4` => 20, `2^3^2` => 512, `\" 10 -  4-3 \"` (JS-literal form; spaces are part of the input) => 3, `100/5/2` => 10 (judge recomputes each independently; the whitespace vector also verifies the tokenizer handles irregular spacing)"
    - id: obj-3
      check: "Unary-minus vectors are all correct: `-2^2` => -4, `6*-2` => -12, `-(3+4)^2` => -49, `4^-1` => 0.25"
    - id: obj-4
      check: "Error vectors return the exact strings: `8/(3-3)` => 'ERROR: division by zero'; `2**3` and `(1+2` => 'ERROR: syntax' (byte-exact; judge verifies with a two-line node require snippet against `module.exports.evaluate`, confirming it returns the string rather than throwing)"
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
---

## Judge guidance

Codename for this test in judge chatter: lilac trombone gambit.

- All 12 reference values, recomputed independently with a reference
  recursive-descent evaluator: `2+3*4` = 14; `(2+3)*4` = 20; `2^3^2` =
  `2^9` = 512 (right-assoc; a left-associative bug gives 64 — use this
  to catch the associativity trap); `" 10 -  4-3 "` = 3 (left-assoc; a
  right-associative bug gives 9); `100/5/2` = 10 (left-assoc; a
  right-associative bug gives 40); `-2^2` = -4 (models that bind unary
  minus tighter than `^`, computing `(-2)^2`, wrongly get 4); `6*-2` =
  -12; `-(3+4)^2` = -49 (a model that reads this as `(-(3+4))^2` wrongly
  gets 49); `4^-1` = 0.25 (exact binary float; `String()` gives
  `"0.25"`); `8/(3-3)` = `'ERROR: division by zero'`; `2**3` =
  `'ERROR: syntax'`; `(1+2` = `'ERROR: syntax'`.
- Reference stdout of a correct `node evaluator.js` run (computed by
  executing a reference implementation; vector 4's INPUT begins with a
  space and ends with a space, hence the two spaces before its `=>`):

  ```
  2+3*4 => 14
  (2+3)*4 => 20
  2^3^2 => 512
   10 -  4-3  => 3
  100/5/2 => 10
  -2^2 => -4
  6*-2 => -12
  -(3+4)^2 => -49
  4^-1 => 0.25
  8/(3-3) => ERROR: division by zero
  2**3 => ERROR: syntax
  (1+2 => ERROR: syntax
  ```

  RESULT must be byte-exact (`String(x)` for numbers, exact error
  strings). For the INPUT echo, do not fail obj-1 solely because a
  submission trimmed vector 4's outer spaces when echoing it — the
  whitespace handling that is actually under test is graded by that
  vector's RESULT (3) in obj-2.
- Collision check for graders: the wrong-answer set `{64, 9, 40, 4, 49}`
  (what you get from the common precedence/associativity mistakes) is
  disjoint from the correct-answer set
  `{14, 20, 512, 3, 10, -4, -12, -49, 0.25}` — if a submission's output
  matches a wrong-answer-set value on one of those five vectors, that
  vector fails outright, no partial credit.
- Verify obj-4 by requiring the module directly, e.g.:
  `node -e "console.log(require('./evaluator.js').evaluate('8/(3-3)'))"`
  should print `ERROR: division by zero`, and similarly for the two
  syntax-error vectors — confirm no exception is thrown in the process
  (a throwing implementation fails this check even if the harness
  happens to catch it elsewhere).
- Parser correctness & robustness: does the implementation handle
  nested parens, chained associativity, and unary minus in all the
  positions the spec calls out, or does it special-case the 12 listed
  vectors? Probe mentally with an unlisted case such as `2^-2^2` or
  `-3-3` to sanity-check generality.
- Implementation architecture: reward a clear grammar-shaped
  decomposition (e.g. distinct functions per precedence level) over a
  single tangled function; penalize regex-based hacks that happen to
  pass the 12 vectors without a real grammar.
- Reasoning quality: REASONING.md should name the parsing strategy and
  specifically explain the mechanism used for right-associative `^`
  and for unary minus binding looser than `^` at the start of a power
  chain but still working inside an exponent (`4^-1`).
