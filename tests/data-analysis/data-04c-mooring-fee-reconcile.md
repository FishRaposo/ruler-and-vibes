---
id: data-04c-mooring-fee-reconcile
category: data-analysis
title: Harbor mooring fee reconciliation
deliverables:
  - results.json
  - RECONCILIATION.md
---

## Task

A harbor mooring service bills each vessel its monthly berth fee on its
arrival date and on every monthly same-day anniversary after that, with
no charge on or after its departure date (if any). Reconcile what should
have been billed in Q2 2025 (April 1 through June 30) against what the
berthing ledger actually shows.

`vessels.csv`:

```csv
vessel_id,tier,monthly_fee,arrival_date,departure_date
V01,Standard,30,2025-04-06,
V02,Standard,30,2025-04-02,2025-05-14
V03,Premium,80,2025-04-12,
V04,Premium,80,2025-05-04,
V05,Standard,30,2025-04-01,
V06,Premium,80,2025-04-09,2025-05-09
V07,Standard,30,2025-06-11,
V08,Premium,80,2025-04-20,
```

`payments.csv` (payment IDs are unique identifiers assigned by the
harbor's billing terminal — no two distinct real charges ever share an
ID):

```csv
payment_id,vessel_id,date,amount
B001,V01,2025-04-06,30
B002,V01,2025-05-06,30
B003,V01,2025-06-06,30
B004,V02,2025-04-02,30
B005,V02,2025-05-02,30
B006,V03,2025-04-12,80
B007,V03,2025-05-12,80
B008,V03,2025-06-12,80
B009,V04,2025-05-04,80
B010,V04,2025-06-04,80
B011,V05,2025-04-01,30
B012,V05,2025-05-01,30
B013,V06,2025-04-09,80
B014,V07,2025-06-11,30
B015,V08,2025-04-20,80
B016,V08,2025-05-20,72
B017,V08,2025-06-20,80
B018,V03,2025-04-12,80
B019,V77,2025-05-15,30
B020,V06,2025-05-09,80
B021,V06,2025-05-10,-80
```

## Deliverables

- `results.json`, matching exactly this schema:

  ```json
  {
    "expected_total_q2": 0,
    "collected_total_q2": 0,
    "discrepancies": [
      { "vessel_id": "V00", "type": "string", "amount": 0, "note": "string" }
    ]
  }
  ```

  Field semantics (exact):
  - `expected_total_q2`: total amount that should have been billed
    across all vessels per the billing rule above, for Q2 2025.
  - `collected_total_q2`: the NET total of ledger amounts actually
    attributable to V01–V08 for Q2 2025, counting each unique payment
    ID once and including refunds as negative amounts. Ledger lines not
    attributable to any real vessel in `vessels.csv` do not count toward
    this total — they belong in `discrepancies` instead.
  - `discrepancies`: one entry per issue you find between the expected
    schedule and the ledger (missing payments, wrong amounts, lines that
    don't match a real vessel, duplicated entries, etc.). Use
    `vessel_id: null` for a discrepancy not attributable to any real
    vessel.

- `RECONCILIATION.md` (max 600 words): show the expected-schedule
  arithmetic per vessel, explain how you reconciled it against
  `payments.csv`, and summarize every discrepancy found.

## Constraints

- `results.json` must be valid JSON parseable with `node`.
- `RECONCILIATION.md` is at most 600 words (`wc -w` on the whole file).
- State your reasoning for every line in `payments.csv` you treat as not
  counting toward `collected_total_q2` — don't silently drop lines.
