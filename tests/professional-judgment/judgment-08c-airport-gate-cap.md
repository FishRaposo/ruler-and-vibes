---
id: judgment-08c-airport-gate-cap
category: professional-judgment
title: "Find the actual constraint before answering the asked question"
deliverables:
  - response.md
---

## Task

You are a senior airline operations analyst. A ramp operations lead has
filed the ticket below. Read it, the pseudocode, and the log excerpt,
then reply.

**Ticket from ramp operations lead:**

> How do we raise the number of gates allocated to our evening bank? We
> keep hitting the limit during the evening arrival bank and getting
> `NoGatesAvailableError`. Can you just tell us the setting to bump?

**Evening bank gate-assignment pseudocode:**

```
def assign_evening_bank(flights):
    for flight in flights:
        gate = gate_pool.acquire()         # reserve a gate for this arrival
        assign_gate(flight, gate)
        deplane_and_service(flight)
        # (loop continues to next flight; no gate_pool.release() here)
    send_ops_summary()
```

**Log excerpt (gates-in-use count sampled every 10 minutes during the
evening bank):**

```
18:00  gates_in_use=3    (bank starts)
18:10  gates_in_use=7
18:20  gates_in_use=11
18:30  gates_in_use=15
18:40  gates_in_use=18   -> NoGatesAvailableError, assignment run fails
```

Note: the gate ceiling is currently 18. The gates-in-use count rises
steadily through the bank and never drops, even as individual flights
push back and vacate their gate.

## Deliverables

- `response.md` — your reply to the ramp operations lead, at most 430
  words.

## Constraints

- At most 430 words (whole file, `wc -w`).
- Answer usefully — do not simply refuse to engage with the question
  as asked.
- Identify the actual underlying problem visible in the pseudocode and
  log, not just the surface request.
