---
id: ops-01-git-conflict
category: ops
title: Resolve a merge conflict marker file
deliverables:
  - VERSION.txt
---

## Task

File `VERSION.txt` contains unresolved conflict markers from a merge:

```
<<<<<<< HEAD
release: 2.4.1
channel: stable
=======
release: 2.5.0-rc.1
channel: beta
>>>>>>> feature/rc
```

Product decision (given): **ship the RC** — keep release 2.5.0-rc.1 and
channel beta. Remove all conflict markers. Do not leave both sides.

## Deliverables

- `VERSION.txt` — clean final file.

## Constraints

- Exactly two lines: release then channel, or a tiny YAML/text with those keys.
- No conflict markers remain.
