---
id: precision-08c-tincture-phial-relay
category: instruction-following
title: Tincture phials rebalanced as a strict instruction relay
deliverables:
  - phials.json
---

## Task

Four phials — P, Q, R, S — each start holding 123 milliliters of
tincture. Apply the five numbered steps below STRICTLY IN ORDER. Each
step acts on the volumes left by the previous step, not on the original
starting volumes. Produce the final volumes as `phials.json`.

### Steps (apply in this exact order)

1. Pipette 44 milliliters from P into Q.
2. Pipette floor(half of Q's current volume) from Q into R. (Use the
   volume Q holds AFTER step 1, and round down/floor if it is odd.)
3. Conditional branch, evaluated on the volumes AFTER step 2: IF R's
   current volume is greater than 170, pipette 35 milliliters from R
   into S. OTHERWISE (R is 170 or less), pipette 35 milliliters from S
   into R.
4. Pipette max(S's current volume minus P's current volume, 0) from P
   into S, using the volumes left after step 3.
5. For every phial still below 123 milliliters after step 4, top it up
   by adding 30 milliliters to that phial only.

## Deliverables

- `phials.json` — a JSON object with the final volume of every phial
  plus a computed total.

## Constraints

- `phials.json` must be valid JSON (parses with `JSON.parse`) and
  contain EXACTLY the keys `P`, `Q`, `R`, `S`, `TOTAL` — no others, no
  per-step trace or commentary embedded in the file.
- `TOTAL` must equal the arithmetic sum of P, Q, R, and S within the
  same file.
- All four volumes must be non-negative integers.
- Apply the steps in the exact order given; step 3's branch depends on
  the volume produced by step 2, not on the original volumes.
