---
test: pat-04-quill-nested-literal
canary: "gecko iguana"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node quill.js` runs without error and prints exactly 24 corpus lines then 8 vector lines, all in listed order and exact '<input> MATCH/REJECT' or '<input> ACCEPT/REJECT' format"
    - id: obj-2
      check: "Every corpus and vector string in the test file carries an explicit character-by-character gloss disambiguating each backslash, so the judge can determine the exact intended string of every escaped item (spec-required; judge confirms the glosses are present and internally consistent with the printed results)"
    - id: obj-3
      check: "All 11 MUST-MATCH corpus strings classify MATCH, including empty group (the two chars < >), nested-empty (< < > >), deep nesting (< a < b < c > d > e >), siblings (< one < two > three < four > >), and the all-escapes group whose body is backslash-< then backslash-> then backslash-backslash"
    - id: obj-4
      check: "All 13 MUST-REJECT corpus strings classify REJECT, including unbalanced (< a < b >), trailing text (< a > extra), leading text (pre < a >), bad escape (< a backslash b >), extra close (< > >), empty string, and the escaped-close trap (< a backslash > where the backslash escapes the '>' so the group is never closed)"
    - id: obj-5
      check: "The 8-item labeled payload vector is classified 100% correctly against the answer key: [< >] ACCEPT; [< a < b > c >] ACCEPT; [< backslash < >] ACCEPT (backslash escapes the inner '<'); [< a backslash b >] REJECT (b is not an escapable char); [< a < b >] REJECT (unclosed outer); [< a backslash-backslash >] ACCEPT (escaped backslash then close); [< a backslash >] REJECT (backslash escapes the '>', group unterminated); [< < a > >] ACCEPT"
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

Codename for this test in judge chatter: gecko iguana.

- Answer key executed under node this session: reference
  recursive-descent validator gives all 11 MUST-MATCH `true`, all 13
  MUST-REJECT `false` (pat04 corpus ALL PASS, total=24), and the
  labeled vector matches the answer key exactly (pat04 vector ALL
  PASS, n=8). The validator parses a group by consuming `<`, then
  looping: `>` closes and returns; `<` recurses; a backslash consumes
  exactly one following character from `{<, >, \}` (any other
  character after a backslash fails); any other character is consumed
  as a plain unit; after the top-level group closes, the parser
  requires the read position to equal the string length (no trailing
  text).
- Exact run command for the judge:
  `node -e "const {validate}=require('./quill.js'); console.log(validate('<a\\\\<b>'))"`
  style probes — but prefer testing the vector items directly, e.g.
  `node -e "const {validate}=require('./quill.js'); console.log(validate('<a\\\\>'))"`
  must print `false` (the escaped-close trap: the string is the 4
  characters `<`, `a`, backslash, `>`, so the backslash escapes the
  `>` and the group is left unterminated).
- Regex-insufficiency proof, re-confirmed this session: the best
  plausible flat regex `/^<([^<>\\]|\\[<>\\])*>$/` returns `false` for
  the legal corpus strings `<a<b>c>` and `<<>>` (both verified `false`
  this session under that regex), because a flat regex cannot express
  unbounded recursive nesting. Any submission whose `validate` is
  provably equivalent to a single non-recursive regex should fail
  obj-3 on the nested-corpus items and should score very low on
  "Language exactness" regardless of how it does on the flatter
  corpus items.
- Escaped-close discriminator (the core trap of this test): the
  string written as `<a\>` is exactly 4 characters — `<`, `a`,
  backslash, `>` — so the backslash escapes the `>`, making it a
  plain unit rather than the closing delimiter; the group is thus
  never closed and the correct answer is REJECT. Contrast with
  `<a\\>` (5 characters: `<`, `a`, backslash, backslash, `>`), where
  the first backslash escapes the second backslash (a plain unit),
  after which the final `>` genuinely closes the group — ACCEPT. A
  submission that gets this pair backwards, or treats both the same,
  has not correctly modeled escaping and should score low on
  "Language exactness" even if it passes the simpler corpus items.
- Judge verification of obj-2 (gloss requirement): open the
  submission's quill.js and confirm each corpus/vector string with a
  backslash has an accompanying comment naming every character
  (especially distinguishing `\<`, `\>`, `\\` occurrences); if a
  submission reproduces the corpus without glosses, or with glosses
  that don't match what the string literal actually contains, fail
  obj-2 even if the printed classifications happen to be correct.
  - PASS (gloss present and consistent): `< \< >  // chars: '<', then
    escaped-'<' (\<), then '>'`; `< a \\ >  // chars: '<','a', escaped
    backslash (\\), '>'`.
  - FAIL (gloss missing or inconsistent): a corpus line reproduced with
    no accompanying comment at all; `< a \> >  // a normal group with a,
    then >` (the gloss ignores that `\>` escapes the '>', so it
    contradicts the actual literal).
- Language exactness: score per-discriminator — does the validator
  correctly handle unbounded nesting depth, sibling groups, and every
  escape case (valid escape, invalid escape target, escaped-close)?
  A validator that is correct on non-nested inputs but breaks on
  depth 3+ (e.g. via a fixed-depth loop or bounded regex composition)
  should score low here.
- Validator structure: reward a clear recursive-descent or
  explicit-stack shape with an obvious mapping from grammar rule to
  code (group/body/unit/escape) over a tangled index-juggling
  implementation that happens to work but is hard to verify by
  inspection.
- Reasoning quality: judge from comments/structure in quill.js whether
  the model explicitly states that a plain regex cannot accept this
  language because nesting depth is unbounded, and whether it
  articulates the escaped-close discriminator (backslash consuming
  the following `>`) as a design consideration rather than an
  accident of the implementation.
