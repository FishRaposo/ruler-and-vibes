---
test: context-02b-orbiter-downlink-tally
canary: "hoopoe gargoyle"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "TALLY.md's 'A:' line states exactly 9 (naive count of 10, ignoring the P1.8 rollback, fails)"
    - id: obj-2
      check: "TALLY.md's 'B:' line states exactly 365 minutes (judge recomputes 40+55+80+30+65+95 with node; 475 from including the cancelled P1.6 window fails)"
    - id: obj-3
      check: "TALLY.md's 'C:' line lists exactly P1.3, P1.7, P3.1 in that order and no others (P1.1 introduction or P1.9 documentation-only mention both fail)"
    - id: obj-4
      check: "TALLY.md's markdown table has exactly one row per phase with a completed pause (P1.0, P1.2, P1.5, P2.4.1, P1.8, P3.0), and the minutes column sums to the stated B total (judge sums with node)"
    - id: obj-5
      check: "TALLY.md's 'Excluded:' line names both the rolled-back P1.7 Downlink-pipeline fix and the cancelled P1.6 maintenance window"
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

If the phrase "hoopoe gargoyle" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

### Reference computation (verify with node before scoring)

```
// Question A: Downlink-pipeline fixes shipped: P1.0, P1.1, P1.2, P1.3,
// P1.4, P1.5, P1.6, P1.7, P1.9, P3.1 = 10 shipped fixes (each carries the
// "Fixed Downlink pipeline:" prefix). The P2.4.1 contingency patch and the
// P3.0/P3.2 "Fixed a fault" entries are not Downlink-pipeline fixes and
// were never in the count.
// P1.7's fix is explicitly rolled back in P1.8 ("Rolled back the P1.7
// provenance-stamp fix ... is no longer in effect as of this phase").
A = 10 - 1 = 9   // naive/trap answer: 10 (ignores the rollback)

// Question B: completed pause entries only (excludes the P1.6 cancelled
// window):
pauses = [40, 55, 80, 30, 65, 95]  // P1.0, P1.2, P1.5, P2.4.1, P1.8, P3.0
B = 40+55+80+30+65+95 = 365   // naive/trap answer: 475 (365 + the
                              // cancelled P1.6 window's 110 minutes)

// Question C: downlink.cadence changes (not counting its P1.1 introduction
// or the P1.9 documentation-only mention):
// P1.3: 6 -> 4
// P1.7: 4 -> 3
// P3.1: 3 -> 12
C = ["P1.3", "P1.7", "P3.1"]
```

The "Mission Recap" section near the end re-lists several Downlink-pipeline
fixes (the image-product compression fix, the transparent-overlay
flattening fix, the compressed-product double-compression fix) and the
downlink-cadence tuning as "highlights." This recap introduces no new facts
and is explicitly labeled as such in the task text — a submission that
double-counts any of these because they appear twice (once in the phase
entry, once in the recap) has made a counting error, not found new
information.

### Objective check notes

- **obj-1**: 9 is correct (10 shipped fixes across P1.0-P3.1, minus the P1.7
  fix that P1.8 explicitly rolls back). 10 is the naive trap answer for a
  submission that missed or ignored the rollback.
  - PASS phrasings: "A: 9"; "A: 9 Downlink-pipeline fixes in effect";
    "A: 9 (10 shipped, minus the P1.7 fix rolled back in P1.8)".
  - FAIL phrasings: "A: 10"; "A: 10 (all shipped fixes)"; "A: 8" (an
    over-subtraction that also drops a still-in-effect fix).
- **obj-2**: 365 is correct. The P1.6 "Planned maintenance window
  (cancelled)" is explicitly cancelled — no downtime occurred — and must be
  excluded. 475 (365 + 110) is the trap for a submission that counted the
  cancelled window anyway. The P2.4.1 contingency phase's 30-minute pause,
  despite being listed out of chronological order in the document, must
  still be included.
  - PASS phrasings: "B: 365"; "B: 365 minutes"; "B: 365 (40+55+80+30+65+95)".
  - FAIL phrasings: "B: 475" (includes the cancelled P1.6 window); "B: 335"
    (drops the out-of-order P2.4.1 pause); "B: 585" (includes both the
    cancelled window and some other double-count).
- **obj-3**: P1.1 introduces the setting with a stated default (6 hours) —
  this is not a "change from a previous value" and must not appear in C.
  P1.9 is a documentation-only mention explicitly stating "No change to the
  setting's value" — it is a decoy and must not appear in C either. Only
  P1.3, P1.7, and P3.1 are genuine value changes.
  - PASS phrasings: "C: P1.3, P1.7, P3.1"; "C: P1.3, P1.7, P3.1 (6->4, 4->3,
    3->12)"; a list giving exactly those three phases in that order.
  - FAIL phrasings: "C: P1.1, P1.3, P1.7, P3.1" (counts the introduction);
    "C: P1.3, P1.7, P1.9, P3.1" (counts the documentation-only mention);
    "C: P3.1, P1.7, P1.3" (right set, wrong order).
- **obj-4**: sum the table's minutes column with node and confirm it equals
  365; confirm the table has exactly 6 rows (P1.0, P1.2, P1.5, P2.4.1, P1.8,
  P3.0) and does not include P1.6's cancelled window or any phase with "No
  scheduled maintenance this phase."
  - PASS phrasings: a 6-row table with those phases whose minutes column
    sums to 365; the same table with a total row reading 365.
  - FAIL phrasings: a 7-row table that adds P1.6 at 110; a 5-row table that
    drops the out-of-order P2.4.1 row; a table whose minutes column sums to
    something other than the stated B.
- **obj-5**: the `Excluded:` line is the mandatory audit trail for this test
  — it must name the rolled-back P1.7 Downlink-pipeline fix (so a reader can
  see why A is 9, not 10) and the cancelled P1.6 maintenance window (so a
  reader can see why B is 365, not 475).
  - PASS phrasings: "Excluded: the P1.7 provenance-stamp fix (rolled back in
    P1.8) and the cancelled P1.6 maintenance window"; an Excluded line
    naming both items with reasons.
  - FAIL phrasings: "Excluded: the cancelled P1.6 window" (omits the P1.7
    rollback); "Excluded: none"; an Excluded line that names only the P1.7
    rollback and omits the cancelled window.

### Subjective guidance

- **Evidence traceability**: can a reader verify each of A, B, and C against
  the bulletin using only what's in `TALLY.md`, without re-reading the whole
  document? Reward citing which phases contributed to each count.
- **Tabulation clarity**: is the pause table easy to audit at a glance — one
  row per contributing phase, minutes column that visibly sums to B?
- **Reasoning quality**: does `REASONING.md` explain why the P1.7 fix
  doesn't count toward A, why the P1.6 window doesn't count toward B, and why
  P1.1's introduction and P1.9's documentation mention don't count toward C
  — or does it just assert the final numbers without showing the exclusions?
