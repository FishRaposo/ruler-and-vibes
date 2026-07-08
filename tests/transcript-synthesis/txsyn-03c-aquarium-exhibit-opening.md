---
id: txsyn-03c-aquarium-exhibit-opening
category: transcript-synthesis
title: Exhibit-opening relative deadlines
deliverables:
  - schedule.json
  - TIMELINE.md
---

## Task

Below is a transcript of an exhibit-opening readiness meeting for a
public aquarium. Deadlines are stated relative to a stated anchor date,
and one of them is conditional on an external event. You must resolve
every deadline to an absolute calendar date, applying the business-day
rule stated in the meeting, and represent the conditional opening
deadline as both of its possible branches.

**Business-day rule (stated explicitly in the meeting): a business day
runs Monday through Friday — Saturday and Sunday are never counted.
When a deadline is stated as "N business days from" some reference
date, counting begins on the day immediately following that reference
date, and only Monday-through-Friday days advance the count until N is
reached.**

Produce `schedule.json` with every deadline resolved to `YYYY-MM-DD`,
plus `TIMELINE.md`, a short human-readable version of the same schedule.

### Kelp Forest Wing Opening Readiness Sync — Tidewell Aquarium

Four people attended: Marisol (aquarium operations director), Idris
(structural engineer lead), Yusuf (marine safety officer), and Greta
(state certification liaison).

1. Marisol: Let's get everyone aligned on dates. Today is Tuesday,
   September 1, 2026 — that's our anchor for everything below.
2. Marisol: Just to state the rule plainly so nobody has to guess: a
   business day is Monday through Friday, weekends never count, and
   when we say "N business days from" a date, we start counting the day
   after that date and only count Monday-Friday days until we hit N.
3. Idris: Understood. From the structural side: sign-off is due four
   business days from today.
4. Marisol: So that's counting from tomorrow, Wednesday, as business
   day one?
5. Idris: Right — Wednesday is business day one, Thursday is business
   day two, Friday is business day three, and — skipping the weekend —
   Monday is business day four. Structural sign-off lands on business
   day four.
6. Yusuf: Once structural sign-off happens, the marine safety review
   kicks off. The marine safety review lands two business days after
   structural sign-off.
7. Marisol: So we count two business days starting the day after
   structural sign-off, same rule, skip the weekend if it falls in that
   window.
8. Yusuf: Exactly. Two business days after structural sign-off,
   weekends don't count toward those two.
9. Greta: On the state side — we're waiting on the water-quality
   certification. I've asked for it by the time the marine safety
   review lands.
10. Marisol: So here's the opening plan: we open the wing to the public
    at the end of that same week — the week the marine safety review
    lands in — if the state confirms the certification by then. If the
    state hasn't confirmed by then, we push the opening to the
    following Monday instead.
11. Greta: Got it, so two possible opening dates depending on whether my
    certification confirmation comes through in time.
12. Marisol: Right. "End of that week" means the Friday of the week the
    marine safety review lands in. The fallback is the Monday right
    after that Friday.
13. Yusuf: Just to be clear, both of those opening dates are business
    days, no weekend math needed there — they're already Friday and
    Monday.
14. Marisol: Correct. So to recap the chain: structural sign-off, then
    two business days later the marine safety review, then either that
    same week's Friday (if the state confirms in time) or the following
    Monday (if not).
15. Greta: I'll push to get the certification confirmed before the
    Friday cutoff, but I can't promise it from my side alone.
16. Marisol: Understood — that's exactly why we need both branches on
    the schedule rather than picking one and hoping.
17. Idris: Makes sense. I'll have structural sign-off ready right on
    schedule, no slippage expected there.
18. Yusuf: Same for the marine safety review — two business days after
    structural sign-off, no change to that estimate.
19. Marisol: Great, let's lock in the schedule with both opening
    branches and circulate it today.

## Schema for `schedule.json`

A single JSON object with EXACTLY these keys:

- `structural_signoff` — string, `YYYY-MM-DD`.
- `marine_safety_review` — string, `YYYY-MM-DD`.
- `open_if_cert_confirmed` — string, `YYYY-MM-DD`: the opening date if
  the state confirms the water-quality certification in time.
- `open_if_cert_delayed` — string, `YYYY-MM-DD`: the fallback opening
  date if the state has not confirmed in time.
- `open_condition` — string naming the trigger that decides between the
  two opening branches.

## Deliverables

- `schedule.json` — the object described above.
- `TIMELINE.md` (at most 350 words, whole file, `wc -w`) — a short
  human-readable version of the same schedule, including both opening
  branches and the condition between them.

## Constraints

- `schedule.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys.
- Every date must be resolved using the business-day rule stated above —
  weekends never count as business days and never appear as a resolved
  deadline.
- The opening deadline must be represented as BOTH branches (confirmed
  and delayed) plus the condition between them — do not collapse it into
  a single unconditional date.
- `TIMELINE.md` must be at most 350 words (whole file, `wc -w`).
