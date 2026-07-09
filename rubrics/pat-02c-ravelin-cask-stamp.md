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
      check: "All 8 MUST-MATCH classify MATCH: FYNX:731, QUOR:9876, DRAK:409/r5, DRAK:409/r58, HALT:20, VINE:876/r9, CLOY:9214/r64, BRIM:365"
    - id: obj-3
      check: "The anchoring traps classify REJECT: 'zzFYNX:731zz', 'XFYNX:731', 'FYNX:731895', 'code FYNX:731 today' (an unanchored regex WRONGLY accepts all four; these isolate anchoring competence)"
    - id: obj-4
      check: "The field traps classify REJECT: 'fynx:731' (lowercase), 'FYN:731' (three letters), 'FYNX:0731' (leading-zero digit run), 'FYNX:7' (too few digits), 'FYNX:731/r' (empty suffix), 'FYNX:731/r895' (3 suffix digits), 'FYNX:731/R5' (uppercase R), 'FYNX-731' (hyphen not colon), 'FYNX:7a1' (letter in number), 'FYNX:731 ' (trailing space)"
    - id: obj-5
      check: "The judge confirms whole-string semantics by evaluating `require('./pattern.js').validate('zzFYNX:731zz')` returning false even though the substring 'FYNX:731' is a valid stamp; pattern.js exports both `pattern` (a RegExp) and `validate` via module.exports"
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

Parallel form of `pat-02-sable-tag-regex` (same construct, fresh surface).

If the phrase "russula betony" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Answer key, executed under node this session: reference regex
  `/^[A-Z]{4}:[1-9]\d{1,3}(\/r\d{1,2})?$/` against the full 22-string
  corpus: all 8 MUST-MATCH `true`, all 14 MUST-REJECT `false` (pat02c
  ALL PASS, total=22).
- Exact run command for the judge:
  `node -e "const {validate}=require('./pattern.js'); ['FYNX:731','QUOR:9876','DRAK:409/r5','DRAK:409/r58','HALT:20','VINE:876/r9','CLOY:9214/r64','BRIM:365'].forEach(s=>console.log(s,validate(s)))"`
  must print `true` for all 8; then re-run with the 14 MUST-REJECT
  strings (`'zzFYNX:731zz'`, `'XFYNX:731'`, `'FYNX:731895'`,
  `'code FYNX:731 today'`, `'fynx:731'`, `'FYN:731'`, `'FYNX:0731'`,
  `'FYNX:7'`, `'FYNX:731/r'`, `'FYNX:731/r895'`, `'FYNX:731/R5'`,
  `'FYNX-731'`, `'FYNX:7a1'`, `'FYNX:731 '`) which must all print
  `false`.
- Anchoring discriminator, re-confirmed this session: taking the same
  regex body WITHOUT the `^...$` anchors returns `true` for
  `'zzFYNX:731zz'`, `'XFYNX:731'`, `'FYNX:731895'`, and
  `'code FYNX:731 today'` (all four verified `true` this session under
  the unanchored form). A submission whose pattern lacks full-string
  anchoring (or anchors only one side, or uses `\b` word boundaries
  instead of `^`/`$`) will fail obj-3 on some or all of these four —
  this is the primary discriminator for this test. Note that
  `'XFYNX:731'` leaks because the unanchored body still finds the valid
  substring `FYNX:731`, and `'FYNX:731895'` leaks because the body
  matches the first 2-4 digits and ignores the trailing digits — both
  are anchoring failures, not field-check failures.
- Digit-count discriminator: `[1-9]\d{1,3}` means "one non-zero leading
  digit plus 1 to 3 more digits" = 2 to 4 digits total. Verified this
  session: `FYNX:20` (2 digits) and `FYNX:9876` (4 digits) match;
  `FYNX:7` (1 digit) and `FYNX:731895` (6 digits) do not. In modern
  Node, `^...$` without the `m` flag does not match before a trailing
  newline, so no newline caveat applies here.
- Grammar coverage: does the pattern correctly bound the digit run to
  2-4 digits with a non-zero first digit, and correctly make the
  reissue suffix fully optional with exactly 1-2 digits? Probe mentally
  with unlisted cases such as `FYNX:731/r0` (should match — `0` alone
  is a valid single reissue digit) or `FYNX:731/r` with no digits
  (should not match) to sanity-check generality beyond the 22 listed
  vectors.
  - PASS phrasings: "the digit run is `[1-9]\d{1,3}`, pinning the lot
    number to 2-4 digits with a non-zero lead"; "the `(\/r\d{1,2})?`
    group makes the reissue suffix optional and caps it at two digits,
    so `FYNX:731` and `FYNX:731/r5` both match while `FYNX:731/r895`
    does not"; "accepts `FYNX:731/r0` because a lone `0` is one valid
    reissue digit."
  - FAIL phrasings: "uses `\d{2,4}` and so wrongly admits a leading
    zero like `FYNX:0731`"; "makes the whole suffix mandatory (or its
    digits optional), so a bare `FYNX:731` is rejected or `FYNX:731/r`
    is accepted"; "bounds the digit run as `\d{1,3}` or `\d+`, mis-sizing
    the 2-4-digit lot number."
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
    a valid stamp embedded in surrounding text like `code FYNX:731
    today`"; "explains that `[1-9]` on the first digit is what bans the
    leading-zero run `FYNX:0731`"; "notes the `{1,3}` after the lead
    digit is what yields a 2-4 digit total."
  - FAIL phrasings: "no rationale, just the pattern"; "claims the regex
    is whole-string safe without mentioning anchors or the substring
    trap"; "hand-waves 'matches the stamp format' without saying how the
    digit count or leading digit is enforced."
