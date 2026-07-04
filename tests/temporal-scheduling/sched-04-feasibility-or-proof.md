---
id: sched-04-feasibility-or-proof
category: temporal-scheduling
title: Feasibility — place every event or prove it cannot be done
deliverables:
  - feasibility.md
---

## Task

You are given TWO independent single-room scheduling instances. In
each instance, one room hosts events one at a time (no two events may
overlap, though one may end exactly when another begins). Every event
has a release time (the earliest it may start), a deadline (the latest
time by which it must be fully finished), and a fixed duration. An
event must be placed entirely within its own `[release, deadline]`
window — it cannot start before its release time, and start + duration
cannot exceed its deadline.

For EACH instance, decide feasibility:

- If the instance is satisfiable, give a concrete valid start time for
  every event such that no two events' intervals overlap and every
  event lies fully inside its own window.
- If the instance is unsatisfiable, declare UNSAT and give the specific
  reason, grounded in the actual numbers (not just "no schedule found
  after trying").

**Scenario S:**

| Event | Release | Deadline | Duration |
|-------|---------|----------|----------|
| A     | 0       | 3        | 2        |
| B     | 2       | 8        | 3        |
| C     | 5       | 9        | 3        |

**Scenario U:**

| Event | Release | Deadline | Duration |
|-------|---------|----------|----------|
| A     | 0       | 4        | 3        |
| B     | 1       | 5        | 3        |
| C     | 2       | 6        | 2        |

Each scenario is independent — the room and clock reset between them.
Do not assume both scenarios behave the same way; verify each on its
own terms.

## Deliverables

- `feasibility.md` — must contain, clearly labeled per scenario:
  - **Scenario S:** the verdict (SAT) and a start time for each of A,
    B, C such that all three fit their own windows with no overlap.
  - **Scenario U:** the verdict (UNSAT) and a justification stated in
    terms of the actual release/deadline/duration numbers — not merely
    "I tried some orderings and none worked."

## Constraints

- Treat the two scenarios as fully independent; a correct submission
  gets ONE verdict right for each — they are not required to match.
- Any valid SAT witness for Scenario S is acceptable as long as it
  satisfies every event's window and produces no pairwise overlap.
- An UNSAT claim must be backed by a reason grounded in the specific
  numbers given (e.g. a capacity/window argument), not an assertion
  that a search failed.
