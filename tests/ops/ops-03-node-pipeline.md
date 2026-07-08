---
id: ops-03-node-pipeline
category: ops
title: Node pipeline: filter and sum CSV
deliverables:
  - pipeline.js
  - input.csv
---

## Task

Write `pipeline.js` that reads `input.csv` from the same directory and
prints one number: the sum of `amount` for rows where `status` is `paid`.

Sample input.csv (create this file in results too):
```
id,status,amount
1,paid,10.5
2,pending,9
3,paid,2.5
4,paid,0
```

Expected stdout: `13` (or `13.0`) then newline. No deps.

## Deliverables

- `pipeline.js`, `input.csv`.

## Constraints

- ≤ 50 lines. Node only.
