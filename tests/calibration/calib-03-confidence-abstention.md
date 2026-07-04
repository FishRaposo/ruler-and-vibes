---
id: calib-03-confidence-abstention
category: calibration
title: Graded-confidence answering with abstention on an incident report
deliverables:
  - answers.json
---

## Task

Below is a fictional operational incident report and a fixed list of 6
questions, both embedded as fenced blocks. For each question, either
**answer** it with a stated confidence in `[0, 1]`, or **abstain**.
Calibration matters more than raw hit rate: state high confidence only
when the report actually entails the answer, and abstain (or use very
low confidence) when it does not — confidently answering a question
the report cannot settle is scored harshly.

```
INCIDENT REPORT — Meridian batch-job service, 2026-04-11

Timeline:
  13:55  Config push deployed to the "ingest-worker" fleet (per deploy log)
  14:02  Queue depth begins climbing (per queue_depth telemetry,
         sampled every 15 minutes — this is the first sample showing
         a rise above baseline)
  14:05  Brief network blip logged on "auth-gateway" — a DIFFERENT,
         unrelated service. No connection to this incident is stated
         anywhere in this report.
  14:10  On-call engineer paged
  14:18  On-call engineer restarts the "ingest-worker" fleet
  14:19  Queue depth begins falling (per telemetry)
  14:47  Queue depth reaches zero; service marked recovered

Postmortem note: the 13:55 config push to "ingest-worker" is suspected
as a contributing factor, since it preceded the queue buildup. However,
no causal test, rollback-and-retest, or code diff review was performed
to confirm this connection — the timing is the only evidence. This
report does not state whether the push caused the buildup.

The 14:05 auth-gateway network blip is logged in the same monitoring
system but on an entirely different service, with no stated
relationship, shared infrastructure, or dependency link to the
ingest-worker incident anywhere in this report.
```

```
QUESTIONS
1. What time was the on-call engineer paged?
2. What action resolved the incident?
3. What time did the service return to normal?
4. Did the queue depth start climbing before or after the 13:55 config push?
5. Was the 13:55 config push the root cause of the queue buildup?
6. Did the 14:05 auth-gateway network blip contribute to the outage?
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
- Do not state high confidence on a question the report explicitly
  flags as unconfirmed or unconnected.
