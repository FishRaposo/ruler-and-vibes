---
id: ops-02-ci-log-triage
category: ops
title: Triage a CI failure log
deliverables:
  - TRIAGE.md
---

## Task

CI log excerpt:

```
[build] npm ci OK
[test] running...
[test] FAIL src/auth.test.js
Error: Expected status 401, got 200
  at Object.<anonymous> (src/auth.test.js:42)
[test] PASS src/math.test.js
[lint] OK
##[error]Process completed with exit code 1.
```

Write TRIAGE.md: root cause in one sentence, failing job step, and the
single most likely fix (one sentence). The failure is **auth test expected
401 got 200** — not lint, not npm ci.

## Deliverables

- `TRIAGE.md` with ## Root cause, ## Failed step, ## Fix.

## Constraints

- ≤ 150 words.
