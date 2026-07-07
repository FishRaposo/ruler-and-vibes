---
id: sched-04c-recording-booth-slates
category: temporal-scheduling
title: Booth slate feasibility — place every session or prove it cannot be done
deliverables:
  - booth-feasibility.md
---

## Task

A small studio, Kettlebrook Sound, has exactly ONE soundproof vocal
booth. The booth hosts sessions one at a time (no two sessions may overlap,
though one may end exactly when the next begins). Every client session
has a release time (the earliest hour the client can arrive), a
deadline (the latest hour by which the session must be fully
finished), and a fixed duration in hours. A session must be placed
entirely within its own `[release, deadline]` window — it cannot start
before its release time, and start + duration cannot exceed its
deadline.

You are given the booth's booking requests for TWO independent days.
The booth and its clock reset overnight, so Tuesday's requests and
Wednesday's requests are entirely separate instances — nothing carries
over between them.

For EACH day, decide feasibility:

- If the day's requests are satisfiable, give a concrete valid start
  time for every session such that no two sessions' intervals overlap
  and every session lies fully inside its own window.
- If the day's requests are unsatisfiable, declare UNSAT and give the
  specific reason, grounded in the actual numbers (not just "no
  arrangement found after trying a few orders").

**Tuesday's requests:**

| Session | Release | Deadline | Duration |
|---------|---------|----------|----------|
| P       | 1       | 6        | 3        |
| Q       | 3       | 10       | 4        |
| R       | 7       | 13       | 3        |

**Wednesday's requests:**

| Session | Release | Deadline | Duration |
|---------|---------|----------|----------|
| X       | 2       | 9        | 4        |
| Y       | 3       | 8        | 3        |
| Z       | 4       | 9        | 2        |

Treat the two days as fully independent. Do not assume they behave the
same way — verify each on its own terms.

## Deliverables

- `booth-feasibility.md` — must contain, clearly labeled per day:
  - **Tuesday:** the verdict (SAT) and a start time for each of P, Q, R
    such that all three fit their own windows with no overlap.
  - **Wednesday:** the verdict (UNSAT) and a justification stated in
    terms of the actual release/deadline/duration numbers — not merely
    "I tried some orderings and none worked."

## Constraints

- Treat the two days as fully independent; a correct submission gets
  ONE verdict right for each — they are not required to match.
- Any valid SAT witness for Tuesday is acceptable as long as it
  satisfies every session's window and produces no pairwise overlap.
- An UNSAT claim must be backed by a reason grounded in the specific
  numbers given (e.g. a capacity/window argument), not an assertion
  that a search failed.
