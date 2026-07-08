---
id: ops-01c-git-conflict-flag
category: ops
title: Resolve feature flag conflict
deliverables:
  - flags.json
---

## Task

`flags.json` conflict between true/false for `darkMode`. Decision: enable
darkMode true; keep other keys from either side if present.

```
<<<<<<< HEAD
{"darkMode": false, "locale": "en"}
=======
{"darkMode": true}
>>>>>>> feat/dark
```

Produce valid JSON with darkMode true and locale "en".

## Deliverables

- `flags.json`.

## Constraints

- Valid JSON object. No markers.
