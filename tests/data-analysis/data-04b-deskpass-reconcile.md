---
id: data-04b-deskpass-reconcile
category: data-analysis
title: Coworking membership ledger reconciliation
deliverables:
  - results.json
  - RECONCILIATION.md
---

## Task

A coworking space bills each membership its monthly plan price on its
start date and on every monthly same-day anniversary after that, with no
charge on or after its cancellation date (if any). Reconcile what should
have been billed in Q2 2025 (April 1 through June 30) against what the
payment ledger actually shows.

`memberships.csv`:

```csv
membership_id,plan,monthly_price,start_date,cancel_date
M01,Flex,30,2025-04-04,
M02,Flex,30,2025-04-02,2025-05-18
M03,Dedicated,75,2025-04-12,
M04,Dedicated,75,2025-05-06,
M05,Flex,30,2025-04-01,
M06,Dedicated,75,2025-04-09,2025-04-25
M07,Flex,30,2025-06-14,
M08,Dedicated,75,2025-04-22,
```

`payments.csv` (payment IDs are unique identifiers assigned by the
payment processor — no two distinct real charges ever share an ID):

```csv
payment_id,membership_id,date,amount
P001,M05,2025-04-01,30
P002,M02,2025-04-02,30
P003,M01,2025-04-04,30
P004,M06,2025-04-09,75
P005,M03,2025-04-12,75
P006,M08,2025-04-22,75
P007,M05,2025-05-01,30
P008,M02,2025-05-02,30
P009,M03,2025-04-12,75
P010,M04,2025-05-06,75
P011,M01,2025-05-04,30
P012,M06,2025-05-09,75
P013,M03,2025-05-12,75
P014,M08,2025-05-22,68
P015,M04,2025-06-06,75
P016,M01,2025-06-04,30
P017,M07,2025-06-14,30
P018,M03,2025-06-12,75
P019,M99,2025-05-20,30
P020,M06,2025-05-10,-75
P021,M08,2025-06-22,75
```

## Deliverables

- `results.json`, matching exactly this schema:

  ```json
  {
    "expected_total_q2": 0,
    "collected_total_q2": 0,
    "discrepancies": [
      { "membership_id": "M00", "type": "string", "amount": 0, "note": "string" }
    ]
  }
  ```

  Field semantics (exact):
  - `expected_total_q2`: total amount that should have been billed
    across all memberships per the billing rule above, for Q2 2025.
  - `collected_total_q2`: the NET total of ledger amounts actually
    attributable to M01–M08 for Q2 2025, counting each unique payment
    ID once and including refunds as negative amounts. Ledger lines not
    attributable to any real membership in `memberships.csv` do not
    count toward this total — they belong in `discrepancies` instead.
  - `discrepancies`: one entry per issue you find between the expected
    schedule and the ledger (missing payments, wrong amounts, lines
    that don't match a real membership, duplicated entries, etc.).
    Use `membership_id: null` for a discrepancy not attributable to
    any real membership.

- `RECONCILIATION.md` (max 600 words): show the expected-schedule
  arithmetic per membership, explain how you reconciled it against
  `payments.csv`, and summarize every discrepancy found.

## Constraints

- `results.json` must be valid JSON parseable with `node`.
- `RECONCILIATION.md` is at most 600 words (`wc -w` on the whole file).
- State your reasoning for every line in `payments.csv` you treat as
  not counting toward `collected_total_q2` — don't silently drop lines.
