---
id: ops-05c-incident-queue
category: ops
title: "Incident narrative for a queue worker deploy"
deliverables:
  - INCIDENT.md
---

## Task

**Timeline**

- 21:02 Deploy `worker@3.1.0`  
- 21:07 Queue depth 200 → 12,000  
- 21:09 Page fires  
- 21:20 Rollback to `worker@3.0.2`  
- 21:28 Queue depth falling  

**Logs:** `ERROR job_ack timeout queue=mailers` repeated; `WARN dlq_insert`.

Same INCIDENT.md structure. Hypothesis ties 3.1.0 to job_ack/mailers backlog.  
No PII breach claim.

## Deliverables

- `INCIDENT.md`

## Constraints

- 150–350 words.

