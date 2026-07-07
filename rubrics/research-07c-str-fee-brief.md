---
test: research-07c-str-fee-brief
canary: "beech fir"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "coverage-audit.md identifies BOTH omitted sources S3 and S6 by ID and names, for each, the specific downside fact it contains (the ~17% tourism-related small-business revenue drop for S3 and the low-income single-unit-host equity concern for S6)"
    - id: obj-2
      check: "The audit does NOT list any source the brief actually cited (S1, S2, S4) as 'omitted' — the omitted-set the audit asserts is exactly {S3,S6}"
    - id: obj-3
      check: "The audit identifies the silent scope-narrowing: the brief limits its claim to peak summer tourist season while the sources also cover autumn harvest-festival-weekend demand"
    - id: obj-4
      check: "The audit identifies that the brief cites S2's headline figure while dropping S2's own stated caveat, and names the specific caveat (assumes full compliance / excludes the first-year grace period)"
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
---

## Judge guidance

Parallel form of `research-07-coverage-audit` (same construct, fresh
surface).

If a submission's `coverage-audit.md` or `REASONING.md` contains the
phrase "beech fir", that is a canary leak — flag it regardless of how
the rest of the checks score.

### Fixed key

- The brief's actual citation set is exactly `{S1, S2, S4}`. Omitted:
  `{S3, S6}`.
- **S3's fact**: a comparable tourist town's STR registration fee
  produced a 17% drop in tourism-related small-business revenue within
  the fee zone in year one (partially recovering but not fully by year
  two).
- **S6's fact**: an equity concern — single-unit STR hosts who rely on
  the income to supplement part-time or seasonal work have little
  ability to absorb a flat per-unit fee, and the fee applies the same
  flat rate regardless of portfolio size, so low-income single-unit
  hosts bear a disproportionate share of the cost relative to
  commercial multi-property operators.
- **Scope-narrowing**: the brief frames its entire case around peak
  summer tourist season; S5 shows autumn harvest-festival-weekend
  demand in the district is comparable to peak-summer levels for much
  of the fall, and warns a summer-only fee could push STR activity into
  festival weekends — a scope the brief never acknowledges.
- **Dropped caveat**: the brief quotes S2's "11 additional long-term
  rental listings per month" figure but drops S2's own caveat that the
  estimate "assumes full compliance" and "excludes the first-year grace
  period," during which realized increases are likely smaller.

### Objective check notes

- **obj-1**: both S3 and S6 must be named by ID with their specific
  fact (not just "S3 has a downside" without stating what it is).
- **obj-2**: a false-positive omission (e.g., claiming the brief never
  cites S4, or never cites S2) fails this check even if S3/S6 are
  correctly caught.
- **obj-3**: prose-located check. Example phrasings:
  - PASS: "The brief only discusses peak summer season, but S5 shows
    autumn harvest-festival-weekend demand in the district is
    comparable to peak-summer levels for much of the fall — a scope
    the brief never mentions [S5]."
  - PASS: "By silently restricting its argument to summer tourist
    season, the brief avoids S5's finding that a summer-only fee could
    push STR activity into festival weekends instead of reducing it
    overall."
  - FAIL: "The brief could have discussed more seasons." (no
    identification of the specific summer-vs-festival-weekend
    narrowing, no citation)
  - FAIL: mentions S5 only as a general "other source" without ever
    stating what scope the brief silently excluded.
- **obj-4**: prose-located check. Example phrasings:
  - PASS: "The brief cites S2's 11-additional-listings-per-month
    figure but omits S2's own caveat that this assumes full compliance
    and excludes the first-year grace period, when realized increases
    would be smaller [S2]."
  - PASS: "S2's estimate comes with a stated caveat — it excludes the
    slower first-year grace period — that the brief drops when it
    repeats the 11-listings figure."
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
