---
id: txsyn-03b-clinic-reopening-window
category: transcript-synthesis
title: Clinic-reopening relative deadlines
deliverables:
  - reopening.json
  - NOTICE.md
---

## Task

Below is a transcript of a clinic reopening-readiness meeting. Deadlines
are stated relative to a stated anchor date, and some are conditional on
an external event. You must resolve every deadline to an absolute
calendar date, applying the business-day rule stated in the meeting, and
represent the conditional reopening deadline as both of its possible
branches.

**Business-day rule (stated explicitly in the meeting): a business day
is Monday through Friday; Saturday and Sunday never count. When counting
"N business days from" a reference date, start counting at the next day
after the reference date, and count only Monday-Friday days until you
reach N.**

Produce `reopening.json` with every deadline resolved to `YYYY-MM-DD`,
plus `NOTICE.md`, a short human-readable version of the same schedule.

### Reopening Readiness Sync — Alder Cove Community Clinic

Four people attended: Thandiwe (facility operations director), Emeka
(building inspector liaison), Callista (fire marshal liaison), and
Baptiste (equipment vendor liaison).

1. Thandiwe: Let's get everyone aligned on dates. Today is Monday,
   November 2, 2026 — that's our anchor for everything below.
2. Thandiwe: Just to state the rule plainly so nobody has to guess: a
   business day is Monday through Friday, weekends never count, and when
   we say "N business days from" a date, we start counting the day after
   that date and only count Monday-Friday days until we hit N.
3. Emeka: Understood. From the inspection side: the building sign-off is
   due three business days from today.
4. Thandiwe: So that's counting from tomorrow, Tuesday, as business day
   one?
5. Emeka: Right — Tuesday is business day one, Wednesday is business day
   two, Thursday is business day three. Building sign-off lands on
   business day three.
6. Callista: Once the building sign-off lands, the fire-marshal
   walkthrough kicks off. The walkthrough lands four business days after
   the sign-off.
7. Thandiwe: So we count four business days starting the day after
   sign-off, same rule, skip the weekend if it falls in that window.
8. Callista: Exactly. Four business days after sign-off, weekends don't
   count toward those four.
9. Baptiste: On the vendor side — we're waiting on the imaging-equipment
   delivery confirmation. I've asked for it by the time the walkthrough
   lands.
10. Thandiwe: So here's the reopening plan: we reopen at the end of that
    same week — the week the walkthrough lands in — if the vendor
    confirms delivery by then. If the vendor hasn't confirmed by then, we
    slip the reopening date to the following Monday instead.
11. Baptiste: Got it, so two possible reopening dates depending on
    whether my delivery confirmation comes through in time.
12. Thandiwe: Right. "End of that week" means the Friday of the week the
    walkthrough lands in. The fallback is the Monday right after that
    Friday.
13. Callista: Just to be clear, both of those reopening dates are
    business days, no weekend math needed there — they're already Friday
    and Monday.
14. Thandiwe: Correct. So to recap the chain: building sign-off, then
    four business days later the fire-marshal walkthrough, then either
    that same week's Friday (if the vendor confirms in time) or the
    following Monday (if not).
15. Baptiste: I'll push to get the delivery confirmation in before the
    Friday cutoff, but I can't promise it from my side alone.
16. Thandiwe: Understood — that's exactly why we need both branches on
    the schedule rather than picking one and hoping.
17. Emeka: Makes sense. I'll have the building sign-off ready right on
    schedule, no slippage expected there.
18. Callista: Same for the walkthrough — four business days after
    sign-off, no change to that estimate.
19. Thandiwe: Great, let's lock in the schedule with both reopening
    branches and circulate it today.

## Schema for `reopening.json`

A single JSON object with EXACTLY these keys:

- `inspection_signoff` — string, `YYYY-MM-DD`.
- `safety_walkthrough` — string, `YYYY-MM-DD`.
- `reopen_if_vendor_confirms` — string, `YYYY-MM-DD`: the reopening date
  if the vendor confirms the equipment delivery in time.
- `reopen_if_vendor_delayed` — string, `YYYY-MM-DD`: the fallback
  reopening date if the vendor has not confirmed in time.
- `reopen_condition` — string naming the trigger that decides between
  the two reopening branches.

## Deliverables

- `reopening.json` — the object described above.
- `NOTICE.md` (at most 350 words, whole file, `wc -w`) — a short
  human-readable version of the same schedule, including both reopening
  branches and the condition between them.

## Constraints

- `reopening.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys.
- Every date must be resolved using the business-day rule stated above —
  weekends never count as business days and never appear as a resolved
  deadline.
- The reopening deadline must be represented as BOTH branches (confirmed
  and delayed) plus the condition between them — do not collapse it into
  a single unconditional date.
- `NOTICE.md` must be at most 350 words (whole file, `wc -w`).
