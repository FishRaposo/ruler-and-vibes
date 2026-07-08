---
test: pat-02c-ravelin-cask-stamp
canary: "russula betony"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node pattern.js` runs without error and prints exactly 22 lines, one per corpus string in listed order, each exactly '<input> MATCH' or '<input> REJECT'"
    - id: obj-2
      check: "All 8 MUST-MATCH classify MATCH: WKT:1234, QRS:987654, MZP:5000/r3, MZP:5000/r27, BCD:1000, GHT:2718/r9, VXN:314159/r42, JKL:80085"
    - id: obj-3
      check: "The anchoring traps classify REJECT: 'ooWKT:1234oo', 'ABCD:1234', 'WKT:1234567', 'tag WKT:9000 x' (an unanchored regex WRONGLY accepts all four; these isolate anchoring competence)"
    - id: obj-4
      check: "The field traps classify REJECT: 'wkt:1234' (lowercase), 'WK:1234' (two letters), 'WKT:0123' (leading-zero digit run), 'WKT:123' (too few digits), 'WKT:1234/r' (empty suffix), 'WKT:1234/r123' (3 suffix digits), 'WKT:1234/R3' (uppercase R), 'WKT-1234' (hyphen not colon), 'WKT:12a4' (letter in number), 'WKT:1234 ' (trailing space)"
    - id: obj-5
      check: "The judge confirms whole-string semantics by evaluating `require('./pattern.js').validate('ooWKT:1234oo')` returning false even though the substring 'WKT:1234' is a valid stamp; pattern.js exports both `pattern` (a RegExp) and `validate` via module.exports"
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

If the phrase "russula betony" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Answer key, executed under node this session: reference regex
  `/^[A-Z]{3}:[1-9]\d{3,5}(\/r\d{1,2})?$/` against the full 22-string
  corpus: all 8 MUST-MATCH `true`, all 14 MUST-REJECT `false` (pat02c
  ALL PASS, total=22).
- Exact run command for the judge:
  `node -e "const {validate}=require('./pattern.js'); ['WKT:1234','QRS:987654','MZP:5000/r3','MZP:5000/r27','BCD:1000','GHT:2718/r9','VXN:314159/r42','JKL:80085'].forEach(s=>console.log(s,validate(s)))"`
  must print `true` for all 8; then re-run with the 14 MUST-REJECT
  strings (`'ooWKT:1234oo'`, `'ABCD:1234'`, `'WKT:1234567'`,
  `'tag WKT:9000 x'`, `'wkt:1234'`, `'WK:1234'`, `'WKT:0123'`,
  `'WKT:123'`, `'WKT:1234/r'`, `'WKT:1234/r123'`, `'WKT:1234/R3'`,
  `'WKT-1234'`, `'WKT:12a4'`, `'WKT:1234 '`) which must all print
  `false`.
- Anchoring discriminator, re-confirmed this session: taking the same
  regex body WITHOUT the `^...$` anchors returns `true` for
  `'ooWKT:1234oo'`, `'ABCD:1234'`, `'WKT:1234567'`, and
  `'tag WKT:9000 x'` (all four verified `true` this session under the
  unanchored form). A submission whose pattern lacks full-string
  anchoring (or anchors only one side, or uses `\b` word boundaries
  instead of `^`/`$`) will fail obj-3 on some or all of these four —
  this is the primary discriminator for this test. Note that
  `'ABCD:1234'` leaks because the unanchored body still finds the valid
  substring `BCD:1234`, and `'WKT:1234567'` leaks because the body
  matches the first 4-6 digits and ignores the trailing digits — both
  are anchoring failures, not field-check failures.
- Digit-count discriminator: `[1-9]\d{3,5}` means "one non-zero leading
  digit plus 3 to 5 more digits" = 4 to 6 digits total. Verified this
  session: `WKT:10000` (5 digits) and `WKT:100000` (6 digits) match;
  `WKT:123` (3 digits) and `WKT:1234567` (7 digits) do not. In modern
  Node, `^...$` without the `m` flag does not match before a trailing
  newline, so no newline caveat applies here.
- Grammar coverage: does the pattern correctly bound the digit run to
  4-6 digits with a non-zero first digit, and correctly make the
  reissue suffix fully optional with exactly 1-2 digits? Probe mentally
  with unlisted cases such as `WKT:1234/r0` (should match — `0` alone
  is a valid single reissue digit) or `WKT:1234/r` with no digits
  (should not match) to sanity-check generality beyond the 22 listed
  vectors.
  - PASS phrasings: "the digit run is `[1-9]\d{3,5}`, pinning the lot
    number to 4-6 digits with a non-zero lead"; "the `(\/r\d{1,2})?`
    group makes the reissue suffix optional and caps it at two digits,
    so `WKT:1234` and `WKT:1234/r9` both match while `WKT:1234/r123`
    does not"; "accepts `WKT:1234/r0` because a lone `0` is one valid
    reissue digit."
  - FAIL phrasings: "uses `\d{4,6}` and so wrongly admits a leading
    zero like `WKT:0123`"; "makes the whole suffix mandatory (or its
    digits optional), so a bare `WKT:1234` is rejected or `WKT:1234/r`
    is accepted"; "bounds the digit run as `\d{3,5}` or `\d+`, mis-sizing
    the 4-6-digit lot number."
- Pattern economy: reward a single clean anchored regex that maps
  cleanly to the grammar (character class, colon, digit-count
  quantifier, optional group) over a sprawling alternation or a regex
  wrapped in extra hand-written pre/post string manipulation that
  defeats the "single regex" spirit of the task.
  - PASS phrasings: "one anchored literal whose four pieces line up with
    the four grammar rules, no alternation"; "the optional suffix is a
    single `?`-quantified group rather than two spelled-out
    alternatives"; "no hand-written slicing or pre-trimming around the
    regex — the pattern does all the work."
  - FAIL phrasings: "a long `|`-alternation enumerating with-suffix and
    without-suffix forms separately"; "the regex is only part of the job
    and the code hand-parses the colon or the digit run in JavaScript";
    "escaped every literal character defensively, producing an
    unreadable pattern that obscures the four grammar rules."
- Reasoning quality: judge from comments/structure in pattern.js whether
  the model explains why full-string anchoring is required (the
  substring-match trap) and how the digit-count and leading-digit
  constraints are encoded.
  - PASS phrasings: "states that without `^...$` the pattern would match
    a valid stamp embedded in surrounding text like `tag WKT:9000 x`";
    "explains that `[1-9]` on the first digit is what bans the
    leading-zero run `WKT:0123`"; "notes the `{3,5}` after the lead
    digit is what yields a 4-6 digit total."
  - FAIL phrasings: "no rationale, just the pattern"; "claims the regex
    is whole-string safe without mentioning anchors or the substring
    trap"; "hand-waves 'matches the stamp format' without saying how the
    digit count or leading digit is enforced."
