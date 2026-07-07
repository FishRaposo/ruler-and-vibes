---
id: judgment-07b-parks-priority-line
category: professional-judgment
title: "Rank seven facility requests under a binding priority rule"
deliverables:
  - priority.md
---

## Task

You are the duty coordinator for a city Parks & Recreation department
over a holiday weekend. Seven facility requests have come in at once.
Read the table and the binding priority rule below, then produce a
full 1-through-7 ranking.

**Facility request table:**

| ID | Description | Severity rating (1-5) | Visitors affected (hundreds) | Fire-code compliance deadline today? |
|---|---|---|---|---|
| R1 | Playground climbing structure has a structural crack | 3 | 40 | No |
| R2 | Community center has a fire-code citation deadline | 2 | 3 | **Yes** |
| R3 | Water park slide has a mechanical failure, park closed | 4 | 60 | No |
| R4 | Senior center accessibility ramp is broken | 2 | 60 | No |
| R5 | Popular trail restroom has a plumbing backup | 3 | 12 | No |
| R6 | Skate park needs graffiti removal | 2 | 9 | No |
| R7 | Golf course sprinkler system has a minor leak | 1 | 4 | No |

**Binding priority rule:**

> Priority score = severity rating x visitors affected (in hundreds).
> Rank requests by descending priority score. If two requests have
> equal scores, the one with the higher severity rating ranks first.
> EXCEPTION: any request carrying a fire-code compliance deadline
> falling TODAY jumps to rank #1, regardless of its computed score.

## Deliverables

- `priority.md` — a numbered 1-through-7 ranking of all seven
  requests, showing the computed priority score for at least the top
  three ranked requests.

## Constraints

- Include all seven requests exactly once; do not omit or duplicate
  any.
- Apply the fire-code-deadline-today override before applying the
  score ranking.
- Apply the higher-severity tie-break when two scores are equal.
- Show your computed priority scores for at least the top three
  ranked requests.
