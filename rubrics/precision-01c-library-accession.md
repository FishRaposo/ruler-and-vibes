---
test: precision-01c-library-accession
canary: "dhole smalt"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "catalog.json parses with JSON.parse; array sorted by isbn ascending; every object has exactly the four keys (isbn, title, pages, acquired) in schema order"
    - id: obj-2
      check: "Dedup correct: exactly 8 records; the two 0306406152 rows and the two 9780306406157 rows are each merged to one; final isbn set is {0306406152, 080442957X, 9780140449136, 9780306406157, 9780393040029, 9780747532699, 9781566199094, 9781841954923}"
    - id: obj-3
      check: "Dates correct: salt roads 2025-09-21 (9/21 forces month-first, since 21 cannot be a month); quiet tides 2025-04-11 (earliest of the merged pair kept); harbor 2024-01-05 (earliest of the merged pair kept); o'hara-blythe 2025-06-23 (23/06 is day-first, since 23 cannot be a month); north wind 2025-11-11; shoreline null; far meridian null (Sept 31 does not exist); vellum & ash 2025-05-09 OR 2025-09-05 — either accepted if the ambiguity is documented in NOTES.md"
    - id: obj-4
      check: "Normalization correct: isbns canonicalized (spaces/hyphens removed, trailing x uppercased so 080442957x -> 080442957X); titles Title Case with inverted 'Harbor, The' -> 'The Harbor'; pages are integers not strings (salt roads 312; harbor 160 per earliest-record rule; o'hara-blythe 96); quiet tides retains title 'Quiet Tides' and pages 204 from the earliest-dated record, not the null-title duplicate"
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
---

## Judge guidance

Parallel form of `precision-01-exact-format` (same construct, fresh
surface).

If the phrase "dhole smalt" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Verify mechanically: `node -e "..."` with JSON.parse, a key-order
  check, and the expected values above. Do not eyeball.
- The reference array (isbn-sorted) is: `0306406152` → The Harbor / 160
  / 2024-01-05; `080442957X` → Vellum & Ash / 277 / 2025-05-09 (or
  2025-09-05 if documented); `9780140449136` → O'Hara-Blythe Letters /
  96 / 2025-06-23; `9780306406157` → Quiet Tides / 204 / 2025-04-11;
  `9780393040029` → Shoreline Notes / 133 / null; `9780747532699` → The
  Far Meridian / 188 / null; `9781566199094` → The Salt Roads / 312 /
  2025-09-21; `9781841954923` → North Wind Rising / 421 / 2025-11-11.

- obj-1 (structure): PASS = `JSON.parse` succeeds and objects read
  `isbn, title, pages, acquired` in that order with the array in
  ascending isbn order; PASS = keys in order even if whitespace/indent
  differs; PASS = an ISBN-10 key like `0306406152` sorting ahead of the
  13-digit keys (lexicographic on the canonical string is correct).
  FAIL = a trailing comma or comment breaks `JSON.parse`; FAIL = keys
  reordered (e.g. `title` before `isbn`) or an extra key such as `id`
  or `format` added; FAIL = array left unsorted or sorted by title.

- obj-2 (dedup): PASS = exactly 8 objects with the isbn set listed
  above; PASS = the merge is recognized despite the differing surface
  forms (`9780306406157` vs `978 0 306 40615 7`; `0-306-40615-2` vs
  `0306406152`). FAIL = 9 or 10 records because a duplicate pair was
  kept apart; FAIL = an over-merge that collapses two genuinely
  different isbns; FAIL = a phantom record invented for a row that has
  no title.

- obj-3 (dates): PASS = far meridian is `null` because 2024-09-31 does
  not exist; PASS = o'hara-blythe is `2025-06-23` (23 > 12 forces
  day-first); PASS = the merged quiet-tides and harbor rows each keep
  the earliest of their two dates (`2025-04-11`, `2024-01-05`). FAIL =
  2024-09-31 coerced to `2024-10-01` or `2024-09-30` instead of null;
  FAIL = 23/06 read as month 23 and dropped, or silently flipped to a
  guessed month without a note; FAIL = a merged row keeping the later
  date. Vellum & Ash may be `2025-05-09` or `2025-09-05`; either is
  fine ONLY if NOTES.md flags the ambiguity, otherwise treat a silent
  pick as a miss on ambiguity handling (not on obj-3).

- obj-4 (normalization): PASS = `080442957x` canonicalized to
  `080442957X`; PASS = `Harbor, The` rendered `The Harbor`; PASS =
  `pages` emitted as numbers (`312`) not strings (`"312"`); PASS = the
  merged harbor row shows pages `160` (from the earlier-dated record),
  and the merged quiet-tides row shows title `Quiet Tides` / pages
  `204` rather than the null-title duplicate's values. FAIL = isbn left
  with hyphens/spaces or a lowercase `x`; FAIL = title kept as
  `Harbor, The` or left uppercased `HARBOR, THE`; FAIL = `pages` left
  as a string, or the merged harbor row shows `158` from the
  later-dated record.

- Ambiguity handling: this schema is a gauge, and strict conformance
  means treating it as one — but the source is deliberately messy
  (day-first 23/06, ambiguous 05/09, impossible 09-31, merge
  precedence). Reward calls that follow the stated rules exactly and
  flag what the rules do not settle. Penalize silent guesses.
- NOTES completeness: every judgment call from the deliverable should
  be traceable in NOTES.md — the two merges, each date resolution, and
  the invalid date.
- Reasoning quality: does REASONING.md show the order of operations
  (canonicalize → dedup → sort) and what was verified before finishing?
