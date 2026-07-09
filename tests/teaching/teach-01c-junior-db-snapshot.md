---
id: teach-01c-junior-db-snapshot
category: teaching
title: "Handoff so a junior can take a DB snapshot"
deliverables:
  - handoff.md
---

## Task

Fictional Postgres host:

- Run as user `pgops`  
- Snapshot: `/usr/local/bin/pg_snap.sh --label nightly`  
- Verify file appears under `/var/backups/pg/`  
- Do **not** delete yesterday's snapshot until retention job runs  

Same handoff headings. No invented RDS console steps as required.

## Deliverables

- `handoff.md`

## Constraints

- 150–320 words. Steps include pg_snap.sh and verify path.

