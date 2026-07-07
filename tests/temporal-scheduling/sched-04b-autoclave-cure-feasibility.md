---
id: sched-04b-autoclave-cure-feasibility
category: temporal-scheduling
title: Autoclave feasibility — cure every part or prove it cannot be done
deliverables:
  - cure-feasibility.md
---

## Task

Ridgepoint Composites has exactly ONE autoclave (a pressurized curing
oven). The autoclave cures parts one at a time (no two cure cycles may
overlap, though one may finish exactly as the next begins). Every part
has a release time (the earliest hour its layup is ready to load), a
deadline (the latest hour by which curing must be fully finished), and
a fixed cure duration in hours. A part must be cured entirely within
its own `[release, deadline]` window — it cannot start before its
release time, and start + duration cannot exceed its deadline.

You are given the autoclave's work orders for TWO independent
production batches. The autoclave and its clock reset between batches,
so Batch 1's work orders and Batch 2's work orders are entirely
separate instances — nothing carries over between them.

For EACH batch, decide feasibility:

- If the batch is satisfiable, give a concrete valid start time for
  every part such that no two cure cycles overlap and every part lies
  fully inside its own window.
- If the batch is unsatisfiable, declare UNSAT and give the specific
  reason, grounded in the actual numbers (not just "no schedule found
  after trying").

**Batch 1:**

| Part       | Release | Deadline | Duration |
|------------|---------|----------|----------|
| Panel-114  | 2       | 6        | 3        |
| Spar-207   | 4       | 9        | 2        |
| Rib-330    | 7       | 11       | 3        |

**Batch 2:**

| Part          | Release | Deadline | Duration |
|---------------|---------|----------|----------|
| Longeron-455  | 2       | 8        | 4        |
| Bulkhead-512  | 3       | 9        | 3        |
| Fairing-618   | 5       | 11       | 4        |

Treat the two batches as fully independent. Do not assume they behave
the same way — verify each on its own terms.

## Deliverables

- `cure-feasibility.md` — must contain, clearly labeled per batch:
  - **Batch 1:** the verdict (SAT) and a start time for each of
    Panel-114, Spar-207, Rib-330 such that all three fit their own
    windows with no overlap.
  - **Batch 2:** the verdict (UNSAT) and a justification stated in
    terms of the actual release/deadline/duration numbers — not merely
    "I tried some orderings and none worked."

## Constraints

- Treat the two batches as fully independent; a correct submission
  gets ONE verdict right for each — they are not required to match.
- Any valid SAT witness for Batch 1 is acceptable as long as it
  satisfies every part's window and produces no pairwise overlap.
- An UNSAT claim must be backed by a reason grounded in the specific
  numbers given (e.g. a capacity/window argument), not an assertion
  that a search failed.
