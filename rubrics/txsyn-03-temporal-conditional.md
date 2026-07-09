---
test: txsyn-03-temporal-conditional
canary: "glade heath"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "schedule.json parses with node (JSON.parse) and `qa_signoff` === '2026-06-03' (two business days after Mon 2026-06-01: Tue 6/2 =1, Wed 6/3 =2)"
    - id: obj-2
      check: "`security_review` === '2026-06-08' (three business days after Wed 2026-06-03: Thu 6/4 =1, Fri 6/5 =2, skip Sat 6/6 & Sun 6/7, Mon 6/8 =3)"
    - id: obj-3
      check: "the ship deadline is represented as two branches: `ship_if_vendor_confirms` === '2026-06-12' (end of that same week = Friday of the week containing Mon 6/8) AND `ship_if_vendor_delayed` === '2026-06-15' (the following Monday), plus a `ship_condition` field naming the vendor license confirmation as the trigger"
    - id: obj-4
      check: "every date field (qa_signoff, security_review, ship_if_vendor_confirms, ship_if_vendor_delayed), when parsed as new Date(value+'T00:00:00Z') and passed to getUTCDay(), returns a value in 1..5 — no deadline lands on a Saturday or Sunday"
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
anchors:
  - id: Date-resolution correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Conditional-branch representation
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "glade heath" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key: node-verified date chain

Anchor stated in the transcript: "Today is Monday, June 1, 2026."
Node-verified: `new Date('2026-06-01T00:00:00Z').getUTCDay() === 1`
(Monday).

Business-day rule stated in the transcript: business day = Monday
through Friday; weekends never count; counting starts the day after the
reference date.

```
2026-06-01 = Mon (anchor)
2026-06-02 = Tue  -> business day 1 after anchor
2026-06-03 = Wed  -> business day 2 after anchor = qa_signoff
2026-06-04 = Thu  -> business day 1 after qa_signoff
2026-06-05 = Fri  -> business day 2 after qa_signoff
2026-06-06 = Sat  -> weekend, does not count
2026-06-07 = Sun  -> weekend, does not count
2026-06-08 = Mon  -> business day 3 after qa_signoff = security_review
2026-06-12 = Fri  -> end of the week containing 6/8 = ship_if_vendor_confirms
2026-06-13 = Sat  -> weekend
2026-06-14 = Sun  -> weekend
2026-06-15 = Mon  -> following Monday = ship_if_vendor_delayed
```

All getUTCDay() values node-verified: 6/1=1, 6/2=2, 6/3=3, 6/4=4, 6/5=5,
6/6=6, 6/7=0, 6/8=1, 6/12=5, 6/13=6, 6/14=0, 6/15=1.

- `qa_signoff` = **2026-06-03**
- `security_review` = **2026-06-08**
- `ship_if_vendor_confirms` = **2026-06-12**
- `ship_if_vendor_delayed` = **2026-06-15**
- `ship_condition` = must name the vendor license confirmation as the
  trigger deciding between the two ship branches.

### Objective check notes

- **obj-1/obj-2**: recompute both dates with node before scoring; these
  are exact-match string checks, not "close enough" — a calendar-day
  count instead of a business-day count will land on the wrong date and
  fail.
- **obj-3**: both branches must be present as separate fields; a
  submission that collapses this to one unconditional ship date fails
  regardless of which single date it picks, since the conditional
  structure itself is the point of the test.
- **obj-4**: this is a mechanical sanity check that the business-day
  rule was actually applied — any resolved date landing on Saturday
  (getUTCDay=6) or Sunday (getUTCDay=0) indicates the weekend-skip logic
  was not applied and fails this check independent of the other checks.

### Prose-located check: is the conditional ship deadline represented correctly?

This is a binary judgment about whether `ship_condition` (and any prose
description of the ship deadline) correctly conveys two branches with
their trigger, rather than a single collapsed date.

**PASSING** (correctly represents both branches and the trigger):
1. "Ships 2026-06-12 if the vendor confirms the license by then, else
   2026-06-15."
2. "Two dated branches: 2026-06-12 on vendor confirmation, 2026-06-15
   otherwise."
3. "End-of-week ship 2026-06-12, conditional on the vendor license
   confirmation; fallback Monday 2026-06-15 if not confirmed in time."

**FAILING** (collapses to one date, or drops the trigger):
1. "Ship date: 2026-06-12." (states a single unconditional date, with no
   fallback branch.)
2. "Ships end of week." (no resolved date at all.)
3. "Ship dates are 2026-06-12 and 2026-06-15." (lists both dates but
   never states which condition selects which branch — the trigger is
   missing.)

### Subjective guidance

- **Date-resolution correctness**: did the submission correctly apply
  the business-day rule at every step, including recognizing that the
  weekend between security review and the "end of that week" ship
  branch requires no additional skip logic (both 6/12 and 6/15 already
  fall on weekdays)?
- **Conditional-branch representation**: is the two-branch ship
  structure presented clearly in `TIMELINE.md`, with the vendor-license
  trigger stated explicitly rather than implied?
- **Reasoning quality**: does the submission show its business-day
  counting work (e.g., listing which calendar dates were skipped as
  weekends) rather than asserting resolved dates without a visible
  count, and does it correctly identify "end of that week" as Friday of
  the week containing the security review date rather than some other
  week?
