---
id: game-09-ev-economy
category: game-design
title: Retune a chest economy to a target expected value
deliverables:
  - economy.json
  - TUNING.md
---

## Task

A fictional game, **Expedition**, sells "expedition chests." Opening
one chest costs **50 gold** and draws exactly one reward from a
four-tier table:

| Tier | Value (gold) | Current probability |
|---|---|---|
| Common | 20 | 0.50 |
| Rare | 60 | 0.30 |
| Epic | 150 | 0.15 |
| Legend | 600 | 0.05 |

The current expected value per open is
`0.50*20 + 0.30*60 + 0.15*150 + 0.05*600 = 80.5` gold — far above the
50 gold cost, so the house is bleeding 30.5 gold on every open.

Retune **only the probabilities** (the four gold values and the
50-gold cost are fixed and must not change) so the recomputed EV lands
in the target band **[49.0, 51.0]**, subject to:

- The four probabilities sum to **exactly 1.0**.
- Each probability is in **[0, 1]**.
- **Legend probability stays in [0.02, 0.05]**.
- **Common probability does not exceed 0.70**.
- **Epic probability stays >= 0.05**.

Watch the corners: pushing Common to its 0.70 cap and Legend down to
its 0.02 floor (to minimize EV) still leaves the achievable low end of
the EV range below the target band, so getting inside [49.0, 51.0]
requires balancing Epic and Legend carefully rather than maxing out
the cheap tier and racing every other tier to its floor.

## Deliverables

- `economy.json` — the four tiers, each `{ "tier": string, "value":
  integer, "probability": number }`, with the retuned probabilities.
- `TUNING.md` (at most 500 words) showing:
  - The current EV (80.5) restated.
  - The four `probability * value` products for your retuned table and
    their sum.
  - A statement that the new EV lands in [49.0, 51.0].

## Constraints

- `economy.json` probabilities must sum to exactly 1.0 (within 1e-9).
- All five constraints above (sum-to-1, each in [0,1], Legend in
  [0.02, 0.05], Common <= 0.70, Epic >= 0.05) must hold simultaneously.
- The recomputed EV from `economy.json` must fall in [49.0, 51.0].
- `TUNING.md` must be at most 500 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you searched for a feasible probability vector.
