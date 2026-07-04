---
id: precision-08-relay-ledger-chain
category: instruction-following
title: Ledger transfers applied as a strict instruction relay
deliverables:
  - ledger.json
---

## Task

Four accounts — A, B, C, D — each start at 100 units. Apply the five
numbered steps below STRICTLY IN ORDER. Each step acts on the balances
left by the previous step, not on the original starting balances.
Produce the final balances as `ledger.json`.

### Steps (apply in this exact order)

1. Transfer 30 units from A to B.
2. Transfer floor(half of B's current balance) from B to C. (Use the
   balance B holds AFTER step 1, and round down/floor if it is odd.)
3. Conditional branch, evaluated on the balances AFTER step 2: IF C's
   current balance is greater than 150, transfer 40 units from C to D.
   OTHERWISE (C is 150 or less), transfer 40 units from D to C.
4. Transfer max(D's current balance minus A's current balance, 0) from
   A to D, using the balances left after step 3.
5. For every account still below 100 units after step 4, top it up by
   adding 25 units to that account only.

## Deliverables

- `ledger.json` — a JSON object with the final balance of every
  account plus a computed total.

## Constraints

- `ledger.json` must be valid JSON (parses with `JSON.parse`) and
  contain EXACTLY the keys `A`, `B`, `C`, `D`, `TOTAL` — no others, no
  per-step trace or commentary embedded in the file.
- `TOTAL` must equal the arithmetic sum of A, B, C, and D within the
  same file.
- All four balances must be non-negative integers.
- Apply the steps in the exact order given; step 3's branch depends on
  the balance produced by step 2, not on the original balances.
