---
test: txsyn-03c-aquarium-exhibit-opening
canary: "woodcut gazetteer"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "schedule.json parses with node (JSON.parse) and `structural_signoff` === '2026-09-04' (three business days after Tue 2026-09-01: Wed 9/2 =1, Thu 9/3 =2, Fri 9/4 =3)"
    - id: obj-2
      check: "`marine_safety_review` === '2026-09-10' (four business days after Fri 2026-09-04: Mon 9/7 =1, Tue 9/8 =2, Wed 9/9 =3, Thu 9/10 =4, skipping Sat 9/5 & Sun 9/6)"
    - id: obj-3
      check: "the opening deadline is represented as two branches: `open_if_cert_confirmed` === '2026-09-11' (end of that same week = Friday of the week containing Thu 9/10) AND `open_if_cert_delayed` === '2026-09-14' (the following Monday), plus an `open_condition` field naming the state water-quality certification confirmation as the trigger"
    - id: obj-4
      check: "every date field (structural_signoff, marine_safety_review, open_if_cert_confirmed, open_if_cert_delayed), when parsed as new Date(value+'T00:00:00Z') and passed to getUTCDay(), returns a value in 1..5 — no deadline lands on a Saturday or Sunday"
    - id: obj-5
      check: "TIMELINE.md is at most 350 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Date-resolution correctness"
      weight: 0.4
    - id: sub-craft
      name: "Conditional-branch representation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `txsyn-03-temporal-conditional` (same construct, fresh
surface).

If the phrase "woodcut gazetteer" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key: node-verified date chain

Anchor stated in the transcript: "Today is Tuesday, September 1, 2026."
Node-verified: `new Date('2026-09-01T00:00:00Z').getUTCDay() === 2`
(Tuesday).

Business-day rule stated in the transcript: business day = Monday
through Friday; weekends never count; counting starts the day after the
reference date.

```
2026-09-01 = Tue (anchor)
2026-09-02 = Wed  -> business day 1 after anchor
2026-09-03 = Thu  -> business day 2 after anchor
2026-09-04 = Fri  -> business day 3 after anchor = structural_signoff
2026-09-05 = Sat  -> weekend, does not count
2026-09-06 = Sun  -> weekend, does not count
2026-09-07 = Mon  -> business day 1 after structural_signoff
2026-09-08 = Tue  -> business day 2 after structural_signoff
2026-09-09 = Wed  -> business day 3 after structural_signoff
2026-09-10 = Thu  -> business day 4 after structural_signoff = marine_safety_review
2026-09-11 = Fri  -> end of the week containing 9/10 = open_if_cert_confirmed
2026-09-12 = Sat  -> weekend
2026-09-13 = Sun  -> weekend
2026-09-14 = Mon  -> following Monday = open_if_cert_delayed
```

All getUTCDay() values node-verified: 9/1=2, 9/2=3, 9/3=4, 9/4=5, 9/5=6,
9/6=0, 9/7=1, 9/8=2, 9/9=3, 9/10=4, 9/11=5, 9/12=6, 9/13=0, 9/14=1.

- `structural_signoff` = **2026-09-04**
- `marine_safety_review` = **2026-09-10**
- `open_if_cert_confirmed` = **2026-09-11**
- `open_if_cert_delayed` = **2026-09-14**
- `open_condition` = must name the state water-quality certification
  confirmation as the trigger deciding between the two opening branches.

### Objective check notes

- **obj-1/obj-2**: recompute both dates with node before scoring; these
  are exact-match string checks, not "close enough" — a calendar-day
  count, or an off-by-one count that treats the reference date itself as
  business day one, will land on the wrong date and fail.
- **obj-3**: both branches must be present as separate fields; a
  submission that collapses this to one unconditional opening date fails
  regardless of which single date it picks, since the conditional
  structure itself is the point of the test.
- **obj-4**: this is a mechanical sanity check that the business-day
  rule was actually applied — any resolved date landing on Saturday
  (getUTCDay=6) or Sunday (getUTCDay=0) indicates the weekend-skip logic
  was not applied and fails this check independent of the other checks.

### Prose-located check: is the conditional opening deadline represented correctly?

This is a binary judgment about whether `open_condition` (and any prose
description of the opening deadline) correctly conveys two branches with
their trigger, rather than a single collapsed date.

**PASSING** (correctly represents both branches and the trigger):
1. "Opens 2026-09-11 if the state confirms the water-quality
   certification by then, else 2026-09-14."
2. "Two dated branches: 2026-09-11 on state certification confirmation,
   2026-09-14 otherwise."
3. "End-of-week opening 2026-09-11, conditional on the state
   water-quality certification; fallback Monday 2026-09-14 if not
   confirmed in time."

**FAILING** (collapses to one date, or drops the trigger):
1. "Opening date: 2026-09-11." (states a single unconditional date, with
   no fallback branch.)
2. "Opens end of week." (no resolved date at all.)
3. "Opening dates are 2026-09-11 and 2026-09-14." (lists both dates but
   never states which condition selects which branch — the trigger is
   missing.)

### Subjective guidance

- **Date-resolution correctness**: did the submission correctly apply
  the business-day rule at every step, including recognizing that the
  weekend between the marine safety review and the "end of that week"
  opening branch requires no additional skip logic (both 9/11 and 9/14
  already fall on weekdays)?
- **Conditional-branch representation**: is the two-branch opening
  structure presented clearly in `TIMELINE.md`, with the state
  certification trigger stated explicitly rather than implied?
- **Reasoning quality**: does the submission show its business-day
  counting work (e.g., listing which calendar dates were skipped as
  weekends) rather than asserting resolved dates without a visible
  count, and does it correctly identify "end of that week" as Friday of
  the week containing the marine safety review date rather than some
  other week?
