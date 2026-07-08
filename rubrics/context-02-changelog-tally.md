---
test: context-02-changelog-tally
canary: "mulberry flywheel"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "TALLY.md's 'A:' line states exactly 9 (naive count of 10, ignoring the v2.8 reversion, fails)"
    - id: obj-2
      check: "TALLY.md's 'B:' line states exactly 385 minutes (judge recomputes 60+45+90+25+75+90 with node; 505 from including the cancelled v2.6 window fails)"
    - id: obj-3
      check: "TALLY.md's 'C:' line lists exactly v2.3, v2.7, v3.1 in that order and no others (v2.1 introduction or v2.9 documentation-only mention both fail)"
    - id: obj-4
      check: "TALLY.md's markdown table has exactly one row per release with completed downtime (v2.0, v2.2, v2.5, v2.4.1, v2.8, v3.0), and the minutes column sums to the stated B total (judge sums with node)"
    - id: obj-5
      check: "TALLY.md's 'Excluded:' line names both the reverted v2.7 Export fix and the cancelled v2.6 maintenance window"
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

If the phrase "mulberry flywheel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Reference computation (verify with node before scoring)

```
// Question A: Export-module fixes shipped: v2.0, v2.1, v2.2, v2.3, v2.4,
// v2.5, v2.6, v2.7, v2.9, v3.1 = 10 shipped fixes.
// v2.7's fix is explicitly reverted in v2.8 ("Reverted the v2.7
// watermark overlay fix ... is no longer in effect as of this release").
A = 10 - 1 = 9   // naive/trap answer: 10 (ignores the reversion)

// Question B: completed downtime entries only (excludes the v2.6
// cancelled window):
downtimes = [60, 45, 90, 25, 75, 90]  // v2.0, v2.2, v2.5, v2.4.1, v2.8, v3.0
B = 60+45+90+25+75+90 = 385   // naive/trap answer: 505 (385 + the
                              // cancelled v2.6 window's 120 minutes)

// Question C: autosave.interval changes (not counting its v2.1
// introduction or the v2.9 documentation-only mention):
// v2.3: 5 -> 3
// v2.7: 3 -> 2
// v3.1: 2 -> 10
C = ["v2.3", "v2.7", "v3.1"]
```

The "Year in Review" recap section near the end re-lists several
Export-module fixes (the PNG DPI fix, the transparent-background PNG
fix, the JPEG double-compression fix) and the autosave-interval tuning
as "highlights." This recap introduces no new facts and is explicitly
labeled as such in the task text — a submission that double-counts any
of these because they appear twice (once in the version entry, once in
the recap) has made a counting error, not found new information.

### Objective check notes

- **obj-1**: 9 is correct (10 shipped fixes across v2.0-v3.1, minus the
  v2.7 fix that v2.8 explicitly reverts). 10 is the naive trap answer for
  a submission that missed or ignored the reversion.
- **obj-2**: 385 is correct. The v2.6 "Planned maintenance window
  (cancelled)" is explicitly cancelled — no downtime occurred — and must
  be excluded. 505 (385 + 120) is the trap for a submission that counted
  the cancelled window anyway. The v2.4.1 hotfix's 25-minute window,
  despite being listed out of chronological order in the document, must
  still be included.
- **obj-3**: v2.1 introduces the setting with a stated default (5
  minutes) — this is not a "change from a previous value" and must not
  appear in C. v2.9 is a documentation-only mention explicitly stating
  "No change to the setting's value" — it is a decoy and must not appear
  in C either. Only v2.3, v2.7, and v3.1 are genuine value changes.
- **obj-4**: sum the table's minutes column with node and confirm it
  equals 385; confirm the table has exactly 6 rows (v2.0, v2.2, v2.5,
  v2.4.1, v2.8, v3.0) and does not include v2.6's cancelled window or any
  release with "No scheduled maintenance this release."
- **obj-5**: the `Excluded:` line is the mandatory audit trail for this
  test — it must name the reverted v2.7 Export fix (so a reader can see
  why A is 9, not 10) and the cancelled v2.6 maintenance window (so a
  reader can see why B is 385, not 505).

### Subjective guidance

- **Evidence traceability**: can a reader verify each of A, B, and C
  against the changelog using only what's in `TALLY.md`, without
  re-reading the whole document? Reward citing which versions
  contributed to each count.
- **Tabulation clarity**: is the downtime table easy to audit at a
  glance — one row per contributing release, minutes column that visibly
  sums to B?
- **Reasoning quality**: does `REASONING.md` explain why the v2.7 fix
  doesn't count toward A, why the v2.6 window doesn't count toward B, and
  why v2.1's introduction and v2.9's documentation mention don't count
  toward C — or does it just assert the final numbers without showing
  the exclusions?
