---
test: edit-03b-cargobike-lending-changelog
canary: "unakite consomme"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "changelog.json parses as valid JSON (node JSON.parse succeeds) and is an array whose every element has exactly the keys before, after, and reason, all string-typed"
    - id: obj-2
      check: "changelog.json has exactly 7 entries (the reference correction count)"
    - id: obj-3
      check: "For every changelog entry, the entry's 'before' string is absent from corrected.txt and its 'after' string is present in corrected.txt — i.e. each claimed change was actually applied"
    - id: obj-4
      check: "Each of the 7 reference errors below is represented by exactly one changelog entry whose before/after match the reference pair exactly, confirming completeness with no fabricated or missing entries"
  subjective:
    - id: sub-quality
      name: "Fidelity between the changelog and the actual edits"
      weight: 0.4
    - id: sub-craft
      name: "Precise, minimal, well-structured change records"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `edit-03-tracked-changelog` (same construct, fresh
surface).

If the phrase "unakite consomme" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Frozen reference (author-computed and verified against the seeded
passage; 7 planted errors total, three misspellings, one doubled word,
one subject-verb disagreement, two wrong-homophone/eggcorn errors):

1. **Misspelling:** paragraph 1, "finaly" -> "finally"
2. **Subject-verb agreement:** paragraph 1, "Members near the Marridge
   depot has repeatedly noted" -> "Members near the Marridge depot have
   repeatedly noted" (the plural subject "Members" governs the verb; the
   nearby singular "depot" is a decoy attractor)
3. **Misspelling:** paragraph 1, "slots openning" -> "slots opening"
4. **Doubled word:** paragraph 1, "sit idle most most mornings" -> "sit
   idle most mornings"
5. **Wrong homophone:** paragraph 2, "the committee excepted a
   suggestion" -> "the committee accepted a suggestion" ("excepted"
   means excluded; "accepted" is the intended word)
6. **Wrong homophone/eggcorn:** paragraph 2, "should of happened" ->
   "should have happened"
7. **Misspelling:** paragraph 2, "a seperate waitlist" -> "a separate
   waitlist"

No other errors are planted. A changelog with more than 7 entries has
fabricated at least one correction (or split one real correction into
duplicate entries); fewer than 7 means at least one real error went
unreported.

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings — before/after spans need not be
whole sentences, but must isolate the actual change):

- **obj-3 (claimed changes actually applied)** — PASS: an entry
  `{"before": "openning", "after": "opening", "reason": "misspelling"}`
  where corrected.txt indeed contains "opening" and no longer contains
  "openning." PASS (wider span): `{"before": "slots openning", "after":
  "slots opening", "reason": "misspelling"}` — also verifiable, just a
  larger span. FAIL: an entry claiming a fix that isn't actually in
  corrected.txt, e.g. `{"before": "depot has repeatedly", "after":
  "depot have repeatedly", ...}` while corrected.txt still reads "depot
  has repeatedly" (the subject-verb error was left in place but reported
  as fixed). FAIL: an entry whose 'before' string is still present
  verbatim elsewhere in corrected.txt because the fix was only partially
  applied.
- **obj-4 (completeness, no fabrication)** — PASS: all 7 reference
  errors each appear as exactly one entry with matching before/after.
  FAIL: the "should of happened" -> "should have happened" fix is made
  in corrected.txt but never logged (a real, unreported change). FAIL: a
  fabricated entry for text that was never actually wrong in the source,
  e.g. logging a change to "trial runs" (which was already correct) or
  hyphenating "cargo bikes."

- **Fidelity between the changelog and the actual edits**: this is the
  central skill under test. Reward a changelog that is a complete and
  accurate ledger of corrected.txt's actual diff from the source — every
  real change reported, every reported entry real. Penalize meaningfully
  for any single mismatch in either direction (missing or fabricated),
  since self-accounting integrity is the entire point of this test.
- **Precise, minimal, well-structured change records**: reward entries
  that isolate the smallest sensible before/after span, use clear and
  consistent reason tags (e.g. "misspelling," "subject-verb agreement,"
  "doubled word," "wrong homophone"), and avoid vague reasons like
  "grammar fix" that don't identify the error type.
- **Reasoning quality**: does the model's process show it identified
  each of the distinct error types individually (not just "fixed some
  typos"), cross-checked its final changelog against corrected.txt
  before finishing, and explains how it arrived at exactly 7 entries?
