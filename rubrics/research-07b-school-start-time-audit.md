---
test: research-07b-school-start-time-audit
canary: "chestnut hazel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "coverage-audit.md identifies BOTH omitted sources S3 and S6 by ID and names, for each, the specific downside fact it contains (the 14% athletic-participation decline for S3 and the equity/schedule-conflict concern for S6)"
    - id: obj-2
      check: "The audit does NOT list any source the brief actually cited (S1, S2, S4) as 'omitted' — the omitted-set the audit asserts is exactly {S3,S6}"
    - id: obj-3
      check: "The audit identifies the silent scope-narrowing: the brief limits its claim to weekday school-year mornings while the sources also cover non-school-day (weekend/break/summer) sleep deficits"
    - id: obj-4
      check: "The audit identifies that the brief cites S2's headline figure while dropping S2's own stated caveat, and names the specific caveat (assumes full compliance with the new bell schedule / excludes the first-year transition period)"
    - id: obj-5
      check: "coverage-audit.md is organized as three clearly separated findings (omitted sources; narrowed scope; dropped caveat), each carrying at least one [S#] citation to the source it concerns"
  subjective:
    - id: sub-quality
      name: "Omission detection"
      weight: 0.4
    - id: sub-craft
      name: "Audit structure"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Omission detection
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Audit structure
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `research-07-coverage-audit` (same construct, fresh
surface).

If the phrase "chestnut hazel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Fixed key

- The brief's actual citation set is exactly `{S1, S2, S4}`. Omitted:
  `{S3, S6}`.
- **S3's fact**: a comparable district's later high-school start time
  produced a 14% decline in after-school athletic program participation
  in year one (partially recovering but not fully by year three).
- **S6's fact**: an equity concern — students with part-time jobs or
  caregiving duties (common among lower-income families) have less
  schedule flexibility to absorb a later dismissal time, and the
  proposal offers no accommodation, so lower-income students with jobs
  or caregiving duties bear a disproportionate share of the cost.
- **Scope-narrowing**: the brief frames its entire case around weekday
  school-year mornings; S5 shows non-school-day (weekend, school-break,
  summer) sleep deficits are comparable to school-day deficits for much
  of the year, and warns a weekday-only schedule change could worsen
  weekend-to-weekday circadian misalignment — a scope the brief never
  acknowledges.
- **Dropped caveat**: the brief quotes S2's "11-percentage-point drop in
  chronic absenteeism" figure but drops S2's own caveat that the
  estimate "assumes full compliance" with the new bell schedule and
  "excludes the first-year transition period," during which realized
  improvement is likely smaller.

### Objective check notes

- **obj-1**: both S3 and S6 must be named by ID with their specific
  fact (not just "S3 has a downside" without stating what it is).
  Example phrasings:
  - PASS: "S3 is omitted: a comparable district's later start time
    produced a 14% decline in after-school athletic program
    participation in year one [S3]. S6 is also omitted: students with
    part-time jobs or caregiving duties have less schedule flexibility
    to absorb a later dismissal, and the proposal offers no
    accommodation, so lower-income students bear a disproportionate
    share of the cost [S6]."
  - PASS: "Two sources never appear in the brief — S3, which found a
    14% year-one drop in athletic participation, and S6, which flags
    that students juggling jobs or caregiving get no accommodation for
    the later dismissal."
  - FAIL: "The brief omitted S3 and S6, both of which contain
    unfavorable evidence." (no specific fact stated for either source)
  - FAIL: "S3 has a downside for athletics, and S6 raises equity
    concerns." (gestures at a topic without naming the actual finding
    or figure)
- **obj-2**: a false-positive omission (e.g., claiming the brief never
  cites S4, or never cites S2) fails this check even if S3/S6 are
  correctly caught. Listing S5 inside the "omitted sources" finding
  (rather than reserving it for the scope-narrowing finding) also
  breaks the exact-{S3,S6} requirement.
- **obj-3**: prose-located check. Example phrasings:
  - PASS: "The brief only discusses weekday school-year mornings, but
    S5 shows non-school-day sleep deficits are comparable to
    school-day levels for much of the year — a scope the brief never
    mentions [S5]."
  - PASS: "By silently restricting its argument to weekday mornings,
    the brief avoids S5's finding that a weekday-only schedule change
    could worsen weekend circadian misalignment instead of reducing
    the sleep deficit overall."
  - FAIL: "The brief could have discussed more sleep research." (no
    identification of the specific weekday-vs-non-school-day
    narrowing, no citation)
  - FAIL: mentions S5 only as a general "other source" without ever
    stating what scope the brief silently excluded.
- **obj-4**: prose-located check. Example phrasings:
  - PASS: "The brief cites S2's 11-percentage-point absenteeism drop
    but omits S2's own caveat that this assumes full compliance with
    the new bell schedule and excludes the first-year transition
    period, when real improvement would be smaller [S2]."
  - PASS: "S2's estimate comes with a stated caveat — it excludes the
    slower first-year transition — that the brief drops when it
    repeats the 11-point figure."
  - FAIL: "S2's numbers might not tell the whole story." (no specific
    caveat named)
  - FAIL: "The brief should have cited more caveats." (vague, no
    identification of which figure or which caveat)
- **obj-5**: the three findings must be visually/structurally separated
  (headers, numbered sections, or clearly delineated paragraphs), not
  run together as one undifferentiated block; each needs its own
  citation.

### Subjective guidance

- **Omission detection**: does the audit catch the substance of what
  was left out (not just that "some sources were omitted"), and does it
  correctly avoid flagging S1/S2/S4 as omitted?
- **Audit structure**: is each of the three findings independently
  checkable, with citations placed on the specific claim rather than
  clustered generically?
- **Reasoning quality**: does `REASONING.md` explain how it determined
  the brief's citation set and cross-checked it against all six
  sources, rather than assuming which sources were "obviously"
  unfavorable?
