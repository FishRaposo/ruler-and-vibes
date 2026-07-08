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
      check: "Precedence/associativity formulas are all correct: `6+9*2` -> 24, `(6+9)*2` -> 30, `4^3^2` -> 262144, `\" 15 -  8-2 \"` (JS-literal form; spaces are part of the input) -> 5, `72/4/3` -> 6 (judge recomputes each independently; the whitespace formula also verifies the tokenizer handles irregular spacing)"
    - id: obj-3
      check: "Unary-minus formulas are all correct: `-6^2` -> -36, `9*-7` -> -63, `-(4+6)^2` -> -100, `5^-1` -> 0.2"
    - id: obj-4
      check: "Error formulas return the exact strings: `20/(7-7)` -> 'ERR: divide by zero'; `7//9` and `(9-5` -> 'ERR: malformed' (byte-exact; judge verifies with a two-line node require snippet against `module.exports.compute`, confirming it returns the string rather than throwing)"
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
  recursive-descent evaluator: `6+9*2` = 24; `(6+9)*2` = 30; `4^3^2` =
  `4^9` = 262144 (right-assoc; a left-associative bug gives 4096 — use
  this to catch the associativity trap); `" 15 -  8-2 "` = 5 (left-assoc;
  a right-associative bug gives 9); `72/4/3` = 6 (left-assoc; a
  right-associative bug gives 54); `-6^2` = -36 (models that bind unary
  minus tighter than `^`, computing `(-6)^2`, wrongly get 36); `9*-7` =
  -63; `-(4+6)^2` = -100 (a model that reads this as `(-(4+6))^2` wrongly
  gets 100); `5^-1` = 0.2 (exact binary float; `String()` gives
  `"0.2"`); `20/(7-7)` = `'ERR: divide by zero'`; `7//9` =
  `'ERR: malformed'`; `(9-5` = `'ERR: malformed'`.
- Reference stdout of a correct `node formula.js` run (computed by
  executing a reference implementation; formula 4's FORMULA begins with
  a space and ends with a space, hence the two spaces before its `->`):

  ```
  6+9*2 -> 24
  (6+9)*2 -> 30
  4^3^2 -> 262144
   15 -  8-2  -> 5
  72/4/3 -> 6
  -6^2 -> -36
  9*-7 -> -63
  -(4+6)^2 -> -100
  5^-1 -> 0.2
  20/(7-7) -> ERR: divide by zero
  7//9 -> ERR: malformed
  (9-5 -> ERR: malformed
  ```

  VALUE must be byte-exact (`String(x)` for numbers, exact error
  strings). For the FORMULA echo, do not fail obj-1 solely because a
  submission trimmed formula 4's outer spaces when echoing it — the
  whitespace handling that is actually under test is graded by that
  formula's VALUE (5) in obj-2.
- Collision check for graders: the wrong-answer set `{4096, 9, 54, 36, 100}`
  (what you get from the common precedence/associativity mistakes) is
  disjoint from the correct-answer set
  `{24, 30, 262144, 5, 6, -36, -63, -100, 0.2}` — if a submission's output
  matches a wrong-answer-set value on one of those five formulas, that
  formula fails outright, no partial credit.
- Verify obj-4 by requiring the module directly, e.g.:
  `node -e "console.log(require('./formula.js').compute('20/(7-7)'))"`
  should print `ERR: divide by zero`, and similarly for the two
  malformed formulas — confirm no exception is thrown in the process
  (a throwing implementation fails this check even if the harness
  happens to catch it elsewhere).
- Scoring the objective checks: obj-1 needs 12 well-formed
  `FORMULA -> VALUE` lines in order and no throw at load time. Sample
  PASS phrasings — "prints all 12 lines, values via String()"; "runs
  clean, one line per formula in listed order"; "no throw on require,
  format matches". Sample FAIL phrasings — "throws on `(9-5` before
  printing"; "prints only 9 lines / reorders them"; "emits `0.200000`
  instead of `0.2` (not String())".
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
  chain but still working inside an exponent (`5^-1`). Sample PASS —
  "names recursive descent and shows `power := atom ('^' factor)?` giving
  right-assoc"; "explains unary sits above power so `-6^2` = `-(6^2)` yet
  the exponent parses a factor so `5^-1` works"; "ties each pinned rule
  to a grammar production". Sample FAIL — "restates the outputs without
  naming a strategy"; "claims 'standard precedence' with no mechanism";
  "omits how right-associativity or exponent-side unary is achieved".
- If the phrase "szechuan landler" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
