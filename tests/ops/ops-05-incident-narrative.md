---
id: ops-05-incident-narrative
category: ops
title: "Incident narrative from logs and a timeline"
deliverables:
  - INCIDENT.md
---

## Task

**Timeline**

- 14:01 Deploy `api@2.4.1` by CI
- 14:08 Error rate 0.2% → 8%
- 14:12 On-call pages
- 14:25 Rollback to `api@2.4.0`
- 14:31 Error rate back to 0.2%

**Log lines**

```
14:08:11 ERROR payment_auth timeout vendor=ChargebeeMock
14:08:12 ERROR payment_auth timeout vendor=ChargebeeMock
14:09:01 WARN retry_exhausted route=/v1/checkout
```

Write `INCIDENT.md`:

## Summary
## Impact
## Timeline
## Root cause hypothesis
## Next steps

Rules:

- Root cause hypothesis must connect deploy 2.4.1 and payment_auth
  timeouts (not "solar flares").
- Next steps ≥2 concrete actions (e.g. vendor status, regress test).
- Do not claim customer PII was leaked (not in evidence).

## Deliverables

- `INCIDENT.md`

## Constraints

- 150–350 words.

