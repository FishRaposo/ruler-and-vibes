---
id: game-09c-canister-payout
category: game-design
title: Retune a canister payout to a target expected value
deliverables:
  - economy.json
  - TUNING.md
---

## Task

A fictional salvage game, **Deepdrift**, sells "core canisters." Opening
one canister costs **80 credits** and draws exactly one reward from a
four-grade table:

| Grade | Value (credits) | Current probability |
|---|---|---|
| Scrap | 24 | 0.58 |
| Alloy | 88 | 0.27 |
| Crystal | 220 | 0.10 |
| Relic | 960 | 0.05 |

The current expected value per open is
`0.58*24 + 0.27*88 + 0.10*220 + 0.05*960 = 107.68` credits — far above
the 80-credit price, so the house is losing 27.68 credits on every open.

Retune **only the probabilities** (the four credit values and the
80-credit price are fixed and must not change) so the recomputed EV
lands in the target band **[79.0, 81.0]**, subject to:

- The four probabilities sum to **exactly 1.0**.
- Each probability is in **[0, 1]**.
- **Relic probability stays in [0.03, 0.06]**.
- **Scrap probability does not exceed 0.70**.
- **Crystal probability stays >= 0.06**.

Watch the corners: pinning Scrap to its 0.70 cap and dropping Crystal
and Relic to their floors (to minimize EV) still leaves the achievable
low end of the EV range below the target band, so getting inside
[79.0, 81.0] requires balancing the grades carefully rather than maxing
out the cheap grade and racing every other grade to its floor.

## Deliverables

- `economy.json` — the four grades, each `{ "tier": string, "value":
  integer, "probability": number }`, with the retuned probabilities.
- `TUNING.md` (at most 500 words) showing:
  - The current EV (107.68) restated.
  - The four `probability * value` products for your retuned table and
    their sum.
  - A statement that the new EV lands in [79.0, 81.0].

## Constraints

- `economy.json` probabilities must sum to exactly 1.0 (within 1e-9).
- All five constraints above (sum-to-1, each in [0,1], Relic in
  [0.03, 0.06], Scrap <= 0.70, Crystal >= 0.06) must hold
  simultaneously.
- The recomputed EV from `economy.json` must fall in [79.0, 81.0].
- `TUNING.md` must be at most 500 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you searched for a feasible probability vector.
