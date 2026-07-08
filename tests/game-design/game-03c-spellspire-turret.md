---
id: game-03c-spellspire-turret
category: game-design
title: Balance patch for an arcane-turret defense stat table
deliverables:
  - BALANCE.md
---

## Task

You are the balance designer for a fictional tower-defense game,
**Spellspire Vigil**. Four turrets currently exist, each with a potency
(damage dealt per bolt), a cooldown (seconds between bolts), an
attunement (0-1, chance a bolt connects), and an essence cost (used for
drafting a loadout, not for combat power):

| Turret | Potency | Cooldown (s) | Attunement | Essence |
|---|---|---|---|---|
| Emberpike | 26 | 2.1 | 0.88 | 130 |
| Frostcoil | 14 | 0.75 | 0.72 | 95 |
| Stormlance | 52 | 2.6 | 0.60 | 120 |
| Voidspar | 9 | 0.45 | 0.90 | 100 |

Effective output (damage per second) for a turret is:

```
output = potency * attunement / cooldown
```

Exactly one of these four turrets is overpowered relative to the rest
of the roster and needs a balance patch.

## Deliverables

- `BALANCE.md` (at most 500 words) containing:
  - An output table showing the computed effective output for all four
    turrets.
  - Identification of the overpowered turret, with reasoning that goes
    beyond raw potency (show your supporting analysis, e.g. an
    essence-normalized comparison).
  - A patch to that turret: change **at most two** of its stats, each
    changed stat differing from its original value by **at most 20%
    relative to the original**, such that the turret's recomputed
    post-patch output lands in the range **[11.5, 13.5]**.
  - The post-patch output arithmetic shown explicitly (state the patched
    stat values and the resulting output number).

## Constraints

- The patch must target only the overpowered turret — do not change any
  other turret's stats.
- At most two stats may change on the patched turret, and each changed
  stat must stay within 20% of its original value (relative change,
  either direction).
- Essence does not enter the output formula, so an essence-only change
  cannot satisfy the output band requirement.
- The post-patch output, recomputed from your stated patched stats using
  the formula above, must fall in [11.5, 13.5].
- `BALANCE.md` must be at most 500 words (whole file, `wc -w`).

Note: `REASONING.md` is also required per the standard run protocol.
