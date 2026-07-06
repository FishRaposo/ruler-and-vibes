---
id: calib-03b-turbidity-field-log
category: calibration
title: Graded-confidence answering with abstention on a field survey log
deliverables:
  - answers.json
---

## Task

Below is a fictional estuary field-survey daily log and a fixed list of
6 questions, both embedded as fenced blocks. For each question, either
**answer** it with a stated confidence in `[0, 1]`, or **abstain**.
Calibration matters more than raw hit rate: state high confidence only
when the log actually entails the answer, and abstain (or use very low
confidence) when it does not — confidently answering a question the log
cannot settle is scored harshly.

```
FIELD SURVEY LOG — Thornwell Reach sediment station, 2026-09-23

Timeline:
  06:40  Firmware update pushed to the "sediment-sampler" unit
         (per maintenance log)
  06:52  Turbidity readings begin rising above baseline (per turbidity
         sensor, sampled every 20 minutes — this is the first sample
         showing a rise above baseline)
  06:58  Static-discharge fault logged on the "tide-gauge" instrument —
         a DIFFERENT, unrelated device. No connection to this event is
         stated anywhere in this log.
  07:05  Field technician alerted
  07:14  Field technician clears silt from the sampler intake filter
  07:16  Turbidity readings begin falling (per sensor)
  07:44  Turbidity returns to baseline; sampler marked operational

Field note: the 06:40 firmware update to "sediment-sampler" is suspected
as a contributing factor, since it preceded the turbidity rise. However,
no controlled retest, firmware rollback-and-recheck, or change review was
performed to confirm this connection — the timing is the only evidence.
This log does not state whether the update caused the turbidity rise.

The 06:58 tide-gauge static-discharge fault is recorded in the same
logging console but on an entirely different instrument, with no stated
relationship, shared wiring, or dependency link to the sediment-sampler
event anywhere in this log.
```

```
QUESTIONS
1. What time was the field technician alerted?
2. What action returned the sampler to normal turbidity readings?
3. What time did turbidity return to baseline?
4. Did turbidity begin rising before or after the 06:40 firmware update?
5. Was the 06:40 firmware update the root cause of the turbidity rise?
6. Did the 06:58 tide-gauge static-discharge fault contribute to the
   turbidity rise?
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
