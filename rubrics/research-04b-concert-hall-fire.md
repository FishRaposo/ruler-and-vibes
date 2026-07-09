---
test: research-04b-concert-hall-fire
canary: "lapis spinel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The timeline table contains exactly 8 event rows, each with a date and at least one [S#] citation from S1-S8, and dossier.md total word count (wc -w, whole file) is at most 1150"
    - id: obj-2
      check: "At least 7 of 8 timeline dates match the answer key below, including partial fire = 14 November and the '02/12' item resolved to 2 December"
    - id: obj-3
      check: "Q3 and Q5 are both explicitly marked insufficient evidence / not answerable from the sources with no fabricated answer, and Q1, Q2, Q4 match the keyed answers"
    - id: obj-4
      check: "Q6 identifies the interview transcript (S5) and the retrospective article (S8) as dependent (same person, Marigold Fenn), not independent corroboration"
    - id: obj-5
      check: "The discrepancy analysis names S3, shows the recomputed component sum 587,150 against the stated 634,000, and states the 46,850 gap (judge recomputes 342000+156750+88400 and 634000-587150 with node)"
  subjective:
    - id: sub-quality
      name: "Investigative rigor"
      weight: 0.4
    - id: sub-craft
      name: "Dossier organization"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Investigative rigor
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Dossier organization
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `research-04-dossier` (same construct, fresh surface).

If the phrase "lapis spinel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key: 8-event timeline

| # | Date | Event | Source(s) |
|---|---|---|---|
| 1 | 12 April 1897 | Construction of Hollow Pine Concert Hall completed | S6 |
| 2 | 5 October | First scorch mark observed near stage wiring | S4 |
| 3 | 14 November | Partial fire in the west wing | S2, S4 (S1's "16 November" is an early, superseded error) |
| 4 | 19 November | Insurance assessor's initial site visit | S3 |
| 5 | 25 November | Full evacuation of the caretaker's residence | S4, S7 |
| 6 | 2 December | Salvage and stabilization work begins | S6 (resolves S7's ambiguous "02/12") |
| 7 | 9 January | Full destruction of the remaining structure | S2, S8 |
| 8 | 20 January | Formal condemnation of the site | S2 |

The "02/12" ambiguity trap: S7's letter uses the shorthand "02/12" with
no further clarification (could mean 2 December or 12 February). S6's
almanac entry explicitly disambiguates: "on the second of December,
salvage and stabilization work began" — this is the only source that
resolves the ambiguity, and it resolves to **2 December**, not 12
February. (12 February would in any case fall after the full destruction
on 9 January and the condemnation on 20 January, which is impossible for
work described as trying to save the structure ahead of its collapse.)

### Answer key: research questions

- **Q1**: 610,000 (pre-fire insured value, stated in S3).
- **Q2**: Linden Marrow (named in S2's official investigation; the "L.
  Marrow, Caretaker" signature in S4's logbook is consistent with this).
- **Q3**: Insufficient evidence — no source states a count of prior
  fire-safety inspections.
- **Q4**: The Aldercross County Fire Review Board (named as the issuing
  body in S2).
- **Q5**: Insufficient evidence — no source addresses what became of
  Caretaker Marrow's career after the fire.
- **Q6**: S5 (interview transcript) and S8 (retrospective article) are
  not independent — S5's interview subject is named Marigold Fenn, and
  S8's byline is also Marigold Fenn. Anything S8 repeats that traces back
  to Fenn's own recollections is not separate corroboration of S5.

### Answer key: discrepancy analysis

S3's primary damage-claim itemization: auditorium structure and roof
342,000 + pipe organ and stage rigging 156,750 + foyer and box-office
fittings 88,400 = **587,150** (node-verified). S3 states a total claim of
**634,000** — an unexplained gap of **46,850** (634,000 − 587,150). S3's
separate ancillary-structures itemization (rehearsal annex 97,500 +
equipment storage barn 41,200 = 138,700, stated as 138,700) is internally
consistent and is a decoy — it must NOT be identified as the discrepancy.

```
342000 + 156750 + 88400 = 587150
634000 - 587150 = 46850
97500 + 41200 = 138700   // decoy — sums correctly, no discrepancy here
```

### Objective check notes

- **obj-1**: exactly 8 timeline rows; run `wc -w` on the whole file for
  the 1,150 cap.
- **obj-2**: 7 or 8 of 8 dates matching passes. The two hardest dates to
  get right are the partial-fire date (14 November, not S1's superseded
  16 November) and the salvage-start date (2 December, resolved from
  S7's ambiguous "02/12" by S6's explicit "second of December" phrasing —
  a submission that guesses "12 February" instead has picked the wrong,
  unsupported reading).
- **obj-3**: Q3 and Q5 test epistemic restraint — a submission that
  invents a plausible-sounding inspection count or a plausible-sounding
  post-fire career for the caretaker (rather than stating insufficient
  evidence) fails this check even if the invented content sounds
  reasonable. Example phrasings (apply to equivalent wordings):
  - PASS: "Q3: the dossier does not record how many inspections
    occurred — insufficient evidence"; "Q5: no source says what the
    caretaker did afterward; cannot be determined"; "Q3: not stated in
    any source, so this cannot be answered".
  - FAIL (fabricated specifics): "Q3: there were two inspections"; "Q5:
    the caretaker retired to the coast and opened a music shop"; "Q3:
    likely one or two routine inspections took place, as is standard"
    (no source states any of this).
- **obj-4**: this is the shared-author dependency check — the byline of
  S8 and the interviewee named in S5 are the same person (Marigold
  Fenn); a submission that treats S8 as separate corroboration for
  anything Fenn says in S5 has missed this. Example phrasings:
  - PASS: "S8 is authored by Fenn, the same person interviewed in S5, so
    it is not independent corroboration of S5"; "S5 and S8 share a
    source and should count once"; "S8 restates Fenn's own views from
    S5, not a second witness".
  - FAIL: "S5 is corroborated by S8" (treats them as independent); "two
    separate accounts confirm this" when the two accounts are S5 and S8;
    "three sources agree" when two of the three are S5 and S8.
- **obj-5**: recompute both sums with node; a submission that names the
  wrong source (e.g., says the ancillary total is the broken one) or
  gets either arithmetic value wrong fails.

### Subjective guidance

- **Investigative rigor**: does the dossier correctly weigh S2 (official,
  based on the caretaker's own logbook) over S1 (early, admittedly
  provisional dispatch) on the partial-fire date, and correctly use S6 as
  the tiebreaker for the ambiguous "02/12" notation rather than guessing?
- **Dossier organization**: can a reader follow the timeline, the six
  question answers, and the discrepancy analysis as three clearly
  separated sections, each independently checkable?
- **Reasoning quality**: does `REASONING.md` explain why S1's date was
  superseded, why "02/12" resolves to 2 December rather than 12
  February, and why Q3/Q5 were left unanswered rather than guessed?
