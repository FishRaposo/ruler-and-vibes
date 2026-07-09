---
test: txsyn-03b-clinic-reopening-window
canary: "stainedglass etching"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "reopening.json parses with node (JSON.parse) and `inspection_signoff` === '2026-11-05' (three business days after Mon 2026-11-02: Tue 11/3 =1, Wed 11/4 =2, Thu 11/5 =3)"
    - id: obj-2
      check: "`safety_walkthrough` === '2026-11-11' (four business days after Thu 2026-11-05: Fri 11/6 =1, skip Sat 11/7 & Sun 11/8, Mon 11/9 =2, Tue 11/10 =3, Wed 11/11 =4)"
    - id: obj-3
      check: "the reopening deadline is represented as two branches: `reopen_if_vendor_confirms` === '2026-11-13' (end of that same week = Friday of the week containing Wed 11/11) AND `reopen_if_vendor_delayed` === '2026-11-16' (the following Monday), plus a `reopen_condition` field naming the vendor equipment-delivery confirmation as the trigger"
    - id: obj-4
      check: "every date field (inspection_signoff, safety_walkthrough, reopen_if_vendor_confirms, reopen_if_vendor_delayed), when parsed as new Date(value+'T00:00:00Z') and passed to getUTCDay(), returns a value in 1..5 — no deadline lands on a Saturday or Sunday"
    - id: obj-5
      check: "NOTICE.md is at most 350 words (whole file, wc -w)"
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

Parallel form of `txsyn-03-temporal-conditional` (same construct, fresh
surface).

If the phrase "stainedglass etching" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key: node-verified date chain

Anchor stated in the transcript: "Today is Monday, November 2, 2026."
Node-verified: `new Date('2026-11-02T00:00:00Z').getUTCDay() === 1`
(Monday).

Business-day rule stated in the transcript: business day = Monday
through Friday; weekends never count; counting starts the day after the
reference date.

```
2026-11-02 = Mon (anchor)
2026-11-03 = Tue  -> business day 1 after anchor
2026-11-04 = Wed  -> business day 2 after anchor
2026-11-05 = Thu  -> business day 3 after anchor = inspection_signoff
2026-11-06 = Fri  -> business day 1 after inspection_signoff
2026-11-07 = Sat  -> weekend, does not count
2026-11-08 = Sun  -> weekend, does not count
2026-11-09 = Mon  -> business day 2 after inspection_signoff
2026-11-10 = Tue  -> business day 3 after inspection_signoff
2026-11-11 = Wed  -> business day 4 after inspection_signoff = safety_walkthrough
2026-11-12 = Thu
2026-11-13 = Fri  -> end of the week containing 11/11 = reopen_if_vendor_confirms
2026-11-14 = Sat  -> weekend
2026-11-15 = Sun  -> weekend
2026-11-16 = Mon  -> following Monday = reopen_if_vendor_delayed
```

All getUTCDay() values node-verified: 11/2=1, 11/3=2, 11/4=3, 11/5=4,
11/6=5, 11/7=6, 11/8=0, 11/9=1, 11/10=2, 11/11=3, 11/12=4, 11/13=5,
11/14=6, 11/15=0, 11/16=1.

- `inspection_signoff` = **2026-11-05**
- `safety_walkthrough` = **2026-11-11**
- `reopen_if_vendor_confirms` = **2026-11-13**
- `reopen_if_vendor_delayed` = **2026-11-16**
- `reopen_condition` = must name the vendor's imaging-equipment delivery
  confirmation as the trigger deciding between the two reopening
  branches.

### Objective check notes

- **obj-1/obj-2**: recompute both dates with node before scoring; these
  are exact-match string checks, not "close enough" — a calendar-day
  count instead of a business-day count will land on the wrong date and
  fail. A submission that naively adds 4 calendar days after
  `inspection_signoff` (2026-11-05) lands on 2026-11-09 instead of the
  correct 2026-11-11 — a 2-day gap that fails obj-2 even though 11-09 is
  itself a weekday.
- **obj-3**: both branches must be present as separate fields; a
  submission that collapses this to one unconditional reopening date
  fails regardless of which single date it picks, since the conditional
  structure itself is the point of the test.
- **obj-4**: this is a mechanical sanity check that the business-day
  rule was actually applied — any resolved date landing on Saturday
  (getUTCDay=6) or Sunday (getUTCDay=0) indicates the weekend-skip logic
  was not applied and fails this check independent of the other checks.
  A submission that drops `reopen_if_vendor_confirms` or
  `reopen_if_vendor_delayed` entirely (e.g. collapsing to a single
  `reopen_date` field) also fails obj-4 for those missing fields, since
  an absent value cannot resolve to a weekday.

### Prose-located check: is the conditional reopening deadline represented correctly?

This is a binary judgment about whether `reopen_condition` (and any
prose description of the reopening deadline) correctly conveys two
branches with their trigger, rather than a single collapsed date.

**PASSING** (correctly represents both branches and the trigger):
1. "Reopens 2026-11-13 if the vendor confirms the equipment delivery by
   then, else 2026-11-16."
2. "Two dated branches: 2026-11-13 on delivery confirmation, 2026-11-16
   otherwise."
3. "End-of-week reopening 2026-11-13, conditional on the vendor's
   imaging-equipment delivery confirmation; fallback Monday 2026-11-16
   if not confirmed in time."

**FAILING** (collapses to one date, or drops the trigger):
1. "Reopening date: 2026-11-13." (states a single unconditional date,
   with no fallback branch.)
2. "Reopens end of week." (no resolved date at all.)
3. "Reopening dates are 2026-11-13 and 2026-11-16." (lists both dates
   but never states which condition selects which branch — the trigger
   is missing.)

### Subjective guidance

- **Date-resolution correctness**: did the submission correctly apply
  the business-day rule at every step, including recognizing that the
  weekend between the fire-marshal walkthrough and the "end of that
  week" reopening branch requires no additional skip logic (both 11/13
  and 11/16 already fall on weekdays)?
- **Conditional-branch representation**: is the two-branch reopening
  structure presented clearly in `NOTICE.md`, with the vendor
  equipment-delivery trigger stated explicitly rather than implied?
- **Reasoning quality**: does the submission show its business-day
  counting work (e.g., listing which calendar dates were skipped as
  weekends) rather than asserting resolved dates without a visible
  count, and does it correctly identify "end of that week" as Friday of
  the week containing the fire-marshal walkthrough date rather than
  some other week?
