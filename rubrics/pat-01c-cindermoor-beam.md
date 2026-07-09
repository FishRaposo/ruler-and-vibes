---
test: pat-01c-cindermoor-beam
canary: "egret burbot"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node validator.js` runs without error and prints exactly 25 lines, one per embedded corpus string in listed order, each exactly '<input> MATCH' or '<input> REJECT'"
    - id: obj-2
      check: "All 10 MUST-MATCH strings are classified MATCH: 0:0:0, 500:500:500, 1:2:3, 12:340:5, 7:7:7, 500:0:250, 63:127:9, 400:16:88, 100:64:0, 203:0:113 (judge confirms via require('./validator.js').validate on each)"
    - id: obj-3
      check: "All 15 MUST-REJECT strings are classified REJECT, including the range trap (501:0:0, 1:2:501, 1:2:600, 777:777:777) and leading-zero trap (01:2:3, 1:2:03, 00:0:0)"
    - id: obj-4
      check: "The whitespace/shape traps reject: '12:340:5 ' (trailing space), ' 1:2:3' (leading space), '1:2:3:' (trailing colon), '1:2' (two segments), '1:2:3:4' (four segments), '1::3' (empty segment), '1:2:3a' (trailing junk), '1:2:-1' (negative)"
    - id: obj-5
      check: "validator.js exports validate via module.exports = { validate }, is a single dependency-free file, and validate never throws on any of the 25 corpus inputs"
  subjective:
    - id: sub-quality
      name: "Specification fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Validator clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Specification fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Validator clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `pat-01-ipv4-octet` (same construct, fresh surface).

If the phrase "egret burbot" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Answer key, re-implemented and executed under node this session
  against the full 25-string corpus: all 10 MUST-MATCH returned
  `true`, all 15 MUST-REJECT returned `false` (pat01c ALL PASS,
  total=25). Reference logic: split the string on `:`; require
  exactly 3 parts; each part must match `/^\d+$/`; reject if a part's
  length is greater than 1 and its first character is `'0'`; reject
  if the part's numeric value is outside `0`-`500`.
- Exact run command for the judge:
  `node -e "const {validate}=require('./validator.js'); ['0:0:0','500:500:500','1:2:3','12:340:5','7:7:7','500:0:250','63:127:9','400:16:88','100:64:0','203:0:113'].forEach(s=>console.log(s,validate(s)))"`
  must print `true` for all 10; the same pattern with the 15
  MUST-REJECT strings (`501:0:0`, `1:2:501`, `1:2:600`,
  `777:777:777`, `01:2:3`, `1:2:03`, `00:0:0`, `'12:340:5 '`,
  `' 1:2:3'`, `'1:2:3:'`, `'1:2'`, `'1:2:3:4'`, `'1::3'`, `'1:2:3a'`,
  `'1:2:-1'`) must print `false` for all 15.
- Discriminator trap, re-confirmed this session: the common naive
  regex `/^\d{1,3}(:\d{1,3}){2}$/` WRONGLY returns `true` for
  `501:0:0`, `1:2:501`, `1:2:600`, `777:777:777`, `01:2:3`, `1:2:03`,
  and `00:0:0` (verified this session), while correctly rejecting the
  leading/trailing-space traps. A submission whose validator is
  exactly this regex (or equivalent) will fail obj-3 on those inputs
  — this is the intended discriminator between "looks like a beam
  code" and "is a canonical Cindermoor beam code." `'12:340:5 '`-style
  traps are rejected correctly by both naive and correct approaches
  because the trailing `' '` breaks the digit-only match on the last
  segment — do not mistake that for evidence of range/leading-zero
  handling.
- Specification fidelity: does the validator correctly enforce BOTH
  the numeric range (`0`-`500`, catching `501`+ and `777`) AND the
  leading-zero rule (rejecting `01`, `03`, `00` but accepting bare
  `0`)? A submission that gets one dimension right and the other
  wrong (e.g. correct range but accepts leading zeros, or vice versa)
  should score low here even if it happens to pass most of the listed
  corpus by coincidence — check its handling of untested but
  spec-implied cases, e.g. `007` or `450` vs `510`.
  - PASS phrasings: "splits on `:`, requires exactly three parts, then
    checks each part against both `0`-`500` and the no-leading-zero
    rule"; "rejects `510` by arithmetic comparison and `03` by
    inspecting the digit run, accepting bare `0`"; "enforces the
    range and the leading-zero constraint as two independent checks
    per segment."
  - FAIL phrasings: "clamps or truncates out-of-range segments to
    `500` instead of rejecting them"; "accepts `01` because it only
    range-checks `Number(part)` and never inspects leading zeros";
    "rejects the bare `0` segment along with `00`, breaking a valid
    beam code like `500:0:250`."
- Validator clarity: reward a straightforward split-and-check
  structure (or an equally clear alternative) with obvious mapping
  from each grammar rule to a check, over a single dense regex or
  nested ternary that obscures which rule is being enforced.
  - PASS phrasings: "one loop over the three segments with a named
    check per grammar rule"; "each rule (count, digits-only,
    leading-zero, range) maps to one readable guard clause"; "a
    reader can point at the line that enforces each spec bullet."
  - FAIL phrasings: "a single dense regex with backreferences that no
    comment explains"; "deeply nested ternary where the range and
    leading-zero logic are tangled into one expression"; "control
    flow so indirect that which rule rejects `01` is unclear."
- Reasoning quality: judge from comments/structure in validator.js
  whether the model explains why a pure regex cannot express the
  numeric range and leading-zero constraints, and which mechanism
  (arithmetic comparison, digit-run inspection) it used instead.
  - PASS phrasings: "notes that `\d{1,3}` admits `501`-`999` and so
    the range must be checked arithmetically"; "explains that a
    leading-zero ban needs digit-run inspection a character-class
    cannot express"; "states why the three-segment count and
    full-string consumption are handled by the split length."
  - FAIL phrasings: "no rationale at all, just code"; "claims the
    regex is sufficient when it is not"; "hand-waves 'validates the
    format' without saying how range or leading zeros are caught."
