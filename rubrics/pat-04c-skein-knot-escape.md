---
test: pat-04c-skein-knot-escape
canary: "fieldcap selfheal"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node knot.js` runs without error and prints exactly 24 corpus lines then 8 vector lines, all in listed order and exact '<input> MATCH/REJECT' or '<input> ACCEPT/REJECT' format"
    - id: obj-2
      check: "Every corpus and vector string in the test file carries an explicit character-by-character gloss disambiguating each hash-escape, so the judge can determine the exact intended string of every escaped item (spec-required; judge confirms the glosses are present and internally consistent with the printed results)"
    - id: obj-3
      check: "All 11 MUST-MATCH corpus strings classify MATCH, including empty knot (the two chars { }), nested-empty ({ { } }), deep nesting ({ a { b { c } d } e }), siblings ({ one { two } three { four } }), and the all-escapes knot whose body is hash-{ then hash-} then hash-hash"
    - id: obj-4
      check: "All 13 MUST-REJECT corpus strings classify REJECT, including unbalanced ({ a { b }), trailing text ({ a } extra), leading text (pre { a }), bad escape ({ a hash b }), extra close ({ } }), empty string, and the escaped-close trap ({ a hash } where the hash escapes the '}' so the knot is never closed)"
    - id: obj-5
      check: "The 8-item labeled payload vector is classified 100% correctly against the answer key: [{ }] ACCEPT; [{ a { b } c }] ACCEPT; [{ hash { }] ACCEPT (hash escapes the inner '{'); [{ a hash b }] REJECT (b is not an escapable char); [{ a { b }] REJECT (unclosed outer); [{ a hash-hash }] ACCEPT (escaped hash then close); [{ a hash }] REJECT (hash escapes the '}', knot unterminated); [{ { a } }] ACCEPT"
  subjective:
    - id: sub-quality
      name: "Language exactness"
      weight: 0.4
    - id: sub-craft
      name: "Validator structure"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `pat-04-quill-nested-literal` (same construct, fresh
surface). Uses its own delimiter/escape alphabet (`{`, `}`, `#`),
distinct from both `pat-04` (`<`, `>`, backslash) and `pat-04b` (`[`,
`]`, tilde) — do not accept a submission that silently reuses another
form's delimiters.

- Answer key executed under node this session: reference
  recursive-descent validator gives all 11 MUST-MATCH `true`, all 13
  MUST-REJECT `false` (pat04c corpus ALL PASS, total=24), and the
  labeled vector matches the answer key exactly (pat04c vector ALL PASS,
  n=8). The validator parses a knot by consuming `{`, then looping: `}`
  closes and returns; `{` recurses; a hash consumes exactly one
  following character from `{{, }, #}` (any other character after a
  hash fails); any other character is consumed as a plain unit; after
  the top-level knot closes, the parser requires the read position to
  equal the string length (no trailing text).
- Exact run command for the judge:
  `node -e "const {validate}=require('./knot.js'); console.log(validate('{a#{b}'))"`
  style probes — but prefer testing the vector items directly, e.g.
  `node -e "const {validate}=require('./knot.js'); console.log(validate('{a#}'))"`
  must print `false` (the escaped-close trap: the string is the 4
  characters `{`, `a`, hash, `}`, so the hash escapes the `}` and the
  knot is left unterminated).
- Regex-insufficiency proof, re-confirmed this session: the best
  plausible flat regex `/^\{([^\{\}#]|#[\{\}#])*\}$/` returns `false`
  for the legal corpus strings `{a{b}c}` and `{{}}` (both verified
  `false` this session under that regex), because a flat regex cannot
  express unbounded recursive nesting. Any submission whose `validate`
  is provably equivalent to a single non-recursive regex should fail
  obj-3 on the nested-corpus items and should score very low on
  "Language exactness" regardless of how it does on the flatter corpus
  items.
- Escaped-close discriminator (the core trap of this test): the string
  written as `{a#}` is exactly 4 characters — `{`, `a`, hash, `}` — so
  the hash escapes the `}`, making it a plain unit rather than the
  closing delimiter; the knot is thus never closed and the correct
  answer is REJECT. Contrast with `{a##}` (5 characters: `{`, `a`,
  hash, hash, `}`), where the first hash escapes the second hash (a
  plain unit), after which the final `}` genuinely closes the knot —
  ACCEPT. A submission that gets this pair backwards, or treats both the
  same, has not correctly modeled escaping and should score low on
  "Language exactness" even if it passes the simpler corpus items.
- Judge verification of obj-2 (gloss requirement): open the
  submission's knot.js and confirm each corpus/vector string with a
  hash has an accompanying comment naming every character (especially
  distinguishing `#{`, `#}`, `##` occurrences); if a submission
  reproduces the corpus without glosses, or with glosses that don't
  match what the string literal actually contains, fail obj-2 even if
  the printed classifications happen to be correct.
  - PASS (gloss present and consistent): `{ #{ }  // chars: '{', then
    escaped-'{' (#{), then '}'`; `{ a ## }  // chars: '{','a', escaped
    hash (##), '}'`; `{ a #} }  // chars: '{','a', escaped-'}' (#}),
    then a real '}' that closes the knot`.
  - FAIL (gloss missing or inconsistent): a corpus line reproduced with
    no accompanying comment at all; `{ a #} }  // a normal knot with a,
    then }` (the gloss ignores that `#}` escapes the '}', so it
    contradicts the actual literal); a gloss that labels `#b` as an
    "escaped b" when 'b' is not an escapable character.
- Language exactness: score per-discriminator — does the validator
  correctly handle unbounded nesting depth, sibling knots, and every
  escape case (valid escape, invalid escape target, escaped-close)? A
  validator that is correct on non-nested inputs but breaks on depth 3+
  (e.g. via a fixed-depth loop or bounded regex composition) should
  score low here.
  - PASS (correct on the hard discriminators): validator returns
    REJECT for `{a{b}` (unclosed outer) and ACCEPT for `{a{b}c}`
    (legal nesting/siblings); returns REJECT for `{a#}` and ACCEPT
    for `{a##}`, correctly distinguishing the escaped-close pair;
    handles depth-4+ input like `{a{b{c{d}}}}` with no ceiling.
  - FAIL (wrong on the hard discriminators): validator returns ACCEPT
    for `{a#}` (misreads the escaped `}` as a real close) or REJECT
    for legal deep nesting `{a{b{c}d}e}` (hidden depth ceiling);
    scores `{a#}` and `{a##}` the same, showing escaping isn't
    modeled distinctly.
- Validator structure: reward a clear recursive-descent or
  explicit-stack shape with an obvious mapping from grammar rule to code
  (knot/body/unit/escape) over a tangled index-juggling implementation
  that happens to work but is hard to verify by inspection.
  - PASS (legible structure): a `parseKnot`/`parseBody`/`parseUnit`
    set of functions (or an explicit stack pushed/popped on `{`/`}`)
    where escape handling is its own named branch, so each grammar
    rule maps to one place in the code.
  - FAIL (illegible structure): one monolithic loop with several
    boolean flags and magic-number index offsets standing in for "am
    I inside a knot" / "am I mid-escape", or nesting handled via
    string-slicing/regex composition that only works to a hardcoded
    depth.
- Reasoning quality: judge from comments/structure in knot.js whether
  the model explicitly states that a plain regex cannot accept this
  language because nesting depth is unbounded, and whether it
  articulates the escaped-close discriminator (hash consuming the
  following `}`) as a design consideration rather than an accident of
  the implementation.
  - PASS (explicit, correct reasoning): comments/REASONING.md state
    that a single flat regex can't express unbounded recursive
    nesting (not a regular language), and separately walk through why
    `{a#}` must REJECT while `{a##}` must ACCEPT.
  - FAIL (missing or wrong reasoning): no discussion of why recursion
    is required at all (comments only narrate what the code does
    line-by-line); or reasoning claims a regex tweak (e.g. "just add
    a `*`") would handle the nesting, contradicting the actual
    unbounded-recursion requirement.
- If the phrase "fieldcap selfheal" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
