---
test: pat-02b-ferrule-stamp-regex
canary: "bolete vervain"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node pattern.js` runs without error and prints exactly 22 lines, one per corpus string in listed order, each exactly '<input> MATCH' or '<input> REJECT'"
    - id: obj-2
      check: "All 8 MUST-MATCH classify MATCH: TRV/1234, ZZZ/999999, QPR/45678#g1, QPR/45678#g12, AAA/1000, XYK/1000#g9, MNB/654321#g42, BCD/9999"
    - id: obj-3
      check: "The anchoring traps classify REJECT: 'qqTRV/1234qq', 'ABCD/1234', 'TRV/1234567', 'lot TRV/9999 flagged' (an unanchored regex WRONGLY accepts all four; these isolate anchoring competence)"
    - id: obj-4
      check: "The field traps classify REJECT: 'trv/1234' (lowercase), 'AB/1234' (two letters), 'TRV/0123' (leading-zero digit run), 'TRV/123' (too few digits), 'TRV/1234#g' (empty grade), 'TRV/1234#g123' (3 grade digits), 'TRV/1234#G1' (uppercase G), 'TRV-1234' (hyphen not slash), 'TRV/12a4' (letter in number), 'TRV/1234 ' (trailing space)"
    - id: obj-5
      check: "The judge confirms whole-string semantics by evaluating `require('./pattern.js').validate('qqTRV/1234qq')` returning false even though the substring 'TRV/1234' is a valid stamp; pattern.js exports both `pattern` (a RegExp) and `validate` via module.exports"
  subjective:
    - id: sub-quality
      name: "Grammar coverage"
      weight: 0.4
    - id: sub-craft
      name: "Pattern economy"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `pat-02-sable-tag-regex` (same construct, fresh surface).

If the phrase "bolete vervain" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Answer key, executed under node this session: reference regex
  `/^[A-Z]{3}\/[1-9]\d{3,5}(#g\d{1,2})?$/` against the full 22-string
  corpus: all 8 MUST-MATCH `true`, all 14 MUST-REJECT `false` (pat02b
  ALL PASS, total=22).
- Exact run command for the judge:
  `node -e "const {validate}=require('./pattern.js'); ['TRV/1234','ZZZ/999999','QPR/45678#g1','QPR/45678#g12','AAA/1000','XYK/1000#g9','MNB/654321#g42','BCD/9999'].forEach(s=>console.log(s,validate(s)))"`
  must print `true` for all 8; then re-run with the 14 MUST-REJECT
  strings (`'qqTRV/1234qq'`, `'ABCD/1234'`, `'TRV/1234567'`,
  `'lot TRV/9999 flagged'`, `'trv/1234'`, `'AB/1234'`, `'TRV/0123'`,
  `'TRV/123'`, `'TRV/1234#g'`, `'TRV/1234#g123'`, `'TRV/1234#G1'`,
  `'TRV-1234'`, `'TRV/12a4'`, `'TRV/1234 '`) which must all print
  `false`.
- Anchoring discriminator, re-confirmed this session: taking the same
  regex body WITHOUT the `^...$` anchors returns `true` for
  `'qqTRV/1234qq'`, `'ABCD/1234'`, `'TRV/1234567'`, and
  `'lot TRV/9999 flagged'` (all four verified `true` this session under
  the unanchored form). A submission whose pattern lacks full-string
  anchoring (or anchors only one side, or uses `\b` word boundaries
  instead of `^`/`$`) will fail obj-3 on some or all of these four —
  this is the primary discriminator for this test.
- Digit-count discriminator: `[1-9]\d{3,5}` means "one non-zero leading
  digit plus 3 to 5 more digits" = 4 to 6 digits total. Verified this
  session: `TRV/10000` (5 digits) and `TRV/100000` (6 digits) match;
  `TRV/123` (3 digits) and `TRV/1234567` (7 digits) do not. In modern
  Node, `^...$` without the `m` flag does not match before a trailing
  newline, so no newline caveat applies here.
- Grammar coverage: does the pattern correctly bound the digit run to
  4-6 digits with a non-zero first digit, and correctly make the grade
  suffix fully optional with exactly 1-2 digits? Probe mentally with
  unlisted cases such as `TRV/9999#g0` (should match — `0` alone is a
  valid single grade digit) or `TRV/1000#g` followed by no digits
  (should not match) to sanity-check generality beyond the 22 listed
  vectors.
  - PASS phrasings: "the digit run is `[1-9]\d{3,5}`, pinning the
    stamp number to 4-6 digits with a non-zero lead"; "the
    `(#g\d{1,2})?` group makes the grade suffix optional and caps it
    at two digits, so `TRV/1234` and `TRV/1234#g1` both match while
    `TRV/1234#g123` does not"; "accepts `TRV/1234#g0` because a lone
    `0` is one valid grade digit."
  - FAIL phrasings: "uses `\d{4,6}` and so wrongly admits a leading
    zero like `TRV/0123`"; "makes the whole suffix mandatory (or its
    digits optional), so a bare `TRV/1234` is rejected or `TRV/1234#g`
    is accepted"; "bounds the digit run as `\d{3,5}` or `\d+`,
    mis-sizing the 4-6-digit stamp number."
- Pattern economy: reward a single clean anchored regex that maps
  cleanly to the grammar (character class, slash, digit-count
  quantifier, optional group) over a sprawling alternation or a regex
  wrapped in extra hand-written pre/post string manipulation that
  defeats the "single regex" spirit of the task.
  - PASS phrasings: "one anchored literal whose four pieces line up
    with the four grammar rules, no alternation"; "the optional suffix
    is a single `?`-quantified group rather than two spelled-out
    alternatives"; "no hand-written slicing or pre-trimming around the
    regex — the pattern does all the work."
  - FAIL phrasings: "a long `|`-alternation enumerating with-suffix
    and without-suffix forms separately"; "the regex is only part of
    the job and the code hand-parses the slash or the digit run in
    JavaScript"; "escaped every literal character defensively,
    producing an unreadable pattern that obscures the four grammar
    rules."
- Reasoning quality: judge from comments/structure in pattern.js
  whether the model explains why full-string anchoring is required
  (the substring-match trap) and how the digit-count and leading-digit
  constraints are encoded.
  - PASS phrasings: "states that without `^...$` the pattern would
    match a valid stamp embedded in surrounding text like `lot
    TRV/9999 flagged`"; "explains that `[1-9]` on the first digit is
    what bans the leading-zero run `TRV/0123`"; "notes the `{3,5}`
    after the lead digit is what yields a 4-6 digit total."
  - FAIL phrasings: "no rationale, just the pattern"; "claims the
    regex is whole-string safe without mentioning anchors or the
    substring trap"; "hand-waves 'matches the stamp format' without
    saying how the digit count or leading digit is enforced."
