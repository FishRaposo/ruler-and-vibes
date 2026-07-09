---
test: pat-02-sable-tag-regex
canary: "civet wombat"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node pattern.js` runs without error and prints exactly 22 lines, one per corpus string in listed order, each exactly '<input> MATCH' or '<input> REJECT'"
    - id: obj-2
      check: "All 8 MUST-MATCH classify MATCH: AB-123, ZZ-99999, QR-4567.v1, QR-4567.v12, AA-100, XY-100.v9, MN-12345.v42, BC-999"
    - id: obj-3
      check: "The anchoring traps classify REJECT: 'xxAB-123xx', 'ABC-123', 'AB-123456', 'see AB-999 here' (an unanchored regex WRONGLY accepts all four; these isolate anchoring competence)"
    - id: obj-4
      check: "The field traps classify REJECT: 'ab-123' (lowercase), 'A-123' (one letter), 'AB-023' (leading-zero digit run), 'AB-12' (too few digits), 'AB-123.v' (empty version), 'AB-123.v123' (3 version digits), 'AB-123.V1' (uppercase V), 'AB_123' (underscore), 'AB-1a3' (letter in number), 'AB-123 ' (trailing space)"
    - id: obj-5
      check: "The judge confirms whole-string semantics by evaluating `require('./pattern.js').validate('xxAB-123xx')` returning false even though the substring 'AB-123' is a valid tag; pattern.js exports both `pattern` (a RegExp) and `validate` via module.exports"
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
anchors:
  - id: Grammar coverage
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Pattern economy
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "civet wombat" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Answer key, executed under node this session: reference regex
  `/^[A-Z]{2}-[1-9]\d{2,4}(\.v\d{1,2})?$/` against the full 22-string
  corpus: all 8 MUST-MATCH `true`, all 14 MUST-REJECT `false` (pat02
  ALL PASS, total=22).
- Exact run command for the judge:
  `node -e "const {validate}=require('./pattern.js'); ['AB-123','ZZ-99999','QR-4567.v1','QR-4567.v12','AA-100','XY-100.v9','MN-12345.v42','BC-999'].forEach(s=>console.log(s,validate(s)))"`
  must print `true` for all 8; then re-run with the 14 MUST-REJECT
  strings (`'xxAB-123xx'`, `'ABC-123'`, `'AB-123456'`,
  `'see AB-999 here'`, `'ab-123'`, `'A-123'`, `'AB-023'`, `'AB-12'`,
  `'AB-123.v'`, `'AB-123.v123'`, `'AB-123.V1'`, `'AB_123'`,
  `'AB-1a3'`, `'AB-123 '`) which must all print `false`.
- Anchoring discriminator, re-confirmed this session: taking the same
  regex body WITHOUT the `^...$` anchors returns `true` for
  `'xxAB-123xx'`, `'ABC-123'`, `'AB-123456'`, and
  `'see AB-999 here'` (all four verified `true` this session under
  the unanchored form). A submission whose pattern lacks full-string
  anchoring (or anchors only one side, or uses `\b` word boundaries
  instead of `^`/`$`) will fail obj-3 on some or all of these four —
  this is the primary discriminator for this test.
- Digit-count discriminator: `[1-9]\d{2,4}` means "one non-zero
  leading digit plus 2 to 4 more digits" = 3 to 5 digits total.
  Verified this session: `AB-1000` (4 digits) and `AB-10000` (5
  digits) match; `AB-12` (2 digits) and `AB-123456` (6 digits) do
  not. In modern Node, `^...$` without the `m` flag does not match
  before a trailing newline, so no newline caveat applies here.
- Grammar coverage: does the pattern correctly bound the digit run to
  3-5 digits with a non-zero first digit, and correctly make the
  version suffix fully optional with exactly 1-2 digits? Probe
  mentally with unlisted cases such as `AB-999.v0` (should match —
  `0` alone is a valid single version digit) or `AB-100.v` followed
  by no digits (should not match) to sanity-check generality beyond
  the 22 listed vectors.
  - PASS phrasings: "the digit run is `[1-9]\d{2,4}`, pinning the tag
    number to 3-5 digits with a non-zero lead"; "the `(\.v\d{1,2})?`
    group makes the version suffix optional and caps it at two digits,
    so `AB-123` and `AB-123.v1` both match while `AB-123.v123` does
    not"; "accepts `AB-999.v0` because a lone `0` is one valid version
    digit."
  - FAIL phrasings: "uses `\d{3,5}` and so wrongly admits a leading
    zero like `AB-023`"; "makes the whole suffix mandatory (or its
    digits optional), so a bare `AB-123` is rejected or `AB-123.v` is
    accepted"; "bounds the digit run as `\d{2,4}` or `\d+`, mis-sizing
    the 3-5-digit tag number."
- Pattern economy: reward a single clean anchored regex that maps
  cleanly to the grammar (character class, hyphen, digit-count
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
    the job and the code hand-parses the hyphen or the digit run in
    JavaScript"; "escaped every literal character defensively,
    producing an unreadable pattern that obscures the four grammar
    rules."
- Reasoning quality: judge from comments/structure in pattern.js
  whether the model explains why full-string anchoring is required
  (the substring-match trap) and how the digit-count and leading-digit
  constraints are encoded.
  - PASS phrasings: "states that without `^...$` the pattern would
    match a valid tag embedded in surrounding text like `see AB-999
    here`"; "explains that `[1-9]` on the first digit is what bans the
    leading-zero run `AB-023`"; "notes the `{2,4}` after the lead digit
    is what yields a 3-5 digit total."
  - FAIL phrasings: "no rationale, just the pattern"; "claims the
    regex is whole-string safe without mentioning anchors or the
    substring trap"; "hand-waves 'matches the tag format' without
    saying how the digit count or leading digit is enforced."
