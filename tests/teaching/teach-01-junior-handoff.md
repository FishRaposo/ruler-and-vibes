---
id: teach-01-junior-handoff
category: teaching
title: "Handoff so a junior can rotate logs without you"
deliverables:
  - handoff.md
---

## Task

Explain how to rotate application logs on a fictional host:

- Logs live in `/var/log/lampost/app.log`
- Rotate by: copy to `app.log.1`, truncate `app.log`, send SIGHUP to
  process id in `/var/run/lampost.pid`
- Do **not** delete `app.log.1` until next day

Write `handoff.md` for a junior on first on-call:

## Goal
## Preconditions
## Steps
## Verify
## Rollback / if stuck

No inventing Kubernetes or cloud consoles not mentioned.

## Deliverables

- `handoff.md`

## Constraints

- 150–320 words.
- Steps must be numbered and include copy, truncate, SIGHUP.

