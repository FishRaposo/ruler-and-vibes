---
id: ops-01b-git-conflict-ports
category: ops
title: Resolve config port conflict
deliverables:
  - port.conf
---

## Task

`port.conf` conflict:

```
<<<<<<< HEAD
PORT=8080
=======
PORT=3000
>>>>>>> fix/dev-port
```

Decision: production stays **8080**. Resolve markers accordingly.

## Deliverables

- `port.conf`.

## Constraints

- Single assignment line PORT=...
- No markers.
