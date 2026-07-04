---
id: game-03-balance-patch
category: game-design
title: Balance patch for a squad-battler stat table
deliverables:
  - BALANCE.md
---

## Task

You are the balance designer for a fictional squad-battler, **Emberline
Tactics**. Four units currently exist, each with a damage-per-hit,
attack interval (seconds between attacks), an accuracy (0-1, chance a
hit lands), and a cost (used for drafting, not for combat power):

| Unit | Damage | Interval (s) | Accuracy | Cost |
|---|---|---|---|---|
| Bulwark | 30 | 2.0 | 0.90 | 120 |
| Skirmisher | 12 | 0.8 | 0.80 | 100 |
| Longshot | 45 | 2.5 | 0.70 | 110 |
| Twinfang | 11 | 0.5 | 0.85 | 105 |

Effective DPS (damage per second) for a unit is:

```
DPS = damage * accuracy / interval
```

Exactly one of these four units is overpowered relative to the rest
of the roster and needs a balance patch.

## Deliverables

- `BALANCE.md` (at most 500 words) containing:
  - A DPS table showing the computed DPS for all four units.
  - Identification of the overpowered unit, with reasoning that goes
    beyond raw damage-per-hit (show your supporting analysis, e.g. a
    cost-normalized comparison).
  - A patch to that unit: change **at most two** of its stats, each
    changed stat differing from its original value by **at most 20%
    relative to the original**, such that the unit's recomputed
    post-patch DPS lands in the range **[12.0, 14.0]**.
  - The post-patch DPS arithmetic shown explicitly (state the patched
    stat values and the resulting DPS number).

## Constraints

- The patch must target only the overpowered unit — do not change any
  other unit's stats.
- At most two stats may change on the patched unit, and each changed
  stat must stay within 20% of its original value (relative change,
  either direction).
- Cost does not enter the DPS formula, so a cost-only change cannot
  satisfy the DPS band requirement.
- The post-patch DPS, recomputed from your stated patched stats using
  the formula above, must fall in [12.0, 14.0].
- `BALANCE.md` must be at most 500 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol.
