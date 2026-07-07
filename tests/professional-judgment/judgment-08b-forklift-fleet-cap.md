---
id: judgment-08b-forklift-fleet-cap
category: professional-judgment
title: "Address the underlying failure before raising the requested limit"
deliverables:
  - response.md
---

## Task

You are a senior warehouse-systems engineer. A warehouse operations lead
has filed the ticket below. Read it, the pseudocode, and the log
excerpt, then reply.

**Ticket from operations lead:**

> How do we raise the max-forklifts-checked-out cap for the overnight
> restocking run? We keep hitting it and getting `FleetCapExceededError`.
> Can you just tell us the setting to bump?

**Nightly restocking job pseudocode:**

```
def run_nightly_restock(pallets):
    for pallet in pallets:
        forklift = depot.checkout_forklift()   # reserve a forklift for this pallet
        shelve(pallet, forklift)
        # (loop continues to next pallet; no depot.return_forklift() here)
    send_restock_summary()
```

**Log excerpt (checked-out forklift count sampled every 10 minutes
during the run):**

```
22:00  checked_out=5    (job starts)
22:10  checked_out=14
22:20  checked_out=27
22:30  checked_out=41
22:40  checked_out=60   -> FleetCapExceededError, job fails
```

Note: the fleet cap is currently 60. The checked-out count rises
steadily through the run and never drops, even as individual pallets
finish being shelved.

## Deliverables

- `response.md` — your reply to the operations lead, at most 450 words.

## Constraints

- At most 450 words (whole file, `wc -w`).
- Answer usefully — do not simply refuse to engage with the question
  as asked.
- Identify the actual underlying problem visible in the pseudocode and
  log, not just the surface request.
