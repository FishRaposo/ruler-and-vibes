---
id: txsyn-03-temporal-conditional
category: transcript-synthesis
title: Release-readiness relative deadlines
deliverables:
  - schedule.json
  - TIMELINE.md
---

## Task

Below is a transcript of a release-readiness meeting. Deadlines are
stated relative to a stated anchor date, and some are conditional on an
external event. You must resolve every deadline to an absolute calendar
date, applying the business-day rule stated in the meeting, and
represent the conditional ship deadline as both of its possible branches.

**Business-day rule (stated explicitly in the meeting): a business day
is Monday through Friday; Saturday and Sunday never count. When counting
"N business days from" a reference date, start counting at the next day
after the reference date, and count only Monday-Friday days until you
reach N.**

Produce `schedule.json` with every deadline resolved to `YYYY-MM-DD`,
plus `TIMELINE.md`, a short human-readable version of the same schedule.

### Release Readiness Sync — Project Halyard

Four people attended: Priya (release manager), Tomas (QA lead), Renata
(security lead), and Callum (vendor liaison).

1. Priya: Let's get everyone aligned on dates. Today is Monday, June 1,
   2026 — that's our anchor for everything below.
2. Priya: Just to state the rule plainly so nobody has to guess: a
   business day is Monday through Friday, weekends never count, and when
   we say "N business days from" a date, we start counting the day
   after that date and only count Monday-Friday days until we hit N.
3. Tomas: Understood. From QA's side: sign-off is due two business days
   from today.
4. Priya: So that's counting from tomorrow, Tuesday, as business day
   one?
5. Tomas: Right — Tuesday is business day one, Wednesday is business day
   two. QA sign-off lands on business day two.
6. Renata: Once QA signs off, security review kicks off. The security
   review lands three business days after QA signs off.
7. Priya: So we count three business days starting the day after QA
   sign-off, same rule, skip the weekend if it falls in that window.
8. Renata: Exactly. Three business days after QA signs off, weekends
   don't count toward those three.
9. Callum: On the vendor side — we're waiting on the software license
   confirmation. I've asked for it by the time security review lands.
10. Priya: So here's the ship plan: we ship at the end of that same week
    — the week the security review lands in — if the vendor confirms
    the license by then. If the vendor hasn't confirmed by then, we
    slip the ship date to the following Monday instead.
11. Callum: Got it, so two possible ship dates depending on whether my
    vendor confirmation comes through in time.
12. Priya: Right. "End of that week" means the Friday of the week the
    security review lands in. The fallback is the Monday right after
    that Friday.
13. Renata: Just to be clear, both of those ship dates are business
    days, no weekend math needed there — they're already Friday and
    Monday.
14. Priya: Correct. So to recap the chain: QA sign-off, then three
    business days later security review, then either that same week's
    Friday (if the vendor confirms in time) or the following Monday (if
    not).
15. Callum: I'll push to get the license confirmation in before the
    Friday cutoff, but I can't promise it from my side alone.
16. Priya: Understood — that's exactly why we need both branches on the
    schedule rather than picking one and hoping.
17. Tomas: Makes sense. I'll have QA sign-off ready right on schedule,
    no slippage expected there.
18. Renata: Same for security review — three business days after QA
    signs off, no change to that estimate.
19. Priya: Great, let's lock in the schedule with both ship branches and
    circulate it today.

## Schema for `schedule.json`

A single JSON object with EXACTLY these keys:

- `qa_signoff` — string, `YYYY-MM-DD`.
- `security_review` — string, `YYYY-MM-DD`.
- `ship_if_vendor_confirms` — string, `YYYY-MM-DD`: the ship date if the
  vendor confirms the license in time.
- `ship_if_vendor_delayed` — string, `YYYY-MM-DD`: the fallback ship date
  if the vendor has not confirmed in time.
- `ship_condition` — string naming the trigger that decides between the
  two ship branches.

## Deliverables

- `schedule.json` — the object described above.
- `TIMELINE.md` (at most 350 words, whole file, `wc -w`) — a short
  human-readable version of the same schedule, including both ship
  branches and the condition between them.

## Constraints

- `schedule.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys.
- Every date must be resolved using the business-day rule stated above —
  weekends never count as business days and never appear as a resolved
  deadline.
- The ship deadline must be represented as BOTH branches (confirmed and
  delayed) plus the condition between them — do not collapse it into a
  single unconditional date.
- `TIMELINE.md` must be at most 350 words (whole file, `wc -w`).
