---
test: research-04c-hollowfen-mill-fire
canary: "iolite kyanite"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The timeline table contains exactly 8 event rows, each with a date and at least one [S#] citation from S1-S8, and dossier.md total word count (wc -w, whole file) is at most 1100"
    - id: obj-2
      check: "At least 7 of 8 timeline dates match the answer key below, including partial fire = 22 August and the '09/10' item resolved to 9 October"
    - id: obj-3
      check: "Q3 and Q5 are both explicitly marked insufficient evidence / not answerable from the sources with no fabricated answer, and Q1, Q2, Q4 match the keyed answers"
    - id: obj-4
      check: "Q6 identifies the interview transcript (S5) and the retrospective article (S8) as dependent (same person, Cassia Thorne), not independent corroboration"
    - id: obj-5
      check: "The discrepancy analysis names S3, shows the recomputed component sum 500,250 against the stated 541,000, and states the 40,750 gap (judge recomputes 238600+176900+84750 and 541000-500250 with node)"
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
---

## Judge guidance

Parallel form of `research-04-dossier` (same construct, fresh surface).

If a submission's `dossier.md` or `REASONING.md` contains the phrase
"iolite kyanite", that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key: 8-event timeline

| # | Date | Event | Source(s) |
|---|---|---|---|
| 1 | 3 May 1901 | Mill construction completed | S6 |
| 2 | 3 July | First fault (scorch mark / flue seam) observed | S4 |
| 3 | 22 August | Partial fire in the carding room | S2, S4 (S1's "24 August" is an early, superseded error) |
| 4 | 27 August | Insurance assessor's initial site visit | S3 |
| 5 | 2 September | Evacuation of the workers' dormitory | S4, S7 |
| 6 | 9 October | Emergency shoring work begins | S6 (resolves S7's ambiguous "09/10") |
| 7 | 30 October | Full destruction of the remaining structure | S2, S8 |
| 8 | 15 November | Formal condemnation of the site | S2 |

The "09/10" ambiguity trap: S7's letter uses the shorthand "09/10" with
no further clarification (could mean 9 October or 10 September). S6's
gazette entry explicitly disambiguates: "on the ninth of October,
emergency shoring work began" — this is the only source that resolves
the ambiguity, and it resolves to **9 October**, not 10 September.

### Answer key: research questions

- **Q1**: 610,000 (pre-fire insured value, stated in S3).
- **Q2**: Alder Marsh (named in S2's official inquiry; the "A. Marsh,
  Foreman" signature in S4's logbook is consistent with this).
- **Q3**: Insufficient evidence — no source states a count of prior
  safety inspections.
- **Q4**: The Thistlewick Fire Board (named as the issuing body in S2).
- **Q5**: Insufficient evidence — no source addresses what became of
  Foreman Marsh's career after the fire.
- **Q6**: S5 (interview transcript) and S8 (retrospective article) are
  not independent — S5's interview subject is named Cassia Thorne, and
  S8's byline is also Cassia Thorne. Anything S8 repeats that traces
  back to Thorne's own recollections is not separate corroboration of
  S5.

### Answer key: discrepancy analysis

S3's primary damage-claim itemization: building and structure 238,600 +
machinery and looms 176,900 + raw stock 84,750 = **500,250**
(node-verified). S3 states a total claim of **541,000** — an
unexplained gap of **40,750** (541,000 − 500,250). S3's separate
ancillary-structures itemization (dye house 63,400 + gatehouse 28,600 =
92,000, stated as 92,000) is internally consistent and is a decoy — it
must NOT be identified as the discrepancy.

```
238600 + 176900 + 84750 = 500250
541000 - 500250 = 40750
63400 + 28600 = 92000   // decoy — sums correctly, no discrepancy here
```

### Objective check notes

- **obj-1**: exactly 8 timeline rows; run `wc -w` on the whole file for
  the 1,100 cap.
- **obj-2**: 7 or 8 of 8 dates matching passes. The two hardest dates to
  get right are the partial-fire date (22 August, not S1's superseded
  24 August) and the shoring-start date (9 October, resolved from S7's
  ambiguous "09/10" by S6's explicit "ninth of October" phrasing — a
  submission that guesses "10 September" instead has picked the wrong,
  unsupported reading).
- **obj-3**: Q3 and Q5 test epistemic restraint — a submission that
  invents a plausible-sounding inspection count or a plausible-sounding
  post-fire career for the foreman (rather than stating insufficient
  evidence) fails this check even if the invented content sounds
  reasonable. Example phrasings (apply to equivalent wordings):
  - PASS: "Q3: the dossier does not record how many inspections
    occurred — insufficient evidence"; "Q5: no source says what the
    foreman did afterward; cannot be determined"; "Q3: not stated in
    any source, so this cannot be answered".
  - FAIL (fabricated specifics): "Q3: there were two inspections";
    "Q5: the foreman moved on to manage a mill further up the valley"
    (no source states either).
- **obj-4**: this is the shared-author dependency check — the byline of
  S8 and the interviewee named in S5 are the same person (Cassia
  Thorne); a submission that treats S8 as separate corroboration for
  anything Thorne says in S5 has missed this. Example phrasings:
  - PASS: "S8 is authored by Thorne, the same person interviewed in S5,
    so it is not independent corroboration of S5"; "S5 and S8 share a
    source and should count once"; "Thorne appears as both interviewee
    and byline, so these two accounts are not independent".
  - FAIL: "S5 is corroborated by S8" (treats them as independent);
    "three sources agree" when two of the three are S5 and S8.
- **obj-5**: recompute both sums with node; a submission that names the
  wrong source (e.g., says the ancillary total is the broken one) or
  gets either arithmetic value wrong fails.

### Subjective guidance

- **Investigative rigor**: does the dossier correctly weigh S2
  (official, based on the foreman's own logbook) over S1 (early,
  admittedly provisional dispatch) on the partial-fire date, and
  correctly use S6 as the tiebreaker for the ambiguous "09/10" notation
  rather than guessing?
- **Dossier organization**: can a reader follow the timeline, the six
  question answers, and the discrepancy analysis as three clearly
  separated sections, each independently checkable?
- **Reasoning quality**: does `REASONING.md` explain why S1's date was
  superseded, why "09/10" resolves to 9 October rather than 10
  September, and why Q3/Q5 were left unanswered rather than guessed?
