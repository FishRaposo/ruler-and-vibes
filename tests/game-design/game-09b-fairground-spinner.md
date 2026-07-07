---
id: game-09b-fairground-spinner
category: game-design
title: Retune a fairground spinner to a target expected value
deliverables:
  - economy.json
  - TUNING.md
---

## Task

A fictional fairground, **Lanternfall**, runs a "prize spinner." One
spin costs **38 tokens** and lands on exactly one reward from a
four-tier wheel:

| Tier | Value (tokens) | Current probability |
|---|---|---|
| Blank | 18 | 0.55 |
| Bronze | 55 | 0.25 |
| Silver | 120 | 0.15 |
| Jackpot | 300 | 0.05 |

The current expected value per spin is
`0.55*18 + 0.25*55 + 0.15*120 + 0.05*300 = 56.65` tokens — well above
the 38-token spin cost, so the booth is bleeding 18.65 tokens on every
spin.

Retune **only the probabilities** (the four token values and the
38-token spin cost are fixed and must not change) so the recomputed EV
lands in the target band **[39.0, 41.0]**, subject to:

- The four probabilities sum to **exactly 1.0**.
- Each probability is in **[0, 1]**.
- **Jackpot probability stays in [0.02, 0.06]**.
- **Blank probability does not exceed 0.71**.
- **Silver probability stays >= 0.06**.

Watch the corners: pushing Blank to its 0.71 cap and dropping Silver to
its 0.06 floor and Jackpot to its 0.02 floor (to minimize EV) still
leaves the achievable low end of the EV range below the target band, so
getting inside [39.0, 41.0] requires balancing Silver and Jackpot
carefully rather than maxing out the cheap tier and racing every other
tier to its floor.

## Deliverables

- `economy.json` — the four tiers, each `{ "tier": string, "value":
  integer, "probability": number }`, with the retuned probabilities.
- `TUNING.md` (at most 500 words) showing:
  - The current EV (56.65) restated.
  - The four `probability * value` products for your retuned table and
    their sum.
  - A statement that the new EV lands in [39.0, 41.0].

## Constraints

- `economy.json` probabilities must sum to exactly 1.0 (within 1e-9).
- All five constraints above (sum-to-1, each in [0,1], Jackpot in
  [0.02, 0.06], Blank <= 0.71, Silver >= 0.06) must hold simultaneously.
- The recomputed EV from `economy.json` must fall in [39.0, 41.0].
- `TUNING.md` must be at most 500 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol;
describe there how you searched for a feasible probability vector.
