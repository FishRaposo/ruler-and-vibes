---
id: ops-02b-ci-log-oom
category: ops
title: Triage CI OOM log
deliverables:
  - TRIAGE.md
---

## Task

Log:

```
[build] docker build OK
[test] jest --runInBand
FATAL ERROR: Reached heap limit
JavaScript heap out of memory
##[error]exit code 134
[deploy] skipped
```

TRIAGE.md: root cause heap OOM during jest; not docker build.

## Deliverables

- `TRIAGE.md` with ## Root cause, ## Failed step, ## Fix.

## Constraints

- ≤ 150 words.
