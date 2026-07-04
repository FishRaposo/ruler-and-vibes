---
test: research-04-dossier
canary: "saffron ocarina"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The timeline table contains exactly 8 event rows, each with a date and at least one [S#] citation from S1-S8, and dossier.md total word count (wc -w, whole file) is at most 1100"
    - id: obj-2
      check: "At least 7 of 8 timeline dates match the answer key below, including partial collapse = 17 March and the '03/04' item resolved to 3 April"
    - id: obj-3
      check: "Q3 and Q5 are both explicitly marked insufficient evidence / not answerable from the sources with no fabricated answer, and Q1, Q2, Q4 match the keyed answers"
    - id: obj-4
      check: "Q6 identifies the interview transcript (S5) and the retrospective article (S8) as dependent (same person, Persimmon Wilde), not independent corroboration"
    - id: obj-5
      check: "The discrepancy analysis names S3, shows the recomputed component sum 479,750 against the stated 512,000, and states the 32,250 gap (judge recomputes 264000+118500+97250 and 512000-479750 with node)"
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

If a submission's `dossier.md` or `REASONING.md` contains the phrase
"saffron ocarina", that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key: 8-event timeline

| # | Date | Event | Source(s) |
|---|---|---|---|
| 1 | 14 June 1888 | Lighthouse construction completed | S6 |
| 2 | 2 February | First structural crack observed | S4 |
| 3 | 17 March | Partial collapse of the north gallery | S2, S4 (S1's "19 March" is an early, superseded error) |
| 4 | 22 March | Insurance assessor's initial site visit | S3 |
| 5 | 28 March | Full evacuation of the keeper's residence | S4, S7 |
| 6 | 3 April | Emergency shoring work begins | S6 (resolves S7's ambiguous "03/04") |
| 7 | 9 April | Full collapse of the remaining structure | S2, S8 |
| 8 | 15 April | Formal condemnation of the site | S2 |

The "03/04" ambiguity trap: S7's letter uses the shorthand "03/04" with
no further clarification (could mean 3 April or 4 March). S6's almanac
entry explicitly disambiguates: "on the third of April, emergency
shoring work began" — this is the only source that resolves the
ambiguity, and it resolves to **3 April**, not 4 March.

### Answer key: research questions

- **Q1**: 425,000 (pre-collapse insured value, stated in S3).
- **Q2**: Wren Ashdown (named in S2's official inquiry; the "W. Ashdown,
  Keeper" signature in S4's logbook is consistent with this).
- **Q3**: Insufficient evidence — no source states a count of prior
  structural inspections.
- **Q4**: The Grey Harbor Maritime Board (named as the issuing body in
  S2).
- **Q5**: Insufficient evidence — no source addresses what became of
  Keeper Ashdown's career after the collapse.
- **Q6**: S5 (interview transcript) and S8 (retrospective article) are
  not independent — S5's interview subject is named Persimmon Wilde, and
  S8's byline is also Persimmon Wilde. Anything S8 repeats that traces
  back to Wilde's own recollections is not separate corroboration of
  S5.

### Answer key: discrepancy analysis

S3's primary damage-claim itemization: masonry 264,000 + lantern
assembly 118,500 + access road 97,250 = **479,750** (node-verified). S3
states a total claim of **512,000** — an unexplained gap of **32,250**
(512,000 − 479,750). S3's separate ancillary-structures itemization
(boathouse 148,000 + storage shed 52,500 = 200,500, stated as 200,500) is
internally consistent and is a decoy — it must NOT be identified as the
discrepancy.

```
264000 + 118500 + 97250 = 479750
512000 - 479750 = 32250
148000 + 52500 = 200500   // decoy — sums correctly, no discrepancy here
```

### Objective check notes

- **obj-1**: exactly 8 timeline rows; run `wc -w` on the whole file for
  the 1,100 cap.
- **obj-2**: 7 or 8 of 8 dates matching passes. The two hardest dates to
  get right are the partial-collapse date (17 March, not S1's superseded
  19 March) and the shoring-start date (3 April, resolved from S7's
  ambiguous "03/04" by S6's explicit "third of April" phrasing — a
  submission that guesses "4 March" instead has picked the wrong,
  unsupported reading).
- **obj-3**: Q3 and Q5 test epistemic restraint — a submission that
  invents a plausible-sounding inspection count or a plausible-sounding
  post-collapse career for the keeper (rather than stating insufficient
  evidence) fails this check even if the invented content sounds
  reasonable.
- **obj-4**: this is the shared-author dependency check — the byline of
  S8 and the interviewee named in S5 are the same person
  (Persimmon Wilde); a submission that treats S8 as separate
  corroboration for anything Wilde says in S5 has missed this.
- **obj-5**: recompute both sums with node; a submission that names the
  wrong source (e.g., says the ancillary total is the broken one) or
  gets either arithmetic value wrong fails.

### Subjective guidance

- **Investigative rigor**: does the dossier correctly weigh S2 (official,
  based on the keeper's own logbook) over S1 (early, admittedly
  provisional dispatch) on the partial-collapse date, and correctly use
  S6 as the tiebreaker for the ambiguous "03/04" notation rather than
  guessing?
- **Dossier organization**: can a reader follow the timeline, the six
  question answers, and the discrepancy analysis as three clearly
  separated sections, each independently checkable?
- **Reasoning quality**: does `REASONING.md` explain why S1's date was
  superseded, why "03/04" resolves to 3 April rather than 4 March, and
  why Q3/Q5 were left unanswered rather than guessed?
