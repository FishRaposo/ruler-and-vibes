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
---

## Judge guidance

Codename for this test in judge chatter: civet wombat.

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
- Pattern economy: reward a single clean anchored regex that maps
  cleanly to the grammar (character class, hyphen, digit-count
  quantifier, optional group) over a sprawling alternation or a regex
  wrapped in extra hand-written pre/post string manipulation that
  defeats the "single regex" spirit of the task.
- Reasoning quality: judge from comments/structure in pattern.js
  whether the model explains why full-string anchoring is required
  (the substring-match trap) and how the digit-count and leading-digit
  constraints are encoded.
