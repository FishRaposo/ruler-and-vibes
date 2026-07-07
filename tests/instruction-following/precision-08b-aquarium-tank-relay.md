---
id: precision-08b-aquarium-tank-relay
category: instruction-following
title: Aquarium tank moves applied as a strict instruction relay
deliverables:
  - tanks.json
---

## Task

Four display tanks — T, U, V, W — each start stocked with 80 fish. Apply
the five numbered steps below STRICTLY IN ORDER. Each step acts on the
counts left by the previous step, not on the original starting counts.
Produce the final fish counts as `tanks.json`.

### Steps (apply in this exact order)

1. Move 25 fish from T to U.
2. Move floor(half of U's current count) from U to V. (Use the count U
   holds AFTER step 1, and round down/floor if it is odd.)
3. Conditional branch, evaluated on the counts AFTER step 2: IF V's
   current count is greater than 120, move 30 fish from V to W.
   OTHERWISE (V is 120 or less), move 30 fish from W to V.
4. Move max(W's current count minus T's current count, 0) from T to W,
   using the counts left after step 3.
5. For every tank still below 80 fish after step 4, top it up by adding
   20 fish to that tank only.

## Deliverables

- `tanks.json` — a JSON object with the final count of every tank plus a
  computed total.

## Constraints

- `tanks.json` must be valid JSON (parses with `JSON.parse`) and contain
  EXACTLY the keys `T`, `U`, `V`, `W`, `TOTAL` — no others, no per-step
  trace or commentary embedded in the file.
- `TOTAL` must equal the arithmetic sum of T, U, V, and W within the same
  file.
- All four counts must be non-negative integers.
- Apply the steps in the exact order given; step 3's branch depends on
  the count produced by step 2, not on the original counts.
