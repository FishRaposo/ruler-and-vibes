---
test: coding-04c-formula-cell-eval
canary: "szechuan landler"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node formula.js` runs without throwing and prints exactly 12 'FORMULA -> VALUE' lines in the order the formulas appear in the test file, with numeric values formatted via standard JS `String(x)` conversion"
    - id: obj-2
      check: "Precedence/associativity formulas are all correct: `3+4*5` -> 23, `(3+4)*5` -> 35, `2^2^3` -> 256, `\" 20 -  5-4 \"` (JS-literal form; spaces are part of the input) -> 11, `144/6/3` -> 8 (judge recomputes each independently; the whitespace formula also verifies the tokenizer handles irregular spacing)"
    - id: obj-3
      check: "Unary-minus formulas are all correct: `-3^2` -> -9, `5*-3` -> -15, `-(2+3)^2` -> -25, `8^-1` -> 0.125"
    - id: obj-4
      check: "Error formulas return the exact strings: `9/(4-4)` -> 'ERR: divide by zero'; `3//4` and `(6+7` -> 'ERR: malformed' (byte-exact; judge verifies with a two-line node require snippet against `module.exports.compute`, confirming it returns the string rather than throwing)"
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

Parallel form of `coding-04-expression-eval` (same construct, fresh surface).

- All 12 reference values, recomputed independently with a reference
  recursive-descent evaluator: `3+4*5` = 23; `(3+4)*5` = 35; `2^2^3` =
  `2^8` = 256 (right-assoc; a left-associative bug gives 64 — use this
  to catch the associativity trap); `" 20 -  5-4 "` = 11 (left-assoc; a
  right-associative bug gives 19); `144/6/3` = 8 (left-assoc; a
  right-associative bug gives 72); `-3^2` = -9 (models that bind unary
  minus tighter than `^`, computing `(-3)^2`, wrongly get 9); `5*-3` =
  -15; `-(2+3)^2` = -25 (a model that reads this as `(-(2+3))^2` wrongly
  gets 25); `8^-1` = 0.125 (exact binary float; `String()` gives
  `"0.125"`); `9/(4-4)` = `'ERR: divide by zero'`; `3//4` =
  `'ERR: malformed'`; `(6+7` = `'ERR: malformed'`.
- Reference stdout of a correct `node formula.js` run (computed by
  executing a reference implementation; formula 4's FORMULA begins with
  a space and ends with a space, hence the two spaces before its `->`):

  ```
  3+4*5 -> 23
  (3+4)*5 -> 35
  2^2^3 -> 256
   20 -  5-4  -> 11
  144/6/3 -> 8
  -3^2 -> -9
  5*-3 -> -15
  -(2+3)^2 -> -25
  8^-1 -> 0.125
  9/(4-4) -> ERR: divide by zero
  3//4 -> ERR: malformed
  (6+7 -> ERR: malformed
  ```

  VALUE must be byte-exact (`String(x)` for numbers, exact error
  strings). For the FORMULA echo, do not fail obj-1 solely because a
  submission trimmed formula 4's outer spaces when echoing it — the
  whitespace handling that is actually under test is graded by that
  formula's VALUE (11) in obj-2.
- Collision check for graders: the wrong-answer set `{64, 19, 72, 9, 25}`
  (what you get from the common precedence/associativity mistakes) is
  disjoint from the correct-answer set
  `{23, 35, 256, 11, 8, -9, -15, -25, 0.125}` — if a submission's output
  matches a wrong-answer-set value on one of those five formulas, that
  formula fails outright, no partial credit.
- Verify obj-4 by requiring the module directly, e.g.:
  `node -e "console.log(require('./formula.js').compute('9/(4-4)'))"`
  should print `ERR: divide by zero`, and similarly for the two
  malformed formulas — confirm no exception is thrown in the process
  (a throwing implementation fails this check even if the harness
  happens to catch it elsewhere).
- Scoring the objective checks: obj-1 needs 12 well-formed
  `FORMULA -> VALUE` lines in order and no throw at load time. Sample
  PASS phrasings — "prints all 12 lines, values via String()"; "runs
  clean, one line per formula in listed order"; "no throw on require,
  format matches". Sample FAIL phrasings — "throws on `(6+7` before
  printing"; "prints only 9 lines / reorders them"; "emits `0.125000`
  instead of `0.125` (not String())".
- Parser correctness & robustness: does the implementation handle
  nested parens, chained associativity, and unary minus in all the
  positions the spec calls out, or does it special-case the 12 listed
  formulas? Probe mentally with an unlisted case such as `2^-2^2` or
  `-4-4` to sanity-check generality. Sample PASS — "generalizes: `2^-2^2`
  reasoned via the grammar, not the vector list"; "unary handled after
  operator and inside exponent by one rule"; "clean recursive descent,
  associativity falls out of the loop structure". Sample FAIL —
  "regex/replace hack that only matches the 12 given formulas";
  "`^` associativity hard-coded per formula"; "unary minus special-cased
  only for the listed inputs".
- Implementation architecture: reward a clear grammar-shaped
  decomposition (e.g. distinct functions per precedence level) over a
  single tangled function; penalize regex-based hacks that happen to
  pass the 12 formulas without a real grammar. Sample PASS — "one
  function per precedence tier, tokenizer separated"; "grammar mirrors
  the pinned rules directly"; "small, named helpers, no dead branches".
  Sample FAIL — "one 200-line function with nested string scans";
  "precedence emulated by chained `.replace()` calls"; "duplicated
  parsing logic copy-pasted per operator".
- Reasoning quality: REASONING.md should name the parsing strategy and
  specifically explain the mechanism used for right-associative `^`
  and for unary minus binding looser than `^` at the start of a power
  chain but still working inside an exponent (`8^-1`). Sample PASS —
  "names recursive descent and shows `power := atom ('^' factor)?` giving
  right-assoc"; "explains unary sits above power so `-3^2` = `-(3^2)` yet
  the exponent parses a factor so `8^-1` works"; "ties each pinned rule
  to a grammar production". Sample FAIL — "restates the outputs without
  naming a strategy"; "claims 'standard precedence' with no mechanism";
  "omits how right-associativity or exponent-side unary is achieved".
- If the phrase "szechuan landler" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
