---
id: calib-01b-lot-intake-ledger
category: calibration
title: Three-way answerability triage of a coffee-lot intake ledger
deliverables:
  - triage.json
---

## Task

Below is a fictional green-bean intake ledger from a coffee roastery (5
lots) and a fixed list of 10 questions about it, both embedded as fenced
blocks. For each question, decide whether it is:

- **answerable** — a definite answer is entailed by the ledger. Supply
  that answer.
- **underdetermined** — the ledger contains partial but insufficient
  information to reach a unique answer (e.g. some but not all of the
  needed facts are present).
- **missing** — the ledger says nothing at all about the needed field.

```
GREEN-BEAN INTAKE LEDGER — Autumn Intake
Lots and roast-line assignments:

  Lot   Roast line   Cupping score   Received      Purchase decision
  L-1   Aurora       8.4             2026-04-09    Purchased, 7.10
  L-2   Aurora       7.6             2026-04-12    Decision pending
  L-3   Meridian     9.0             2026-03-28    Purchased, 6.40
  L-4   Meridian     Pending cup     2026-05-02    Purchased, 5.20
  L-5   Solstice     8.1             2026-04-18    Purchased, 5.90

Notes:
- Prices are US dollars per kilogram of green coffee.
- "Decision pending" means no purchase price has been set for that lot
  yet.
- "Pending cup" means that lot's cupping score has not been entered yet.
- L-4 received a head-buyer override purchase before its cupping score
  was entered; this ledger does not explain the override process
  further.
- No purchase threshold, minimum cupping score, or sourcing policy is
  stated anywhere in this ledger.
- Roast-line leads are not identified in this ledger.
```

```
QUESTIONS
1. What is L-1's purchase price?
2. Which lot was purchased at the highest price, and how much?
3. Which lot was received earliest?
4. What is L-3's cupping score?
5. What is the average cupping score of the Meridian line?
6. Was L-2 approved for purchase?
7. What is the average cupping score across all five lots?
8. What is L-4's cupping score?
9. Who is the roast-line lead for the Solstice line?
10. Was L-4's cupping score above or below the Meridian line's average
    cupping score?
```

## Deliverables

- `triage.json` — a strict JSON array of exactly 10 objects, one per
  question, each with keys:
  - `id` — the question number (1-10)
  - `label` — one of `"answerable"`, `"underdetermined"`, or `"missing"`
  - `answer` — the entailed value when `label` is `"answerable"`;
    `null` otherwise

## Constraints

- The file must be valid JSON (parses with `JSON.parse`, no comments, no
  trailing commas).
- Every question 1-10 must appear exactly once.
- Do not guess or interpolate a value for `underdetermined` or
  `missing` questions — `answer` must be exactly `null` for those.
