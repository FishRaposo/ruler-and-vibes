---
id: calib-01c-launch-log-triage
category: calibration
title: Three-way answerability triage of a rocketry launch-day log
deliverables:
  - triage.json
---

## Task

Below is a fictional model-rocketry club launch-day log (5 flights) and a
fixed list of 10 questions about it, both embedded as fenced blocks. For
each question, decide whether it is:

- **answerable** — a definite answer is entailed by the log. Supply that
  answer.
- **underdetermined** — the log contains partial but insufficient
  information to reach a unique answer (e.g. some but not all of the
  needed facts are present).
- **missing** — the log says nothing at all about the needed field.

```
CLUB LAUNCH LOG — Saturday range day
Flights and pad assignments:

  Rocket  Pad     Apogee (m)   Launch time         Cert decision
  R-1     Pad-1   412          2026-05-09T09:14    Certified, flight #218
  R-2     Pad-1   388          2026-05-09T09:31    Cert pending
  R-3     Pad-2   507          2026-05-09T08:47    Certified, flight #241
  R-4     Pad-2   No lock      2026-05-09T10:05    Certified, flight #196
  R-5     Pad-3   449          2026-05-09T09:58    Certified, flight #203

Notes:
- "Cert pending" means no flight number has been assigned to that rocket
  yet.
- "No lock" means the altimeter never acquired a reading on that flight,
  so no apogee value was recorded.
- R-4 was certified on a range-safety-officer waiver before its altimeter
  data came in; this log does not describe the waiver process further.
- No minimum certification altitude, cutoff apogee, or eligibility policy
  is stated anywhere in this log.
- Range safety officers are not identified in this log.
```

```
QUESTIONS
1. What flight number was assigned to R-3?
2. Which rocket was assigned the highest flight number, and what is it?
3. Which rocket launched earliest?
4. What is R-1's apogee?
5. What is the average apogee of Pad-2?
6. Was R-2 certified?
7. What is the average apogee across all five rockets?
8. What is R-4's apogee?
9. Who was the range safety officer for Pad-3?
10. Was R-4's apogee above or below Pad-2's average apogee?
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
