---
id: game-03b-harvester-yield
category: game-design
title: Yield patch for a space-mining harvester roster
deliverables:
  - BALANCE.md
---

## Task

You are the balance designer for a fictional space-mining strategy game,
**Slagreach Deep**. Four harvester ships currently exist, each with an
ore-per-scoop (raw ore extracted per scoop), a cycle time (seconds
between scoops), a purity (0-1, fraction of scooped ore that is usable),
and an upkeep (fuel/maintenance cost used for fleet drafting, not for
mining output):

| Ship | Ore/scoop | Cycle (s) | Purity | Upkeep |
|---|---|---|---|---|
| Brackhaul | 22 | 2.4 | 0.90 | 140 |
| Dustmaw | 9 | 0.9 | 0.80 | 110 |
| Palerift | 34 | 3.0 | 0.65 | 120 |
| Corehound | 8 | 0.5 | 0.80 | 115 |

Effective yield (usable ore per second) for a ship is:

```
Yield = ore_per_scoop * purity / cycle_time
```

Exactly one of these four ships is overpowered relative to the rest of
the roster and needs a balance patch.

## Deliverables

- `BALANCE.md` (at most 500 words) containing:
  - A yield table showing the computed yield for all four ships.
  - Identification of the overpowered ship, with reasoning that goes
    beyond raw ore-per-scoop (show your supporting analysis, e.g. an
    upkeep-normalized comparison).
  - A patch to that ship: change **at most two** of its stats, each
    changed stat differing from its original value by **at most 20%
    relative to the original**, such that the ship's recomputed
    post-patch yield lands in the range **[8.2, 9.6]**.
  - The post-patch yield arithmetic shown explicitly (state the patched
    stat values and the resulting yield number).

## Constraints

- The patch must target only the overpowered ship — do not change any
  other ship's stats.
- At most two stats may change on the patched ship, and each changed
  stat must stay within 20% of its original value (relative change,
  either direction).
- Upkeep does not enter the yield formula, so an upkeep-only change
  cannot satisfy the yield band requirement.
- The post-patch yield, recomputed from your stated patched stats using
  the formula above, must fall in [8.2, 9.6].
- `BALANCE.md` must be at most 500 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol.
