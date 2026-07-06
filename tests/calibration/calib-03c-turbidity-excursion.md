---
id: calib-03c-turbidity-excursion
category: calibration
title: Graded-confidence answering with abstention on a water-treatment log
deliverables:
  - answers.json
---

## Task

Below is a fictional drinking-water treatment operations log and a fixed
list of 6 questions, both embedded as fenced blocks. For each question,
either **answer** it with a stated confidence in `[0, 1]`, or
**abstain**. Calibration matters more than raw hit rate: state high
confidence only when the log actually entails the answer, and abstain
(or use very low confidence) when it does not — confidently answering a
question the log cannot settle is scored harshly.

```
OPERATIONS LOG — Ostara Water plant, Halewood filtration hall, 2026-05-09

Log entries:
  07:40  Coagulant dose on Filter-3 train reduced from 2.4 to 1.9 mg/L
         (per dosing-controller setpoint change)
  07:52  Filtered-water turbidity first sample above the 0.30 NTU target
         (per online turbidimeter, sampled every 12 minutes — this is
         the first sample showing a reading over target)
  07:58  High-vibration alarm logged on the Train-B backwash pump — a
         DIFFERENT, unrelated process train. No connection to this
         excursion is stated anywhere in this log.
  08:04  SCADA turbidity alarm raised; duty operator alerted
  08:15  Duty operator takes Filter-3 offline and initiates a backwash
  08:16  Filtered-water turbidity begins falling (per turbidimeter)
  08:40  Turbidity returns within the 0.30 NTU target; filter returned
         to service and excursion marked cleared

Shift note: the 07:40 coagulant-dose reduction on the Filter-3 train is
suspected as a contributing factor, since it preceded the turbidity
rise. However, no jar test, dose-restore-and-recheck, or coagulation
bench confirmation was performed to verify this — the timing is the only
evidence. This log does not state whether the dose reduction caused the
turbidity rise.

The 07:58 Train-B backwash-pump vibration alarm is recorded in the same
SCADA system but on an entirely separate process train, with no stated
relationship, shared filter, or hydraulic dependency to the Filter-3
excursion anywhere in this log.
```

```
QUESTIONS
1. What time was the duty operator alerted?
2. What action cleared the turbidity excursion?
3. What time did turbidity return within target?
4. Did the turbidity begin rising before or after the 07:40 coagulant-dose reduction?
5. Was the 07:40 coagulant-dose reduction the root cause of the turbidity rise?
6. Did the 07:58 Train-B backwash-pump alarm contribute to the excursion?
```

## Deliverables

- `answers.json` — a strict JSON array of exactly 6 objects, one per
  question, each with keys:
  - `id` — the question number (1-6)
  - `answer_or_abstain` — `"answer"` or `"abstain"`
  - `answer` — the answer text when answering; `null` when abstaining
  - `confidence` — a number in `[0, 1]` when answering; `null` when
    abstaining

## Constraints

- The file must be valid JSON (parses with `JSON.parse`, no comments,
  no trailing commas).
- Do not abstain on everything to avoid risk — at least 4 of the 6
  questions must be answered.
- Do not state high confidence on a question the log explicitly flags as
  unconfirmed or unconnected.
