---
id: ops-05b-incident-cache
category: ops
title: "Incident narrative for a cache deploy spike"
deliverables:
  - INCIDENT.md
---

## Task

**Timeline**

- 09:10 Deploy `cache@1.8.0` by CI  
- 09:14 p95 latency 80ms → 900ms  
- 09:18 On-call pages  
- 09:30 Rollback to `cache@1.7.4`  
- 09:36 p95 back to ~80ms  

**Logs**
```
09:14:02 ERROR redis_pool exhausted cluster=edge-a
09:14:03 ERROR redis_pool exhausted cluster=edge-a
09:15:10 WARN circuit_open route=/v1/session
```

`INCIDENT.md`: Summary, Impact, Timeline, Root cause hypothesis, Next steps.

Hypothesis must link 1.8.0 deploy to redis_pool / session latency.  
≥2 next steps. No invented PII breach.

## Deliverables

- `INCIDENT.md`

## Constraints

- 150–350 words.

