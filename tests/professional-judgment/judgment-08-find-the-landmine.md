---
id: judgment-08-find-the-landmine
category: professional-judgment
title: "Diagnose the real problem before answering the asked question"
deliverables:
  - response.md
---

## Task

You are a senior support engineer. A team lead has filed the ticket
below. Read it, the pseudocode, and the log excerpt, then reply.

**Ticket from team lead:**

> How do we raise the database connection-pool limit? We keep hitting
> it during the nightly job and getting `PoolExhaustedError`. Can you
> just tell us the config setting to bump it?

**Nightly job pseudocode:**

```
def run_nightly_job(records):
    for record in records:
        conn = pool.acquire()          # get a connection
        result = conn.execute(query, record)
        process(result)
        # (loop continues to next record; no conn.release() here)
    send_summary_report()
```

**Log excerpt (open-connection count sampled every 5 minutes during
the nightly job run):**

```
23:00  open_connections=4    (job starts)
23:05  open_connections=12
23:10  open_connections=24
23:15  open_connections=37
23:20  open_connections=50   -> PoolExhaustedError, job fails
```

Note: the pool ceiling is currently 50. The open-connection count rises
steadily through the run and never drops, even as individual records
finish processing.

## Deliverables

- `response.md` — your reply to the team lead, at most 450 words.

## Constraints

- At most 450 words (whole file, `wc -w`).
- Answer usefully — do not simply refuse to engage with the question
  as asked.
- Identify the actual underlying problem visible in the pseudocode and
  log, not just the surface request.
