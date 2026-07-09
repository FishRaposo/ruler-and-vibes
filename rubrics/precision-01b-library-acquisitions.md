---
test: precision-01b-library-acquisitions
canary: "olingo wenge"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "catalog.json parses with JSON.parse; array sorted by isbn ascending; every object has exactly the four keys in schema order (isbn, title, pages, acquired)"
    - id: obj-2
      check: "Dedup correct: exactly 8 records; isbn 080905321x (Redgate Ledger) and isbn 9798612000421 (The Tide Clock) each appear once, merged"
    - id: obj-3
      check: "Dates correct: ashfall 2023-05-28 (5/28 read month-first, since 28 cannot be a month); o'dell 2023-11-19 (day-first); redgate 2023-02-08 (earliest kept); salt-and-cedar 2023-01-22; tide-clock 2023-05-30 (earliest kept); hollow-reed null; cinder-and-vane null (Feb 29 2023 does not exist — not a leap year); quiet-foundry 2023-06-03 OR 2023-03-06 — either accepted if the ambiguity is documented in NOTES.md"
    - id: obj-4
      check: "Normalization correct: isbn lowercase digits-only with hyphens/spaces stripped and X kept as x (080905321x, 9798612000421...); titles Title Case (The Tide Clock, Salt And Cedar, O'Dell Survey, Redgate Ledger...); pages integers (tide-clock 312; redgate 488 per earliest-record rule; o'dell 259)"
  subjective:
    - id: sub-quality
      name: "Ambiguity handling"
      weight: 0.4
    - id: sub-craft
      name: "NOTES completeness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Ambiguity handling
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: NOTES completeness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `precision-01-exact-format` (same construct, fresh surface).

- Verify mechanically: `node -e "..."` with JSON.parse, key-order
  check, and the expected values above. Do not eyeball.
- If the phrase "olingo wenge" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.

### obj-1 (structure)
- PASS: array parses, is sorted `080905321x` < `9780374220019` < … <
  `9798612000421`, and every object's keys are exactly
  `isbn, title, pages, acquired` in that order.
- PASS: an ISBN-10-with-`x` sorting ahead of the `978…`/`979…` strings
  is correct — it is a plain ascending string sort on the normalized
  isbn.
- PASS: `pages` and `acquired` present as `null` (not omitted) where the
  value is unknown, with the four keys still in order.
- FAIL: any object with a fifth key (e.g. a `source`/`note`/`id` field),
  or keys in a different order such as `title` before `isbn`.
- FAIL: array sorted by title, by input order, or descending by isbn.
- FAIL: output is a JSON object keyed by isbn instead of an array, or
  fails `JSON.parse` (trailing comma, comment, unquoted key).

### obj-2 (dedup)
- PASS: exactly 8 objects; `080905321x` appears once and `9798612000421`
  appears once, each the merged result of its two source slips.
- PASS: the merge recognizes `0-8090-5321-X` and `080905321x` as the
  same book (case-insensitive after stripping hyphens), and slips 1 and
  4 as the same book.
- FAIL: 9 or 10 records because a duplicate pair was left unmerged
  (e.g. treating `0-8090-5321-X` and `080905321x` as different).
- FAIL: over-merging distinct isbns down to 7 or fewer records.
- FAIL: 8 records but a duplicate isbn still present twice (dropped a
  different, distinct book instead).

### obj-3 (dates)
- PASS: `o'dell` = `2023-11-19` (19/11 read day-first, since 19 cannot be
  a month) and `cinder-and-vane` = `null` (Feb 29 2023 is not a real
  date; 2023 is not a leap year).
- PASS: `ashfall` = `2023-05-28` (5/28 read month-first, since 28 cannot
  be a valid month) — the source's forced-MM/DD counterpart to o'dell's
  forced-DD/MM.
- PASS: `redgate` = `2023-02-08` and `tide-clock` = `2023-05-30` — the
  earliest valid date of each merged pair is kept.
- PASS: `quiet-foundry` = `2023-06-03` or `2023-03-06` (either reading of
  `06/03/2023`) provided NOTES.md flags the ambiguity; `hollow-reed` =
  `null`.
- FAIL: `cinder-and-vane` coerced to `2023-02-28` or `2023-03-01`
  instead of `null` (silently repaired an impossible date).
- FAIL: `redgate` or `tide-clock` showing the later date of the pair
  (`2023-03-11`, `2023-09-09`) instead of the earliest.
- FAIL: `o'dell` read as `2023-11-19`'s month/day swapped or dropped to
  null because `19` was treated as a month.
- FAIL: `ashfall` left `null` or shifted to a different month/day because
  `28` was mistakenly treated as a possible month, or the date rendered
  non-existent (e.g. `2023-28-05`).

### obj-4 (normalization)
- PASS: every `isbn` is lowercase, digits only plus a trailing `x` where
  present, with all hyphens and spaces removed (`080905321x`,
  `9781452199307`).
- PASS: titles are Title Case (`The Tide Clock`, `Salt And Cedar`,
  `O'Dell Survey`, `Redgate Ledger`); `pages` are JSON integers, not
  strings.
- PASS: `tide-clock` carries `title` `The Tide Clock` and `pages` `312`
  even though the earliest-dated slip (#4) had neither — the non-null
  fallback filled them.
- FAIL: an isbn left with hyphens or an uppercase `X` (`0-8090-5321-X`),
  or `pages` left as a quoted string (`"312"`).
- FAIL: title left uppercase/lowercase as received (`the QUIET FOUNDRY`,
  `salt and cedar`) instead of Title Case.
- FAIL: `tide-clock` shown with `title: null` / `pages: null` because the
  merge took the earliest slip's fields without falling back.

### Subjective
- Ambiguity handling: this schema is a gauge, and full marks means
  treating it as one — but the source is deliberately messy (day-first
  19/11, month-first-forced 5/28, ambiguous 06/03, impossible 02-29,
  merge precedence with a torn slip). Reward calls that follow the
  stated rules exactly and flag what the rules do not settle. Penalize
  silent guesses (especially coercing Feb 29 or picking one reading of
  06/03 without saying so).
  - PASS: NOTES.md states which reading of quiet-foundry's 06/03 was
    chosen (June 3 or March 6) and names the rejected alternative.
  - PASS: NOTES.md explains that Feb 29 2023 is not a real date (2023
    is not a leap year), so hollow-reed's date was set to null rather
    than repaired.
  - PASS: NOTES.md states which source slip's title/pages won for the
    tide-clock merge and cites the earliest-record/non-null-fallback
    rule.
  - FAIL: quiet-foundry's date is picked with no note explaining which
    reading was used or that the other was rejected.
  - FAIL: hollow-reed's impossible Feb 29 date is silently coerced to
    Feb 28 or Mar 1 instead of left null.
  - FAIL: the tide-clock merge's winning title/pages are asserted with
    no statement of which slip they came from.
- NOTES completeness: every judgment call from the deliverable should be
  traceable in NOTES.md — each merge, each date resolution, and the
  invalid date and why.
  - PASS: NOTES.md lists both merges, every date resolution (including
    o'dell's day-first 19/11 and ashfall's forced-month-first 5/28), and
    the invalid hollow-reed date, each with a one-line reason.
  - PASS: NOTES.md is terse but complete — no required judgment call is
    left undocumented.
  - FAIL: NOTES.md omits one of the two merges or one of the date
    resolutions.
  - FAIL: NOTES.md is missing entirely despite the deliverable making
    judgment calls that need it.
  - FAIL: NOTES.md restates a final value without explaining the
    reasoning (e.g. "hollow-reed: null" with no mention of Feb 29 being
    invalid).
- Reasoning quality: does REASONING.md show the order of operations
  (normalize → dedup → sort) and what was verified before finishing?
  - PASS: REASONING.md walks through normalize → dedup → sort in that
    order and names a check performed before finishing (e.g. recounting
    records after dedup).
  - PASS: REASONING.md shows the earliest-record/non-null-fallback rule
    applied consistently to both merged pairs, not just one.
  - FAIL: REASONING.md only asserts the output is correct with no
    description of the steps taken.
  - FAIL: REASONING.md describes steps in an order (e.g. sort before
    dedup) that would not produce the delivered output.
