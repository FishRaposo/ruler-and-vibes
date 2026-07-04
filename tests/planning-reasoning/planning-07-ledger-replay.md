---
id: planning-07-ledger-replay
category: planning-reasoning
title: Warehouse ledger replay
deliverables:
  - LEDGER-FINAL.md
---

## Task

A warehouse tracks five SKUs. The opening inventory is:

| SKU    | Opening count |
|--------|---------------|
| WIDGET | 40            |
| GASKET | 12            |
| BOLT   | 100           |
| CLAMP  | 0             |
| ROTOR  | 8             |

**Pinned operation semantics:**

- `ADD sku n` — increases the SKU's count by `n`.
- `SET sku n` — **overwrites** the SKU's count to exactly `n` (this is
  not an addition; whatever the count was before is discarded).
- `REMOVE sku n` — subtracts `n` from the SKU's count. If `n` is
  greater than the current count, the count is floored at 0 AND the
  step is recorded as an **underflow**, with `shortfall = n - available`
  (the available count at the moment of the operation, before this
  step runs). If `n` is less than or equal to the current count, this
  is a normal, valid removal — it is never flagged, even if it drains
  the SKU to exactly 0.

Below is the numbered log of 30 operations, applied in order:

1. ADD WIDGET 10
2. ADD GASKET 5
3. REMOVE BOLT 20
4. ADD CLAMP 15
5. ADD ROTOR 12
6. REMOVE WIDGET 5
7. ADD BOLT 25
8. SET GASKET 9
9. REMOVE CLAMP 15
10. ADD WIDGET 8
11. REMOVE ROTOR 3
12. REMOVE GASKET 20
13. ADD CLAMP 6
14. ADD BOLT 0
15. SET ROTOR 20
16. REMOVE WIDGET 13
17. ADD GASKET 4
18. REMOVE BOLT 100
19. ADD CLAMP 9
20. REMOVE ROTOR 7
21. ADD WIDGET 15
22. SET BOLT 20
23. REMOVE CLAMP 20
24. ADD GASKET 0
25. ADD CLAMP 30
26. REMOVE ROTOR 0
27. ADD ROTOR 7
28. REMOVE WIDGET 0
29. ADD GASKET 0
30. ADD BOLT 0

Replay all 30 operations in order under the pinned semantics and
report the final state.

## Deliverables

- `LEDGER-FINAL.md` — must report:
  - The final count of every SKU (WIDGET, GASKET, BOLT, CLAMP, ROTOR).
  - The grand total of all units across all five SKUs.
  - The exact list of underflow events, each with SKU, requested
    amount, available amount at that step, and shortfall.

## Constraints

- Apply the pinned semantics exactly — `SET` overwrites, it does not
  add to the existing count.
- Do not flag a `REMOVE` as an underflow unless the requested amount
  strictly exceeds the available count at that step.
