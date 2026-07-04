---
id: calib-01-triage-dossier
category: calibration
title: Three-way answerability triage of a grant-review dossier
deliverables:
  - triage.json
---

## Task

Below is a fictional grant-review dossier (5 applicants) and a fixed list
of 10 questions about it, both embedded as fenced blocks. For each
question, decide whether it is:

- **answerable** — a definite answer is entailed by the dossier. Supply
  that answer.
- **underdetermined** — the dossier contains partial but insufficient
  information to reach a unique answer (e.g. some but not all of the
  needed facts are present).
- **missing** — the dossier says nothing at all about the needed field.

```
GRANT REVIEW DOSSIER — Spring Cycle
Applicants and panel assignments:

  Applicant  Panel   Review score   Submitted     Award decision
  A-1        A       8.7            2026-02-03    Awarded, 76000
  A-2        A       7.9            2026-02-05    Decision pending
  A-3        B       9.1            2026-01-22    Awarded, 82000
  A-4        B       Pending review 2026-03-01    Awarded, 54000
  A-5        C       8.2            2026-02-10    Awarded, 61000

Notes:
- "Decision pending" means no award amount has been set for that
  applicant yet.
- "Pending review" means that applicant's review score has not been
  entered yet.
- A-4 received a panel-chair override award before its review score was
  entered; this dossier does not explain the override process further.
- No approval threshold, cutoff score, or funding policy is stated
  anywhere in this dossier.
- Panel chairs are not identified in this dossier.
```

```
QUESTIONS
1. What is A-3's award amount?
2. Which applicant received the highest award, and how much?
3. Which applicant submitted their application earliest?
4. What is A-1's review score?
5. What is the average review score of Panel B?
6. Was A-2 approved for funding?
7. What is the average review score across all five applicants?
8. What is A-4's review score?
9. Who is the panel chair for Panel C?
10. Was A-4's review score above or below Panel B's average review score?
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
