---
test: context-02c-tram-headway-tally
canary: "avocet corbel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "TALLY.md's 'A:' line states exactly 9 (naive count of 10, ignoring the R1.8 rollback, fails)"
    - id: obj-2
      check: "TALLY.md's 'B:' line states exactly 375 minutes (judge recomputes 50+35+70+20+85+115 with node; 475 from including the cancelled R1.6 window fails)"
    - id: obj-3
      check: "TALLY.md's 'C:' line lists exactly R1.3, R1.7, R3.1 in that order and no others (R1.1 introduction or R1.9 documentation-only mention both fail)"
    - id: obj-4
      check: "TALLY.md's markdown table has exactly one row per revision with a completed closure (R1.0, R1.2, R1.5, R2.4.1, R1.8, R3.0), and the minutes column sums to the stated B total (judge sums with node)"
    - id: obj-5
      check: "TALLY.md's 'Excluded:' line names both the rolled-back R1.7 junction-signalling fix and the cancelled R1.6 track-possession window"
  subjective:
    - id: sub-quality
      name: "Evidence traceability"
      weight: 0.4
    - id: sub-craft
      name: "Tabulation clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `context-02-changelog-tally` (same construct, fresh surface).

If the phrase "avocet corbel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Reference computation (verify with node before scoring)

```
// Question A: junction-signalling fixes shipped ("Fixed Junction
// signalling:"): R1.0, R1.1, R1.2, R1.3, R1.4, R1.5, R1.6, R1.7, R1.9,
// R3.1 = 10 shipped fixes.
// R1.7's fix is explicitly rolled back in R1.8 ("Rolled back the R1.7
// slow-order overlay fix ... is no longer in effect as of this revision").
A = 10 - 1 = 9   // naive/trap answer: 10 (ignores the rollback)

// Question B: completed closures only (excludes the R1.6 cancelled window):
closures = [50, 35, 70, 20, 85, 115]  // R1.0, R1.2, R1.5, R2.4.1, R1.8, R3.0
B = 50+35+70+20+85+115 = 375   // naive/trap answer: 475 (375 + the
                               // cancelled R1.6 window's 100 minutes)

// Question C: headway.target changes (not counting its R1.1 introduction
// or the R1.9 documentation-only mention):
// R1.3: 120 -> 90
// R1.7: 90 -> 60
// R3.1: 60 -> 200
C = ["R1.3", "R1.7", "R3.1"]
```

The "Season in Review" recap section near the end re-lists several
junction-signalling fixes (the Cloister curve overlap-timing fix, the
nested-reservation overlay flattening fix, the compressed route-table
double-compression fix) and the headway-target tuning as "highlights."
This recap introduces no new facts and is explicitly labeled as such in
the task text — a submission that double-counts any of these because they
appear twice (once in the revision entry, once in the recap) has made a
counting error, not found new information.

### Objective check notes

- **obj-1**: 9 is correct (10 shipped fixes across R1.0-R3.1, minus the
  R1.7 fix that R1.8 explicitly rolls back). 10 is the naive trap answer
  for a submission that missed or ignored the rollback. The R2.4.1 patch,
  R1.8, R3.0, and R3.2 do not ship a "Fixed Junction signalling:" fix and
  must not inflate the count.
- **obj-2**: 375 is correct. The R1.6 "Planned track possession
  (cancelled)" is explicitly cancelled — no closure occurred — and must be
  excluded. 475 (375 + 100) is the trap for a submission that counted the
  cancelled window anyway. The R2.4.1 patch's 20-minute closure, despite
  being listed out of chronological order in the document, must still be
  included.
- **obj-3**: R1.1 introduces the setting with a stated default (120
  seconds) — this is not a "change from a previous value" and must not
  appear in C. R1.9 is a documentation-only mention explicitly stating "No
  change to the setting's value" — it is a decoy and must not appear in C
  either. R3.0's passing reference to the setting is likewise not a change.
  Only R1.3, R1.7, and R3.1 are genuine value changes.
- **obj-4**: sum the table's minutes column with node and confirm it
  equals 375; confirm the table has exactly 6 rows (R1.0, R1.2, R1.5,
  R2.4.1, R1.8, R3.0) and does not include R1.6's cancelled window or any
  revision with "No scheduled possession this revision."
- **obj-5**: the `Excluded:` line is the mandatory audit trail for this
  test — it must name the rolled-back R1.7 junction-signalling fix (so a
  reader can see why A is 9, not 10) and the cancelled R1.6
  track-possession window (so a reader can see why B is 375, not 475).

Example `Excluded:` phrasings that PASS obj-5:

- "Excluded: the R1.7 slow-order overlay fix (rolled back in R1.8, so
  not counted toward A) and the R1.6 planned possession (cancelled, so
  not counted toward B)."
- "Excluded: R1.7's junction-signalling fix — reverted by R1.8 — and
  R1.6's 100-minute window, which was cancelled before it began."
- "Excluded from A: the R1.7 fix, since R1.8 rolled it back. Excluded
  from B: the cancelled R1.6 track possession."

Example `Excluded:` phrasings that FAIL obj-5:

- "Excluded: nothing; all items were counted." (names neither)
- "Excluded: the cancelled R1.6 window." (omits the rolled-back R1.7 fix)
- "Excluded: the R1.7 fix that was rolled back." (omits the cancelled
  R1.6 window)

### Subjective guidance

- **Evidence traceability**: can a reader verify each of A, B, and C
  against the bulletin using only what's in `TALLY.md`, without re-reading
  the whole document? Reward citing which revisions contributed to each
  count.
- **Tabulation clarity**: is the closure table easy to audit at a glance
  — one row per contributing revision, minutes column that visibly sums to
  B?
- **Reasoning quality**: does `REASONING.md` explain why the R1.7 fix
  doesn't count toward A, why the R1.6 window doesn't count toward B, and
  why R1.1's introduction and R1.9's documentation mention don't count
  toward C — or does it just assert the final numbers without showing the
  exclusions?
