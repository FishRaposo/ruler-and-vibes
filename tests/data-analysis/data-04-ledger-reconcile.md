---
id: data-04-ledger-reconcile
category: data-analysis
title: Subscription ledger reconciliation
deliverables:
  - results.json
  - RECONCILIATION.md
---

## Task

A plant-subscription service bills each subscription its monthly plan
price on its start date and on every monthly same-day anniversary
after that, with no charge on or after its cancellation date (if any).
Reconcile what should have been billed in Q1 2025 (January 1 through
March 31) against what the payment ledger actually shows.

`subscriptions.csv`:

```csv
subscription_id,plan,monthly_price,start_date,cancel_date
S01,Basic,20,2025-01-05,
S02,Basic,20,2025-01-03,2025-02-10
S03,Pro,50,2025-01-15,
S04,Pro,50,2025-02-03,
S05,Basic,20,2025-01-01,
S06,Pro,50,2025-01-08,2025-01-20
S07,Basic,20,2025-03-12,
S08,Pro,50,2025-01-20,
```

`payments.csv` (payment IDs are unique identifiers assigned by the
payment processor — no two distinct real charges ever share an ID):

```csv
payment_id,subscription_id,date,amount
P001,S05,2025-01-01,20
P002,S02,2025-01-03,20
P003,S01,2025-01-05,20
P004,S06,2025-01-08,50
P005,S03,2025-01-15,50
P006,S08,2025-01-20,50
P007,S05,2025-02-01,20
P008,S02,2025-02-03,20
P009,S03,2025-01-15,50
P010,S04,2025-02-03,50
P011,S01,2025-02-05,20
P012,S06,2025-02-08,50
P013,S03,2025-02-15,50
P014,S08,2025-02-20,45
P015,S04,2025-03-03,50
P016,S01,2025-03-05,20
P017,S07,2025-03-12,20
P018,S03,2025-03-15,50
P019,S99,2025-02-14,20
P020,S06,2025-02-09,-50
P021,S08,2025-03-20,50
```

## Deliverables

- `results.json`, matching exactly this schema:

  ```json
  {
    "expected_total_q1": 0,
    "collected_total_q1": 0,
    "discrepancies": [
      { "subscription_id": "S00", "type": "string", "amount": 0, "note": "string" }
    ]
  }
  ```

  Field semantics (exact):
  - `expected_total_q1`: total amount that should have been billed
    across all subscriptions per the billing rule above, for Q1 2025.
  - `collected_total_q1`: the NET total of ledger amounts actually
    attributable to S01–S08 for Q1 2025, counting each unique payment
    ID once and including refunds as negative amounts. Ledger lines not
    attributable to any real subscription in `subscriptions.csv` do not
    count toward this total — they belong in `discrepancies` instead.
  - `discrepancies`: one entry per issue you find between the expected
    schedule and the ledger (missing payments, wrong amounts, lines
    that don't match a real subscription, duplicated entries, etc.).
    Use `subscription_id: null` for a discrepancy not attributable to
    any real subscription.

- `RECONCILIATION.md` (max 600 words): show the expected-schedule
  arithmetic per subscription, explain how you reconciled it against
  `payments.csv`, and summarize every discrepancy found.

## Constraints

- `results.json` must be valid JSON parseable with `node`.
- `RECONCILIATION.md` is at most 600 words (`wc -w` on the whole file).
- State your reasoning for every line in `payments.csv` you treat as
  not counting toward `collected_total_q1` — don't silently drop lines.
