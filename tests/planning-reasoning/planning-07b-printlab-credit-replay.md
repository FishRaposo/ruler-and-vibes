---
id: planning-07b-printlab-credit-replay
category: planning-reasoning
title: Campus print-lab credit ledger replay
deliverables:
  - PRINTLAB-LEDGER.md
---

## Task

A university IT department tracks page-print credit balances for five
print-lab stations. The opening balances are:

| Station | Opening credits |
|---------|------------------|
| NORTH   | 35               |
| SOUTH   | 18               |
| EAST    | 90               |
| WEST    | 0                |
| CENTRAL | 6                |

**Pinned operation semantics:**

- `TOPUP station n` — increases the station's credit balance by `n`.
- `ADJUST station n` — **overwrites** the station's balance to exactly
  `n` (this is not an addition; whatever the balance was before is
  discarded).
- `CONSUME station n` — subtracts `n` from the station's balance (a
  print job spending `n` credits). If `n` is greater than the current
  balance, the balance is floored at 0 AND the job is recorded as
  **denied**, with `shortfall = n - available` (the available balance
  at the moment of the job, before this step runs). If `n` is less
  than or equal to the current balance, this is a normal, valid job —
  it is never flagged, even if it drains the station to exactly 0.

Below is the numbered log of 30 operations, applied in order:

1. TOPUP NORTH 12
2. TOPUP SOUTH 7
3. CONSUME EAST 25
4. TOPUP WEST 20
5. TOPUP CENTRAL 14
6. CONSUME NORTH 9
7. TOPUP EAST 30
8. ADJUST SOUTH 11
9. CONSUME WEST 18
10. TOPUP NORTH 6
11. CONSUME CENTRAL 5
12. CONSUME SOUTH 25
13. TOPUP WEST 8
14. TOPUP EAST 0
15. ADJUST CENTRAL 25
16. CONSUME NORTH 17
17. TOPUP SOUTH 6
18. CONSUME EAST 88
19. TOPUP WEST 11
20. CONSUME CENTRAL 9
21. TOPUP NORTH 20
22. ADJUST EAST 25
23. CONSUME WEST 25
24. TOPUP SOUTH 0
25. TOPUP WEST 35
26. CONSUME CENTRAL 0
27. TOPUP CENTRAL 9
28. CONSUME NORTH 0
29. TOPUP SOUTH 0
30. TOPUP EAST 0

Replay all 30 operations in order under the pinned semantics and
report the final state.

## Deliverables

- `PRINTLAB-LEDGER.md` — must report:
  - The final credit balance of every station (NORTH, SOUTH, EAST,
    WEST, CENTRAL).
  - The grand total of all credits across all five stations.
  - The exact list of denied jobs, each with station, requested
    amount, available balance at that step, and shortfall.

## Constraints

- Apply the pinned semantics exactly — `ADJUST` overwrites, it does
  not add to the existing balance.
- Do not flag a `CONSUME` as denied unless the requested amount
  strictly exceeds the available balance at that step.
